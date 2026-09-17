import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/shell/header";
import { QuickAction } from "@/components/shell/quick-action";
import { Sidebar } from "@/components/shell/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, jobTitle: true },
  });

  // The session outlived the record (e.g. database reset during development).
  if (!user) redirect("/login");

  const connection = await db.googleConnection.findFirst({
    where: { userId: user.id, status: "CONNECTED" },
    select: { id: true },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} calendarConnected={Boolean(connection)} />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
      <QuickAction />
    </div>
  );
}
