import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  jobTitle: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  timezone: z.string().trim().min(1).max(60),
  currency: z.string().trim().length(3, "Use a 3-letter currency code"),
  locale: z.enum(["en", "id"]),
  theme: z.enum(["light", "dark", "system"]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
