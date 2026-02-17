import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckInData, computeMicroStreaks } from "@/lib/cognitive-engine";
import { Flame } from "lucide-react";

interface MicroStreaksBarProps {
  checkIns: CheckInData[];
}

export default function MicroStreaksBar({ checkIns }: MicroStreaksBarProps) {
  const streaks = useMemo(() => computeMicroStreaks(checkIns), [checkIns]);
  const hasAny = streaks.some(s => s.active);

  if (!hasAny) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 px-1"
    >
      {streaks.filter(s => s.active).map((s, i) => (
        <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Flame className="h-3 w-3 text-amber" />
          <span className="font-medium text-foreground">{s.days}d</span>
          <span>{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
