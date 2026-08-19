import { useState } from "react";
import { CornerDownLeft, MessageSquareText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiTag, Panel } from "./primitives";

type Turn = { id: number; question: string; answer: string; note: string };

export function AnalystWidget({
  scopeLabel,
  suggestions,
}: {
  scopeLabel: string;
  suggestions: string[];
}) {
  const [value, setValue] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);

  function ask(question: string) {
    const q = question.trim();
    if (!q) return;
    setTurns((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: q,
        answer: `Scoped to ${scopeLabel}. Query resolved against permitted records only; the response below is assembled from source rows you already have access to.`,
        note: "Answer is descriptive analytics over raw records — no clinical, engineering, or eligibility decision is made or implied.",
      },
    ]);
    setValue("");
  }

  return (
    <Panel
      title="Conversational analyst"
      caption={`Context-bound to ${scopeLabel}`}
      action={<AiTag />}
      className="flex flex-col"
    >
      <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
        {turns.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
            <MessageSquareText className="mb-2 size-4" aria-hidden />
            Ask in plain language. The widget inherits the current scale and scope, so questions resolve against the
            active {scopeLabel} without exposing records outside your tenant.
          </div>
        ) : (
          turns.map((t) => (
            <div key={t.id} className="space-y-2">
              <p className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-secondary px-3 py-2 text-xs text-secondary-foreground">
                {t.question}
              </p>
              <div className="ai-tint rounded-lg rounded-bl-sm px-3 py-2">
                <p className="text-xs leading-relaxed text-foreground">{t.answer}</p>
                <p className="mt-2 text-[11px] italic text-muted-foreground">{t.note}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
        }}
      >
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ai" aria-hidden />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={suggestions[0] ?? "Ask a question"}
            aria-label="Ask the analyst"
            className="pl-8 text-xs"
          />
        </div>
        <Button type="submit" size="sm" className="gap-1.5">
          Ask
          <CornerDownLeft className="size-3.5" aria-hidden />
        </Button>
      </form>
    </Panel>
  );
}
