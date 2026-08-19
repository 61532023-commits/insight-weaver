import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Boxes, Focus, ShieldCheck } from "lucide-react";

import { AnalystWidget } from "@/components/analytics/analyst-widget";
import { LineageDrawer } from "@/components/analytics/lineage-drawer";
import { MacroSystemView } from "@/components/analytics/macro-system-view";
import { MicroEntityView } from "@/components/analytics/micro-entity-view";
import { Panel, PrivacyBar, SectionLabel } from "@/components/analytics/primitives";
import { domains, type Highlight } from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scala — Adaptive Multi-Scale Analytics Components" },
      {
        name: "description",
        content:
          "Embeddable analytics UI components that adapt across healthcare, engineering and government — micro record views, macro system dashboards, lineage audit and privacy badges.",
      },
      { property: "og:title", content: "Scala — Adaptive Multi-Scale Analytics Components" },
      {
        property: "og:description",
        content:
          "Micro entity views, macro system dashboards, AI pattern highlights for human double-check, lineage inspector and tenant isolation badges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Scale = "micro" | "macro";

function Index() {
  const [domainId, setDomainId] = useState(domains[0]!.id);
  const [scale, setScale] = useState<Scale>("micro");
  const [entityIndex, setEntityIndex] = useState(0);
  const [inspected, setInspected] = useState<Highlight | null>(null);

  const domain = useMemo(() => domains.find((d) => d.id === domainId) ?? domains[0]!, [domainId]);
  const entity = domain.entities[Math.min(entityIndex, domain.entities.length - 1)]!;

  const scopeLabel =
    scale === "micro" ? entity.ref : `${domain.macro.breakdownTitle.replace(" breakdown", "")}-wide ${domain.systemNoun.toLowerCase()} scope`;

  return (
    <main className="min-h-screen bg-background">
      <div className="grid-canvas border-b border-border bg-surface-2/60">
        <div className="mx-auto max-w-[1400px] px-5 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Boxes className="size-5" aria-hidden />
              </span>
              <div>
                <h1 className="text-base font-semibold leading-tight text-foreground">
                  Scala Analytics Components
                </h1>
                <p className="text-xs text-muted-foreground">
                  Drop-in analytics surfaces · {domain.tagline}
                </p>
              </div>
            </div>
            <PrivacyBar compliance={domain.compliance} scope={domain.isolationScope} />
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Domain adapter</SectionLabel>
              <div className="mt-2 inline-flex rounded-lg border border-border bg-surface p-1">
                {domains.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDomainId(d.id);
                      setEntityIndex(0);
                    }}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      d.id === domain.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Scale</SectionLabel>
              <div className="mt-2 inline-flex rounded-lg border border-border bg-surface p-1">
                {(
                  [
                    { id: "micro" as const, label: `Micro · ${domain.entityNoun}`, icon: Focus },
                    { id: "macro" as const, label: `Macro · ${domain.systemNoun}`, icon: Boxes },
                  ]
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScale(s.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      scale === s.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <s.icon className="size-3.5" aria-hidden />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {scale === "micro" && domain.entities.length > 1 && (
              <div>
                <SectionLabel>Active record</SectionLabel>
                <div className="mt-2 inline-flex rounded-lg border border-border bg-surface p-1">
                  {domain.entities.map((e, i) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEntityIndex(i)}
                      className={cn(
                        "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                        i === entityIndex
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {e.ref}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          <div key={`${domain.id}-${scale}-${entity.id}`} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
            {scale === "micro" ? (
              <MicroEntityView domain={domain} entity={entity} onInspect={setInspected} />
            ) : (
              <MacroSystemView domain={domain} onInspect={setInspected} onDrillDown={() => setScale("micro")} />
            )}
          </div>

          <div className="space-y-4">
            <AnalystWidget
              scopeLabel={scopeLabel}
              suggestions={scale === "micro" ? domain.prompts.micro : domain.prompts.macro}
            />

            <Panel title="Isolation status" caption="Verified per request, per tenant, per record.">
              <ul className="space-y-2 text-xs">
                {[
                  `Tenant boundary enforced (${domain.compliance})`,
                  "Row-level scope applied to every query",
                  "AI observations computed on de-identified feature vectors",
                  "Full read audit retained for 7 years",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-stable" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>

      <LineageDrawer highlight={inspected} onOpenChange={(open) => !open && setInspected(null)} />
    </main>
  );
}
