import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Invoices" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Invoices"
      description="Draft, issued, paid, overdue and cancelled invoices."
      phase={8}
      whatItWillDo="A step-by-step invoice builder that pulls billable work from the period you choose, with a live preview that matches the PDF exactly."
    />
  );
}
