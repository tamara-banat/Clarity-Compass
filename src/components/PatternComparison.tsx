import { motion } from "framer-motion";
import { PatternComparison as PatternComparisonType } from "@/lib/cognitive-engine";
import { ArrowUpRight, ArrowDownRight, Minus, GitCompareArrows } from "lucide-react";

interface PatternComparisonProps {
  comparison: PatternComparisonType;
}

function ChangeIndicator({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const isPositive = inverse ? value < 0 : value > 0;
  const isNegative = inverse ? value > 0 : value < 0;
  if (value === 0) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  if (isPositive) return <ArrowUpRight className="h-3.5 w-3.5 text-load-high" />;
  return <ArrowDownRight className="h-3.5 w-3.5 text-load-low" />;
}

export default function PatternComparison({ comparison }: PatternComparisonProps) {
  if (!comparison.available) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
        {comparison.summary}
      </div>
    );
  }

  const metrics = [
    { label: "Avg Load", prev: comparison.previousPeriod.avgLoad, curr: comparison.currentPeriod.avgLoad, change: comparison.loadChange, inverse: true },
    { label: "Volatility", prev: comparison.previousPeriod.volatility, curr: comparison.currentPeriod.volatility, change: comparison.volatilityChange, inverse: true },
    { label: "Avg Sleep", prev: comparison.previousPeriod.avgSleep, curr: comparison.currentPeriod.avgSleep, change: +(comparison.currentPeriod.avgSleep - comparison.previousPeriod.avgSleep).toFixed(1), inverse: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Pattern Comparison</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl bg-muted/50 p-3 text-center">
            <span className="text-xs text-muted-foreground block mb-1">{m.label}</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-serif font-semibold text-foreground">{m.curr}</span>
              <ChangeIndicator value={m.change} inverse={m.inverse} />
            </div>
            <span className="text-[10px] text-muted-foreground">was {m.prev}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{comparison.summary}</p>
    </motion.div>
  );
}
