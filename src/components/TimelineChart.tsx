import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckInData, computeCognitiveLoad } from "@/lib/cognitive-engine";

interface TimelineChartProps {
  checkIns: CheckInData[];
}

export default function TimelineChart({ checkIns }: TimelineChartProps) {
  const data = useMemo(() => {
    return checkIns.map((c, i) => {
      const subset = checkIns.slice(0, i + 1);
      const result = computeCognitiveLoad(subset);
      return {
        date: new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        load: result.loadIndex,
        sleep: c.sleepHours,
        focus: c.focusHours,
      };
    });
  }, [checkIns]);

  if (data.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
        Complete at least 2 check-ins to see your timeline.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Cognitive Load Over Time</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-line))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--chart-line))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="load"
            stroke="hsl(var(--chart-line))"
            fill="url(#loadGradient)"
            strokeWidth={2}
            dot={false}
            name="Cognitive Load"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}