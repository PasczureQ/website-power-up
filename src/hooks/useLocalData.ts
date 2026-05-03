import { useState, useEffect } from "react";
import {
  getPortfolio,
  getProducts,
  getSpecs,
  getSponsors,
  getSteam,
  getGallery,
  getSocials,
  seedInitialData,
} from "@/lib/localData";

let seeded = false;
function ensureSeed() {
  if (!seeded) {
    seedInitialData();
    seeded = true;
  }
}

function useStore<T>(getter: () => T): T {
  ensureSeed();
  const [val, setVal] = useState<T>(getter);
  useEffect(() => {
    const handler = () => setVal(getter());
    handler();
    window.addEventListener("localdata-changed", handler);
    return () => window.removeEventListener("localdata-changed", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return val;
}

export const usePortfolio = (category?: string) =>
  useStore(() => getPortfolio(category)) as Record<string, unknown>[];
export const useProducts = (category?: string) =>
  useStore(() => getProducts(category)) as Record<string, unknown>[];
export const useSpecs = () => useStore(() => getSpecs()) as Record<string, unknown>[];
export const useSponsors = () => useStore(() => getSponsors()) as Record<string, unknown>[];
export const useSteam = () => useStore(() => getSteam()) as Record<string, unknown>[];
export const useGallery = () => useStore(() => getGallery()) as Record<string, unknown>[];
export const useSocials = () => useStore(() => getSocials()) as Record<string, string>;
