// Shared data layer backed by Lovable Cloud.
// Reads use the public anon client (RLS allows public read).
// Writes go through the `admin` edge function with the admin password header.
import { supabase } from "@/integrations/supabase/client";
import { callAdmin } from "./api";

type Item = Record<string, any>;

const emit = () => window.dispatchEvent(new Event("localdata-changed"));

/* ------- Field mappers (db <-> app camelCase) ------- */
const portfolioToApp = (r: any) => ({
  id: r.id, title: r.title, description: r.description, category: r.category,
  imageUrl: r.image_url, videoUrl: r.video_url, link: r.link,
  featured: r.featured, order: r.sort_order,
});
const portfolioToDb = (d: any) => ({
  title: d.title, description: d.description, category: d.category,
  image_url: d.imageUrl, video_url: d.videoUrl, link: d.link,
  featured: !!d.featured, sort_order: Number(d.order) || 0,
});

const productToApp = (r: any) => ({
  id: r.id, name: r.name, brand: r.brand, category: r.category, description: r.description,
  imageUrl: r.image_url, productUrl: r.product_url, specs: r.specs || {}, rating: r.rating, featured: r.featured,
});
const productToDb = (d: any) => ({
  name: d.name, brand: d.brand, category: d.category, description: d.description,
  image_url: d.imageUrl, product_url: d.productUrl, specs: d.specs || {}, rating: d.rating, featured: !!d.featured,
});

const specToApp = (r: any) => ({
  id: r.id, gameName: r.game_name, gameImage: r.game_image,
  ...(r.data || {}),
});
const specToDb = (d: any) => {
  const { gameName, gameImage, ...rest } = d;
  return { game_name: gameName, game_image: gameImage, data: rest };
};

const sponsorToApp = (r: any) => ({
  id: r.id, name: r.name, description: r.description,
  logoUrl: r.logo_url, websiteUrl: r.website_url,
  couponCode: r.coupon_code, discountText: r.discount_text,
  featured: r.featured, order: r.sort_order,
});
const sponsorToDb = (d: any) => ({
  name: d.name, description: d.description,
  logo_url: d.logoUrl, website_url: d.websiteUrl,
  coupon_code: d.couponCode, discount_text: d.discountText,
  featured: !!d.featured, sort_order: Number(d.order) || 0,
});

const steamToApp = (r: any) => ({
  id: r.id, appId: r.app_id, name: r.name, imageUrl: r.image_url,
  hoursPlayed: r.hours_played, achievementsEarned: r.achievements_earned,
  achievementsTotal: r.achievements_total, featured: r.featured,
});
const steamToDb = (d: any) => ({
  app_id: d.appId, name: d.name, image_url: d.imageUrl,
  hours_played: d.hoursPlayed,
  achievements_earned: d.achievementsEarned ? Number(d.achievementsEarned) : null,
  achievements_total: d.achievementsTotal ? Number(d.achievementsTotal) : null,
  featured: !!d.featured,
});

const galleryToApp = (r: any) => ({ id: r.id, url: r.url, name: r.name });

/* ------- In-memory cache + loaders ------- */
const cache: Record<string, Item[]> = {
  portfolio: [], products: [], specs: [], sponsors: [], steam: [], gallery: [],
};
const socialsCache: { data: Record<string, string> } = { data: {} };
const siteCache: { data: Record<string, any> } = { data: {} };

let loaded = false;
export async function loadAll() {
  const [p, pr, sp, so, st, ga, soc, sc] = await Promise.all([
    supabase.from("portfolio").select("*").order("sort_order"),
    supabase.from("products").select("*").order("created_at"),
    supabase.from("specs").select("*").order("created_at"),
    supabase.from("sponsors").select("*").order("sort_order"),
    supabase.from("steam_games").select("*").order("created_at"),
    supabase.from("gallery").select("*").order("created_at", { ascending: false }),
    supabase.from("socials").select("*").eq("id", 1).maybeSingle(),
    supabase.from("site_content").select("*"),
  ]);
  cache.portfolio = (p.data || []).map(portfolioToApp);
  cache.products = (pr.data || []).map(productToApp);
  cache.specs = (sp.data || []).map(specToApp);
  cache.sponsors = (so.data || []).map(sponsorToApp);
  cache.steam = (st.data || []).map(steamToApp);
  cache.gallery = (ga.data || []).map(galleryToApp);
  socialsCache.data = (soc.data?.data as Record<string, string>) || {};
  siteCache.data = {};
  for (const row of sc.data || []) siteCache.data[row.key] = row.value;
  loaded = true;
  emit();
}
export const isLoaded = () => loaded;

/* ------- Read API (sync) ------- */
export const getPortfolio = (cat?: string) =>
  cat ? cache.portfolio.filter((i) => i.category === cat) : cache.portfolio;
export const getProducts = (cat?: string) =>
  cat ? cache.products.filter((i) => i.category === cat) : cache.products;
export const getSpecs = () => cache.specs;
export const getSponsors = () => cache.sponsors;
export const getSteam = () => cache.steam;
export const getGallery = () => cache.gallery;
export const getSocials = () => socialsCache.data;
export const getSiteContent = (key: string, fallback: any = null) =>
  siteCache.data[key] ?? fallback;

/* ------- Write API (admin only) ------- */
function makeCrud(table: string, toDb: (d: any) => any) {
  return {
    list: getPortfolio, // not used; pages call get* directly
    add: async (data: Item) => {
      await callAdmin({ action: "insert", table, payload: toDb(data) });
      await loadAll();
    },
    update: async (id: string | number, data: Item) => {
      await callAdmin({ action: "update", table, id, payload: toDb(data) });
      await loadAll();
    },
    remove: async (id: string | number) => {
      await callAdmin({ action: "delete", table, id });
      await loadAll();
    },
  };
}

export const portfolioApi = makeCrud("portfolio", portfolioToDb);
export const productsApi = makeCrud("products", productToDb);
export const specsApi = makeCrud("specs", specToDb);
export const sponsorsApi = makeCrud("sponsors", sponsorToDb);
export const steamApi = makeCrud("steam_games", steamToDb);

export const galleryApi = {
  add: async (_data: any) => {
    /* upload happens via uploadImage; this exists for back-compat */
  },
  remove: async (id: string | number) => {
    await callAdmin({ action: "delete", table: "gallery", id });
    await loadAll();
  },
};

export async function uploadImage(file: File): Promise<string> {
  if (file.size > 5_000_000) throw new Error("Max 5MB");
  const base64 = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const s = r.result as string;
      res(s.split(",")[1]);
    };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const result = await callAdmin({
    action: "upload",
    payload: { base64, filename: file.name, contentType: file.type },
  });
  await loadAll();
  return (result as { url: string }).url;
}

export async function setSocials(data: Record<string, string>) {
  await callAdmin({
    action: "upsert", table: "socials",
    payload: { id: 1, data, updated_at: new Date().toISOString() },
  });
  await loadAll();
}

export async function setSiteContent(key: string, value: any) {
  await callAdmin({
    action: "upsert", table: "site_content",
    payload: { key, value, updated_at: new Date().toISOString() },
  });
  await loadAll();
}

// No-op: kept so existing imports don't break
export function seedInitialData() {}
