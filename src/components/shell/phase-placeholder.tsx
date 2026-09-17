import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "./page-header";

/**
 * Honest placeholder for modules that land in a later phase. It states what the
 * page will do rather than pretending with dead buttons (§90).
 */
export function PhasePlaceholder({
  title,
  description,
  phase,
  whatItWillDo,
}: {
  title: string;
  description: string;
  phase: number;
  whatItWillDo: string;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState
        title={`Arrives in phase ${phase}`}
        description={whatItWillDo}
      />
    </>
  );
}
