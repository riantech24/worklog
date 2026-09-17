"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

const ACTIONS = [
  { href: "/work-log/new", label: "Log work", primary: true },
  { href: "/clients", label: "Add client" },
  { href: "/projects", label: "Add project" },
  { href: "/invoices", label: "Create invoice" },
];

export function QuickAction() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-40 no-print">
      {open ? (
        <div
          className="mb-2 w-52 overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-lg"
          role="menu"
        >
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
            >
              {action.primary ? (
                <span className="font-medium text-ink">{action.label}</span>
              ) : (
                action.label
              )}
            </Link>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Quick actions"
        className="ml-auto flex size-13 items-center justify-center rounded-full bg-ink text-bg shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="size-6" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
