import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sliders } from "lucide-react";
import { CheckInData, computeStabilityIndex, computeRawLoad } from "@/lib/cognitive-engine";
import { Slider } from "@/components/ui/slider";

interface DecisionSimulatorProps {
  checkIns: CheckInData[];
}

export default function DecisionSimulator({ checkIns }: DecisionSimulatorProps) {
  const [switchReduction, setSwitchReduction] = useState(20);
  const [sleepIncrease, setSleepIncrease] = useState(1);
  const [deadlineReduction, setDeadlineReduction] = useState(20);

  const baseline = useMemo(() => computeStabilityIndex(checkIns), [checkIns]);

  const projected = useMemo(() => {
    if (checkIns.length < 3) return baseline.score;
    const recent = checkIns.slice(-7);
    const adjustedLoads = recent.map(c => {
      const adjusted = { ...c };
      adjusted.taskSwitching = Math.max(0, c.taskSwitching - switchReduction);
      adjusted.sleepHours = Math.min(10, c.sleepHours + sleepIncrease);
      adjusted.deadlinePressure = Math.max(0, c.deadlinePressure - deadlineReduction);
      return computeRawLoad(adjusted);
    });
    const mean = adjustedLoads.reduce((a, b) => a + b, 0) / adjustedLoads.length;
    const stdDev = Math.sqrt(adjustedLoads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / adjustedLoads.length);
    return Math.round(Math.max(0, 100 - stdDev * 3));
  }, [checkIns, switchReduction, sleepIncrease, deadlineReduction, baseline.score]);

  const improvement = projected - baseline.score;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Decision Simulator</h3>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-foreground">Reduce switching by</label>
            <span className="text-xs text-muted-foreground">{switchReduction}%</span>
          </div>
          <Slider value={[switchReduction]} onValueChange={([v]) => setSwitchReduction(v)} max={60} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-foreground">Increase sleep by</label>
            <span className="text-xs text-muted-foreground">{sleepIncrease}h</span>
          </div>
          <Slider value={[sleepIncrease]} onValueChange={([v]) => setSleepIncrease(v)} max={3} step={0.5} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-foreground">Decrease deadline density</label>
            <span className="text-xs text-muted-foreground">{deadlineReduction}%</span>
          </div>
          <Slider value={[deadlineReduction]} onValueChange={([v]) => setDeadlineReduction(v)} max={60} />
        </div>
      </div>

      <div className="flex items-center justify-between glass-panel rounded-xl px-4 py-3">
        <div>
          <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Projected Stability</span>
          <span className="text-2xl font-serif font-semibold text-foreground">{projected}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Improvement</span>
          <span className={`text-lg font-serif font-semibold ${improvement > 0 ? "text-load-low" : "text-muted-foreground"}`}>
            {improvement > 0 ? "+" : ""}{improvement} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
}
