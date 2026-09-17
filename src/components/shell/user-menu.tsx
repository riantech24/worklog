"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserMenu({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null; jobTitle?: string | null };
}) {
  const initials = (user.name ?? user.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-line px-2.5 pt-3">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-[13px] font-semibold text-ink-soft"
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">
          {user.name ?? user.email}
        </span>
        <span className="block truncate text-[12px] text-muted">
          {user.jobTitle ?? user.email}
        </span>
      </span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-[var(--radius-sm)] p-1.5 text-muted transition-colors hover:bg-sunken hover:text-ink"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
