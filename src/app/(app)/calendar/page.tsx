import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Calendar" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Calendar"
      description="Google Calendar events and your work log, side by side."
      phase={4}
      whatItWillDo="Month, week, day and agenda views over your Google calendars, each event marked logged or not logged, with one click to turn an event into a work entry."
    />
  );
}
