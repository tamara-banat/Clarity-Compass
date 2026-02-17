import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Shield, Zap, AlertTriangle, Cpu } from "lucide-react";
import { CheckInData, computeCognitiveLoad, computeStabilityIndex } from "@/lib/cognitive-engine";
import { CoachIntelligence, getCoachIntelligence, isLLMEnabled } from "@/lib/coach-service";

interface CoachPanelProps {
  checkIns: CheckInData[];
}

export default function CoachPanel({ checkIns }: CoachPanelProps) {
  const result = useMemo(() => computeCognitiveLoad(checkIns), [checkIns]);
  const stability = useMemo(() => computeStabilityIndex(checkIns), [checkIns]);
  const [advice, setAdvice] = useState<CoachIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCoachIntelligence(checkIns, result, stability).then(a => {
      if (!cancelled) { setAdvice(a); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [checkIns, result, stability]);

  if (loading || !advice) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center gap-2.5">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-serif font-medium text-foreground">Cognitive Coach</h2>
        </div>
        <div className="glass-panel rounded-2xl p-8 flex items-center justify-center">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="text-sm text-muted-foreground">
            Analyzing cognitive patterns…
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-serif font-medium text-foreground">Cognitive Coach</h2>
        </div>
        {advice.source === "llm" && (
          <div className="flex items-center gap-1.5 text-[10px] text-primary/70">
            <Cpu className="h-3 w-3" />
            <span>LLM Mode</span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {advice.source === "llm" ? "Intelligence powered by local LLM analysis." : "Daily cognitive guidance based on your behavioral patterns."}
      </p>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5 space-y-4">
        {/* Insight */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-3 w-3 text-primary" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Daily Insight</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{advice.insight}</p>
        </div>

        <div className="h-px bg-border/30" />

        {/* Protection Strategy */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-load-low/10 flex items-center justify-center">
              <Shield className="h-3 w-3 text-load-low" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Protection Strategy</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{advice.protectionStrategy}</p>
        </div>

        <div className="h-px bg-border/30" />

        {/* Optimization */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-amber/10 flex items-center justify-center">
              <Zap className="h-3 w-3 text-amber" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Performance Optimization</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{advice.optimization}</p>
        </div>

        {/* Risk Warning */}
        {advice.riskWarning && (
          <>
            <div className="h-px bg-border/30" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-load-moderate/10 flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3 text-load-moderate" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Risk Warning</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{advice.riskWarning}</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
