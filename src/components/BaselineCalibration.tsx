import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface CalibrationData {
  typicalFocus: number;
  typicalSleep: number;
  pressureTolerance: number;
  switchingFreq: number;
}

interface BaselineCalibrationProps {
  onComplete: (data: CalibrationData) => void;
  onSkip: () => void;
}

export default function BaselineCalibration({ onComplete, onSkip }: BaselineCalibrationProps) {
  const [data, setData] = useState<CalibrationData>({
    typicalFocus: 6,
    typicalSleep: 7,
    pressureTolerance: 50,
    switchingFreq: 40,
  });

  const provisionalArchetype = data.typicalFocus > 8 && data.pressureTolerance > 60
    ? "Burst Performer"
    : data.typicalSleep >= 7.5 && data.switchingFreq < 30
    ? "Steady Builder"
    : data.pressureTolerance > 65
    ? "Deadline Reactor"
    : "Adaptive Thinker";

  const baselineStability = Math.round(Math.max(20, 100 - Math.abs(data.typicalFocus - 6) * 8 - Math.abs(data.typicalSleep - 7.5) * 10 - data.switchingFreq * 0.3));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-lg space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-serif font-medium text-foreground">Baseline Calibration</h2>
        <p className="mt-2 text-sm text-muted-foreground">Help the system understand your typical patterns for immediate insights.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <CalField label="Typical daily focus hours" value={data.typicalFocus} display={`${data.typicalFocus}h`}
          onChange={v => setData(d => ({ ...d, typicalFocus: v }))} max={16} step={0.5} />
        <CalField label="Typical sleep duration" value={data.typicalSleep} display={`${data.typicalSleep}h`}
          onChange={v => setData(d => ({ ...d, typicalSleep: v }))} min={4} max={10} step={0.5} />
        <CalField label="Pressure tolerance" value={data.pressureTolerance} display={data.pressureTolerance < 33 ? "Low" : data.pressureTolerance < 66 ? "Moderate" : "High"}
          onChange={v => setData(d => ({ ...d, pressureTolerance: v }))} max={100} />
        <CalField label="Task switching frequency" value={data.switchingFreq} display={data.switchingFreq < 33 ? "Rare" : data.switchingFreq < 66 ? "Sometimes" : "Frequent"}
          onChange={v => setData(d => ({ ...d, switchingFreq: v }))} max={100} />
      </div>

      {/* Live provisional output */}
      <div className="glass-panel rounded-2xl p-5 space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">Provisional Analysis</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/30 px-3 py-2">
            <span className="text-[10px] text-muted-foreground block">Archetype</span>
            <span className="text-sm font-semibold text-foreground">{provisionalArchetype}</span>
          </div>
          <div className="rounded-lg bg-muted/30 px-3 py-2">
            <span className="text-[10px] text-muted-foreground block">Est. Stability</span>
            <span className="text-sm font-semibold text-foreground">{baselineStability}/100</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={onSkip} className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
          Skip calibration
        </button>
        <button onClick={() => onComplete(data)} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
          Calibrate system
        </button>
      </div>
    </motion.div>
  );
}

function CalField({ label, value, display, onChange, min = 0, max, step = 1 }: {
  label: string; value: number; display: string; onChange: (v: number) => void; min?: number; max: number; step?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">{display}</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} />
    </div>
  );
}
