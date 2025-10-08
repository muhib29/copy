import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // 👈 Add your custom field here
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // 👈 Add it here too if you're storing it in the database
  }
}
