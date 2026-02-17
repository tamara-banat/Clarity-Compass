import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckInData, computeCognitiveLoad, computeStabilityIndex, computeRiskForecast } from "@/lib/cognitive-engine";

interface CognitiveArcProps {
  checkIns: CheckInData[];
}

interface DailyArc {
  state: string;
  question: string;
  resolution: string;
}

function generateArc(checkIns: CheckInData[]): DailyArc {
  if (checkIns.length === 0) {
    return {
      state: "System awaiting first signal",
      question: "What patterns will emerge from your cognitive rhythm?",
      resolution: "Submit your first check-in to activate pattern detection.",
    };
  }

  const result = computeCognitiveLoad(checkIns);
  const stability = computeStabilityIndex(checkIns);
  const risk = computeRiskForecast(checkIns);
  const latest = checkIns[checkIns.length - 1];

  // State
  let state = "Cognitive system operating within normal parameters";
  if (result.tier === "high" && stability.score < 40) {
    state = "Elevated load with destabilizing volatility detected";
  } else if (result.tier === "high") {
    state = "System under sustained pressure — buffer margins narrowing";
  } else if (stability.score < 40) {
    state = "Pattern instability increasing — monitoring closely";
  } else if (result.tier === "low" && stability.score >= 70) {
    state = "Stable equilibrium achieved — optimal capacity window";
  } else if (result.tier === "moderate") {
    state = "Operating in productive tension — capacity holding";
  }

  // Question
  let question = "Can the current trajectory be sustained through tomorrow?";
  if (risk.burnoutProbability > 50) {
    question = "Is the system approaching a critical load threshold?";
  } else if (latest.sleepHours < 6) {
    question = "Will sleep deficit compound into cognitive degradation?";
  } else if (latest.taskSwitching > 70) {
    question = "Is fragmented attention eroding deeper processing capacity?";
  } else if (stability.score >= 70 && result.tier === "low") {
    question = "What could this sustained stability enable next?";
  } else if (checkIns.length >= 7) {
    const loads = checkIns.slice(-7).map(c => {
      const w = { focus: 0.2, sleep: 0.25, deadline: 0.2, switching: 0.2, clarity: 0.15 };
      return Math.min(c.focusHours / 12, 1) * 100 * w.focus + Math.max(0, (8 - c.sleepHours) / 8) * 100 * w.sleep +
        c.deadlinePressure * w.deadline + c.taskSwitching * w.switching + ((5 - c.mentalClarity) / 4) * 100 * w.clarity;
    });
    const trend = loads[loads.length - 1] - loads[0];
    if (trend > 15) question = "Will this upward load trajectory plateau or continue?";
    else if (trend < -15) question = "Is this recovery genuine or just a temporary dip?";
  }

  // Resolution
  let resolution = "Maintain observation. The system continues to learn.";
  if (result.tier === "high" && latest.sleepHours < 6.5) {
    resolution = "Protect tonight's sleep. Even 30 extra minutes could shift tomorrow's trajectory.";
  } else if (result.tier === "high") {
    resolution = "Create one protected focus block today. Reduce switching to preserve remaining capacity.";
  } else if (risk.burnoutProbability > 50) {
    resolution = "Consider a deliberate recovery day within 48 hours. The data supports this intervention.";
  } else if (result.tier === "low" && stability.score >= 60) {
    resolution = "Use this window for challenging work. Your system has capacity for demanding tasks.";
  } else if (stability.score < 40) {
    resolution = "Regularity matters more than intensity. Stabilize sleep and work patterns first.";
  }

  return { state, question, resolution };
}

export default function CognitiveArc({ checkIns }: CognitiveArcProps) {
  const arc = useMemo(() => generateArc(checkIns), [checkIns]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Subtle connecting line */}
      <div className="absolute left-5 top-6 bottom-6 w-[1px] bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

      <div className="space-y-6 pl-11">
        {/* State */}
        <div className="relative">
          <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary/60 ring-2 ring-primary/20" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70 block mb-1">System State</span>
          <p className="text-sm text-foreground/90 leading-relaxed font-light">{arc.state}</p>
        </div>

        {/* Question */}
        <div className="relative">
          <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-muted-foreground/30 ring-2 ring-muted-foreground/10" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground block mb-1">System Question</span>
          <p className="text-sm text-foreground/70 leading-relaxed italic font-light">{arc.question}</p>
        </div>

        {/* Resolution */}
        <div className="relative">
          <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary/30 ring-2 ring-primary/10" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground block mb-1">System Resolution</span>
          <p className="text-sm text-foreground/80 leading-relaxed font-light">{arc.resolution}</p>
        </div>
      </div>
    </motion.div>
  );
}
