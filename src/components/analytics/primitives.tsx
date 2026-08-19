import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Check, Lock, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { severityLabel, type Severity } from "@/lib/analytics-data";

export const toneRing: Record<Severity, string> = {
  stable: "border-stable/40 bg-stable/10 text-stable-foreground",
  caution: "border-caution/50 bg-caution/15 text-caution-foreground",
  critical: "border-critical/50 bg-critical/12 text-critical",
  signal: "border-signal/40 bg-signal/10 text-signal",
};

export const toneDot: Record<Severity, string> = {
  stable: "bg-stable",
  caution: "bg-caution",
  critical: "bg-critical",
  signal: "bg-signal",
};

export const toneStroke: Record<Severity, string> = {
  stable: "var(--color-stable)",
  caution: "var(--color-caution)",
  critical: "var(--color-critical)",
  signal: "var(--color-signal)",
};

const riskBadge = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-tight",
);

export function RiskBadge({
  severity,
  label,
  className,
}: {
  severity: Severity;
  label?: string;
  className?: string;
}) {
  const Icon = severity === "stable" ? Check : severity === "signal" ? TrendingUp : AlertTriangle;
  return (
    <span className={cn(riskBadge(), toneRing[severity], className)}>
      <Icon className="size-3" aria-hidden />
      {label ?? severityLabel[severity]}
    </span>
  );
}

export function AiTag({ confidence, className }: { confidence?: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ai/40 bg-ai/10 px-2.5 py-1 text-[11px] font-medium text-ai",
        className,
      )}
    >
      <Sparkles className="size-3" aria-hidden />
      AI observation
      {confidence !== undefined && (
        <span className="font-mono text-[10px] opacity-80">{Math.round(confidence * 100)}%</span>
      )}
    </span>
  );
}

export function PrivacyBadge({
  icon: Icon = ShieldCheck,
  label,
  value,
  tone = "stable",
}: {
  icon?: typeof ShieldCheck;
  label: string;
  value: string;
  tone?: Severity;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5">
      <span className={cn("flex size-6 items-center justify-center rounded-md border", toneRing[tone])}>
        <Icon className="size-3.5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="block text-xs font-medium text-foreground">{value}</span>
      </span>
    </div>
  );
}

export function PrivacyBar({ compliance, scope }: { compliance: string; scope: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PrivacyBadge label="Compliance" value={`${compliance} verified`} />
      <PrivacyBadge icon={Lock} label="Isolation" value={scope} />
      <PrivacyBadge icon={ShieldCheck} label="Encryption" value="Field-level, at rest & in transit" tone="signal" />
    </div>
  );
}

export function Panel({
  title,
  caption,
  action,
  children,
  className,
}: {
  title?: string;
  caption?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {caption && <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</p>
  );
}

export type ToneProps = VariantProps<typeof riskBadge>;
