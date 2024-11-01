import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";

import { getUserById } from "./data/user";
import { db } from "./lib/db";

//Prisma doesnt work on edge runtimes, so we split the providers (used in middleware) with the db calls
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // Events are async funtions that doesnt return a response for handling side effects
  events: {
    //Triggered when user use OAuth provider to sign up or log in
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      //Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    //The callback that returns our session, session uses JWT to create the session which is passed automatically by auth
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    //The callback that returns our JWT, we are modifying the token here to include the user role
    async jwt({ token }) {
      if (!token.sub) return token; //Logged out
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
