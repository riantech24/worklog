"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

export function MobileNav({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null; jobTitle?: string | null };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[var(--radius-sm)] p-2 text-ink-soft hover:bg-sunken lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-line bg-surface px-3 py-4">
            <div className="mb-5 flex items-center justify-between px-2.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-[17px] font-semibold tracking-tight text-ink"
              >
                Worklog
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] p-1.5 text-muted hover:bg-sunken"
                aria-label="Close menu"
              >
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
            <UserMenu user={user} />
          </div>
        </div>
      ) : null}
    </>
  );
}
