import { motion } from "framer-motion";
import { InsightCard as InsightCardType } from "@/lib/cognitive-engine";
import { Lightbulb, Eye, HeartPulse } from "lucide-react";

interface InsightCardProps {
  insight: InsightCardType;
  index: number;
}

export default function InsightCard({ insight, index }: InsightCardProps) {
  const icons = {
    pattern: Eye,
    suggestion: Lightbulb,
    recovery: HeartPulse,
  };

  const typeLabels = {
    pattern: "Pattern noticed",
    suggestion: "Small adjustment",
    recovery: "Recovery signal",
  };

  const typeBg = {
    pattern: "bg-secondary",
    suggestion: "bg-amber-light",
    recovery: "bg-load-low/10",
  };

  const typeIcon = {
    pattern: "text-secondary-foreground",
    suggestion: "text-amber",
    recovery: "text-load-low",
  };

  const Icon = icons[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="glass-panel rounded-xl p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${typeBg[insight.type]}`}>
          <Icon className={`h-3.5 w-3.5 ${typeIcon[insight.type]}`} />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {typeLabels[insight.type]}
        </span>
      </div>
      <h4 className="mb-1 text-sm font-medium text-foreground">{insight.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{insight.body}</p>
    </motion.div>
  );
}
