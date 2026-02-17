import { useMemo } from "react";
import { motion } from "framer-motion";
import { getCheckIns } from "@/lib/storage";
import { computeRawLoad, computeStabilityIndex, determineCognitiveArchetype, comparePatterns } from "@/lib/cognitive-engine";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { GitCompareArrows, TrendingUp, Activity, Brain } from "lucide-react";
import CorrelationMatrix from "@/components/CorrelationMatrix";
import DecisionSimulator from "@/components/DecisionSimulator";

export default function CognitiveLab() {
  const checkIns = useMemo(() => getCheckIns(), []);
  const comparison = useMemo(() => comparePatterns(checkIns), [checkIns]);

  const volatilityData = useMemo(() => {
    if (checkIns.length < 6) return [];
    const windowSize = 5;
    const results = [];
    for (let i = windowSize; i <= checkIns.length; i++) {
      const window = checkIns.slice(i - windowSize, i);
      const loads = window.map(computeRawLoad);
      const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
      const vol = Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / loads.length);
      results.push({
        point: new Date(checkIns[i - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        volatility: Math.round(vol * 10) / 10,
        avgLoad: Math.round(mean),
      });
    }
    return results;
  }, [checkIns]);

  const archetypeHistory = useMemo(() => {
    if (checkIns.length < 14) return [];
    const results = [];
    for (let i = 14; i <= checkIns.length; i++) {
      const subset = checkIns.slice(0, i);
      const arch = determineCognitiveArchetype(subset);
      if (results.length === 0 || results[results.length - 1].archetype !== arch.name) {
        results.push({
          point: new Date(checkIns[i - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          archetype: arch.name,
          dataPoints: i,
        });
      }
    }
    return results;
  }, [checkIns]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-serif font-medium text-foreground">Cognitive Lab</h1>
        <p className="text-xs text-muted-foreground mt-1">Longitudinal analysis and behavioral intelligence</p>
      </div>

      {checkIns.length < 6 ? (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <Brain className="h-8 w-8 text-primary/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            The Cognitive Lab requires at least 6 check-ins. You have {checkIns.length} so far.
          </p>
        </div>
      ) : (
        <>
          {/* Period Comparison */}
          {comparison.available && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Period Comparison</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <CompareCell label="Avg Load" prev={comparison.previousPeriod.avgLoad} curr={comparison.currentPeriod.avgLoad} />
                <CompareCell label="Volatility" prev={comparison.previousPeriod.volatility} curr={comparison.currentPeriod.volatility} />
                <CompareCell label="Avg Sleep" prev={comparison.previousPeriod.avgSleep} curr={comparison.currentPeriod.avgSleep} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{comparison.summary}</p>
            </motion.div>
          )}

          {/* Volatility Trend */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Volatility Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={volatilityData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--load-moderate))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--load-moderate))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="point" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "11px" }} />
                <Area type="monotone" dataKey="volatility" stroke="hsl(var(--load-moderate))" fill="url(#volGrad)" strokeWidth={2} dot={false} name="Volatility σ" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Correlation Matrix */}
          <CorrelationMatrix checkIns={checkIns} />

          {/* Decision Simulator */}
          <DecisionSimulator checkIns={checkIns} />

          {/* Archetype Evolution */}
          {archetypeHistory.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Archetype Evolution</h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {archetypeHistory.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-muted-foreground">→</span>}
                    <div className="glass-panel rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-primary block">{a.archetype}</span>
                      <span className="text-[10px] text-muted-foreground">{a.point} · {a.dataPoints} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Load Distribution */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Load Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={volatilityData}>
                <XAxis dataKey="point" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "11px" }} />
                <Bar dataKey="avgLoad" radius={[3, 3, 0, 0]} name="Avg Load">
                  {volatilityData.map((d, i) => (
                    <Cell key={i} fill={d.avgLoad > 65 ? "hsl(var(--load-high))" : d.avgLoad > 40 ? "hsl(var(--load-moderate))" : "hsl(var(--load-low))"} opacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </div>
  );
}

function CompareCell({ label, prev, curr }: { label: string; prev: number; curr: number }) {
  const diff = curr - prev;
  return (
    <div className="glass-panel rounded-xl px-3 py-2.5 text-center">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">{label}</span>
      <span className="text-lg font-serif font-semibold text-foreground">{curr}</span>
      <span className={`text-[10px] block ${diff > 0 ? "text-load-moderate" : diff < 0 ? "text-load-low" : "text-muted-foreground"}`}>
        {diff > 0 ? "+" : ""}{diff.toFixed(1)} vs prior
      </span>
    </div>
  );
}
