import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
      },
      async authorize(credentials) {
        if (!credentials?.mobileNumber || !credentials?.otp) {
          return null;
        }

        // Accepts any 6 digit OTP for the mock
        if (credentials.otp.length === 6) {
          // Return a mock user object
          return {
            id: credentials.mobileNumber,
            name: credentials.firstName && credentials.lastName 
                ? `${credentials.firstName} ${credentials.lastName}` 
                : "User",
            email: credentials.email || `${credentials.mobileNumber}@mock.phone`,
            mobileNumber: credentials.mobileNumber
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.mobileNumber = (user as any).mobileNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).mobileNumber = token.mobileNumber;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/home", // We use a modal instead of a dedicated sign in page
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy_secret_for_development_weinix_3d",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
