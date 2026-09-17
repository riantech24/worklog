import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Clients" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Clients"
      description="The organisations you work for and their billing defaults."
      phase={2}
      whatItWillDo="Client records with contact details, billing defaults, projects, invoices and full work history."
    />
  );
}
