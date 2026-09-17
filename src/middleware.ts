import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge middleware uses the Prisma-free config; the `authorized` callback in
// auth.config.ts decides what is public.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.webmanifest).*)"],
};
