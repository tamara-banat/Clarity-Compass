import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { setConsent } from "@/lib/storage";

interface CinematicLandingProps {
  onComplete: () => void;
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CinematicLanding({ onComplete }: CinematicLandingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const splineOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 0.15]);
  const splineScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  const handleEnter = () => {
    setConsent(true);
    onComplete();
  };

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Ambient Spline Background — fixed, behind everything, branding clipped */}
      <motion.div
        className="fixed inset-0 z-0 overflow-hidden"
        style={{ opacity: splineOpacity, scale: splineScale }}
      >
        <div className="absolute inset-0 w-[calc(100%+80px)] h-[calc(100%+80px)] -m-10 overflow-hidden">
          <iframe
            src="https://my.spline.design/interactiveaiassistant-rDWhzTN7PIAaju657SYacPmi/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="scale-125"
            style={{ border: "none", pointerEvents: "none", filter: "blur(1px)" }}
            title="Ambient Intelligence"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </motion.div>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-breathe" />
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Cognitive Intelligence System
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-foreground leading-[1.1] max-w-3xl">
            Your mind has patterns.
            <br />
            <span className="text-gradient">This system reads them.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Not a dashboard. Not a tracker. A living intelligence that observes, 
            predicts, and evolves with your cognitive rhythm.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to understand</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-[1px] bg-primary/40"
          />
        </motion.div>
      </motion.section>

      {/* Philosophy Sections */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-2xl mx-auto space-y-40">
          <RevealSection>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
              Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground leading-snug mb-4">
              Cognitive load isn't a number.
              <br />It's a trajectory.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Most tools give you a score and move on. This system tracks the arc
              of your cognitive patterns — how you react to pressure, when you
              recover, what fractures your stability, and what strengthens it.
            </p>
          </RevealSection>

          <RevealSection>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
              Identity
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground leading-snug mb-4">
              You have a cognitive archetype.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              After enough observations, the system identifies your behavioral
              signature — are you a Burst Performer who sprints and crashes? A
              Steady Builder who sustains? A Deadline Reactor who thrives under
              external pressure? Your archetype reveals your deepest patterns.
            </p>
          </RevealSection>

          <RevealSection>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
              Prediction
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground leading-snug mb-4">
              The system anticipates
              <br />before you feel it.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Risk forecasting, burnout probability, recovery deficits — not as
              alarms, but as quiet intelligence. The system shifts its tone, its
              suggestions, even its visual presence based on what it detects.
            </p>
          </RevealSection>

          <RevealSection>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
              Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground leading-snug mb-4">
              Every insight is explainable.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              No black boxes. Every prediction shows its contributing factors.
              Every recommendation cites the behavioral data that triggered it.
              You always know <em>why</em>.
            </p>
            <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <span className="glass-panel rounded-lg px-3 py-1.5">All data local</span>
              <span className="glass-panel rounded-lg px-3 py-1.5">No accounts</span>
              <span className="glass-panel rounded-lg px-3 py-1.5">No tracking</span>
              <span className="glass-panel rounded-lg px-3 py-1.5">Delete anytime</span>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center pb-20">
        <RevealSection className="flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
            Ready to see your patterns?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md">
            This is not a medical tool. It observes patterns and suggests adjustments.
            All data stays in your browser.
          </p>
          <button
            onClick={handleEnter}
            className="group relative rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            <span>Begin observation</span>
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ boxShadow: "0 0 30px -5px hsl(var(--primary) / 0.3)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </button>
        </RevealSection>
      </section>
    </div>
  );
}
