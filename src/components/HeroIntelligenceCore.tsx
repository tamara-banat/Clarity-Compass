import { motion } from "framer-motion";
import { CognitiveResult, StabilityResult, CognitiveArchetype, CheckInData } from "@/lib/cognitive-engine";
import { useMemo } from "react";

interface HeroCoreProps {
  result: CognitiveResult;
  stability: StabilityResult;
  archetype: CognitiveArchetype;
  checkIns: CheckInData[];
}

function computeElasticity(checkIns: CheckInData[]): { score: number; label: string; interpretation: string; buffering: string } {
  if (checkIns.length < 5) {
    return { score: 50, label: "Calibrating", interpretation: "Gathering data to measure cognitive elasticity.", buffering: "Unknown" };
  }
  const recent = checkIns.slice(-14);
  const loads = recent.map(c => {
    const w = { focus: 0.2, sleep: 0.25, deadline: 0.2, switching: 0.2, clarity: 0.15 };
    return Math.min(c.focusHours / 12, 1) * 100 * w.focus + Math.max(0, (8 - c.sleepHours) / 8) * 100 * w.sleep +
      c.deadlinePressure * w.deadline + c.taskSwitching * w.switching + ((5 - c.mentalClarity) / 4) * 100 * w.clarity;
  });
  // Find spikes and measure recovery time
  let totalRecovery = 0, spikeCount = 0;
  for (let i = 1; i < loads.length; i++) {
    if (loads[i] > loads[i - 1] + 15) {
      let recovery = 0;
      for (let j = i + 1; j < loads.length; j++) {
        recovery++;
        if (loads[j] < loads[i] - 10) break;
      }
      totalRecovery += recovery;
      spikeCount++;
    }
  }
  const avgRecovery = spikeCount > 0 ? totalRecovery / spikeCount : 2;
  const score = Math.round(Math.max(0, Math.min(100, 100 - avgRecovery * 20)));
  const label = score >= 70 ? "High" : score >= 40 ? "Moderate" : "Low";
  const interpretation = score >= 70
    ? "You recover quickly from cognitive spikes — high adaptive capacity."
    : score >= 40
    ? "Moderate recovery rate — your system rebounds within expected parameters."
    : "Slower recovery from load spikes — consider protective strategies.";
  const recoveryDays = recent.filter(c => c.focusHours < 5 && c.deadlinePressure < 30).length;
  const buffering = recoveryDays >= 3 ? "Strong" : recoveryDays >= 1 ? "Moderate" : "Weak";
  return { score, label, interpretation, buffering };
}

function computeModelConfidence(checkIns: CheckInData[]): { data: number; pattern: number; projection: number } {
  const n = checkIns.length;
  const data = Math.min(100, Math.round((n / 21) * 100));
  const pattern = n < 3 ? 10 : n < 7 ? 35 : n < 14 ? 60 : n < 21 ? 80 : 95;
  const projection = n < 5 ? 15 : n < 10 ? 40 : n < 21 ? 65 : 90;
  return { data, pattern, projection };
}

function generateHypothesis(checkIns: CheckInData[], result: CognitiveResult, stability: StabilityResult): string {
  if (checkIns.length === 0) return "Awaiting initial cognitive data to begin pattern analysis. Submit your first check-in to activate the modeling engine.";
  if (checkIns.length < 3) return "Preliminary calibration in progress. Early signals suggest initial baseline formation — more data points will refine hypothesis generation.";
  const recent = checkIns.slice(-7);
  const avgDeadline = recent.reduce((s, c) => s + c.deadlinePressure, 0) / recent.length;
  const avgSleep = recent.reduce((s, c) => s + c.sleepHours, 0) / recent.length;
  
  let hyp = `Your cognitive system is operating at ${result.tier} load tolerance`;
  if (stability.score < 50) hyp += `, but volatility suggests ${avgDeadline > 50 ? "deadline reactivity" : "inconsistent recovery patterns"}`;
  else hyp += ` with ${stability.label.toLowerCase()} pattern regularity`;
  if (avgSleep < 6.5) hyp += `. Sleep deficit may be constraining recovery buffering capacity`;
  hyp += ".";
  return hyp;
}

export default function HeroIntelligenceCore({ result, stability, archetype, checkIns }: HeroCoreProps) {
  const elasticity = useMemo(() => computeElasticity(checkIns), [checkIns]);
  const confidence = useMemo(() => computeModelConfidence(checkIns), [checkIns]);
  const hypothesis = useMemo(() => generateHypothesis(checkIns, result, stability), [checkIns, result, stability]);

  const tierColors = {
    low: "hsl(var(--load-low))",
    moderate: "hsl(var(--load-moderate))",
    high: "hsl(var(--load-high))",
  };

  const stabilityColor = stability.score >= 70 ? "hsl(var(--load-low))" : stability.score >= 40 ? "hsl(var(--load-moderate))" : "hsl(var(--load-high))";

  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference - (result.loadIndex / 100) * circumference;

  // Stability ring
  const stabRadius = 100;
  const stabCirc = Math.PI * stabRadius;
  const stabOffset = stabCirc - (stability.score / 100) * stabCirc;

  return (
    <section className="w-full">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] items-start">
        {/* LEFT — Dial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center py-8"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-full animate-pulse-glow" style={{
              background: `radial-gradient(circle, hsl(var(--glow) / 0.12) 0%, transparent 70%)`,
            }} />
          </div>

          <div className="relative dial-glow">
            <svg width="240" height="140" viewBox="0 0 240 140">
              {/* Outer stability ring */}
              <path
                d="M 15 125 A 100 100 0 0 1 225 125"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={0.3}
              />
              <motion.path
                d="M 15 125 A 100 100 0 0 1 225 125"
                fill="none"
                stroke={stabilityColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={stabCirc}
                initial={{ strokeDashoffset: stabCirc }}
                animate={{ strokeDashoffset: stabOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                opacity={0.5}
              />

              {/* Main load arc background */}
              <path
                d="M 27 120 A 90 90 0 0 1 213 120"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Main load arc */}
              <motion.path
                d="M 27 120 A 90 90 0 0 1 213 120"
                fill="none"
                stroke={tierColors[result.tier]}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>

            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-5xl font-serif font-semibold"
                style={{ color: tierColors[result.tier] }}
              >
                {result.loadIndex}
              </motion.span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                Cognitive Load
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — System Interpretation */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            System Interpretation
          </h2>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <MetricCell label="Load Index" value={result.loadIndex} suffix="/100" />
            <MetricCell label="Stability" value={stability.score} suffix="/100" />
            <MetricCell label="Elasticity" value={elasticity.score} suffix="/100" />
            <MetricCell label="Model Confidence" value={confidence.pattern} suffix="%" />
          </div>

          {/* Hypothesis */}
          <div className="glass-panel rounded-xl p-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary mb-1.5 block">
              Emerging Hypothesis
            </span>
            <p className="text-sm text-foreground/90 leading-relaxed font-light">
              {hypothesis}
            </p>
          </div>

          {/* Archetype badge */}
          {archetype.available && (
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
              <span className="text-xs text-muted-foreground">Archetype:</span>
              <span className="text-xs font-semibold text-foreground">{archetype.name}</span>
              <span className="text-[10px] text-muted-foreground">— {archetype.description.slice(0, 60)}…</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function MetricCell({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="glass-panel rounded-xl px-3.5 py-3 neural-glow">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-serif font-semibold text-foreground"
        >
          {value}
        </motion.span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}
