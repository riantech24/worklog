import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Projects" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Projects"
      description="Work streams under each client, with their own rates."
      phase={2}
      whatItWillDo="Projects with billing type, default rate, hours per working day and rate history, so past work keeps the rate that applied at the time."
    />
  );
}
