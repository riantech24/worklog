/**
 * Display formatting. Everything renders in the user's timezone (Asia/Jakarta
 * by default) with 24-hour clocks and IDR currency, per §51.
 */

export const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMEZONE ?? "Asia/Jakarta";
export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY ?? "IDR";

type Zoned = { timeZone?: string };

export function formatDate(date: Date | string, opts: Zoned = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: opts.timeZone ?? DEFAULT_TIMEZONE,
  }).format(d);
}

export function formatLongDate(date: Date | string, opts: Zoned = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: opts.timeZone ?? DEFAULT_TIMEZONE,
  }).format(d);
}

export function formatTime(date: Date | string, opts: Zoned = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: opts.timeZone ?? DEFAULT_TIMEZONE,
  }).format(d);
}

/** 150 -> "2h 30m", 60 -> "1h 00m", 45 -> "45m" */
export function formatDuration(minutes: number) {
  const safe = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${String(mins).padStart(2, "0")}m`;
}

export function formatCurrency(amount: number, currency = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/^([A-Z]{3})\s?/, "$1 ");
}

/** 9.75 -> "9.75", 9 -> "9" */
export function formatDayUnits(units: number) {
  return Number(units.toFixed(2)).toString();
}

/** The current wall-clock hour in the given timezone, for greetings. */
export function hourIn(timeZone = DEFAULT_TIMEZONE, now = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone,
    }).format(now),
  );
}

export function greeting(timeZone = DEFAULT_TIMEZONE, now = new Date()) {
  const hour = hourIn(timeZone, now);
  if (hour < 11) return "Good morning";
  if (hour < 15) return "Good afternoon";
  if (hour < 19) return "Good evening";
  return "Good evening";
}
