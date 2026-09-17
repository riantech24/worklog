import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";

import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";

const devLoginEnabled =
  process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_LOGIN === "true";

const devLoginSchema = z.object({ email: z.string().email() });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfig.providers,
    // Local-only shortcut so the app is usable before Google OAuth credentials
    // exist. Disabled outright when NODE_ENV=production.
    ...(devLoginEnabled
      ? [
          Credentials({
            id: "dev-login",
            name: "Development sign-in",
            credentials: { email: { label: "Email", type: "email" } },
            async authorize(raw) {
              const parsed = devLoginSchema.safeParse(raw);
              if (!parsed.success) return null;
              const email = parsed.data.email.toLowerCase();
              const user = await db.user.upsert({
                where: { email },
                update: {},
                create: { email, name: email.split("@")[0] },
              });
              return { id: user.id, email: user.email, name: user.name, image: user.image };
            },
          }),
        ]
      : []),
  ],
});

/** Server-side guard. Every server action and route handler starts here (§64). */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user as { id: string; email: string; name?: string | null; image?: string | null };
}
