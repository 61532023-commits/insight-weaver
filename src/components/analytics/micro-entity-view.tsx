import { ChevronRight, Database, FileClock, Stethoscope } from "lucide-react";

import { AiTag, Panel, RiskBadge, SectionLabel, toneDot, toneStroke } from "./primitives";
import { Sparkline } from "./trend-chart";
import { Button } from "@/components/ui/button";
import type { DomainConfig, Entity, Highlight } from "@/lib/analytics-data";

export function MicroEntityView({
  domain,
  entity,
  onInspect,
}: {
  domain: DomainConfig;
  entity: Entity;
  onInspect: (h: Highlight) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <SectionLabel>{domain.entityNoun} record</SectionLabel>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">{entity.ref}</h2>
              <p className="text-sm text-muted-foreground">{entity.name}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entity.meta.map((m) => (
                  <span
                    key={m}
                    className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[11px] text-muted-foreground">
              <Database className="size-3.5" aria-hidden />
              Source of truth: system of record
            </span>
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-3">
          {entity.series.map((s) => (
            <Panel key={s.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">
                    {s.latest}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">{s.unit}</span>
                  </p>
                </div>
                <span className={`mt-1 size-2 rounded-full ${toneDot[s.severity]}`} aria-hidden />
              </div>
              <Sparkline points={s.points} stroke={toneStroke[s.severity]} />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{s.reference}</span>
                <RiskBadge severity={s.severity} label={s.delta} />
              </div>
            </Panel>
          ))}
        </div>

        <Panel
          title="Pattern highlights"
          caption="Observational only — surfaced for your double-check, never a decision."
          action={<AiTag />}
        >
          <ul className="space-y-3">
            {entity.highlights.map((h) => (
              <li key={h.id} className="ai-tint rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge severity={h.severity} />
                  <AiTag confidence={h.confidence} />
                  <span className="font-mono text-[11px] text-muted-foreground">{h.window}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{h.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{h.detail}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 gap-1 px-2 text-xs"
                  onClick={() => onInspect(h)}
                >
                  Inspect lineage & sources
                  <ChevronRight className="size-3.5" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Record timeline" caption="Raw entries, kept visually distinct from AI observations.">
          <ol className="relative space-y-4 border-l border-border pl-4">
            {entity.timeline.map((e) => (
              <li key={e.id} className="relative">
                <span
                  className={`absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-surface ${
                    e.kind === "observation" ? "bg-ai" : e.kind === "order" ? "bg-signal" : "bg-muted-foreground"
                  }`}
                  aria-hidden
                />
                <p className="font-mono text-[11px] text-muted-foreground">{e.date}</p>
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.detail}</p>
                {e.kind === "observation" && <AiTag className="mt-1.5" />}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Human-in-the-loop" caption="Every highlight requires practitioner acknowledgement.">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-start gap-2">
              <Stethoscope className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              AI never authors decisions, orders, or determinations — it ranks patterns for review.
            </p>
            <p className="flex items-start gap-2">
              <FileClock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Acknowledgements are written to the audit log with reviewer identity and timestamp.
            </p>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="flex-1">
              Acknowledge review
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Dismiss highlight
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
