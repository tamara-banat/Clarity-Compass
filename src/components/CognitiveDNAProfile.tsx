import { motion } from "framer-motion";
import { CognitiveDNA } from "@/lib/cognitive-engine";
import { Dna } from "lucide-react";

interface DNAProfileProps {
  dna: CognitiveDNA;
  checkInCount: number;
}

export default function CognitiveDNAProfile({ dna, checkInCount }: DNAProfileProps) {
  if (checkInCount < 7) {
    return (
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Dna className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Cognitive DNA</h3>
        </div>
        <p className="text-xs text-muted-foreground italic">
          Cognitive DNA Profile activates after 7 check-ins. {7 - checkInCount} remaining.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dna className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Cognitive DNA Profile</h3>
        </div>
        <div className="glass-panel rounded-lg px-3 py-1">
          <span className="text-[10px] text-muted-foreground">Cognitive Age: </span>
          <span className="text-xs font-serif font-semibold text-foreground">{dna.cognitiveAge}</span>
        </div>
      </div>

      {/* Core metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <DNAMetric label="Baseline" value={`${dna.baselineRange[0]}–${dna.baselineRange[1]}`} />
        <DNAMetric label="Reactivity" value={dna.reactivityIndex} />
        <DNAMetric label="Recovery" value={dna.recoveryVelocity} />
        <DNAMetric label="Sleep Sens." value={dna.sleepSensitivity} />
        <DNAMetric label="Deadline Amp." value={dna.deadlineAmplification} />
        <DNAMetric label="Switch Fric." value={dna.taskSwitchingFriction} />
      </div>

      {/* Spectrums */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Personality Spectrums</h4>
        {dna.spectrums.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{s.left}</span>
              <span className="text-[9px] uppercase tracking-wider font-medium text-foreground">{s.label}</span>
              <span>{s.right}</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="absolute top-0 h-full rounded-full bg-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary border-2 border-card"
                style={{ left: `calc(${s.value}% - 6px)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DNAMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted/30 px-2.5 py-2 text-center">
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">{label}</span>
      <span className="text-sm font-serif font-semibold text-foreground">{value}</span>
    </div>
  );
}
