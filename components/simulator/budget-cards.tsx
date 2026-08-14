import { StatCard, StatGrid } from "@/components/ui/stat-card";
import type { ErrorBudget } from "@/lib/engine";

export type BudgetCardsProps = Omit<React.ComponentProps<"div">, "children"> & {
  budget: ErrorBudget;
};

// U+2212 minus sign — spec §7 verbatim, distinct from MetricCard's en dash.
const formatRange = (low: number, high: number): string => (low === high ? `~${low}` : `~${low}−${high}`);

// `note` is "<section>: до N ошибок · в Module 1 — не больше K" — split on the
// engine's own " · " separator to give the Module 1 clause its own line.
const NoteLabel = ({ note }: { note: string }) => {
  const [headline, detail] = note.split(" · ");
  return (
    <>
      <div>{headline}</div>
      <div>{detail}</div>
    </>
  );
};

export const BudgetCards = ({ className, budget, ...props }: BudgetCardsProps) => {
  const summary = formatRange(budget.totalRange.low, budget.totalRange.high);

  return (
    <StatGrid className={className} {...props}>
      <StatCard value={budget.perSection.rw.total} label={<NoteLabel note={budget.perSection.rw.note} />} />
      <StatCard
        value={budget.perSection.math.total}
        label={<NoteLabel note={budget.perSection.math.note} />}
      />
      <StatCard value={summary} label="Итого ошибок на весь экзамен" />
    </StatGrid>
  );
};
