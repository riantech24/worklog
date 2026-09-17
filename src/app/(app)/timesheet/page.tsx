import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Timesheet" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Timesheet"
      description="Hours and working days for a client, project and period."
      phase={6}
      whatItWillDo="Filtered by client, project and billing period, totalled in hours and fractional days, exportable to PDF and Excel."
    />
  );
}
