import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export type Section = "dashboard" | "checkin" | "reflection" | "lab" | "simulation" | "settings";

interface ControlBarProps {
  active: Section;
  onNavigate: (section: Section) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const sections: { id: Section; label: string }[] = [
  { id: "checkin", label: "Check-In" },
  { id: "reflection", label: "Reflection" },
  { id: "lab", label: "Cognitive Lab" },
  { id: "simulation", label: "Simulation" },
  { id: "settings", label: "Settings" },
];

export default function IntelligenceControlBar({ active, onNavigate, isDark, onToggleTheme }: ControlBarProps) {
  return (
    <header className="sticky top-0 z-50 glass-panel backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left — brand */}
        <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2.5 group">
          <div className="h-2 w-2 rounded-full bg-primary animate-breathe" />
          <h1 className="text-base font-serif font-medium text-foreground tracking-tight">
            Cognitive Load AI
          </h1>
        </button>

        {/* Right — nav */}
        <nav className="flex items-center gap-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="relative px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {s.label}
              {active === s.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="ml-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
