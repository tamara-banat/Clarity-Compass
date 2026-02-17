import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SystemShift } from "@/lib/cognitive-engine";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

interface SystemShiftOverlayProps {
  shift: SystemShift;
  onComplete: () => void;
}

export default function SystemShiftOverlay({ shift, onComplete }: SystemShiftOverlayProps) {
  const [phase, setPhase] = useState<"recalibrating" | "results">("recalibrating");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("results"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-lg"
    >
      <AnimatePresence mode="wait">
        {phase === "recalibrating" ? (
          <motion.div
            key="recal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-4"
          >
            <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary animate-breathe" />
            </div>
            <p className="text-lg font-serif font-medium text-foreground">System recalibrating…</p>
            <p className="text-xs text-muted-foreground">Analyzing behavioral pattern shift</p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-6 space-y-5"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-serif font-medium text-foreground">System Updated</h2>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-4">
              {/* Load delta */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Load Index Change</span>
                <span className={`text-sm font-serif font-semibold flex items-center gap-1 ${shift.loadDelta > 0 ? "text-load-moderate" : shift.loadDelta < 0 ? "text-load-low" : "text-muted-foreground"}`}>
                  {shift.loadDelta > 0 ? <ArrowUp className="h-3 w-3" /> : shift.loadDelta < 0 ? <ArrowDown className="h-3 w-3" /> : null}
                  {shift.loadDelta > 0 ? "+" : ""}{shift.loadDelta}
                </span>
              </div>

              {/* Changes */}
              {shift.increases.length > 0 && (
                <div className="text-[11px]">
                  <span className="text-muted-foreground">Increased: </span>
                  <span className="text-foreground/80">{shift.increases.join(", ")}</span>
                </div>
              )}
              {shift.decreases.length > 0 && (
                <div className="text-[11px]">
                  <span className="text-muted-foreground">Decreased: </span>
                  <span className="text-foreground/80">{shift.decreases.join(", ")}</span>
                </div>
              )}

              {/* Tomorrow risk */}
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tomorrow Risk</span>
                <span className="text-sm font-serif font-semibold text-foreground">{shift.riskForecast}%</span>
              </div>

              {/* Divergence */}
              {shift.divergenceDetected && (
                <div className="flex items-center gap-2 rounded-lg bg-load-moderate/10 px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-load-moderate" />
                  <span className="text-[11px] text-foreground/80">Pattern divergence detected</span>
                </div>
              )}
            </div>

            <button
              onClick={onComplete}
              className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue to dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}