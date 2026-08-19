import { FileSearch, Clock, Gauge } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { AiTag, RiskBadge, SectionLabel } from "./primitives";
import type { Highlight } from "@/lib/analytics-data";

export function LineageDrawer({
  highlight,
  onOpenChange,
}: {
  highlight: Highlight | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={!!highlight} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {highlight && (
          <>
            <SheetHeader>
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge severity={highlight.severity} />
                <AiTag confidence={highlight.confidence} />
              </div>
              <SheetTitle className="mt-2 text-left text-base">{highlight.title}</SheetTitle>
              <SheetDescription className="text-left">{highlight.detail}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-surface-2 p-3">
                  <SectionLabel>Observation window</SectionLabel>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="size-3.5 text-muted-foreground" aria-hidden />
                    {highlight.window}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface-2 p-3">
                  <SectionLabel>Pattern confidence</SectionLabel>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                    <Gauge className="size-3.5 text-muted-foreground" aria-hidden />
                    {Math.round(highlight.confidence * 100)}%
                  </p>
                  <Progress value={highlight.confidence * 100} className="mt-2 h-1" />
                </div>
              </div>

              <div>
                <SectionLabel>Raw source records</SectionLabel>
                <ul className="mt-2 space-y-2">
                  {highlight.sources.map((s) => (
                    <li key={s.id} className="rounded-lg border border-border bg-surface p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.source}</p>
                          <p className="mt-0.5 font-mono text-xs text-muted-foreground">{s.captured}</p>
                        </div>
                        <span className="font-mono text-sm font-semibold text-foreground">{s.value}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{s.method}</span>
                        <span className="font-mono">record confidence {Math.round(s.confidence * 100)}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ai-tint rounded-lg p-3">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
                  <FileSearch className="mt-0.5 size-4 shrink-0 text-ai" aria-hidden />
                  This highlight is a statistical pattern surfaced for human double-check. It is not a diagnosis,
                  determination, or recommendation. Every value above links back to an immutable source record and
                  is retained in the audit log with the reviewing user's identity.
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
