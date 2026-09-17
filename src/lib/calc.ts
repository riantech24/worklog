/**
 * Central calculation service (§79, §80).
 * Timesheets, service logs, invoices and dashboard stats must all call these —
 * never re-implement duration or billing maths anywhere else.
 */

export type BillingType = "PER_DAY" | "PER_HOUR" | "FIXED" | "CUSTOM";

export function calculateDuration(
  startAt: Date | null | undefined,
  endAt: Date | null | undefined,
  breakMinutes = 0,
): number {
  if (!startAt || !endAt) return 0;
  const raw = (endAt.getTime() - startAt.getTime()) / 60000;
  return Math.max(0, Math.round(raw - breakMinutes));
}

/**
 * Fractional working days (§15). 4h at an 8h day = 0.5.
 *
 * `step` is 0 by default — exact division — so that the sum of per-entry day
 * units always reconciles with total hours / hours per workday. Rounding each
 * entry to 0.25 first would turn 78 hours into 10.5 days instead of 9.75.
 * Pass a step only where a project genuinely bills in quarter-day blocks.
 */
export function calculateWorkDayUnits(
  durationMinutes: number,
  hoursPerWorkday = 8,
  step = 0,
): number {
  if (hoursPerWorkday <= 0) return 0;
  const raw = durationMinutes / 60 / hoursPerWorkday;
  if (step <= 0) return Number(raw.toFixed(3));
  return Number((Math.round(raw / step) * step).toFixed(3));
}

export function calculateBillableAmount(input: {
  billable: boolean;
  billingType: BillingType;
  rate?: number | null;
  durationMinutes?: number;
  dayUnits?: number;
  fixedAmount?: number | null;
}): number {
  if (!input.billable) return 0;
  const rate = input.rate ?? 0;
  switch (input.billingType) {
    case "PER_DAY":
      return round2((input.dayUnits ?? 0) * rate);
    case "PER_HOUR":
      return round2(((input.durationMinutes ?? 0) / 60) * rate);
    case "FIXED":
    case "CUSTOM":
      return round2(input.fixedAmount ?? 0);
    default:
      return 0;
  }
}

export type SummaryRow = {
  durationMinutes: number;
  dayUnits: number;
  billable: boolean;
  billableAmount: number;
};

export function summarise(rows: SummaryRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.totalMinutes += row.durationMinutes;
      acc.totalDayUnits = round3(acc.totalDayUnits + row.dayUnits);
      acc.entries += 1;
      if (row.billable) {
        acc.billableMinutes += row.durationMinutes;
        acc.billableDayUnits = round3(acc.billableDayUnits + row.dayUnits);
        acc.billableAmount = round2(acc.billableAmount + row.billableAmount);
      }
      return acc;
    },
    {
      entries: 0,
      totalMinutes: 0,
      totalDayUnits: 0,
      billableMinutes: 0,
      billableDayUnits: 0,
      billableAmount: 0,
    },
  );
}

export function calculateInvoiceSubtotal(
  items: { quantity: number; rate: number }[],
): number {
  return round2(items.reduce((sum, i) => sum + i.quantity * i.rate, 0));
}

export function calculateInvoiceTotal(input: {
  subtotal: number;
  discount?: number;
  taxRate?: number;
  additionalFee?: number;
}) {
  const discount = input.discount ?? 0;
  const taxable = Math.max(0, input.subtotal - discount);
  const taxAmount = round2((taxable * (input.taxRate ?? 0)) / 100);
  const total = round2(taxable + taxAmount + (input.additionalFee ?? 0));
  return { taxAmount, total };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
