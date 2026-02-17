import { motion } from "framer-motion";
import { Sun, Moon, Brain, ClipboardCheck, BookOpen, FlaskConical, Beaker, MessageCircle, Dna, TrendingUp, Settings, ChevronLeft, ChevronRight, Github } from "lucide-react";

export type Section = "dashboard" | "checkin" | "reflection" | "lab" | "simulation" | "coach" | "experiments" | "evolution" | "settings";

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
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

export default function AppSidebar({ active, onNavigate, isDark, onToggleTheme, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside className={`hidden lg:flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 ease-out ${collapsed ? "w-16" : "w-56"} border-r border-border/40 bg-card/50 backdrop-blur-xl`}>
      {/* Brand */}
      <div className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="h-2 w-2 rounded-full bg-primary animate-breathe shrink-0" />
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-serif font-medium text-foreground tracking-tight whitespace-nowrap">
            Cognitive AI
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-all ${
                isActive ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-2 py-3 space-y-1 border-t border-border/30 ${collapsed ? "flex flex-col items-center" : ""}`}>
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun className="h-3.5 w-3.5 shrink-0" /> : <Moon className="h-3.5 w-3.5 shrink-0" />}
          {!collapsed && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
        </button>
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5 shrink-0" /> : <ChevronLeft className="h-3.5 w-3.5 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <a
          href="https://github.com/tamara-banat/Clarity-Compass"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <Github className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>GitHub</span>}
        </a>
      </div>
    </aside>
  );
}
