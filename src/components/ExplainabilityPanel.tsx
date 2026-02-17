import { motion } from "framer-motion";
import { Factor } from "@/lib/cognitive-engine";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ExplainabilityPanelProps {
  factors: Factor[];
  explanation: string;
}

export default function ExplainabilityPanel({ factors, explanation }: ExplainabilityPanelProps) {
  const impactIcons = {
    increasing: TrendingUp,
    decreasing: TrendingDown,
    stable: Minus,
  };

  const impactColors = {
    increasing: "text-load-moderate",
    decreasing: "text-load-low",
    stable: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <h3 className="mb-1 text-sm font-semibold text-foreground">Why this score?</h3>
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{explanation}</p>

      <div className="space-y-3">
        {factors.map((factor, i) => {
          const Icon = impactIcons[factor.impact];
          return (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-3 rounded-xl bg-muted/50 p-3"
            >
              <div className={`mt-0.5 ${impactColors[factor.impact]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{factor.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(factor.weight * 100)}% contribution
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{factor.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
