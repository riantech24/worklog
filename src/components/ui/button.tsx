import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-bg hover:opacity-90 disabled:opacity-40 border border-transparent",
  secondary:
    "bg-surface text-ink border border-line-strong hover:bg-sunken disabled:opacity-40",
  ghost: "bg-transparent text-ink-soft hover:bg-sunken border border-transparent",
  danger: "bg-danger text-white hover:opacity-90 border border-transparent",
  accent:
    "bg-accent text-accent-ink hover:opacity-90 border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9.5 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, loadingText, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-[background-color,opacity] disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (loadingText ?? "Working…") : children}
    </button>
  ),
);
Button.displayName = "Button";
