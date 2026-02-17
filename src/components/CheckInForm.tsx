import { useState } from "react";
import { motion } from "framer-motion";
import { saveCheckIn, CheckInData } from "@/lib/storage";
import { Slider } from "@/components/ui/slider";

interface CheckInFormProps {
  onComplete: () => void;
}

export default function CheckInForm({ onComplete }: CheckInFormProps) {
  const [focusHours, setFocusHours] = useState(4);
  const [sleepHours, setSleepHours] = useState(7);
  const [deadlinePressure, setDeadlinePressure] = useState(30);
  const [taskSwitching, setTaskSwitching] = useState(30);
  const [mentalClarity, setMentalClarity] = useState(3);
  const [moodWord, setMoodWord] = useState("");

  const handleSubmit = () => {
    const checkIn: CheckInData = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      focusHours,
      sleepHours,
      deadlinePressure,
      taskSwitching,
      mentalClarity,
      moodWord: moodWord.trim() || undefined,
    };
    saveCheckIn(checkIn);
    onComplete();
  };

  const clarityLabels = ["Very low", "Low", "Neutral", "Good", "Very clear"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-lg space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-serif font-medium text-foreground">
          Daily check-in
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Takes about 2 minutes. You can skip today if you'd like.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        {/* Focus hours */}
        <div>
          <label className="mb-3 flex items-center justify-between text-sm font-medium text-foreground">
            Hours of focused work
            <span className="text-muted-foreground">{focusHours}h</span>
          </label>
          <Slider
            value={[focusHours]}
            onValueChange={([v]) => setFocusHours(v)}
            max={16}
            min={0}
            step={0.5}
          />
        </div>

        {/* Sleep */}
        <div>
          <label className="mb-3 flex items-center justify-between text-sm font-medium text-foreground">
            Sleep duration
            <span className="text-muted-foreground">{sleepHours}h</span>
          </label>
          <Slider
            value={[sleepHours]}
            onValueChange={([v]) => setSleepHours(v)}
            max={12}
            min={0}
            step={0.5}
          />
        </div>

        {/* Deadline pressure */}
        <div>
          <label className="mb-3 flex items-center justify-between text-sm font-medium text-foreground">
            Deadline pressure
            <span className="text-muted-foreground">
              {deadlinePressure < 33 ? "Low" : deadlinePressure < 66 ? "Moderate" : "High"}
            </span>
          </label>
          <Slider
            value={[deadlinePressure]}
            onValueChange={([v]) => setDeadlinePressure(v)}
            max={100}
            min={0}
          />
        </div>

        {/* Task switching */}
        <div>
          <label className="mb-3 flex items-center justify-between text-sm font-medium text-foreground">
            Task switching frequency
            <span className="text-muted-foreground">
              {taskSwitching < 33 ? "Rare" : taskSwitching < 66 ? "Sometimes" : "Frequent"}
            </span>
          </label>
          <Slider
            value={[taskSwitching]}
            onValueChange={([v]) => setTaskSwitching(v)}
            max={100}
            min={0}
          />
        </div>

        {/* Mental clarity */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">
            Mental clarity
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setMentalClarity(val)}
                className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                  mentalClarity === val
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {clarityLabels[val - 1]}
              </button>
            ))}
          </div>
        </div>

        {/* Mood word */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            One word for how you feel{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            type="text"
            value={moodWord}
            onChange={(e) => setMoodWord(e.target.value.slice(0, 20))}
            placeholder="e.g. steady, foggy, energized"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onComplete}
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          Skip today
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Save check-in
        </button>
      </div>
    </motion.div>
  );
}
