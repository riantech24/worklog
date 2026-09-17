/**
 * Translation keys (§66). Kept deliberately small in Phase 1 — the point is
 * that no UI string is hardcoded in a component that will be translated later.
 */
export const dictionaries = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.calendar": "Calendar",
    "nav.work_log": "Work Log",
    "nav.timesheet": "Timesheet",
    "nav.service_log": "Service Log",
    "nav.invoices": "Invoices",
    "nav.clients": "Clients",
    "nav.projects": "Projects",
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    "dashboard.subtitle": "Track your work, tasks and billing in one place.",
    "stats.working_days": "Working days",
    "stats.working_hours": "Working hours",
    "stats.completed_tasks": "Completed tasks",
    "stats.billable": "Billable",
    "action.log_work": "Log work",
  },
  id: {
    "nav.dashboard": "Dasbor",
    "nav.calendar": "Kalender",
    "nav.work_log": "Catatan Kerja",
    "nav.timesheet": "Timesheet",
    "nav.service_log": "Log Penggunaan Jasa",
    "nav.invoices": "Invoice",
    "nav.clients": "Klien",
    "nav.projects": "Proyek",
    "nav.reports": "Laporan",
    "nav.settings": "Pengaturan",
    "dashboard.subtitle": "Pantau pekerjaan, tugas, dan penagihan dalam satu tempat.",
    "stats.working_days": "Hari kerja",
    "stats.working_hours": "Jam kerja",
    "stats.completed_tasks": "Tugas selesai",
    "stats.billable": "Dapat ditagih",
    "action.log_work": "Catat pekerjaan",
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type TranslationKey = keyof (typeof dictionaries)["en"];

export function t(key: TranslationKey, locale: Locale = "en") {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}
