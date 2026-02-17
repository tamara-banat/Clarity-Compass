import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Beaker, Play, CheckCircle } from "lucide-react";
import { CheckInData, getAvailableExperiments, Experiment, computeStabilityIndex } from "@/lib/cognitive-engine";
import { getExperiments, saveExperiments } from "@/lib/storage";

interface ExperimentsPanelProps {
  checkIns: CheckInData[];
}

export default function ExperimentsPanel({ checkIns }: ExperimentsPanelProps) {
  const [activeExperiments, setActiveExperiments] = useState<Experiment[]>(() => getExperiments());
  const available = useMemo(() => getAvailableExperiments(), []);
  const stability = useMemo(() => computeStabilityIndex(checkIns), [checkIns]);

  const startExperiment = (exp: Experiment) => {
    const started: Experiment = {
      ...exp,
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      baselineValue: stability.score,
    };
    const updated = [...activeExperiments.filter(e => e.id !== exp.id), started];
    setActiveExperiments(updated);
    saveExperiments(updated);
  };

  const activeIds = new Set(activeExperiments.filter(e => e.status === "active").map(e => e.id));

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-2.5">
        <Beaker className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-serif font-medium text-foreground">Experiments</h2>
      </div>
      <p className="text-xs text-muted-foreground">Run 7-day behavioral experiments and measure their cognitive impact.</p>

      {/* Active experiments */}
      {activeExperiments.filter(e => e.status === "active").length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Active Experiments</h3>
          {activeExperiments.filter(e => e.status === "active").map((exp) => {
            const daysElapsed = exp.startDate ? Math.floor((Date.now() - new Date(exp.startDate).getTime()) / 86400000) : 0;
            const progress = Math.min(100, Math.round((daysElapsed / exp.duration) * 100));
            return (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{exp.name}</span>
                  <span className="text-[10px] text-primary font-medium">Day {daysElapsed}/{exp.duration}</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden mb-2">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Baseline: {exp.baselineValue}</span>
                  <span>Current stability: {stability.score}</span>
                  <span className={stability.score > (exp.baselineValue || 0) ? "text-load-low" : "text-muted-foreground"}>
                    Δ {stability.score - (exp.baselineValue || 0)} pts
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Available experiments */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Available Experiments</h3>
        {available.map((exp, i) => {
          const isActive = activeIds.has(exp.id);
          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{exp.name}</span>
                {isActive ? (
                  <span className="flex items-center gap-1 text-[10px] text-primary">
                    <CheckCircle className="h-3 w-3" /> Running
                  </span>
                ) : (
                  <button
                    onClick={() => startExperiment(exp)}
                    className="flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <Play className="h-3 w-3" /> Start
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">{exp.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>{exp.duration} days</span>
                <span>·</span>
                <span>Measures: {exp.metric}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
