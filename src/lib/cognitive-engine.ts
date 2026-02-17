export interface CheckInData {
  id: string;
  date: string;
  focusHours: number;
  sleepHours: number;
  deadlinePressure: number;
  taskSwitching: number;
  mentalClarity: number;
  moodWord?: string;
}

export interface CognitiveResult {
  loadIndex: number;
  tier: "low" | "moderate" | "high";
  factors: Factor[];
  explanation: string;
}

export interface Factor {
  name: string;
  impact: "increasing" | "decreasing" | "stable";
  weight: number;
  description: string;
}

export interface InsightCard {
  type: "pattern" | "suggestion" | "recovery";
  title: string;
  body: string;
}

export interface StabilityResult {
  score: number;
  label: string;
  description: string;
  volatilityIndex: number;
  stdDev: number;
  patternRegularity: string;
  projection: string;
}

export interface CognitiveArchetype {
  name: string;
  description: string;
  pattern: string;
  available: boolean;
  confidence: number;
  stressResponse: string;
  behaviorSignature: string;
}

export interface ElasticityResult {
  score: number;
  label: string;
  interpretation: string;
  buffering: string;
  recoveryVelocity: number;
}

export interface ModelConfidence {
  data: number;
  pattern: number;
  projection: number;
}

export interface RecoverySignal {
  description: string;
  impact: string;
  percentage: number;
}

export interface PatternComparison {
  available: boolean;
  currentPeriod: { avgLoad: number; volatility: number; avgSleep: number };
  previousPeriod: { avgLoad: number; volatility: number; avgSleep: number };
  loadChange: number;
  volatilityChange: number;
  sleepCorrelation: string;
  summary: string;
}

export interface SimulationInput {
  expectedWorkload: number;
  majorDeadlines: number;
  plannedSleep: number;
  recoveryIntention: number;
}

export interface SimulationResult {
  projectedLoads: number[];
  riskZones: { day: number; risk: "low" | "moderate" | "high" }[];
  summary: string;
  stabilityShift: number;
  peakDay: number;
  riskProbability: number;
}

export interface CognitiveDNA {
  baselineRange: [number, number];
  reactivityIndex: number;
  recoveryVelocity: number;
  sleepSensitivity: number;
  deadlineAmplification: number;
  taskSwitchingFriction: number;
  cognitiveAge: number;
  spectrums: { label: string; left: string; right: string; value: number }[];
}

export interface CoachAdvice {
  insight: string;
  protectionStrategy: string;
  optimization: string;
  riskWarning: string | null;
}

export interface SystemShift {
  loadDelta: number;
  volatilityDelta: number;
  sleepDelta: number;
  riskForecast: number;
  divergenceDetected: boolean;
  increases: string[];
  decreases: string[];
}

export interface RiskForecast {
  burnoutProbability: number;
  instabilityRisk: number;
  recoveryDeficit: number;
}

export interface EvolutionLevel {
  level: number;
  name: string;
  progress: number;
  stabilityImprovement: number;
  volatilityReduction: number;
  recoveryStrengthening: number;
  milestones: string[];
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  duration: number;
  metric: string;
  startDate?: string;
  endDate?: string;
  baselineValue?: number;
  currentValue?: number;
  status: "available" | "active" | "completed";
}

export interface CorrelationEntry {
  xLabel: string;
  yLabel: string;
  correlation: number;
  explanation: string;
}

export interface MicroStreak {
  label: string;
  days: number;
  active: boolean;
}

// ===================== CORE COMPUTATIONS =====================

const WEIGHTS = { focus: 0.2, sleep: 0.25, deadline: 0.2, switching: 0.2, clarity: 0.15 };

export function computeRawLoad(c: CheckInData): number {
  return Math.min(c.focusHours / 12, 1) * 100 * WEIGHTS.focus +
    Math.max(0, (8 - c.sleepHours) / 8) * 100 * WEIGHTS.sleep +
    c.deadlinePressure * WEIGHTS.deadline +
    c.taskSwitching * WEIGHTS.switching +
    ((5 - c.mentalClarity) / 4) * 100 * WEIGHTS.clarity;
}

export function computeCognitiveLoad(checkIns: CheckInData[]): CognitiveResult {
  if (checkIns.length === 0) {
    return {
      loadIndex: 0, tier: "low", factors: [],
      explanation: "Awaiting initial data. Submit your first check-in to activate the cognitive modeling engine.",
    };
  }
  const recent = checkIns.slice(-14);
  const latest = recent[recent.length - 1];
  const focusLoad = Math.min(latest.focusHours / 12, 1) * 100;
  const sleepDeficit = Math.max(0, (8 - latest.sleepHours) / 8) * 100;
  const deadlineLoad = latest.deadlinePressure;
  const switchingLoad = latest.taskSwitching;
  const clarityInverse = ((5 - latest.mentalClarity) / 4) * 100;

  let rawLoad = focusLoad * WEIGHTS.focus + sleepDeficit * WEIGHTS.sleep + deadlineLoad * WEIGHTS.deadline + switchingLoad * WEIGHTS.switching + clarityInverse * WEIGHTS.clarity;

  if (recent.length > 1) {
    const prevLoads = recent.slice(0, -1).map(computeRawLoad);
    const avgPrev = prevLoads.reduce((a, b) => a + b, 0) / prevLoads.length;
    rawLoad = rawLoad * 0.6 + avgPrev * 0.4;
  }

  const loadIndex = Math.round(Math.max(0, Math.min(100, rawLoad)));
  const tier = loadIndex < 40 ? "low" : loadIndex < 70 ? "moderate" : "high";

  const factorData = [
    { name: "Focus hours", value: focusLoad, weight: WEIGHTS.focus },
    { name: "Sleep deficit", value: sleepDeficit, weight: WEIGHTS.sleep },
    { name: "Deadline pressure", value: deadlineLoad, weight: WEIGHTS.deadline },
    { name: "Task switching", value: switchingLoad, weight: WEIGHTS.switching },
    { name: "Mental clarity", value: clarityInverse, weight: WEIGHTS.clarity },
  ].sort((a, b) => b.value * b.weight - a.value * a.weight);

  const factors: Factor[] = factorData.slice(0, 3).map((f) => {
    let impact: Factor["impact"] = "stable";
    if (recent.length >= 3) {
      const recentVals = recent.slice(-3);
      if (f.name === "Sleep deficit") {
        const sleeps = recentVals.map((c) => c.sleepHours);
        impact = sleeps[2] < sleeps[0] ? "increasing" : sleeps[2] > sleeps[0] ? "decreasing" : "stable";
      } else if (f.name === "Task switching") {
        const switches = recentVals.map((c) => c.taskSwitching);
        impact = switches[2] > switches[0] ? "increasing" : switches[2] < switches[0] ? "decreasing" : "stable";
      }
    }
    return { name: f.name, impact, weight: Math.round((f.value * f.weight) / 100 * 100) / 100, description: getFactorDescription(f.name, f.value) };
  });

  const explanation = generateExplanation(factors, loadIndex, tier);
  return { loadIndex, tier, factors, explanation };
}

function getFactorDescription(name: string, value: number): string {
  const level = value > 66 ? "high" : value > 33 ? "moderate" : "low";
  const descriptions: Record<string, Record<string, string>> = {
    "Focus hours": { high: "Extended focus periods may be depleting cognitive reserves.", moderate: "Focus duration within manageable range.", low: "Focus periods are well-balanced." },
    "Sleep deficit": { high: "Significant sleep deficit affecting cognitive capacity.", moderate: "Slight sleep inconsistency contributing to load.", low: "Sleep pattern supportive of recovery." },
    "Deadline pressure": { high: "High deadline pressure is a major contributor.", moderate: "Some deadline pressure present but manageable.", low: "Deadline pressure minimal." },
    "Task switching": { high: "Frequent switching fragmenting attention.", moderate: "Some switching — consider batching.", low: "Task flow relatively uninterrupted." },
    "Mental clarity": { high: "Reduced clarity compounding other factors.", moderate: "Clarity moderate — small adjustments may help.", low: "Self-reported clarity is strong." },
  };
  return descriptions[name]?.[level] || "";
}

function generateExplanation(factors: Factor[], load: number, tier: string): string {
  const topFactors = factors.slice(0, 2).map((f) => f.name.toLowerCase());
  if (tier === "low") return `Cognitive load well-managed. ${topFactors[0] ? `Monitor ${topFactors[0]} as highest contributor.` : ""}`;
  if (tier === "moderate") return `Load elevated, mainly due to ${topFactors.join(" and ")}. Small adjustments could help.`;
  return `Load high. Main contributors: ${topFactors.join(" and ")}. Prioritize recovery.`;
}

// ===================== STABILITY =====================

export function computeStabilityIndex(checkIns: CheckInData[]): StabilityResult {
  if (checkIns.length < 3) {
    return { score: 50, label: "Calibrating", description: "Need at least 3 check-ins.", volatilityIndex: 0, stdDev: 0, patternRegularity: "Unknown", projection: "Gathering data" };
  }
  const recent = checkIns.slice(-14);
  const loads = recent.map(computeRawLoad);
  const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
  const variance = loads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / loads.length;
  const stdDev = Math.sqrt(variance);
  const rawStability = Math.max(0, 100 - stdDev * 3);
  const score = Math.round(rawStability);
  const label = score >= 70 ? "Stable" : score >= 40 ? "Variable" : "Volatile";
  const patternRegularity = stdDev < 8 ? "Regular" : stdDev < 15 ? "Variable" : "Irregular";
  const volatilityIndex = Math.round(stdDev * 10) / 10;

  let projection = "Maintaining current trajectory";
  if (loads.length >= 5) {
    const recentTrend = loads.slice(-3).reduce((a, b) => a + b, 0) / 3 - loads.slice(-6, -3).reduce((a, b) => a + b, 0) / Math.min(3, loads.slice(-6, -3).length || 1);
    projection = recentTrend > 5 ? "Load trending upward — monitor closely" : recentTrend < -5 ? "Load trending downward — positive trajectory" : "Stable trajectory maintained";
  }

  const descriptions: Record<string, string> = {
    Stable: "Consistent cognitive load. Stability predicts sustained performance.",
    Variable: "Some fluctuation. Moderate variability worth monitoring.",
    Volatile: "Significant fluctuation. Instability predicts burnout more than raw intensity.",
  };
  return { score, label, description: descriptions[label], volatilityIndex, stdDev, patternRegularity, projection };
}

// ===================== ARCHETYPE =====================

export function determineCognitiveArchetype(checkIns: CheckInData[]): CognitiveArchetype {
  const base = { confidence: 0, stressResponse: "", behaviorSignature: "" };
  if (checkIns.length < 7) {
    return { ...base, name: "Emerging", description: `${7 - checkIns.length} more check-ins needed.`, pattern: "", available: false, confidence: Math.round((checkIns.length / 7) * 40) };
  }
  const recent = checkIns.slice(-21);
  const loads = recent.map(computeRawLoad);
  const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
  const stdDev = Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / loads.length);
  const highDays = loads.filter((l) => l > 65).length;
  const deadlineSpikes = recent.filter((c) => c.deadlinePressure > 70).length;
  const avgSleep = recent.reduce((s, c) => s + c.sleepHours, 0) / recent.length;
  let recoveryPatterns = 0;
  for (let i = 1; i < loads.length - 1; i++) {
    if (loads[i - 1] > 60 && loads[i] < 45 && (i + 1 < loads.length ? loads[i + 1] < 45 : true)) recoveryPatterns++;
  }

  const conf = checkIns.length >= 21 ? 95 : checkIns.length >= 14 ? 78 : 55;

  if (stdDev > 18 && highDays > recent.length * 0.3 && recoveryPatterns >= 2)
    return { name: "Burst Performer", description: "High-intensity bursts followed by recovery. Effective but carries crash risk.", pattern: `Intensity spikes followed by ${recoveryPatterns}-day recovery periods.`, available: true, confidence: conf, stressResponse: "Absorbs pressure then crashes — needs deliberate decompression", behaviorSignature: "High amplitude oscillation with recovery dependency" };
  if (deadlineSpikes > recent.length * 0.35)
    return { name: "Deadline Reactor", description: "Load spikes notably under deadline pressure. Thrives with external structure.", pattern: `${deadlineSpikes} of ${recent.length} days showed high deadline pressure.`, available: true, confidence: conf, stressResponse: "Performance amplifies under deadline proximity", behaviorSignature: "Pressure-driven activation with anticipatory load building" };
  if (stdDev > 14 && mean > 45)
    return { name: "Elastic Thinker", description: "Highly adaptive cognitive patterns. Flexes between modes rapidly.", pattern: "Wide load range with quick transitions between states.", available: true, confidence: conf, stressResponse: "Absorbs varied demands but risks over-extension", behaviorSignature: "High-bandwidth cognitive switching with moderate recovery needs" };
  if (recoveryPatterns >= 2 && avgSleep >= 6.5)
    return { name: "Recovery Dependent", description: "Relies on deliberate recovery windows. Works well when rest is protected.", pattern: `${recoveryPatterns} clear recovery cycles detected.`, available: true, confidence: conf, stressResponse: "Degrades without recovery windows — needs protected downtime", behaviorSignature: "Performance sustained through intentional recovery cycling" };
  if (stdDev < 12 && mean < 55)
    return { name: "Steady Builder", description: "Consistent output with low volatility. Most sustainable long-term pattern.", pattern: "Low variance, moderate intensity. Supports sustained performance.", available: true, confidence: conf, stressResponse: "Resilient under consistent load, may struggle with sudden spikes", behaviorSignature: "Low-amplitude consistent output with strong baseline maintenance" };
  return { name: "Adaptive Thinker", description: "Flexible cognitive strategies adapting across contexts.", pattern: `Average load ${Math.round(mean)} with moderate variability.`, available: true, confidence: conf, stressResponse: "Context-dependent — adapts strategy to demand type", behaviorSignature: "Multi-modal cognitive approach without dominant pattern" };
}

// ===================== ELASTICITY =====================

export function computeElasticity(checkIns: CheckInData[]): ElasticityResult {
  if (checkIns.length < 5) {
    return { score: 50, label: "Calibrating", interpretation: "Gathering data to measure cognitive elasticity.", buffering: "Unknown", recoveryVelocity: 0 };
  }
  const recent = checkIns.slice(-14);
  const loads = recent.map(computeRawLoad);
  let totalRecovery = 0, spikeCount = 0;
  for (let i = 1; i < loads.length; i++) {
    if (loads[i] > loads[i - 1] + 15) {
      let recovery = 0;
      for (let j = i + 1; j < loads.length; j++) {
        recovery++;
        if (loads[j] < loads[i] - 10) break;
      }
      totalRecovery += recovery;
      spikeCount++;
    }
  }
  const avgRecovery = spikeCount > 0 ? totalRecovery / spikeCount : 2;
  const score = Math.round(Math.max(0, Math.min(100, 100 - avgRecovery * 20)));
  const label = score >= 70 ? "High" : score >= 40 ? "Moderate" : "Low";
  const interpretation = score >= 70 ? "Quick recovery from spikes — high adaptive capacity." : score >= 40 ? "Moderate recovery rate — rebounds within expected parameters." : "Slower recovery from spikes — consider protective strategies.";
  const recoveryDays = recent.filter(c => c.focusHours < 5 && c.deadlinePressure < 30).length;
  const buffering = recoveryDays >= 3 ? "Strong" : recoveryDays >= 1 ? "Moderate" : "Weak";
  return { score, label, interpretation, buffering, recoveryVelocity: spikeCount > 0 ? Math.round((1 / avgRecovery) * 100) : 50 };
}

// ===================== MODEL CONFIDENCE =====================

export function computeModelConfidence(checkIns: CheckInData[]): ModelConfidence {
  const n = checkIns.length;
  return {
    data: Math.min(100, Math.round((n / 21) * 100)),
    pattern: n < 3 ? 10 : n < 7 ? 35 : n < 14 ? 60 : n < 21 ? 80 : 95,
    projection: n < 5 ? 15 : n < 10 ? 40 : n < 21 ? 65 : 90,
  };
}

// ===================== HYPOTHESIS =====================

export function generateHypothesis(checkIns: CheckInData[], result: CognitiveResult, stability: StabilityResult): string {
  if (checkIns.length === 0) return "Awaiting initial cognitive data to begin pattern analysis. Submit your first check-in to activate the modeling engine.";
  if (checkIns.length < 3) return "Preliminary calibration in progress. Early signals suggest initial baseline formation — more data points will refine hypothesis generation.";
  const recent = checkIns.slice(-7);
  const avgDeadline = recent.reduce((s, c) => s + c.deadlinePressure, 0) / recent.length;
  const avgSleep = recent.reduce((s, c) => s + c.sleepHours, 0) / recent.length;
  let hyp = `Your cognitive system is operating at ${result.tier} load tolerance`;
  if (stability.score < 50) hyp += `, but volatility suggests ${avgDeadline > 50 ? "deadline reactivity" : "inconsistent recovery patterns"}`;
  else hyp += ` with ${stability.label.toLowerCase()} pattern regularity`;
  if (avgSleep < 6.5) hyp += `. Sleep deficit may be constraining recovery buffering capacity`;
  hyp += ".";
  return hyp;
}

// ===================== COGNITIVE DNA =====================

export function computeCognitiveDNA(checkIns: CheckInData[]): CognitiveDNA {
  const loads = checkIns.map(computeRawLoad);
  const min = loads.length > 0 ? Math.round(Math.min(...loads)) : 30;
  const max = loads.length > 0 ? Math.round(Math.max(...loads)) : 60;
  const mean = loads.length > 0 ? loads.reduce((a, b) => a + b, 0) / loads.length : 45;
  const stdDev = loads.length > 1 ? Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / loads.length) : 10;

  // Reactivity: how much load changes day-to-day
  let totalDelta = 0;
  for (let i = 1; i < loads.length; i++) totalDelta += Math.abs(loads[i] - loads[i - 1]);
  const reactivityIndex = loads.length > 1 ? Math.min(100, Math.round((totalDelta / (loads.length - 1)) * 3)) : 50;

  // Recovery velocity
  const elasticity = computeElasticity(checkIns);
  const recoveryVelocity = elasticity.recoveryVelocity;

  // Sleep sensitivity
  const sleepLoads = checkIns.slice(-14).map((c, i) => ({ sleep: c.sleepHours, load: computeRawLoad(c) }));
  let sleepCorr = 50;
  if (sleepLoads.length >= 5) {
    const lowSleep = sleepLoads.filter(s => s.sleep < 6.5);
    const highSleep = sleepLoads.filter(s => s.sleep >= 7);
    if (lowSleep.length > 0 && highSleep.length > 0) {
      const avgLowLoad = lowSleep.reduce((a, s) => a + s.load, 0) / lowSleep.length;
      const avgHighLoad = highSleep.reduce((a, s) => a + s.load, 0) / highSleep.length;
      sleepCorr = Math.min(100, Math.round(Math.abs(avgLowLoad - avgHighLoad) * 2));
    }
  }

  // Deadline amplification
  const deadlineAmplification = checkIns.length >= 5
    ? Math.min(100, Math.round(checkIns.slice(-14).filter(c => c.deadlinePressure > 60).length / Math.max(1, checkIns.slice(-14).length) * 150))
    : 50;

  // Task switching friction
  const avgSwitch = checkIns.length > 0 ? checkIns.slice(-14).reduce((a, c) => a + c.taskSwitching, 0) / Math.min(14, checkIns.length) : 40;
  const taskSwitchingFriction = Math.round(avgSwitch);

  // Cognitive age estimate (fun metric)
  const cognitiveAge = Math.round(25 + (mean / 100) * 15 + (stdDev / 30) * 10 - (elasticity.score / 100) * 8);

  const spectrums = [
    { label: "Processing", left: "Reactor", right: "Stabilizer", value: Math.round(100 - reactivityIndex) },
    { label: "Focus", left: "Deep Diver", right: "Switcher", value: Math.round(taskSwitchingFriction) },
    { label: "Resilience", left: "Elastic", right: "Brittle", value: Math.round(100 - elasticity.score) },
    { label: "Pressure", left: "Thrives", right: "Fractures", value: Math.round(100 - deadlineAmplification) },
  ];

  return { baselineRange: [min, max], reactivityIndex, recoveryVelocity, sleepSensitivity: sleepCorr, deadlineAmplification, taskSwitchingFriction, cognitiveAge, spectrums };
}

// ===================== COACH =====================

export function generateCoachAdvice(checkIns: CheckInData[], result: CognitiveResult, stability: StabilityResult): CoachAdvice {
  const recent = checkIns.slice(-7);
  const avgSleep = recent.length > 0 ? recent.reduce((a, c) => a + c.sleepHours, 0) / recent.length : 7;
  const avgSwitch = recent.length > 0 ? recent.reduce((a, c) => a + c.taskSwitching, 0) / recent.length : 30;

  let insight = "Your cognitive system is operating within normal parameters.";
  if (result.tier === "high") insight = "Your system is under sustained pressure. The data suggests you're approaching a load threshold where recovery becomes disproportionately harder.";
  else if (result.tier === "moderate") insight = "You're operating in a productive but watchful zone. Your patterns show capacity for current demands, though buffer margins are narrowing.";
  else insight = "Your cognitive load is well-managed. This is an optimal window for challenging work or skill acquisition.";

  let protectionStrategy = "Maintain current patterns — they're serving you well.";
  if (avgSleep < 6.5) protectionStrategy = "Prioritize sleep recovery tonight. Even 30 additional minutes could measurably improve tomorrow's cognitive capacity.";
  else if (avgSwitch > 60) protectionStrategy = "Batch similar tasks together today. Reducing context switches by even 2-3 instances can lower cognitive friction significantly.";
  else if (result.tier === "high") protectionStrategy = "Create a 2-hour protected focus block with no notifications. Your system needs uninterrupted processing time.";

  let optimization = "Use this low-load period for strategic planning or creative work.";
  if (result.tier === "moderate") optimization = "Front-load your most demanding task within the next 90 minutes while cognitive reserves are freshest.";
  else if (result.tier === "high") optimization = "Defer non-essential decisions to tomorrow. Your cognitive system processes better when load is reduced.";

  let riskWarning: string | null = null;
  if (result.loadIndex > 75 && stability.score < 40) riskWarning = "Pattern analysis indicates elevated burnout probability. Consider a deliberate recovery day within the next 48 hours.";
  else if (avgSleep < 5.5) riskWarning = "Sleep deficit has reached a level where cognitive impairment compounds. Prioritize recovery.";

  return { insight, protectionStrategy, optimization, riskWarning };
}

// ===================== SYSTEM SHIFT =====================

export function computeSystemShift(checkIns: CheckInData[]): SystemShift {
  if (checkIns.length < 2) return { loadDelta: 0, volatilityDelta: 0, sleepDelta: 0, riskForecast: 15, divergenceDetected: false, increases: [], decreases: [] };
  const latest = checkIns[checkIns.length - 1];
  const prev = checkIns[checkIns.length - 2];
  const latestLoad = computeRawLoad(latest);
  const prevLoad = computeRawLoad(prev);
  const loadDelta = Math.round(latestLoad - prevLoad);
  const sleepDelta = Math.round((latest.sleepHours - prev.sleepHours) * 10) / 10;

  const increases: string[] = [];
  const decreases: string[] = [];
  if (latest.deadlinePressure > prev.deadlinePressure + 10) increases.push("Deadline pressure");
  if (latest.deadlinePressure < prev.deadlinePressure - 10) decreases.push("Deadline pressure");
  if (latest.taskSwitching > prev.taskSwitching + 10) increases.push("Task switching");
  if (latest.taskSwitching < prev.taskSwitching - 10) decreases.push("Task switching");
  if (latest.sleepHours > prev.sleepHours + 0.5) increases.push("Sleep duration");
  if (latest.sleepHours < prev.sleepHours - 0.5) decreases.push("Sleep duration");
  if (latest.mentalClarity > prev.mentalClarity) increases.push("Mental clarity");
  if (latest.mentalClarity < prev.mentalClarity) decreases.push("Mental clarity");

  const volatilityDelta = checkIns.length >= 4 ? Math.round((Math.abs(loadDelta) - Math.abs(computeRawLoad(checkIns[checkIns.length - 3]) - computeRawLoad(checkIns[checkIns.length - 4]))) * 10) / 10 : 0;
  const divergenceDetected = Math.abs(loadDelta) > 20;
  const riskForecast = Math.min(100, Math.max(0, Math.round(latestLoad * 0.6 + (100 - latest.sleepHours * 12) * 0.2 + latest.deadlinePressure * 0.2)));

  return { loadDelta, volatilityDelta, sleepDelta, riskForecast, divergenceDetected, increases, decreases };
}

// ===================== RISK FORECAST =====================

export function computeRiskForecast(checkIns: CheckInData[]): RiskForecast {
  if (checkIns.length < 3) return { burnoutProbability: 10, instabilityRisk: 15, recoveryDeficit: 10 };
  const recent = checkIns.slice(-7);
  const loads = recent.map(computeRawLoad);
  const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
  const stdDev = Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / loads.length);
  const avgSleep = recent.reduce((a, c) => a + c.sleepHours, 0) / recent.length;
  const highDays = loads.filter(l => l > 65).length;

  const burnoutProbability = Math.min(95, Math.round(highDays / recent.length * 40 + Math.max(0, 7 - avgSleep) * 10 + stdDev * 0.8));
  const instabilityRisk = Math.min(95, Math.round(stdDev * 3.5));
  const recoveryDeficit = Math.min(95, Math.round(Math.max(0, 7 - avgSleep) * 15 + recent.filter(c => c.focusHours > 8).length * 8));

  return { burnoutProbability, instabilityRisk, recoveryDeficit };
}

// ===================== EVOLUTION =====================

export function computeEvolution(checkIns: CheckInData[]): EvolutionLevel {
  const n = checkIns.length;
  const milestones: string[] = [];
  if (n >= 1) milestones.push("First check-in completed");
  if (n >= 7) milestones.push("One week of data");
  if (n >= 14) milestones.push("Archetype identified");
  if (n >= 21) milestones.push("Full pattern confidence");
  if (n >= 30) milestones.push("Longitudinal analysis available");

  // Calculate improvement metrics
  let stabilityImprovement = 0, volatilityReduction = 0, recoveryStrengthening = 0;
  if (n >= 14) {
    const firstHalf = checkIns.slice(0, Math.floor(n / 2));
    const secondHalf = checkIns.slice(Math.floor(n / 2));
    const stab1 = computeStabilityIndex(firstHalf);
    const stab2 = computeStabilityIndex(secondHalf);
    stabilityImprovement = stab2.score - stab1.score;
    volatilityReduction = Math.round((stab1.stdDev - stab2.stdDev) / Math.max(1, stab1.stdDev) * 100);
    const elast1 = computeElasticity(firstHalf);
    const elast2 = computeElasticity(secondHalf);
    recoveryStrengthening = elast2.score - elast1.score;
  }

  let level = 1, name = "Reactive";
  const stability = computeStabilityIndex(checkIns);
  if (n >= 30 && stability.score >= 70) { level = 5; name = "Cognitive Strategist"; }
  else if (n >= 21 && stability.score >= 55) { level = 4; name = "Self-Regulating"; }
  else if (n >= 14 && stability.score >= 40) { level = 3; name = "Adaptive"; }
  else if (n >= 7) { level = 2; name = "Aware"; }

  const progress = Math.min(100, Math.round((n / 30) * 100));
  return { level, name, progress, stabilityImprovement, volatilityReduction, recoveryStrengthening, milestones };
}

// ===================== EXPERIMENTS =====================

export function getAvailableExperiments(): Experiment[] {
  return [
    { id: "reduce-switching", name: "Reduce Task Switching", description: "Minimize context switches for 7 days. Batch similar tasks together.", duration: 7, metric: "Volatility change", status: "available" },
    { id: "increase-sleep", name: "Sleep Optimization", description: "Target 7.5+ hours of sleep each night for 7 days.", duration: 7, metric: "Stability improvement", status: "available" },
    { id: "deadline-batching", name: "Deadline Batching", description: "Consolidate deadlines into 2 peak days, keeping other days lighter.", duration: 7, metric: "Recovery delta", status: "available" },
    { id: "deep-work", name: "Deep Work Blocks", description: "Implement 2-hour uninterrupted focus blocks each day.", duration: 7, metric: "Focus efficiency", status: "available" },
  ];
}

// ===================== CORRELATION =====================

export function computeCorrelations(checkIns: CheckInData[]): CorrelationEntry[] {
  if (checkIns.length < 5) return [];
  const recent = checkIns.slice(-21);
  const loads = recent.map(computeRawLoad);

  const correlate = (xs: number[], ys: number[]): number => {
    const n = xs.length;
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((a, x, i) => a + (x - meanX) * (ys[i] - meanY), 0);
    const denX = Math.sqrt(xs.reduce((a, x) => a + Math.pow(x - meanX, 2), 0));
    const denY = Math.sqrt(ys.reduce((a, y) => a + Math.pow(y - meanY, 2), 0));
    return denX * denY === 0 ? 0 : Math.round((num / (denX * denY)) * 100) / 100;
  };

  const sleeps = recent.map(c => c.sleepHours);
  const switches = recent.map(c => c.taskSwitching);
  const deadlines = recent.map(c => c.deadlinePressure);

  // Compute volatility windows
  const volatilities = loads.map((_, i) => {
    if (i < 2) return 0;
    const window = loads.slice(Math.max(0, i - 2), i + 1);
    const m = window.reduce((a, b) => a + b, 0) / window.length;
    return Math.sqrt(window.reduce((a, v) => a + Math.pow(v - m, 2), 0) / window.length);
  });

  return [
    { xLabel: "Sleep", yLabel: "Load", correlation: correlate(sleeps, loads), explanation: correlate(sleeps, loads) < -0.3 ? "More sleep correlates with lower load — sleep is protective." : correlate(sleeps, loads) > 0.3 ? "Unexpected positive correlation — investigate confounders." : "Weak relationship in current data window." },
    { xLabel: "Switching", yLabel: "Volatility", correlation: correlate(switches, volatilities), explanation: correlate(switches, volatilities) > 0.3 ? "Higher switching correlates with more volatility — batching may help." : "Task switching has limited impact on volatility currently." },
    { xLabel: "Deadlines", yLabel: "Recovery", correlation: correlate(deadlines, sleeps), explanation: correlate(deadlines, sleeps) < -0.3 ? "Deadline pressure reduces sleep — a recovery risk pattern." : "Deadlines aren't significantly impacting sleep patterns." },
  ];
}

// ===================== MICRO STREAKS =====================

export function computeMicroStreaks(checkIns: CheckInData[]): MicroStreak[] {
  if (checkIns.length < 2) return [
    { label: "Stability", days: 0, active: false },
    { label: "Sleep consistency", days: 0, active: false },
    { label: "Low volatility", days: 0, active: false },
  ];

  const loads = checkIns.map(computeRawLoad);
  // Stability streak: consecutive days with load < 60
  let stabilityStreak = 0;
  for (let i = loads.length - 1; i >= 0; i--) {
    if (loads[i] < 60) stabilityStreak++;
    else break;
  }

  // Sleep streak: consecutive days with sleep >= 7
  let sleepStreak = 0;
  for (let i = checkIns.length - 1; i >= 0; i--) {
    if (checkIns[i].sleepHours >= 7) sleepStreak++;
    else break;
  }

  // Low volatility: consecutive days with <10 delta
  let volStreak = 0;
  for (let i = loads.length - 1; i >= 1; i--) {
    if (Math.abs(loads[i] - loads[i - 1]) < 10) volStreak++;
    else break;
  }

  return [
    { label: "Stability", days: stabilityStreak, active: stabilityStreak >= 2 },
    { label: "Sleep consistency", days: sleepStreak, active: sleepStreak >= 2 },
    { label: "Low volatility", days: volStreak, active: volStreak >= 2 },
  ];
}

// ===================== SIMULATION (UPGRADED) =====================

export function simulateUpcomingWeek(checkIns: CheckInData[], input: SimulationInput): SimulationResult {
  const recent = checkIns.slice(-7);
  const baseLoad = recent.length > 0 ? recent.reduce((s, c) => s + computeRawLoad(c), 0) / recent.length : 40;
  const workloadFactor = input.expectedWorkload / 100;
  const sleepFactor = Math.max(0, (8 - input.plannedSleep) / 8);
  const deadlineSpread = input.majorDeadlines;
  const recoveryFactor = input.recoveryIntention / 100;

  const projectedLoads: number[] = [];
  const riskZones: SimulationResult["riskZones"] = [];

  for (let day = 0; day < 7; day++) {
    const deadlinePeak = deadlineSpread > 0 ? Math.sin((day / 6) * Math.PI) * deadlineSpread * 12 : 0;
    const recoveryBonus = recoveryFactor * 15;
    const dailyLoad = Math.round(Math.max(0, Math.min(100,
      baseLoad * 0.4 + workloadFactor * 35 + sleepFactor * 25 + deadlinePeak + (day * 1.5) - recoveryBonus
    )));
    projectedLoads.push(dailyLoad);
    riskZones.push({ day: day + 1, risk: dailyLoad < 40 ? "low" : dailyLoad < 70 ? "moderate" : "high" });
  }

  const highRiskDays = riskZones.filter(z => z.risk === "high").length;
  const peakDay = projectedLoads.indexOf(Math.max(...projectedLoads)) + 1;
  const riskProbability = Math.round((highRiskDays / 7) * 100);

  const stability = computeStabilityIndex(checkIns);
  const projectedStability = Math.round(stability.score + (recoveryFactor - 0.5) * 20 - workloadFactor * 10);
  const stabilityShift = projectedStability - stability.score;

  let summary = `Based on your patterns and planned inputs, `;
  if (highRiskDays === 0) summary += "your upcoming week looks manageable. Maintain planned sleep to sustain this.";
  else if (highRiskDays <= 2) summary += `day ${peakDay} may see elevated load. Consider lighter scheduling around that period.`;
  else summary += `${highRiskDays} days show high cognitive load risk. Consider reducing intensity or spacing deadlines.`;

  return { projectedLoads, riskZones, summary, stabilityShift, peakDay, riskProbability };
}

// Simulate 3 scenarios
export function simulateScenarios(checkIns: CheckInData[]): { name: string; loads: number[]; risk: number }[] {
  const highLoad: SimulationInput = { expectedWorkload: 80, majorDeadlines: 3, plannedSleep: 6, recoveryIntention: 20 };
  const highRecovery: SimulationInput = { expectedWorkload: 30, majorDeadlines: 1, plannedSleep: 8.5, recoveryIntention: 80 };
  const balanced: SimulationInput = { expectedWorkload: 50, majorDeadlines: 2, plannedSleep: 7.5, recoveryIntention: 50 };

  const simHigh = simulateUpcomingWeek(checkIns, highLoad);
  const simRecovery = simulateUpcomingWeek(checkIns, highRecovery);
  const simBalanced = simulateUpcomingWeek(checkIns, balanced);

  return [
    { name: "High Load", loads: simHigh.projectedLoads, risk: simHigh.riskProbability },
    { name: "High Recovery", loads: simRecovery.projectedLoads, risk: simRecovery.riskProbability },
    { name: "Balanced", loads: simBalanced.projectedLoads, risk: simBalanced.riskProbability },
  ];
}

// ===================== INSIGHTS =====================

export function generateInsights(checkIns: CheckInData[]): InsightCard[] {
  const insights: InsightCard[] = [];
  if (checkIns.length < 2) return insights;
  const recent = checkIns.slice(-7);
  const avgSleep = recent.reduce((s, c) => s + c.sleepHours, 0) / recent.length;
  const avgFocus = recent.reduce((s, c) => s + c.focusHours, 0) / recent.length;
  const avgSwitch = recent.reduce((s, c) => s + c.taskSwitching, 0) / recent.length;

  if (avgSleep < 6.5) insights.push({ type: "suggestion", title: "Sleep consistency", body: "Average sleep below 6.5 hours. Small improvements can meaningfully reduce cognitive load." });
  if (avgFocus > 8) insights.push({ type: "pattern", title: "Extended focus periods", body: "Averaging over 8 hours of focused work. Cognitive reserves may benefit from shorter blocks." });
  if (avgSwitch > 60) insights.push({ type: "suggestion", title: "Task batching opportunity", body: "High task switching detected. Grouping similar tasks could reduce cognitive friction." });
  if (recent.length >= 3) {
    const lastThree = recent.slice(-3);
    const loadTrend = lastThree.map((c) => c.deadlinePressure + c.taskSwitching);
    if (loadTrend[2] < loadTrend[0] && loadTrend[1] < loadTrend[0]) {
      insights.push({ type: "recovery", title: "Recovery signal detected", body: "Recent entries show decreasing pressure. Positive for cognitive restoration." });
    }
  }
  if (insights.length === 0) insights.push({ type: "pattern", title: "Steady patterns", body: "Consistent patterns detected. Stability is a strong foundation for sustained performance." });
  return insights;
}

// ===================== RECOVERY SIGNALS =====================

export function detectRecoverySignals(checkIns: CheckInData[]): RecoverySignal[] {
  const signals: RecoverySignal[] = [];
  if (checkIns.length < 5) return signals;
  const recent = checkIns.slice(-14);
  const loads = recent.map(computeRawLoad);

  for (let i = 2; i < recent.length; i++) {
    if (recent[i].focusHours < 6 && recent[i - 1].focusHours < 6 && loads[i - 2] > 55) {
      const volatilityBefore = Math.abs(loads[i - 2] - (i >= 3 ? loads[i - 3] : loads[i - 2]));
      const volatilityAfter = Math.abs(loads[i] - loads[i - 1]);
      const reduction = volatilityBefore > 0 ? Math.round(((volatilityBefore - volatilityAfter) / volatilityBefore) * 100) : 0;
      if (reduction > 0) { signals.push({ description: "Two moderate-focus days reduced volatility", impact: `Volatility decreased by ${reduction}%`, percentage: reduction }); break; }
    }
  }

  const recentSleep = recent.slice(-5);
  if (recentSleep.length >= 3) {
    const earlyAvg = recentSleep.slice(0, 2).reduce((s, c) => s + c.sleepHours, 0) / 2;
    const lateAvg = recentSleep.slice(-2).reduce((s, c) => s + c.sleepHours, 0) / 2;
    if (lateAvg > earlyAvg + 0.5) signals.push({ description: "Sleep improvement detected", impact: `Average sleep increased by ${(lateAvg - earlyAvg).toFixed(1)} hours`, percentage: Math.round(((lateAvg - earlyAvg) / earlyAvg) * 100) });
  }

  const recentSwitch = recent.slice(-6);
  if (recentSwitch.length >= 4) {
    const earlySwitch = recentSwitch.slice(0, 2).reduce((s, c) => s + c.taskSwitching, 0) / 2;
    const lateSwitch = recentSwitch.slice(-2).reduce((s, c) => s + c.taskSwitching, 0) / 2;
    if (earlySwitch > lateSwitch + 10) signals.push({ description: "Task switching frequency decreased", impact: `Switching reduced from ${Math.round(earlySwitch)} to ${Math.round(lateSwitch)}`, percentage: Math.round(((earlySwitch - lateSwitch) / earlySwitch) * 100) });
  }

  return signals;
}

// ===================== PATTERN COMPARISON =====================

export function comparePatterns(checkIns: CheckInData[]): PatternComparison {
  const empty = { avgLoad: 0, volatility: 0, avgSleep: 0 };
  if (checkIns.length < 14) return { available: false, currentPeriod: empty, previousPeriod: empty, loadChange: 0, volatilityChange: 0, sleepCorrelation: "", summary: `Need ${14 - checkIns.length} more check-ins for pattern comparison.` };
  const half = Math.floor(checkIns.length / 2);
  const calcPeriod = (data: CheckInData[]) => {
    const loads = data.map(computeRawLoad);
    const avg = loads.reduce((a, b) => a + b, 0) / loads.length;
    const vol = Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - avg, 2), 0) / loads.length);
    const avgSleep = data.reduce((s, c) => s + c.sleepHours, 0) / data.length;
    return { avgLoad: Math.round(avg), volatility: Math.round(vol * 10) / 10, avgSleep: Math.round(avgSleep * 10) / 10 };
  };
  const prev = calcPeriod(checkIns.slice(0, half));
  const curr = calcPeriod(checkIns.slice(half));
  const loadChange = Math.round(curr.avgLoad - prev.avgLoad);
  const volChange = Math.round((curr.volatility - prev.volatility) * 10) / 10;
  const sleepDiff = curr.avgSleep - prev.avgSleep;
  const sleepCorrelation = sleepDiff > 0.3 ? "Improved sleep correlates with cognitive load changes." : sleepDiff < -0.3 ? "Reduced sleep may contribute to load increases." : "Sleep patterns remained consistent.";
  let summary = loadChange > 5 ? `Average load increased by ${loadChange} points. ` : loadChange < -5 ? `Average load decreased by ${Math.abs(loadChange)} points — positive trend. ` : "Average load stable between periods. ";
  summary += sleepCorrelation;
  return { available: true, currentPeriod: curr, previousPeriod: prev, loadChange, volatilityChange: volChange, sleepCorrelation, summary };
}

// ===================== WEEKLY REFLECTION =====================

export function generateWeeklyReflection(checkIns: CheckInData[]): string {
  const week = checkIns.slice(-7);
  if (week.length === 0) return "Complete a few check-ins to receive your weekly reflection.";
  const loads = week.map(computeRawLoad);
  const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
  const avgSleep = week.reduce((s, c) => s + c.sleepHours, 0) / week.length;
  const highPressureDays = week.filter((c) => c.deadlinePressure > 60).length;
  const stdDev = Math.sqrt(loads.reduce((a, v) => a + Math.pow(v - avgLoad, 2), 0) / loads.length);
  const patternClass = stdDev < 8 ? "consistent" : stdDev < 15 ? "variable" : "volatile";

  let elasticity = "moderate";
  if (week.length >= 3) {
    const inputVariance = week.map((c) => c.focusHours + c.deadlinePressure / 10);
    const inputStd = Math.sqrt(inputVariance.reduce((a, v) => a + Math.pow(v - inputVariance.reduce((x, y) => x + y, 0) / inputVariance.length, 2), 0) / inputVariance.length);
    elasticity = stdDev / Math.max(inputStd, 1) > 3 ? "high" : stdDev / Math.max(inputStd, 1) > 1.5 ? "moderate" : "low";
  }

  const recoveryDays = week.filter((c) => c.focusHours < 5 && c.deadlinePressure < 30).length;
  const recoveryBuffering = recoveryDays >= 2 ? "adequate" : recoveryDays === 1 ? "limited" : "minimal";
  const clarityUnderPressure = week.filter((c) => c.deadlinePressure > 50 && c.mentalClarity >= 3).length;
  const resilienceNote = clarityUnderPressure >= 2 ? "You maintained mental clarity under pressure — a strong resilience marker." : highPressureDays >= 2 ? "Mental clarity decreased under pressure, suggesting limited resilience buffering." : "";

  let reflection = `**Pattern Classification:** ${patternClass.charAt(0).toUpperCase() + patternClass.slice(1)} load pattern across ${week.length} check-in${week.length > 1 ? "s" : ""}.\n\n`;
  reflection += `**Volatility Interpretation:** `;
  if (patternClass === "volatile") reflection += `High fluctuation (σ = ${stdDev.toFixed(1)}) suggests reactive load patterns.\n\n`;
  else if (patternClass === "variable") reflection += `Moderate variation (σ = ${stdDev.toFixed(1)}) within manageable range.\n\n`;
  else reflection += `Low variation (σ = ${stdDev.toFixed(1)}) indicates stable baseline.\n\n`;
  reflection += `**Load Elasticity:** ${elasticity} cognitive elasticity. Recovery buffering is ${recoveryBuffering}.\n\n`;
  if (resilienceNote) reflection += `**Resilience Markers:** ${resilienceNote}\n\n`;
  if (avgSleep < 7) reflection += `Sleep averaged ${avgSleep.toFixed(1)} hours — improvements could have outsized benefits. `;
  if (highPressureDays >= 3) reflection += `${highPressureDays} days showed high deadline pressure. Consider spacing intensive periods.`;
  return reflection;
}
