import { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { CheckInData, computeRawLoad, computeStabilityIndex } from "@/lib/cognitive-engine";

interface TrajectoryMapProps {
  checkIns: CheckInData[];
}

export default function TrajectoryMap({ checkIns }: TrajectoryMapProps) {
  const data = useMemo(() => {
    if (checkIns.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        date: `Day ${i + 1}`, load: 35 + Math.sin(i * 0.8) * 5, stability: 50, projected: true,
      }));
    }
    return checkIns.map((c, i) => {
      const load = computeRawLoad(c);
      const subset = checkIns.slice(0, i + 1);
      const stab = computeStabilityIndex(subset);
      return {
        date: new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        load: Math.round(load),
        stability: stab.score,
        projected: false,
      };
    });
  }, [checkIns]);

  const isProjected = data.length > 0 && data[0].projected;

  // Determine current narrative phase
  const phase = useMemo(() => {
    if (checkIns.length < 3) return "Initializing cognitive trajectory";
    const recent = data.slice(-3);
    const trend = recent[recent.length - 1].load - recent[0].load;
    if (trend > 10) return "System instability increasing";
    if (trend < -10) return "Entering stabilization phase";
    return "Maintaining steady trajectory";
  }, [checkIns, data]);

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Cognitive Trajectory</h3>
        <div className="flex items-center gap-2">
          {isProjected && (
            <span className="text-[10px] text-primary/70 animate-pulse-glow">● Baseline projection</span>
          )}
          <span className="text-[10px] text-muted-foreground italic">{phase}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trajGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-line))" stopOpacity={isProjected ? 0.06 : 0.15} />
              <stop offset="95%" stopColor="hsl(var(--chart-line))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "11px" }} />
          <ReferenceLine y={65} stroke="hsl(var(--load-moderate))" strokeDasharray="4 4" opacity={0.3} />
          <Area type="monotone" dataKey="load" stroke="hsl(var(--chart-line))" fill="url(#trajGrad)" strokeWidth={2} dot={false} name="Load" opacity={isProjected ? 0.4 : 1} />
          <Area type="monotone" dataKey="stability" stroke="hsl(var(--teal))" fill="none" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Stability" opacity={isProjected ? 0.25 : 0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.section>
  );
}