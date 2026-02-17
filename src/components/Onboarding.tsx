import { useState } from "react";
import { motion } from "framer-motion";
import { setConsent } from "@/lib/storage";
import { Brain, Shield, Eye, Trash2 } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Brain,
    title: "Understand your cognitive patterns",
    description:
      "Cognitive Load AI helps you notice trends in your mental workload — before they become burnout. It's a decision-support tool, not a diagnosis.",
  },
  {
    icon: Shield,
    title: "What this is not",
    description:
      "This is not a medical tool, therapy, or mental health service. It does not diagnose conditions or prescribe treatments. It observes patterns and suggests gentle adjustments.",
  },
  {
    icon: Eye,
    title: "Transparent by design",
    description:
      "Every prediction comes with an explanation. You'll always see why the system made a recommendation and which factors contributed most.",
  },
  {
    icon: Trash2,
    title: "Your data, your control",
    description:
      "All data stays in your browser. You can delete everything at any time. No accounts, no servers, no tracking.",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const handleConsent = () => {
    setConsent(true);
    onComplete();
  };

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg text-center"
      >
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Icon className="h-7 w-7 text-primary" />
        </div>

        <h1 className="mb-3 text-2xl font-medium font-serif text-foreground">
          {current.title}
        </h1>
        <p className="mb-10 text-muted-foreground leading-relaxed">
          {current.description}
        </p>

        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={handleConsent}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              I understand — let's begin
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Continue
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
