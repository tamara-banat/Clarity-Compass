import { useMemo } from "react";

interface SplineCoreProps {
  loadIndex: number;
  stability: number;
  tier: "low" | "moderate" | "high";
}

export default function SplineCognitiveCore({ loadIndex, stability, tier }: SplineCoreProps) {
  const overlayStyle = useMemo(() => {
    if (tier === "high") {
      return { background: "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(var(--load-high) / 0.08) 0%, transparent 70%)" };
    }
    if (tier === "moderate") {
      return { background: "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(var(--load-moderate) / 0.06) 0%, transparent 70%)" };
    }
    return { background: "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(var(--load-low) / 0.06) 0%, transparent 70%)" };
  }, [tier]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 animate-pulse-glow" style={overlayStyle} />

      {/* Spline embed — ambient, partially off-screen, overflow clips any branding */}
      <div className="absolute -top-[10%] -right-[15%] w-[80vw] h-[80vh] sm:w-[70vw] lg:w-[50vw] lg:h-[100vh] opacity-25 dark:opacity-15">
        <div className="w-[calc(100%+80px)] h-[calc(100%+80px)] -m-10 overflow-hidden">
          <iframe
            src="https://my.spline.design/interactiveaiassistant-rDWhzTN7PIAaju657SYacPmi/"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ border: "none", pointerEvents: "none" }}
            title="Cognitive Core Ambient"
            loading="lazy"
          />
        </div>
      </div>

      {/* Gradient overlays to blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
    </div>
  );
}
