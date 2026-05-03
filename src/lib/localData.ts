const STORAGE_KEYS = {
  portfolio: "pasz_portfolio",
  products: "pasz_products",
  specs: "pasz_specs",
  sponsors: "pasz_sponsors",
  steam: "pasz_steam",
  gallery: "pasz_gallery",
  socials: "pasz_socials",
};

function getItems<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function setItems<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("localdata-changed"));
}
function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

type Item = Record<string, unknown>;

function makeCrud(key: string) {
  return {
    list: (filter?: (i: Item) => boolean) => {
      const items = getItems<Item>(key);
      return filter ? items.filter(filter) : items;
    },
    add: (item: Item) => {
      const items = getItems<Item>(key);
      const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
      items.push(newItem);
      setItems(key, items);
      return newItem;
    },
    update: (id: number, data: Item) => {
      const items = getItems<Item>(key);
      const idx = items.findIndex((i) => i.id === id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
        setItems(key, items);
      }
    },
    remove: (id: number) => {
      setItems(key, getItems<Item>(key).filter((i) => i.id !== id));
    },
  };
}

export const portfolioApi = makeCrud(STORAGE_KEYS.portfolio);
export const productsApi = makeCrud(STORAGE_KEYS.products);
export const specsApi = makeCrud(STORAGE_KEYS.specs);
export const sponsorsApi = makeCrud(STORAGE_KEYS.sponsors);
export const steamApi = makeCrud(STORAGE_KEYS.steam);
export const galleryApi = makeCrud(STORAGE_KEYS.gallery);

// Socials (single record)
export function getSocials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.socials);
    return raw
      ? JSON.parse(raw)
      : { discord: "PaszczureQ", steamUrl: "", twitter: "", youtube: "", twitch: "", github: "" };
  } catch {
    return { discord: "PaszczureQ", steamUrl: "", twitter: "", youtube: "", twitch: "", github: "" };
  }
}
export function setSocials(data: Record<string, string>) {
  localStorage.setItem(STORAGE_KEYS.socials, JSON.stringify(data));
  window.dispatchEvent(new Event("localdata-changed"));
}

export function getPortfolio(category?: string) {
  return portfolioApi.list(category ? (i) => i.category === category : undefined);
}
export function getProducts(category?: string) {
  return productsApi.list(category ? (i) => i.category === category : undefined);
}
export const getSpecs = () => specsApi.list();
export const getSponsors = () => sponsorsApi.list();
export const getSteam = () => steamApi.list();
export const getGallery = () => galleryApi.list();

export function seedInitialData() {
  if (!localStorage.getItem(STORAGE_KEYS.portfolio)) {
    setItems(STORAGE_KEYS.portfolio, [
      {
        id: 1,
        title: "Iravis",
        description: "My main company venture focused on gaming and tech innovation.",
        category: "company",
        imageUrl: "",
        link: "",
        featured: true,
        order: 0,
      },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.steam)) {
    setItems(STORAGE_KEYS.steam, [
      { id: 1, appId: "730", name: "Counter-Strike 2", imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", hoursPlayed: "850.5", achievementsEarned: 120, achievementsTotal: 167, featured: true },
      { id: 2, appId: "570", name: "Dota 2", imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg", hoursPlayed: "320.0", achievementsEarned: 45, achievementsTotal: 150, featured: false },
      { id: 3, appId: "252490", name: "Rust", imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg", hoursPlayed: "600.0", achievementsEarned: 80, achievementsTotal: 120, featured: true },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    setItems(STORAGE_KEYS.products, [
      { id: 1, name: "G Pro X Superlight", brand: "Logitech", category: "mouse", description: "Ultra-lightweight wireless gaming mouse with HERO 25K sensor.", imageUrl: "", productUrl: "https://www.logitechg.com/", specs: { dpi: "25600", weight: "63g", sensor: "HERO 25K" }, rating: "4.8", featured: true },
      { id: 2, name: "Wooting 60HE", brand: "Wooting", category: "keyboard", description: "Analog mechanical keyboard with rapid trigger.", imageUrl: "", productUrl: "https://wooting.io/", specs: { switches: "Lekker Analog", layout: "60%" }, rating: "4.9", featured: true },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.specs)) {
    setItems(STORAGE_KEYS.specs, [
      { id: 1, gameName: "Counter-Strike 2", gameImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg", dpi: 800, sensitivity: "1.5", edpi: 1200, hz: 1000, zoomSens: "1.0", mouseAccel: false, rawInput: true, crosshair: "CSGO-uOiPj-s9oFJ-OCNd5-2N5yX-mO8WB", resolution: "1920x1080", aspectRatio: "16:9", scalingMode: "Fullscreen", mouse: "Logitech G Pro X Superlight", mousepad: "SteelSeries QcK Heavy", keyboard: "Wooting 60HE", headset: "HyperX Cloud II", monitor: "ZOWIE XL2566K 360Hz" },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.sponsors)) {
    setItems(STORAGE_KEYS.sponsors, [
      { id: 1, name: "SteelSeries", description: "Premium gaming peripherals.", logoUrl: "", websiteUrl: "https://steelseries.com", couponCode: "PASZ10", discountText: "-10%", featured: true, order: 0 },
      { id: 2, name: "GFUEL", description: "Energy drink formula for gamers.", logoUrl: "", websiteUrl: "https://gfuel.com", couponCode: "PASZCZUREQ", discountText: "-15%", featured: false, order: 1 },
    ]);
  }
}
