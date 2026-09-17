"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NAV_ITEMS, SECONDARY_NAV } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

function titleFor(pathname: string) {
  const match = [...NAV_ITEMS, ...SECONDARY_NAV]
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (pathname.startsWith("/settings")) return "Settings";
  return match?.label ?? "Worklog";
}

export function Header({
  calendarConnected,
  user,
}: {
  calendarConnected: boolean;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    jobTitle?: string | null;
  };
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur lg:px-8 no-print">
      <MobileNav user={user} />
      <h1 className="text-[15px] font-semibold text-ink">{titleFor(pathname)}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search work, clients, invoices"
            aria-label="Search"
            disabled
            title="Global search arrives with the work log in phase 3"
            className="h-8.5 w-64 rounded-[var(--radius-sm)] border border-line bg-bg pl-8 pr-3 text-[13px] text-ink placeholder:text-muted disabled:cursor-not-allowed"
          />
        </div>

        <Badge tone={calendarConnected ? "positive" : "muted"} className="hidden sm:inline-flex">
          {calendarConnected ? "Calendar connected" : "Calendar not connected"}
        </Badge>

        <button
          type="button"
          disabled
          title="Notifications arrive in phase 10"
          aria-label="Notifications"
          className="rounded-[var(--radius-sm)] p-2 text-muted disabled:cursor-not-allowed"
        >
          <Bell className="size-4.5" strokeWidth={1.75} aria-hidden />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
