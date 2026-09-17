import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Work Log" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Work Log"
      description="Every piece of work you record, searchable and filterable."
      phase={3}
      whatItWillDo="Create, edit, duplicate and delete work entries, with duration and billing calculated for you, plus the quick-entry flow that takes a sentence and a project."
    />
  );
}
