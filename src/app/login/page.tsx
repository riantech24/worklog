import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export const metadata = { title: "Sign in" };

const devLoginEnabled =
  process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_LOGIN === "true";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const { error } = await searchParams;
  const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="text-[17px] font-semibold tracking-tight text-ink">Worklog</p>
        <h1 className="mt-6 text-[26px] font-semibold leading-tight tracking-tight text-ink">
          Record the work once.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Timesheets, service logs and invoices are built from the same entries,
          so nothing gets retyped at the end of the month.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-[var(--radius-sm)] border border-danger/30 bg-danger/8 px-3 py-2 text-[13px] text-danger"
          >
            That sign-in attempt didn&apos;t complete. Try again, or use a different account.
          </p>
        ) : null}

        <form
          className="mt-7"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" size="lg" className="w-full" disabled={!googleConfigured}>
            Continue with Google
          </Button>
        </form>

        {!googleConfigured ? (
          <p className="mt-2 text-[12px] text-muted">
            Google sign-in needs <code>AUTH_GOOGLE_ID</code> and{" "}
            <code>AUTH_GOOGLE_SECRET</code> in your environment.
          </p>
        ) : null}

        {devLoginEnabled ? (
          <>
            <div className="my-6 flex items-center gap-3 text-[12px] text-muted">
              <span className="h-px flex-1 bg-line" />
              local development
              <span className="h-px flex-1 bg-line" />
            </div>

            <form
              className="space-y-3"
              action={async (formData: FormData) => {
                "use server";
                await signIn("dev-login", {
                  email: String(formData.get("email") ?? ""),
                  redirectTo: "/dashboard",
                });
              }}
            >
              <Field
                label="Email address"
                htmlFor="email"
                hint="Signs you in without Google. Disabled in production builds."
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="rian@example.com"
                />
              </Field>
              <Button type="submit" variant="secondary" className="w-full">
                Sign in
              </Button>
            </form>
          </>
        ) : null}
      </div>
    </main>
  );
}
