import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-[15px] font-semibold text-ink">Page not found</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          That address doesn&apos;t exist in Worklog.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button size="sm">Go to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
