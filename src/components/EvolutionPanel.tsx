import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Check } from "lucide-react";
import { CheckInData, computeEvolution } from "@/lib/cognitive-engine";

interface EvolutionPanelProps {
  checkIns: CheckInData[];
}

const levelNames = ["Reactive", "Aware", "Adaptive", "Self-Regulating", "Cognitive Strategist"];

export default function EvolutionPanel({ checkIns }: EvolutionPanelProps) {
  const evolution = useMemo(() => computeEvolution(checkIns), [checkIns]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-2.5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-serif font-medium text-foreground">Evolution</h2>
      </div>
      <p className="text-xs text-muted-foreground">Your cognitive system's growth trajectory over time.</p>

      {/* Level indicator */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Current Level</span>
            <span className="text-2xl font-serif font-semibold text-foreground">{evolution.name}</span>
          </div>
          <div className="text-right">
            <span className="text-4xl font-serif font-semibold text-primary">{evolution.level}</span>
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
        </div>

        {/* Progress bar through levels */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((l) => (
            <div key={l} className="flex-1 relative">
              <div className={`h-1.5 rounded-full transition-colors ${l <= evolution.level ? "bg-primary" : "bg-muted"}`} />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap">
                {levelNames[l - 1]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10" />

        {/* Improvement metrics */}
        {checkIns.length >= 14 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <MetricBlock label="Stability Δ" value={evolution.stabilityImprovement} suffix=" pts" />
            <MetricBlock label="Volatility Δ" value={-evolution.volatilityReduction} suffix="%" />
            <MetricBlock label="Recovery Δ" value={evolution.recoveryStrengthening} suffix=" pts" />
          </div>
        )}

        {/* Milestones */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">Milestones</h4>
          {evolution.milestones.map((m, i) => (
            <motion.div
              key={m}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 text-xs"
            >
              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="text-foreground/80">{m}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MetricBlock({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const isPositive = value > 0;
  return (
    <div className="glass-panel rounded-xl px-3 py-2.5 text-center">
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">{label}</span>
      <span className={`text-lg font-serif font-semibold ${isPositive ? "text-load-low" : value < 0 ? "text-load-moderate" : "text-muted-foreground"}`}>
        {isPositive ? "+" : ""}{value}{suffix}
      </span>
    </div>
  );
}
