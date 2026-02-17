import { CheckInData, Experiment } from "@/lib/cognitive-engine";

export function saveCheckIn(checkIn: CheckInData): void {
  const existing = getCheckIns();
  existing.push(checkIn);
  localStorage.setItem("cogload_checkins", JSON.stringify(existing));
}

export function getCheckIns(): CheckInData[] {
  try {
    const data = localStorage.getItem("cogload_checkins");
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function hasConsented(): boolean {
  return localStorage.getItem("cogload_consent") === "true";
}

export function setConsent(value: boolean): void {
  localStorage.setItem("cogload_consent", value ? "true" : "false");
}

export function clearAllData(): void {
  localStorage.removeItem("cogload_consent");
  localStorage.removeItem("cogload_checkins");
  localStorage.removeItem("cogload_experiments");
  localStorage.removeItem("cogload_calibration");
}

export function saveCalibration(data: any): void {
  localStorage.setItem("cogload_calibration", JSON.stringify(data));
}

export function getCalibration(): any | null {
  try {
    const d = localStorage.getItem("cogload_calibration");
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

export function saveExperiments(experiments: Experiment[]): void {
  localStorage.setItem("cogload_experiments", JSON.stringify(experiments));
}

export function getExperiments(): Experiment[] {
  try {
    const d = localStorage.getItem("cogload_experiments");
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

export type { CheckInData };