import { motion } from "framer-motion";
import { Factor, RecoverySignal, CognitiveArchetype, StabilityResult, CheckInData } from "@/lib/cognitive-engine";
import { TrendingUp, TrendingDown, Minus, Activity, Brain, HeartPulse, BarChart3 } from "lucide-react";

interface GridProps {
  factors: Factor[];
  stability: StabilityResult;
  archetype: CognitiveArchetype;
  signals: RecoverySignal[];
  checkIns: CheckInData[];
}

const impactIcons = { increasing: TrendingUp, decreasing: TrendingDown, stable: Minus };

export default function IntelligenceGrid({ factors, stability, archetype, signals, checkIns }: GridProps) {
  // Compute volatility details
  const loads = checkIns.slice(-14).map(c => {
    const w = { focus: 0.2, sleep: 0.25, deadline: 0.2, switching: 0.2, clarity: 0.15 };
    return Math.min(c.focusHours / 12, 1) * 100 * w.focus + Math.max(0, (8 - c.sleepHours) / 8) * 100 * w.sleep +
      c.deadlinePressure * w.deadline + c.taskSwitching * w.switching + ((5 - c.mentalClarity) / 4) * 100 * w.clarity;
  });
  const mean = loads.length > 0 ? loads.reduce((a, b) => a + b, 0) / loads.length : 0;
  const stdDev = loads.length > 1 ? Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / loads.length) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Factor Analysis */}
      <GridCard title="Factor Analysis" icon={BarChart3} delay={0.1}>
        <div className="space-y-2">
          {factors.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Factors will appear after your first check-in.</p>
          ) : factors.map((f, i) => {
            const Icon = impactIcons[f.impact];
            return (
              <motion.div key={f.name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-2.5"
              >
                <Icon className={`h-3.5 w-3.5 mt-0.5 ${f.impact === "increasing" ? "text-load-moderate" : f.impact === "decreasing" ? "text-load-low" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground">{Math.round(f.weight * 100)}%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{f.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GridCard>

      {/* Load Stability */}
      <GridCard title="Load Stability Model" icon={Activity} delay={0.15}>
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className={`text-2xl font-serif font-semibold ${stability.score >= 70 ? "text-load-low" : stability.score >= 40 ? "text-load-moderate" : "text-load-high"}`}>
              {stability.score}
            </span>
            <span className="text-xs text-muted-foreground">{stability.label}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${stability.score >= 70 ? "bg-load-low" : stability.score >= 40 ? "bg-load-moderate" : "bg-load-high"}`}
              initial={{ width: 0 }}
              animate={{ width: `${stability.score}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-muted/30 px-2.5 py-1.5">
              <span className="text-muted-foreground">Volatility σ</span>
              <span className="block font-medium text-foreground">{stdDev.toFixed(1)}</span>
            </div>
            <div className="rounded-lg bg-muted/30 px-2.5 py-1.5">
              <span className="text-muted-foreground">Pattern</span>
              <span className="block font-medium text-foreground">{stdDev < 8 ? "Regular" : stdDev < 15 ? "Variable" : "Irregular"}</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{stability.description}</p>
        </div>
      </GridCard>

      {/* Archetype */}
      <GridCard title="Cognitive Archetype" icon={Brain} delay={0.2}>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">{archetype.name}</span>
            {archetype.available && (
              <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                {checkIns.length >= 21 ? "95%" : checkIns.length >= 14 ? "75%" : "~50%"} confidence
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{archetype.description}</p>
          {archetype.pattern && (
            <div className="rounded-lg bg-muted/30 p-2.5">
              <p className="text-[11px] text-foreground/80 leading-relaxed italic">"{archetype.pattern}"</p>
            </div>
          )}
        </div>
      </GridCard>

      {/* Recovery Signals */}
      <GridCard title="Recovery Signals" icon={HeartPulse} delay={0.25}>
        {signals.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            {checkIns.length < 5
              ? "Recovery pattern detection activates after 5 check-ins."
              : "No distinct recovery signals detected in recent data."}
          </p>
        ) : (
          <div className="space-y-2">
            {signals.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2.5 rounded-lg bg-load-low/5 p-2.5"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-load-low/15 text-[9px] font-bold text-load-low">
                  {s.percentage > 0 ? `${s.percentage}%` : "↑"}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{s.description}</p>
                  <p className="text-[10px] text-muted-foreground">{s.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GridCard>
    </div>
  );
}

function GridCard({ title, icon: Icon, delay, children }: {
  title: string; icon: typeof Activity; delay: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
