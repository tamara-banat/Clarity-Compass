import { CheckInData, CognitiveResult, StabilityResult, generateCoachAdvice, CoachAdvice } from "./cognitive-engine";

export interface CoachIntelligence {
  insight: string;
  protectionStrategy: string;
  optimization: string;
  riskWarning: string | null;
  source: "algorithmic" | "llm";
}

// Settings stored in localStorage
const LLM_ENABLED_KEY = "cogload_llm_enabled";
const OLLAMA_URL = "http://localhost:11434";

export function isLLMEnabled(): boolean {
  return localStorage.getItem(LLM_ENABLED_KEY) === "true";
}

export function setLLMEnabled(enabled: boolean): void {
  localStorage.setItem(LLM_ENABLED_KEY, enabled ? "true" : "false");
}

function buildCognitiveContext(checkIns: CheckInData[], result: CognitiveResult, stability: StabilityResult): string {
  const recent = checkIns.slice(-7);
  const avgSleep = recent.length > 0 ? (recent.reduce((a, c) => a + c.sleepHours, 0) / recent.length).toFixed(1) : "N/A";
  const avgSwitch = recent.length > 0 ? Math.round(recent.reduce((a, c) => a + c.taskSwitching, 0) / recent.length) : 0;
  const avgDeadline = recent.length > 0 ? Math.round(recent.reduce((a, c) => a + c.deadlinePressure, 0) / recent.length) : 0;

  return `Cognitive System State:
- Load Index: ${result.loadIndex}/100 (${result.tier} tier)
- Stability Score: ${stability.score}/100 (${stability.label})
- Pattern: ${stability.patternRegularity}
- Avg Sleep (7d): ${avgSleep}h
- Avg Task Switching (7d): ${avgSwitch}/100
- Avg Deadline Pressure (7d): ${avgDeadline}/100
- Check-ins: ${checkIns.length} total
- Top Factors: ${result.factors.map(f => `${f.name} (${f.impact})`).join(", ")}`;
}

async function queryOllama(context: string): Promise<CoachIntelligence | null> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: `You are a cognitive intelligence coach. You are systemic, calm, intelligent, and slightly mysterious. You provide grounded, analytical insights — never robotic. Respond with exactly 4 sections, each on a new line prefixed with the label:

INSIGHT: (2-3 sentences about the user's current cognitive state)
PROTECTION: (1 concrete strategy to protect cognitive capacity)
OPTIMIZATION: (1 performance optimization recommendation)
RISK: (1 risk warning if applicable, or "none" if no risk detected)

${context}`,
        stream: false,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.response || "";

    const extract = (label: string): string => {
      const regex = new RegExp(`${label}:\\s*(.+?)(?=\\n[A-Z]+:|$)`, "s");
      const match = text.match(regex);
      return match?.[1]?.trim() || "";
    };

    const insight = extract("INSIGHT");
    const protection = extract("PROTECTION");
    const optimization = extract("OPTIMIZATION");
    const risk = extract("RISK");

    if (!insight) return null;

    return {
      insight,
      protectionStrategy: protection || "Maintain current protective patterns.",
      optimization: optimization || "Continue current optimization approach.",
      riskWarning: risk && risk.toLowerCase() !== "none" ? risk : null,
      source: "llm",
    };
  } catch {
    return null;
  }
}

export async function getCoachIntelligence(
  checkIns: CheckInData[],
  result: CognitiveResult,
  stability: StabilityResult
): Promise<CoachIntelligence> {
  // Always compute algorithmic as fallback
  const algorithmic = generateCoachAdvice(checkIns, result, stability);
  const fallback: CoachIntelligence = { ...algorithmic, source: "algorithmic" };

  // Try LLM if enabled
  if (isLLMEnabled()) {
    const context = buildCognitiveContext(checkIns, result, stability);
    const llmResult = await queryOllama(context);
    if (llmResult) return llmResult;
  }

  return fallback;
}