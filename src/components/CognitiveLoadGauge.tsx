import { motion } from "framer-motion";

interface CognitiveLoadGaugeProps {
  value: number;
  tier: "low" | "moderate" | "high";
}

export default function CognitiveLoadGauge({ value, tier }: CognitiveLoadGaugeProps) {
  const tierColors = {
    low: "text-load-low",
    moderate: "text-load-moderate",
    high: "text-load-high",
  };

  const tierBg = {
    low: "bg-load-low/10",
    moderate: "bg-load-moderate/10",
    high: "bg-load-high/10",
  };

  const tierLabels = {
    low: "Manageable",
    moderate: "Elevated",
    high: "High",
  };

  // SVG arc for gauge
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={`hsl(var(--load-${tier}))`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-serif font-semibold ${tierColors[tier]}`}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <div className={`mt-2 rounded-full px-3 py-1 text-xs font-medium ${tierBg[tier]} ${tierColors[tier]}`}>
        {tierLabels[tier]}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Cognitive Load Index</p>
    </div>
  );
}
