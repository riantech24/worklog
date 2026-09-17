"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface px-6 py-14 text-center">
      <p className="text-[15px] font-semibold text-ink">This page didn&apos;t load</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Something went wrong while loading your data. Nothing you recorded has
        been lost.
      </p>
      <div className="mt-4">
        <Button onClick={reset} size="sm">
          Try again
        </Button>
      </div>
      {error.digest ? (
        <p className="numeric mt-4 text-[12px] text-muted">Reference {error.digest}</p>
      ) : null}
    </div>
  );
}
