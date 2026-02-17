import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckInData, CognitiveResult, StabilityResult, computeElasticity, computeModelConfidence, generateHypothesis, CognitiveArchetype } from "@/lib/cognitive-engine";
import SplineCognitiveCore from "@/components/SplineCognitiveCore";

interface LiveSystemPanelProps {
  checkIns: CheckInData[];
  result: CognitiveResult;
  stability: StabilityResult;
  archetype: CognitiveArchetype;
}

export default function LiveSystemPanel({ checkIns, result, stability, archetype }: LiveSystemPanelProps) {
  const elasticity = useMemo(() => computeElasticity(checkIns), [checkIns]);
  const confidence = useMemo(() => computeModelConfidence(checkIns), [checkIns]);
  const hypothesis = useMemo(() => generateHypothesis(checkIns, result, stability), [checkIns, result, stability]);

  return (
    <div className="space-y-4 h-full">
      {/* 3D Core */}
      <div className="rounded-2xl overflow-hidden" style={{ height: "clamp(250px, 40vh, 400px)" }}>
        <SplineCognitiveCore loadIndex={result.loadIndex} stability={stability.score} tier={result.tier} />
      </div>

      {/* System metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCell label="Load Index" value={result.loadIndex} suffix="/100" tier={result.tier} />
        <MetricCell label="Stability" value={stability.score} suffix="/100" />
        <MetricCell label="Elasticity" value={elasticity.score} suffix="/100" />
        <MetricCell label="Confidence" value={confidence.pattern} suffix="%" />
      </div>

      {/* Hypothesis */}
      <div className="glass-panel rounded-xl p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary mb-1.5 block">Emerging Hypothesis</span>
        <p className="text-[12px] text-foreground/90 leading-relaxed font-light">{hypothesis}</p>
      </div>

      {/* Archetype */}
      {archetype.available && (
        <div className="flex items-center gap-2.5 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
          <span className="text-[10px] text-muted-foreground">Archetype:</span>
          <span className="text-[10px] font-semibold text-foreground">{archetype.name}</span>
          <span className="text-[9px] text-muted-foreground">{archetype.confidence}% conf.</span>
        </div>
      )}
    </div>
  );
}

function MetricCell({ label, value, suffix, tier }: { label: string; value: number; suffix: string; tier?: string }) {
  return (
    <div className="glass-panel rounded-xl px-3.5 py-3">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-serif font-semibold text-foreground">
          {value}
        </motion.span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}