import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

export function Sidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null; jobTitle?: string | null };
}) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface px-3 py-4 lg:flex">
      <Link href="/dashboard" className="mb-5 px-2.5">
        <span className="text-[17px] font-semibold tracking-tight text-ink">
          Worklog
        </span>
      </Link>
      <SidebarNav />
      <UserMenu user={user} />
    </aside>
  );
}
