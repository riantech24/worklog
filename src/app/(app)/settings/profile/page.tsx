import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Profile settings" };
export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  const sessionUser = await requireUser();

  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    select: {
      name: true,
      email: true,
      jobTitle: true,
      phone: true,
      address: true,
      timezone: true,
      currency: true,
      locale: true,
      theme: true,
    },
  });

  return (
    <section aria-labelledby="profile-title">
      <h3 id="profile-title" className="mb-1 text-[16px] font-semibold text-ink">
        Profile
      </h3>
      <p className="mb-5 max-w-prose text-sm text-muted">
        Your name and title appear on the documents Worklog produces. Timezone
        and currency decide how dates, hours and amounts are shown throughout.
      </p>

      <ProfileForm
        email={user.email}
        initial={{
          name: user.name ?? "",
          jobTitle: user.jobTitle ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
          timezone: user.timezone,
          currency: user.currency,
          locale: (user.locale === "id" ? "id" : "en") as "en" | "id",
          theme: (["light", "dark", "system"].includes(user.theme)
            ? user.theme
            : "system") as "light" | "dark" | "system",
        }}
      />
    </section>
  );
}
