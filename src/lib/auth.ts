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
              if (!parsed.success) {
                console.error(
                  "[dev-login] rejected: invalid email —",
                  parsed.error.flatten().fieldErrors,
                );
                return null;
              }

              const email = parsed.data.email.toLowerCase();

              try {
                const user = await db.user.upsert({
                  where: { email },
                  update: {},
                  create: { email, name: email.split("@")[0] },
                });
                return { id: user.id, email: user.email, name: user.name, image: user.image };
              } catch (error) {
                // Auth.js swallows this into a generic CallbackRouteError on
                // screen — the real cause (bad DATABASE_URL, DB not running,
                // migrations not applied) only shows up here, in the server
                // terminal.
                console.error("[dev-login] database error during upsert:", error);
                return null;
              }
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