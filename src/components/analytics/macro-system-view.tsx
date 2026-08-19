import { ChevronRight, Layers } from "lucide-react";

import { AiTag, Panel, RiskBadge, SectionLabel, toneDot } from "./primitives";
import { DualTrendChart } from "./trend-chart";
import { Button } from "@/components/ui/button";
import type { DomainConfig, Highlight } from "@/lib/analytics-data";

export function MacroSystemView({
  domain,
  onInspect,
  onDrillDown,
}: {
  domain: DomainConfig;
  onInspect: (h: Highlight) => void;
  onDrillDown: () => void;
}) {
  const { macro } = domain;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {macro.kpis.map((k) => (
          <Panel key={k.id} className="p-4">
            <SectionLabel>{k.label}</SectionLabel>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{k.value}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">{k.hint}</span>
              <RiskBadge severity={k.severity} label={k.delta} />
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel title={macro.trend.title} caption={macro.trend.caption}>
          <DualTrendChart
            points={macro.trend.points}
            primaryLabel={macro.trend.primaryLabel}
            secondaryLabel={macro.trend.secondaryLabel}
          />
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-chart-1" aria-hidden />
              {macro.trend.primaryLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-chart-2" aria-hidden />
              {macro.trend.secondaryLabel}
            </span>
          </div>
        </Panel>

        <Panel
          title={macro.breakdownTitle}
          caption="Select a row to drill from system scale into a single record."
          action={
            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={onDrillDown}>
              <Layers className="size-3.5" aria-hidden />
              Drill to {domain.entityNoun.toLowerCase()}
            </Button>
          }
        >
          <ul className="divide-y divide-border">
            {macro.rows.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={onDrillDown}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:text-primary"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className={`size-2 shrink-0 rounded-full ${toneDot[r.severity]}`} aria-hidden />
                      <span className="truncate">{r.name}</span>
                    </span>
                    <span className="mt-0.5 block pl-4 text-[11px] text-muted-foreground">
                      {r.primary} · {r.secondary}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="System-level pattern highlights"
        caption="Aggregate observations for departmental double-check."
        action={<AiTag />}
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {macro.highlights.map((h) => (
            <li key={h.id} className="ai-tint rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge severity={h.severity} />
                <AiTag confidence={h.confidence} />
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{h.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{h.detail}</p>
              <Button variant="ghost" size="sm" className="mt-2 h-7 gap-1 px-2 text-xs" onClick={() => onInspect(h)}>
                Inspect lineage & sources
                <ChevronRight className="size-3.5" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
