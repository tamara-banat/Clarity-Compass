import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckInData, computeCorrelations, CorrelationEntry } from "@/lib/cognitive-engine";
import { useState } from "react";

interface CorrelationMatrixProps {
  checkIns: CheckInData[];
}

export default function CorrelationMatrix({ checkIns }: CorrelationMatrixProps) {
  const correlations = useMemo(() => computeCorrelations(checkIns), [checkIns]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (correlations.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">Correlation Matrix</h3>
        <p className="text-xs text-muted-foreground italic">Need at least 5 check-ins for correlation analysis.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-4">Correlation Matrix</h3>
      <div className="space-y-2.5">
        {correlations.map((c, i) => (
          <div
            key={i}
            className="relative rounded-xl bg-muted/20 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/40"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{c.xLabel} → {c.yLabel}</span>
              <span className={`text-xs font-serif font-semibold ${Math.abs(c.correlation) > 0.3 ? (c.correlation < 0 ? "text-load-low" : "text-load-moderate") : "text-muted-foreground"}`}>
                {c.correlation > 0 ? "+" : ""}{c.correlation}
              </span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${Math.abs(c.correlation) > 0.3 ? "bg-primary" : "bg-muted-foreground/30"}`}
                style={{ width: `${Math.abs(c.correlation) * 100}%`, marginLeft: c.correlation < 0 ? `${(1 - Math.abs(c.correlation)) * 50}%` : "50%" }}
              />
            </div>
            {hoveredIndex === i && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-muted-foreground mt-2 leading-relaxed"
              >
                {c.explanation}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
