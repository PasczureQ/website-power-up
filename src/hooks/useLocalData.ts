import { useState, useEffect } from "react";
import {
  getPortfolio, getProducts, getSpecs, getSponsors, getSteam,
  getGallery, getSocials, getSiteContent, loadAll, isLoaded,
} from "@/lib/localData";

let initStarted = false;
function ensureInit() {
  if (!initStarted) {
    initStarted = true;
    loadAll().catch(console.error);
  }
}

function useStore<T>(getter: () => T): T {
  ensureInit();
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
  useStore(() => getPortfolio(category)) as Record<string, any>[];
export const useProducts = (category?: string) =>
  useStore(() => getProducts(category)) as Record<string, any>[];
export const useSpecs = () => useStore(() => getSpecs()) as Record<string, any>[];
export const useSponsors = () => useStore(() => getSponsors()) as Record<string, any>[];
export const useSteam = () => useStore(() => getSteam()) as Record<string, any>[];
export const useGallery = () => useStore(() => getGallery()) as Record<string, any>[];
export const useSocials = () => useStore(() => getSocials()) as Record<string, string>;
export const useSiteContent = <T = any>(key: string, fallback: T): T =>
  useStore(() => getSiteContent(key, fallback)) as T;
export const useDataReady = () => useStore(() => isLoaded()) as boolean;
