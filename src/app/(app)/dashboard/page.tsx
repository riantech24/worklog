import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { summarise } from "@/lib/calc";
import {
  DEFAULT_TIMEZONE,
  formatCurrency,
  formatDate,
  formatDayUnits,
  formatDuration,
  formatLongDate,
  formatTime,
  greeting,
} from "@/lib/format";
import { toNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

/** Calendar parts of "now" as seen in the user's timezone. */
function zonedParts(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/**
 * Work entry dates are stored as calendar dates (@db.Date), which Postgres
 * returns at UTC midnight — so ranges are built in UTC from zoned parts.
 */
function monthRange(timeZone: string, now = new Date()) {
  const { year, month } = zonedParts(timeZone, now);
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 0)),
  };
}

function today(timeZone: string, now = new Date()) {
  const { year, month, day } = zonedParts(timeZone, now);
  return new Date(Date.UTC(year, month - 1, day));
}

export default async function DashboardPage() {
  const sessionUser = await requireUser();

  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    select: { name: true, timezone: true, currency: true },
  });

  const timeZone = user.timezone || DEFAULT_TIMEZONE;
  const now = new Date();
  const { start, end } = monthRange(timeZone, now);

  const [periodEntries, recentEntries, todayEntries, calendarConnection] = await Promise.all([
    db.workEntry.findMany({
      where: {
        userId: sessionUser.id,
        deletedAt: null,
        date: { gte: start, lte: end },
      },
      select: {
        status: true,
        durationMinutes: true,
        dayUnits: true,
        billable: true,
        billableAmount: true,
      },
      take: 500,
    }),
    db.workEntry.findMany({
      where: { userId: sessionUser.id, deletedAt: null },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        date: true,
        title: true,
        category: true,
        durationMinutes: true,
        status: true,
        billable: true,
        billableAmount: true,
        project: { select: { name: true } },
      },
    }),
    db.workEntry.findMany({
      where: { userId: sessionUser.id, deletedAt: null, date: today(timeZone, now) },
      orderBy: [{ startAt: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        startAt: true,
        endAt: true,
        durationMinutes: true,
      },
    }),
    db.googleConnection.findFirst({
      where: { userId: sessionUser.id, status: "CONNECTED" },
      select: { id: true, lastSyncedAt: true },
    }),
  ]);

  const completed = periodEntries.filter((entry) => entry.status === "COMPLETED");
  const totals = summarise(
    completed.map((entry) => ({
      durationMinutes: entry.durationMinutes,
      dayUnits: toNumber(entry.dayUnits),
      billable: entry.billable,
      billableAmount: toNumber(entry.billableAmount),
    })),
  );

  const periodLabel = `${formatDate(start, { timeZone })} – ${formatDate(end, { timeZone })}`;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-[22px] font-semibold tracking-tight text-ink">
          {greeting(timeZone, now)}, {user.name?.split(" ")[0] ?? "there"}
        </h2>
        <p className="mt-1 text-sm text-muted">{formatLongDate(now, { timeZone })}</p>
      </div>

      <section aria-labelledby="stats-heading">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h3 id="stats-heading" className="text-[13px] font-medium text-ink-soft">
            This month
          </h3>
          <span className="text-[12px] text-muted">{periodLabel}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Working days"
            value={formatDayUnits(totals.totalDayUnits)}
            footnote="Completed entries, in day units"
          />
          <StatCard
            label="Working hours"
            value={formatDuration(totals.totalMinutes)}
            footnote="Excluding recorded breaks"
          />
          <StatCard
            label="Completed tasks"
            value={String(totals.entries)}
            footnote={`${periodEntries.length} entries recorded`}
          />
          <StatCard
            label="Billable"
            value={formatCurrency(totals.billableAmount, user.currency)}
            footnote={`${formatDayUnits(totals.billableDayUnits)} billable days`}
            emphasis
          />
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent work</CardTitle>
            <Link
              href="/work-log"
              className="text-[13px] text-ink-soft underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardBody className="px-0 pb-0">
            {recentEntries.length === 0 ? (
              <div className="px-5 pb-5">
                <EmptyState
                  title="No work recorded yet"
                  description="Work you log will appear here, and feed your timesheet, service log and invoices."
                  action={
                    <Link href="/work-log/new">
                      <Button size="sm">Log work</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-line text-left text-[12px] text-muted">
                      <th scope="col" className="px-5 py-2 font-medium">Date</th>
                      <th scope="col" className="px-3 py-2 font-medium">Activity</th>
                      <th scope="col" className="px-3 py-2 font-medium">Project</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium">Time</th>
                      <th scope="col" className="px-5 py-2 text-right font-medium">Billable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-line last:border-0">
                        <td className="numeric whitespace-nowrap px-5 py-3 text-ink-soft">
                          {formatDate(entry.date, { timeZone })}
                        </td>
                        <td className="max-w-[22ch] truncate px-3 py-3 text-ink" title={entry.title}>
                          {entry.title}
                        </td>
                        <td className="px-3 py-3 text-muted">{entry.project?.name ?? "—"}</td>
                        <td className="numeric whitespace-nowrap px-3 py-3 text-right text-ink-soft">
                          {formatDuration(entry.durationMinutes)}
                        </td>
                        <td className="numeric whitespace-nowrap px-5 py-3 text-right">
                          {entry.billable ? (
                            <span className="text-accent">
                              {formatCurrency(toNumber(entry.billableAmount), user.currency)}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-muted">
                {calendarConnection
                  ? "Events from your calendar appear here, each with a one-click way to turn it into a work entry."
                  : "Connect Google Calendar and today's events appear here, each with a one-click way to turn it into a work entry."}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={calendarConnection ? "positive" : "muted"}>
                  {calendarConnection ? "Calendar connected" : "Calendar not connected"}
                </Badge>
                <Link
                  href="/settings/calendar"
                  className="text-[13px] text-ink-soft underline-offset-4 hover:underline"
                >
                  {calendarConnection ? "Manage" : "Set up"}
                </Link>
              </div>
            </div>
            <hr className="border-line" />
            <div>
              {todayEntries.length === 0 ? (
                <>
                  <p className="text-[13px] font-medium text-ink">Nothing logged today</p>
                  <p className="mt-1 text-sm text-muted">
                    Recording takes a sentence and a project.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[13px] font-medium text-ink">
                    {todayEntries.length} {todayEntries.length === 1 ? "entry" : "entries"} today
                  </p>
                  <ul className="mt-2 space-y-2">
                    {todayEntries.map((entry) => (
                      <li key={entry.id} className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 flex-1 truncate text-sm text-ink" title={entry.title}>
                          {entry.title}
                        </span>
                        <span className="numeric shrink-0 text-[13px] text-muted">
                          {entry.startAt && entry.endAt
                            ? `${formatTime(entry.startAt, { timeZone })}–${formatTime(entry.endAt, { timeZone })}`
                            : formatDuration(entry.durationMinutes)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Link href="/work-log/new" className="mt-3 inline-block">
                <Button size="sm">Log work</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
