import { createContext, useContext, useMemo, ReactNode } from "react";

interface AdaptiveUIState {
  loadLevel: number;
  tier: "low" | "moderate" | "high";
  bgOpacity: number;
  animSpeed: number;
  contrast: string;
}

const AdaptiveUIContext = createContext<AdaptiveUIState>({
  loadLevel: 0, tier: "low", bgOpacity: 0.3, animSpeed: 1, contrast: "",
});

export function useAdaptiveUI() {
  return useContext(AdaptiveUIContext);
}

interface ProviderProps {
  loadIndex: number;
  tier: "low" | "moderate" | "high";
  children: ReactNode;
}

export function AdaptiveUIProvider({ loadIndex, tier, children }: ProviderProps) {
  const state = useMemo<AdaptiveUIState>(() => {
    if (tier === "high") {
      return { loadLevel: loadIndex, tier, bgOpacity: 0.15, animSpeed: 1.5, contrast: "contrast-[1.05]" };
    }
    if (tier === "low") {
      return { loadLevel: loadIndex, tier, bgOpacity: 0.4, animSpeed: 0.8, contrast: "" };
    }
    return { loadLevel: loadIndex, tier, bgOpacity: 0.3, animSpeed: 1, contrast: "" };
  }, [loadIndex, tier]);

  return (
    <AdaptiveUIContext.Provider value={state}>
      <div className={`transition-all duration-1000 ${state.contrast}`}>
        {children}
      </div>
    </AdaptiveUIContext.Provider>
  );
}
