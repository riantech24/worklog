"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SECONDARY_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => {
    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm transition-colors",
          active
            ? "bg-sunken font-medium text-ink"
            : "text-ink-soft hover:bg-sunken hover:text-ink",
        )}
      >
        <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
      {NAV_ITEMS.map(renderItem)}
      <hr className="my-3 border-line" />
      {SECONDARY_NAV.map(renderItem)}
    </nav>
  );
}
