import { motion } from "framer-motion";
import { RecoverySignal } from "@/lib/cognitive-engine";
import { HeartPulse } from "lucide-react";

interface RecoverySignalsProps {
  signals: RecoverySignal[];
}

export default function RecoverySignals({ signals }: RecoverySignalsProps) {
  if (signals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <HeartPulse className="h-4 w-4 text-load-low" />
        <h3 className="text-sm font-semibold text-foreground">Recovery Signals</h3>
      </div>
      <div className="space-y-2.5">
        {signals.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-3 rounded-xl bg-load-low/5 p-3"
          >
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-load-low/15 text-xs font-semibold text-load-low">
              {signal.percentage > 0 ? `${signal.percentage}%` : "↑"}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{signal.description}</p>
              <p className="text-xs text-muted-foreground">{signal.impact}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}