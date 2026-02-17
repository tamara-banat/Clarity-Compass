import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckInData, computeRiskForecast } from "@/lib/cognitive-engine";

interface RiskForecastProps {
  checkIns: CheckInData[];
}

export default function RiskForecastPanel({ checkIns }: RiskForecastProps) {
  const risk = useMemo(() => computeRiskForecast(checkIns), [checkIns]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">Risk Forecast</h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <RadialMeter label="Burnout" value={risk.burnoutProbability} />
        <RadialMeter label="Instability" value={risk.instabilityRisk} />
        <RadialMeter label="Recovery Deficit" value={risk.recoveryDeficit} />
      </div>
    </motion.div>
  );
}

function RadialMeter({ label, value }: { label: string; value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 60 ? "hsl(var(--load-high))" : value > 35 ? "hsl(var(--load-moderate))" : "hsl(var(--load-low))";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width="68" height="68" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
          <motion.circle
            cx="34" cy="34" r={radius}
            fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            transform="rotate(-90 34 34)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-serif font-semibold text-foreground">{value}%</span>
        </div>
      </div>
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider text-center">{label}</span>
    </div>
  );
}
