import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { requestOtp, verifyOtp, signup } from "@/utils/api/auth";

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

        const phone = `+91${credentials.mobileNumber}`;
        const action = credentials.action || "verify-otp";

        // -----------------------------------------------------------------
        // Step 1: Request OTP (called from the first form step)
        // -----------------------------------------------------------------
        if (action === "request-otp") {
          const res = await requestOtp(phone);

          if (!res.success) {
            throw new Error(res.error || "Failed to send OTP");
          }

          // If backend says "signup", the user doesn't exist yet
          if (res.data?.flow === "signup") {
            throw new Error("FLOW_SIGNUP");
          }

          // OTP was sent — we can't return a user yet (need OTP verification)
          // NextAuth authorize must return null or a user, so we throw a
          // special error that the frontend will catch to move to step 2.
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

          const res = await signup(
            phone,
            name,
            credentials.email || "",
          );

          if (!res.success) {
            throw new Error(res.error || "Failed to register");
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

        const verifyRes = await verifyOtp(phone, credentials.otp);

        if (verifyRes.success && verifyRes.data) {
          const { customer, accessToken, refreshToken, sessionId } =
            verifyRes.data;

          return {
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
          } as any;
        }

        // ---------------------------------------------------------------
        // Fallback mock — when backend is unreachable keep dev working
        // ---------------------------------------------------------------
        if (verifyRes.status === 0 && credentials.otp.length === 6) {
          return {
            id: credentials.mobileNumber,
            name:
              credentials.firstName && credentials.lastName
                ? `${credentials.firstName} ${credentials.lastName}`
                : "User",
            email:
              credentials.email ||
              `${credentials.mobileNumber}@mock.phone`,
            mobileNumber: credentials.mobileNumber,
          } as any;
        }

        return null;
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
