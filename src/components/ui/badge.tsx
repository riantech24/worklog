import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "positive" | "warning" | "accent" | "muted";

const tones: Record<Tone, string> = {
  neutral: "border-line-strong text-ink-soft",
  positive: "border-transparent bg-positive/12 text-positive",
  warning: "border-transparent bg-warning/14 text-warning",
  accent: "border-transparent bg-accent-soft text-accent",
  muted: "border-transparent bg-sunken text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[12px] font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
