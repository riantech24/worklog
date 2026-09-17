import { PageHeader } from "@/components/shell/page-header";
import { SettingsNav } from "@/components/shell/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Your details, connections and document defaults."
      />
      <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
