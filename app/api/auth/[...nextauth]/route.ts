import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";
const API_BASE = (
  process.env.API_ENDPOINT || "http://localhost:8000"
).replace(/\/+$/, "");

// ---------------------------------------------------------------------------
// Direct backend helpers (server-side only — absolute URLs required)
// ---------------------------------------------------------------------------

async function backendPost<T = unknown>(
  path: string,
  body: Record<string, unknown>
): Promise<{ success: boolean; data: T | null; message?: string }> {
  try {
    const url = `${API_BASE}${path}`;
    if (IS_DEV) console.log(`[AUTH-BACKEND] POST ${url}`, JSON.stringify(body));

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (IS_DEV) console.log(`[AUTH-BACKEND] Response (${res.status}):`, JSON.stringify(json, null, 2));

    return {
      success: res.ok && json.success !== false,
      data: json.data ?? null,
      message: json.message,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Backend unreachable";
    if (IS_DEV) console.log(`[AUTH-BACKEND] NETWORK ERROR:`, msg);
    return { success: false, data: null, message: msg };
  }
}

// ---------------------------------------------------------------------------
// NextAuth config
// ---------------------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobileNumber: { label: "Mobile Number", type: "text" },
        otp: { label: "OTP", type: "text" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        email: { label: "Email", type: "text" },
        /** "request-otp" | "signup" | "verify-otp" */
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.mobileNumber) return null;

        const phone = credentials.mobileNumber;
        const action = credentials.action || "verify-otp";

        // -----------------------------------------------------------------
        // Step 1: Request OTP (called from the first form step)
        // -----------------------------------------------------------------
        if (action === "request-otp") {
          const res = await backendPost<{ phone: string; flow: "login" | "signup" }>(
            "/api/v1/portal/auth/request-otp",
            { phone }
          );

          if (!res.success) {
            throw new Error(res.message || "Failed to send OTP");
          }

          // If backend says "signup", the user doesn't exist yet
          if (res.data?.flow === "signup") {
            throw new Error("FLOW_SIGNUP");
          }

          // OTP was sent — we can't return a user yet (need OTP verification)
          throw new Error("OTP_SENT");
        }

        // -----------------------------------------------------------------
        // Step 1b: Signup (register new customer then send OTP)
        // -----------------------------------------------------------------
        if (action === "signup") {
          const name =
            credentials.firstName && credentials.lastName
              ? `${credentials.firstName} ${credentials.lastName}`
              : credentials.firstName || "User";

          const res = await backendPost(
            "/api/v1/portal/auth/signup",
            { phone, name, email: credentials.email || "" }
          );

          if (!res.success) {
            throw new Error(res.message || "Failed to register");
          }

          // OTP sent after signup — move to step 2
          throw new Error("OTP_SENT");
        }

        // -----------------------------------------------------------------
        // Step 2: Verify OTP
        // -----------------------------------------------------------------
        if (!credentials.otp || credentials.otp.length !== 6) {
          return null;
        }

        const verifyRes = await backendPost<{
          customer: {
            id: string;
            phone: string;
            name: string;
            email: string;
            isPhoneVerified: boolean;
            businessType: string;
          };
          accessToken: string;
          refreshToken: string;
          sessionId: string;
          expiresIn: string;
        }>("/api/v1/portal/auth/verify-otp", { phone, otp: credentials.otp });

        if (verifyRes.success && verifyRes.data) {
          const { customer, accessToken, refreshToken, sessionId } =
            verifyRes.data;

          const userObj = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            mobileNumber: credentials.mobileNumber,
            phone: customer.phone,
            accessToken,
            refreshToken,
            sessionId,
            businessType: customer.businessType,
            customerId: customer.id,
          };

          if (IS_DEV) {
            console.log("[AUTH-AUTHORIZE] Returning user object:", JSON.stringify(userObj, null, 2));
          }

          return userObj as any;
        }

        // Backend returned an error — surface it to the client
        throw new Error(verifyRes.message || "OTP verification failed");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.mobileNumber = u.mobileNumber;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.sessionId = u.sessionId;
        token.customerId = u.customerId || u.id;
        token.businessType = u.businessType;
        token.firstName = u.name?.split(" ")[0];
        token.lastName = u.name?.split(" ").slice(1).join(" ");

        if (IS_DEV) {
          console.log("[AUTH-JWT] Token assembled from user:", JSON.stringify(token, null, 2));
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any;
        u.mobileNumber = token.mobileNumber;
        u.accessToken = token.accessToken;
        u.refreshToken = token.refreshToken;
        u.sessionId = token.sessionId;
        u.customerId = token.customerId;
        u.businessType = token.businessType;
        u.firstName = token.firstName;
        u.lastName = token.lastName;
      }
      if (IS_DEV) {
        console.log("[AUTH-SESSION] Session callback — stored session object:", JSON.stringify(session, null, 2));
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/home",
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "dummy_secret_for_development_weinix_3d",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

