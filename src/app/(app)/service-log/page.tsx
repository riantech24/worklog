import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Service Log" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Service Log"
      description="A descriptive record of the services you delivered."
      phase={7}
      whatItWillDo="Built from completed work entries, with report-only wording you can edit without touching the original record, exportable to PDF and Excel."
    />
  );
}
