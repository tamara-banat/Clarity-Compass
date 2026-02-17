import { motion } from "framer-motion";
import { CognitiveArchetype } from "@/lib/cognitive-engine";
import { Brain, Zap, Target, Battery, Sparkles } from "lucide-react";

interface ArchetypeCardProps {
  archetype: CognitiveArchetype;
}

const archetypeIcons: Record<string, typeof Brain> = {
  "Burst Performer": Zap,
  "Steady Builder": Target,
  "Deadline Reactor": Sparkles,
  "Recovery-Dependent Thinker": Battery,
  "Adaptive Thinker": Brain,
  "Emerging": Brain,
};

export default function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  const Icon = archetypeIcons[archetype.name] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cognitive Archetype</h3>
          <span className="text-xs font-medium text-primary">{archetype.name}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{archetype.description}</p>
      {archetype.pattern && (
        <p className="text-xs text-foreground/80 leading-relaxed rounded-xl bg-muted/50 p-3 italic">
          "{archetype.pattern}"
        </p>
      )}
      {!archetype.available && (
        <div className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          {archetype.description}
        </div>
      )}
    </motion.div>
  );
}
