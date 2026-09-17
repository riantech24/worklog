import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  LayoutDashboard,
  NotebookPen,
  PieChart,
  Receipt,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  labelKey: string;
  label: string;
  icon: LucideIcon;
  phase?: number;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", labelKey: "nav.calendar", label: "Calendar", icon: CalendarDays, phase: 4 },
  { href: "/work-log", labelKey: "nav.work_log", label: "Work Log", icon: NotebookPen, phase: 3 },
  { href: "/timesheet", labelKey: "nav.timesheet", label: "Timesheet", icon: FileSpreadsheet, phase: 6 },
  { href: "/service-log", labelKey: "nav.service_log", label: "Service Log", icon: ClipboardList, phase: 7 },
  { href: "/invoices", labelKey: "nav.invoices", label: "Invoices", icon: Receipt, phase: 8 },
  { href: "/clients", labelKey: "nav.clients", label: "Clients", icon: Building2, phase: 2 },
  { href: "/projects", labelKey: "nav.projects", label: "Projects", icon: FolderKanban, phase: 2 },
  { href: "/reports", labelKey: "nav.reports", label: "Reports", icon: PieChart, phase: 9 },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/settings/profile", labelKey: "nav.settings", label: "Settings", icon: Settings },
  { href: "/settings/invoice", labelKey: "nav.templates", label: "Invoice template", icon: FileText, phase: 8 },
];

export const SETTINGS_NAV = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/calendar", label: "Google Calendar", phase: 4 },
  { href: "/settings/billing", label: "Billing", phase: 2 },
  { href: "/settings/invoice", label: "Invoice", phase: 8 },
  { href: "/settings/notifications", label: "Notifications", phase: 10 },
];

/** §67 — seed categories; users may add their own. */
export const WORK_CATEGORIES = [
  "IT Support",
  "Website Maintenance",
  "Technical Support",
  "System Administration",
  "System Development",
  "Graphic Design",
  "Video Editing",
  "Content Creation",
  "Meeting",
  "Research",
  "Documentation",
  "Administrative Support",
  "Asset Management",
  "Training",
  "Communication",
  "Data Entry",
  "Other",
];

export const TIMEZONES = [
  "Asia/Jakarta",
  "Asia/Makassar",
  "Asia/Jayapura",
  "Asia/Singapore",
  "Asia/Kuala_Lumpur",
  "UTC",
];
