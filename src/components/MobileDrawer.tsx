import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, ClipboardCheck, BookOpen, FlaskConical, Beaker, MessageCircle, Dna, TrendingUp, Settings, Sun, Moon } from "lucide-react";
import { Section } from "@/components/AppSidebar";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  active: Section;
  onNavigate: (section: Section) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const navItems: { id: Section; label: string; icon: typeof Brain }[] = [
  { id: "dashboard", label: "Dashboard", icon: Brain },
  { id: "checkin", label: "Check-In", icon: ClipboardCheck },
  { id: "reflection", label: "Reflection", icon: BookOpen },
  { id: "lab", label: "Cognitive Lab", icon: FlaskConical },
  { id: "simulation", label: "Simulation Lab", icon: Beaker },
  { id: "coach", label: "Coach", icon: MessageCircle },
  { id: "experiments", label: "Experiments", icon: Dna },
  { id: "evolution", label: "Evolution", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function MobileDrawer({ open, onClose, active, onNavigate, isDark, onToggleTheme }: MobileDrawerProps) {
  const handleNav = (s: Section) => {
    onNavigate(s);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[min(72vw,18rem)] bg-card border-r border-border/40 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-primary animate-breathe" />
                <span className="text-sm font-serif font-medium text-foreground">Cognitive AI</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm transition-all ${
                      isActive ? "text-foreground bg-muted/60" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="px-3 py-3 border-t border-border/30">
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? "Light mode" : "Dark mode"}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
