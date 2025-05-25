import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      parishId?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    parishId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    parishId?: string
  }
}
