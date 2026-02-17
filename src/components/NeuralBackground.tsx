import { useMemo } from "react";

export default function NeuralBackground() {
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 4,
    })), []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 dark:opacity-20">
      {/* Soft radial gradient */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 30%, hsl(var(--glow) / 0.06) 0%, transparent 70%)`,
      }} />
      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-drift"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: `hsl(var(--primary) / 0.25)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
