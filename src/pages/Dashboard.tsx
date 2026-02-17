import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { getCheckIns, clearAllData } from "@/lib/storage";
import {
  computeCognitiveLoad, generateInsights, generateWeeklyReflection,
  computeStabilityIndex, determineCognitiveArchetype, detectRecoverySignals,
  computeSystemShift, computeCognitiveDNA,
} from "@/lib/cognitive-engine";
import { isLLMEnabled, setLLMEnabled } from "@/lib/coach-service";
import AppSidebar, { Section } from "@/components/AppSidebar";
import MobileDrawer from "@/components/MobileDrawer";
import SplineCognitiveCore from "@/components/SplineCognitiveCore";
import NeuralBackground from "@/components/NeuralBackground";
import CognitiveArc from "@/components/CognitiveArc";
import TrajectoryMap from "@/components/TrajectoryMap";
import SimulationLab from "@/components/SimulationLab";
import CheckInForm from "@/components/CheckInForm";
import CognitiveLab from "@/pages/CognitiveLab";
import BaselineCalibration from "@/components/BaselineCalibration";
import CoachPanel from "@/components/CoachPanel";
import ExperimentsPanel from "@/components/ExperimentsPanel";
import EvolutionPanel from "@/components/EvolutionPanel";
import CognitiveDNAProfile from "@/components/CognitiveDNAProfile";
import RiskForecastPanel from "@/components/RiskForecastPanel";
import MicroStreaksBar from "@/components/MicroStreaksBar";
import IntelligenceGrid from "@/components/IntelligenceGrid";
import SystemShiftOverlay from "@/components/SystemShiftOverlay";
import { AdaptiveUIProvider } from "@/components/AdaptiveUIProvider";
import { BookOpen, Trash2, Menu, ChevronDown, Cpu, Github } from "lucide-react";

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard() {
  const [section, setSection] = useState<Section>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [showCalibration, setShowCalibration] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showShiftOverlay, setShowShiftOverlay] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [llmEnabled, setLlm] = useState(isLLMEnabled());

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const checkIns = useMemo(() => getCheckIns(), [refreshKey]);
  const result = useMemo(() => computeCognitiveLoad(checkIns), [checkIns]);
  const insights = useMemo(() => generateInsights(checkIns), [checkIns]);
  const reflection = useMemo(() => generateWeeklyReflection(checkIns), [checkIns]);
  const stability = useMemo(() => computeStabilityIndex(checkIns), [checkIns]);
  const archetype = useMemo(() => determineCognitiveArchetype(checkIns), [checkIns]);
  const recoverySignals = useMemo(() => detectRecoverySignals(checkIns), [checkIns]);
  const systemShift = useMemo(() => computeSystemShift(checkIns), [checkIns]);
  const cognitiveDNA = useMemo(() => computeCognitiveDNA(checkIns), [checkIns]);

  const handleCheckInComplete = () => {
    setRefreshKey(k => k + 1);
    setShowShiftOverlay(true);
  };

  const handleClearData = () => {
    if (window.confirm("This will permanently delete all your data. Are you sure?")) {
      clearAllData();
      window.location.reload();
    }
  };

  const handleNav = (s: Section) => {
    setSection(s);
    setShowDeepDive(false);
  };

  const toggleLLM = () => {
    const next = !llmEnabled;
    setLlm(next);
    setLLMEnabled(next);
  };

  useEffect(() => {
    if (checkIns.length === 0) setShowCalibration(true);
  }, [checkIns.length]);

  const renderContent = () => {
    switch (section) {
      case "checkin":
        return (
          <div className="px-4 py-8 lg:py-12">
            <CheckInForm onComplete={handleCheckInComplete} />
          </div>
        );
      case "reflection":
        return (
          <div className="px-4 py-8 lg:py-12">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg">
              <div className="mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-serif font-medium text-foreground">Weekly Reflection</h2>
              </div>
              <div className="glass-panel rounded-2xl p-6">
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {reflection.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.includes(":**")) {
                      const [label, ...rest] = line.split(":**");
                      return <p key={i} className="mb-2"><span className="font-semibold">{label.replace(/\*\*/g, "")}:</span>{rest.join(":**").replace(/\*\*/g, "")}</p>;
                    }
                    return line ? <p key={i} className="mb-2">{line}</p> : null;
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        );
      case "simulation":
        return (
          <div className="px-4 py-8 lg:py-12">
            <SimulationLab checkIns={checkIns} />
          </div>
        );
      case "lab":
        return <div className="px-4 py-8 lg:py-12"><CognitiveLab /></div>;
      case "coach":
        return <div className="px-4 py-8 lg:py-12"><CoachPanel checkIns={checkIns} /></div>;
      case "experiments":
        return <div className="px-4 py-8 lg:py-12"><ExperimentsPanel checkIns={checkIns} /></div>;
      case "evolution":
        return <div className="px-4 py-8 lg:py-12"><EvolutionPanel checkIns={checkIns} /></div>;
      case "settings":
        return (
          <div className="px-4 py-8 lg:py-12">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg space-y-6">
              <h2 className="text-xl font-serif font-medium text-foreground">Settings</h2>
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <p className="text-sm text-muted-foreground">All data stored locally. Not a medical tool.</p>
                <p className="text-sm text-muted-foreground">{checkIns.length} check-in{checkIns.length !== 1 ? "s" : ""} recorded.</p>

                {/* LLM Toggle */}
                <div className="border-t border-border/30 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Cpu className="h-3.5 w-3.5 text-primary" />
                        Local LLM Coach (Advanced)
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Connect to a local Ollama server for enhanced insights.
                        Falls back to algorithmic coach if unavailable.
                      </p>
                    </div>
                    <button
                      onClick={toggleLLM}
                      className={`relative h-6 w-11 rounded-full transition-colors ${llmEnabled ? "bg-primary" : "bg-muted"}`}
                    >
                      <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-primary-foreground shadow transition-transform ${llmEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>

                <button onClick={handleClearData} className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete all data
                </button>
              </div>
            </motion.div>
          </div>
        );
      default: // dashboard — narrative canvas
        return (
          <div className="px-3 sm:px-4 py-6 lg:px-8 lg:py-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-3xl mx-auto">
              {showCalibration && checkIns.length === 0 ? (
                <BaselineCalibration onComplete={() => setShowCalibration(false)} onSkip={() => setShowCalibration(false)} />
              ) : (
                <>
                  {/* Cognitive Arc — the daily narrative */}
                  <ScrollReveal>
                    <CognitiveArc checkIns={checkIns} />
                  </ScrollReveal>

                  {/* Primary insight: Load + Stability */}
                  <ScrollReveal delay={0.1}>
                    <div className="glass-panel rounded-2xl p-6">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground block mb-1">System Load</span>
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              key={result.loadIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`text-4xl font-serif font-semibold ${result.tier === "high" ? "text-load-high" : result.tier === "moderate" ? "text-load-moderate" : "text-load-low"}`}
                            >
                              {result.loadIndex}
                            </motion.span>
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground block mb-1">Stability</span>
                          <span className={`text-2xl font-serif font-semibold ${stability.score >= 70 ? "text-load-low" : stability.score >= 40 ? "text-load-moderate" : "text-load-high"}`}>
                            {stability.score}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">{stability.label}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{result.explanation}</p>
                    </div>
                  </ScrollReveal>

                  {/* Micro Streaks (subtle) */}
                  <MicroStreaksBar checkIns={checkIns} />

                  {/* Risk Forecast — secondary */}
                  <ScrollReveal delay={0.15}>
                    <RiskForecastPanel checkIns={checkIns} />
                  </ScrollReveal>

                  {/* Trajectory Map */}
                  <ScrollReveal delay={0.2}>
                    <TrajectoryMap checkIns={checkIns} />
                  </ScrollReveal>

                  {/* Explore Deeper toggle */}
                  <ScrollReveal delay={0.25}>
                    <button
                      onClick={() => setShowDeepDive(d => !d)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <span className="font-medium">{showDeepDive ? "Collapse analytics" : "Explore deeper"}</span>
                      <motion.div animate={{ rotate: showDeepDive ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </motion.div>
                    </button>
                  </ScrollReveal>

                  {/* Deep dive section */}
                  <AnimatePresence>
                    {showDeepDive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <IntelligenceGrid factors={result.factors} stability={stability} archetype={archetype} signals={recoverySignals} checkIns={checkIns} />
                        <CognitiveDNAProfile dna={cognitiveDNA} checkInCount={checkIns.length} />

                        {insights.length > 0 && (
                          <div>
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Insights</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {insights.map((insight, i) => (
                                <div key={i} className="glass-panel rounded-xl p-4">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary block mb-1">{insight.type}</span>
                                  <span className="text-sm font-medium text-foreground block mb-1">{insight.title}</span>
                                  <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.body}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-5 text-[10px] text-muted-foreground">
                    <p>All data stored locally. Not a medical tool.</p>
                    <span>{checkIns.length} data point{checkIns.length !== 1 ? "s" : ""}</span>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        );
    }
  };

  return (
    <AdaptiveUIProvider loadIndex={result.loadIndex} tier={result.tier}>
      <div className="min-h-screen bg-background relative">
        {/* Ambient Spline background */}
        <SplineCognitiveCore loadIndex={result.loadIndex} stability={stability.score} tier={result.tier} />
        <NeuralBackground />

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 glass-panel backdrop-blur-xl">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3">
            <button onClick={() => setDrawerOpen(true)} className="text-muted-foreground hover:text-foreground p-1">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
              <span className="text-sm font-serif font-medium text-foreground">Cognitive AI</span>
            </div>
            <a
              href="https://github.com/tamara-banat/Clarity-Compass"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </header>

        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active={section}
          onNavigate={handleNav}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
        />

        <div className="flex w-full">
          {/* Sidebar (desktop) */}
          <AppSidebar
            active={section}
            onNavigate={handleNav}
            isDark={isDark}
            onToggleTheme={() => setIsDark(d => !d)}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(c => !c)}
          />

          {/* Main content */}
          <main className="flex-1 relative z-10 min-w-0">
            {renderContent()}
          </main>
        </div>

        {/* System Shift Overlay */}
        <AnimatePresence>
          {showShiftOverlay && checkIns.length >= 2 && (
            <SystemShiftOverlay shift={systemShift} onComplete={() => { setShowShiftOverlay(false); setSection("dashboard"); }} />
          )}
        </AnimatePresence>
      </div>
    </AdaptiveUIProvider>
  );
}
