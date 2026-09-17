import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Log work" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Log work"
      description="The fastest route through the application."
      phase={3}
      whatItWillDo="One question — what did you do — then a project, a date and a time range. Everything else is optional and can be filled in later."
    />
  );
}
