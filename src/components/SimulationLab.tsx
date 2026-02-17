import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { CheckInData, SimulationInput, simulateUpcomingWeek, simulateScenarios } from "@/lib/cognitive-engine";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Slider } from "@/components/ui/slider";

interface SimulationLabProps {
  checkIns: CheckInData[];
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SimulationLab({ checkIns }: SimulationLabProps) {
  const [input, setInput] = useState<SimulationInput>({
    expectedWorkload: 50, majorDeadlines: 1, plannedSleep: 7, recoveryIntention: 50,
  });
  const [showScenarios, setShowScenarios] = useState(false);

  const result = useMemo(() => simulateUpcomingWeek(checkIns, input), [checkIns, input]);
  const scenarios = useMemo(() => simulateScenarios(checkIns), [checkIns]);

  const chartData = result.projectedLoads.map((load, i) => ({
    day: dayLabels[i], load, risk: load < 40 ? "low" : load < 70 ? "moderate" : "high",
  }));

  const scenarioData = dayLabels.map((day, i) => ({
    day,
    ...Object.fromEntries(scenarios.map(s => [s.name, s.loads[i]])),
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FlaskConical className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-serif font-medium text-foreground">Simulation Lab</h2>
        </div>
        <button onClick={() => setShowScenarios(s => !s)} className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors">
          {showScenarios ? "Custom Mode" : "Compare Scenarios"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Define your upcoming week. The system shows ranges, not certainties.</p>

      {showScenarios ? (
        <div className="space-y-5">
          <div className="glass-panel rounded-xl p-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={scenarioData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "11px" }} />
                <ReferenceLine y={65} stroke="hsl(var(--load-moderate))" strokeDasharray="4 4" opacity={0.3} />
                <Area type="monotone" dataKey="High Load" stroke="hsl(var(--load-high))" fill="none" strokeWidth={2} dot={false} opacity={0.8} />
                <Area type="monotone" dataKey="High Recovery" stroke="hsl(var(--load-low))" fill="none" strokeWidth={2} dot={false} opacity={0.8} />
                <Area type="monotone" dataKey="Balanced" stroke="hsl(var(--chart-line))" fill="none" strokeWidth={2} dot={false} opacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scenarios.map((s) => (
              <div key={s.name} className="glass-panel rounded-xl px-3 py-2.5 text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{s.name}</span>
                <span className="text-lg font-serif font-semibold text-foreground">{s.risk}%</span>
                <span className="text-[10px] text-muted-foreground block">risk</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <SliderField label="Expected Workload" value={input.expectedWorkload} max={100} display={`${input.expectedWorkload}%`} onChange={v => setInput(p => ({ ...p, expectedWorkload: v }))} />
            <SliderField label="Major Deadlines" value={input.majorDeadlines} max={5} display={`${input.majorDeadlines}`} onChange={v => setInput(p => ({ ...p, majorDeadlines: v }))} />
            <SliderField label="Planned Sleep" value={input.plannedSleep} min={4} max={10} step={0.5} display={`${input.plannedSleep}h`} onChange={v => setInput(p => ({ ...p, plannedSleep: v }))} />
            <SliderField label="Recovery Intention" value={input.recoveryIntention} max={100} display={`${input.recoveryIntention}%`} onChange={v => setInput(p => ({ ...p, recoveryIntention: v }))} />
          </div>

          <div className="glass-panel rounded-xl p-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-line))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--chart-line))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "11px" }} />
                <ReferenceLine y={65} stroke="hsl(var(--load-moderate))" strokeDasharray="4 4" opacity={0.4} />
                <Area type="monotone" dataKey="load" stroke="hsl(var(--chart-line))" fill="url(#simGrad)" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--card))", stroke: "hsl(var(--chart-line))" }} name="Projected Load" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel rounded-xl px-3 py-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Peak</span>
              <span className="text-lg font-serif font-semibold text-foreground">{dayLabels[result.peakDay - 1]}</span>
            </div>
            <div className="glass-panel rounded-xl px-3 py-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Risk</span>
              <span className="text-lg font-serif font-semibold text-foreground">{result.riskProbability}%</span>
            </div>
            <div className="glass-panel rounded-xl px-3 py-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Stability Δ</span>
              <span className={`text-lg font-serif font-semibold ${result.stabilityShift >= 0 ? "text-load-low" : "text-load-moderate"}`}>
                {result.stabilityShift > 0 ? "+" : ""}{result.stabilityShift}
              </span>
            </div>
            <div className="glass-panel rounded-xl px-3 py-2.5 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Inflection</span>
              <span className="text-lg font-serif font-semibold text-foreground">{result.peakDay > 1 ? dayLabels[result.peakDay - 2] : "—"}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{result.summary}</p>
        </>
      )}
    </div>
  );
}

function SliderField({ label, value, min = 0, max, step = 1, display, onChange }: {
  label: string; value: number; min?: number; max: number; step?: number; display: string; onChange: (v: number) => void;
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