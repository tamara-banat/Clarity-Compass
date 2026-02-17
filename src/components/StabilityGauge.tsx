import { motion } from "framer-motion";
import { StabilityResult } from "@/lib/cognitive-engine";
import { Activity } from "lucide-react";

interface StabilityGaugeProps {
  stability: StabilityResult;
}

export default function StabilityGauge({ stability }: StabilityGaugeProps) {
  const colorClass =
    stability.score >= 70 ? "text-load-low" : stability.score >= 40 ? "text-load-moderate" : "text-load-high";
  const bgClass =
    stability.score >= 70 ? "bg-load-low/10" : stability.score >= 40 ? "bg-load-moderate/10" : "bg-load-high/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Load Stability</h3>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <span className={`text-3xl font-serif font-semibold ${colorClass}`}>{stability.score}</span>
        <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${bgClass} ${colorClass}`}>
          {stability.label}
        </div>
      </div>
      {/* Bar */}
      <div className="h-1.5 w-full rounded-full bg-muted mb-3">
        <motion.div
          className={`h-full rounded-full ${stability.score >= 70 ? "bg-load-low" : stability.score >= 40 ? "bg-load-moderate" : "bg-load-high"}`}
          initial={{ width: 0 }}
          animate={{ width: `${stability.score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{stability.description}</p>
    </motion.div>
  );
}