import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const allowedEmail = "drrhee@lioradermatology.com";
        const passwordHash = process.env.LIBBY_PASSWORD_HASH;

        if (!passwordHash) {
          console.error("LIBBY_PASSWORD_HASH env var is not set");
          return null;
        }

        if (credentials.email.toLowerCase() !== allowedEmail) return null;

        const valid = await bcrypt.compare(credentials.password, passwordHash);
        if (!valid) return null;

        return { id: "1", name: "Libby", email: allowedEmail };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
