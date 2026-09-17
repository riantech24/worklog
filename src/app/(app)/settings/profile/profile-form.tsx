"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { TIMEZONES } from "@/lib/constants";
import type { ProfileInput } from "@/lib/validations";

type FieldErrors = Partial<Record<keyof ProfileInput, string[]>>;

export function ProfileForm({
  initial,
  email,
}: {
  initial: ProfileInput;
  email: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileInput>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function set<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? "Your profile couldn't be saved. Try again.");
        if (body.fields) setFieldErrors(body.fields);
        return;
      }

      // Keep the theme choice and the rendered document in step.
      if (values.theme !== "system") {
        document.documentElement.classList.toggle("dark", values.theme === "dark");
        document.cookie = `worklog-theme=${values.theme}; path=/; max-age=31536000; samesite=lax`;
      }

      setMessage("Profile saved.");
      router.refresh();
    } catch {
      setError("Worklog couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5" noValidate>
      <Field label="Name" htmlFor="name" error={fieldErrors.name?.[0]}>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          autoComplete="name"
          required
        />
      </Field>

      <Field
        label="Email address"
        htmlFor="email"
        hint="Comes from the account you signed in with."
      >
        <Input id="email" value={email} readOnly disabled />
      </Field>

      <Field
        label="Professional title"
        htmlFor="jobTitle"
        hint="Appears on invoices and service logs."
        error={fieldErrors.jobTitle?.[0]}
      >
        <Input
          id="jobTitle"
          value={values.jobTitle ?? ""}
          onChange={(e) => set("jobTitle", e.target.value)}
          placeholder="IT Support Assistant"
        />
      </Field>

      <Field label="Phone" htmlFor="phone" error={fieldErrors.phone?.[0]}>
        <Input
          id="phone"
          value={values.phone ?? ""}
          onChange={(e) => set("phone", e.target.value)}
          autoComplete="tel"
        />
      </Field>

      <Field label="Address" htmlFor="address" error={fieldErrors.address?.[0]}>
        <Textarea
          id="address"
          value={values.address ?? ""}
          onChange={(e) => set("address", e.target.value)}
          rows={3}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Timezone"
          htmlFor="timezone"
          hint="Dates and times are shown here."
          error={fieldErrors.timezone?.[0]}
        >
          <Select
            id="timezone"
            value={values.timezone}
            onChange={(e) => set("timezone", e.target.value)}
          >
            {TIMEZONES.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Currency"
          htmlFor="currency"
          hint="Three-letter code, e.g. IDR."
          error={fieldErrors.currency?.[0]}
        >
          <Input
            id="currency"
            value={values.currency}
            onChange={(e) => set("currency", e.target.value.toUpperCase())}
            maxLength={3}
            className="uppercase"
          />
        </Field>

        <Field label="Language" htmlFor="locale" error={fieldErrors.locale?.[0]}>
          <Select
            id="locale"
            value={values.locale}
            onChange={(e) => set("locale", e.target.value as ProfileInput["locale"])}
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </Select>
        </Field>

        <Field label="Theme" htmlFor="theme" error={fieldErrors.theme?.[0]}>
          <Select
            id="theme"
            value={values.theme}
            onChange={(e) => set("theme", e.target.value as ProfileInput["theme"])}
          >
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </Field>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/8 px-3 py-2 text-[13px] text-danger"
        >
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={saving} loadingText="Saving…">
          Save changes
        </Button>
        {message ? (
          <span role="status" className="text-[13px] text-positive">
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
