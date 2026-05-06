import { useState } from "react";
import {
  Shield, LogOut, Plus, Pencil, Trash2, X, Briefcase, HeartHandshake,
  Mouse, Settings, Trophy, Save, Image as ImageIcon, Link as LinkIcon,
  FileText, Gamepad2,
} from "lucide-react";
import {
  usePortfolio, useProducts, useSpecs, useSponsors, useSteam, useSocials,
  useSiteContent, useDataReady,
} from "@/hooks/useLocalData";
import {
  portfolioApi, productsApi, specsApi, sponsorsApi, steamApi,
  setSocials, setSiteContent,
} from "@/lib/localData";
import { ImageField, GalleryModal } from "@/components/ImageField";
import { setAdminPw, clearAdminPw, isAdmin, verifyAdminPassword } from "@/lib/api";
import { toast } from "sonner";

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setBusy(true);
    const ok = await verifyAdminPassword(p);
    setBusy(false);
    if (ok) { setAdminPw(p); onLogin(); }
    else setMsg("Invalid password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Enter password to manage content</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Password" autoComplete="current-password"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border placeholder:text-muted-foreground focus:outline-none focus:border-ring"
          />
          {msg && (
            <div className="p-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">{msg}</div>
          )}
          <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50">
            {busy ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

type Tab = "site" | "portfolio" | "products" | "specs" | "sponsors" | "steam" | "gallery" | "socials";
const TABS: { id: Tab; label: string; icon: typeof Briefcase }[] = [
  { id: "site", label: "Site Content", icon: FileText },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "products", label: "Products", icon: Mouse },
  { id: "specs", label: "Specs", icon: Settings },
  { id: "sponsors", label: "Sponsors", icon: HeartHandshake },
  { id: "steam", label: "Steam", icon: Trophy },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "socials", label: "Socials", icon: LinkIcon },
];

const Input = ({ name, label, defaultValue, ...rest }: any) => (
  <div>
    <label className="block text-sm text-muted-foreground mb-1">{label}</label>
    <input name={name} defaultValue={defaultValue ?? ""} {...rest}
      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border placeholder:text-muted-foreground focus:outline-none focus:border-ring text-sm" />
  </div>
);
const Textarea = ({ name, label, defaultValue, ...rest }: any) => (
  <div>
    <label className="block text-sm text-muted-foreground mb-1">{label}</label>
    <textarea name={name} defaultValue={defaultValue ?? ""} {...rest}
      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border placeholder:text-muted-foreground focus:outline-none focus:border-ring text-sm" />
  </div>
);
const Select = ({ name, label, defaultValue, options }: any) => (
  <div>
    <label className="block text-sm text-muted-foreground mb-1">{label}</label>
    <select name={name} defaultValue={defaultValue} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:border-ring text-sm">
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
const SubmitBtn = ({ editing, busy }: { editing: boolean; busy?: boolean }) => (
  <button disabled={busy} type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
    <Save className="w-4 h-4" />{busy ? "Saving..." : editing ? "Update" : "Save"}
  </button>
);
const FormHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold">{title}</h3>
    <button type="button" onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
  </div>
);

const handle = async (fn: () => Promise<unknown>, ok: string) => {
  try { await fn(); toast.success(ok); }
  catch (e: any) { toast.error(e?.message || "Failed"); }
};

/* ================= SITE CONTENT ================= */
function SiteMgr() {
  const hero = useSiteContent<any>("hero", { title: "PASZCZUREQ", tagline: "", subtitle: "" });
  const about = useSiteContent<string>("about", "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await setSiteContent("hero", {
        title: (fd.get("title") as string) || "PASZCZUREQ",
        tagline: fd.get("tagline") as string,
        subtitle: fd.get("subtitle") as string,
      });
      await setSiteContent("about", fd.get("about") as string);
      toast.success("Saved");
    } catch (e: any) { toast.error(e?.message || "Failed"); }
    setBusy(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Home Page Content</h2>
      <form onSubmit={submit} className="space-y-4 max-w-2xl">
        <Input name="title" label="Hero Title" defaultValue={hero?.title ?? "PASZCZUREQ"} />
        <Input name="tagline" label="Tagline (under title)" defaultValue={hero?.tagline} placeholder="e.g. Developer & Gamer" />
        <Textarea name="subtitle" label="Subtitle" rows={2} defaultValue={hero?.subtitle} />
        <Textarea name="about" label="About text" rows={4} defaultValue={about} />
        <SubmitBtn editing={false} busy={busy} />
      </form>
    </div>
  );
}

/* ================= PORTFOLIO ================= */
function PortfolioMgr() {
  const items = usePortfolio();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const editing = items.find((i) => i.id === editId);

  const open = (id?: string) => {
    setEditId(id ?? null);
    const it = items.find((i) => i.id === id);
    setImageUrl((it?.imageUrl as string) || "");
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      category: fd.get("category") as string,
      imageUrl, videoUrl: fd.get("videoUrl") as string,
      link: fd.get("link") as string,
      featured: fd.get("featured") === "on",
      order: Number(fd.get("order")) || 0,
    };
    setBusy(true);
    await handle(
      () => editId ? portfolioApi.update(editId, data) : portfolioApi.add(data),
      editId ? "Updated" : "Added"
    );
    setBusy(false);
    setShowForm(false); setEditId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Portfolio Items</h2>
        <button onClick={() => open()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"><Plus className="w-4 h-4" /> Add Item</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="mb-8 p-6 rounded-xl border border-border bg-card space-y-4">
          <FormHeader title={editId ? "Edit Item" : "New Item"} onClose={() => { setShowForm(false); setEditId(null); }} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="title" label="Title *" defaultValue={editing?.title} required />
            <Select name="category" label="Category *" defaultValue={(editing?.category as string) || "work"} options={["work", "project", "roblox_game", "company", "other"]} />
          </div>
          <Textarea name="description" label="Description" rows={3} defaultValue={editing?.description} />
          <ImageField value={imageUrl} onChange={setImageUrl} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="videoUrl" label="Video URL (YouTube embed)" defaultValue={editing?.videoUrl} />
            <Input name="link" label="Link" defaultValue={editing?.link} />
          </div>
          <Input name="order" label="Order" type="number" defaultValue={editing?.order} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input name="featured" type="checkbox" defaultChecked={!!editing?.featured} className="w-4 h-4" /> Featured
          </label>
          <SubmitBtn editing={!!editId} busy={busy} />
        </form>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" /> :
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center"><Briefcase className="w-6 h-6 text-muted-foreground" /></div>}
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground capitalize">{(item.category as string)?.replace("_", " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => open(item.id)} className="p-2 rounded-lg hover:bg-secondary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("Delete?")) handle(() => portfolioApi.remove(item.id), "Deleted"); }} className="p-2 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PRODUCTS ================= */
function ProductsMgr() {
  const items = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const editing = items.find((i) => i.id === editId);

  const open = (id?: string) => {
    setEditId(id ?? null);
    const it = items.find((i) => i.id === id);
    setImageUrl((it?.imageUrl as string) || "");
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const specsStr = fd.get("specs") as string;
    const specs = specsStr ? Object.fromEntries(specsStr.split(",").map((s) => s.split("=").map((x) => x.trim()))) : {};
    const data = {
      name: fd.get("name") as string, brand: fd.get("brand") as string,
      category: fd.get("category") as string, description: fd.get("description") as string,
      imageUrl, productUrl: fd.get("productUrl") as string, specs,
      rating: fd.get("rating") as string, featured: fd.get("featured") === "on",
    };
    setBusy(true);
    await handle(
      () => editId ? productsApi.update(editId, data) : productsApi.add(data),
      editId ? "Updated" : "Added"
    );
    setBusy(false);
    setShowForm(false); setEditId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Products</h2>
        <button onClick={() => open()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"><Plus className="w-4 h-4" /> Add Product</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="mb-8 p-6 rounded-xl border border-border bg-card space-y-4">
          <FormHeader title={editId ? "Edit Product" : "New Product"} onClose={() => { setShowForm(false); setEditId(null); }} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="name" label="Name *" defaultValue={editing?.name} required />
            <Input name="brand" label="Brand *" defaultValue={editing?.brand} required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Select name="category" label="Category *" defaultValue={(editing?.category as string) || "mouse"} options={["mouse", "mousepad", "keyboard", "headset", "monitor", "controller", "other"]} />
            <Input name="rating" label="Rating (0-5)" defaultValue={editing?.rating} placeholder="4.5" />
          </div>
          <Textarea name="description" label="Description" rows={2} defaultValue={editing?.description} />
          <ImageField value={imageUrl} onChange={setImageUrl} />
          <Input name="productUrl" label="Product URL" defaultValue={editing?.productUrl} />
          <Input name="specs" label="Specs (key=value, comma separated)" defaultValue={editing?.specs ? Object.entries(editing.specs as Record<string, string>).map(([k, v]) => `${k}=${v}`).join(", ") : ""} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input name="featured" type="checkbox" defaultChecked={!!editing?.featured} className="w-4 h-4" /> Featured
          </label>
          <SubmitBtn editing={!!editId} busy={busy} />
        </form>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-lg border border-border bg-card flex items-start justify-between">
            <div className="flex items-center gap-3">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-contain bg-secondary" /> :
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center"><Mouse className="w-6 h-6 text-muted-foreground" /></div>}
              <div>
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.brand}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => open(item.id)} className="p-1.5 rounded hover:bg-secondary"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => { if (confirm("Delete?")) handle(() => productsApi.remove(item.id), "Deleted"); }} className="p-1.5 rounded hover:bg-destructive/20"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SPECS ================= */
function SpecsMgr() {
  const items = useSpecs();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [gameImage, setGameImage] = useState("");
  const [busy, setBusy] = useState(false);
  const editing = items.find((i) => i.id === editId);

  const open = (id?: string) => {
    setEditId(id ?? null);
    const it = items.find((i) => i.id === id);
    setGameImage((it?.gameImage as string) || "");
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      gameName: fd.get("gameName"), gameImage,
      dpi: Number(fd.get("dpi")) || undefined,
      sensitivity: fd.get("sensitivity"),
      edpi: Number(fd.get("edpi")) || undefined,
      hz: Number(fd.get("hz")) || undefined,
      zoomSens: fd.get("zoomSens"),
      mouseAccel: fd.get("mouseAccel") === "on",
      rawInput: fd.get("rawInput") === "on",
      crosshair: fd.get("crosshair"),
      resolution: fd.get("resolution"),
      aspectRatio: fd.get("aspectRatio"),
      scalingMode: fd.get("scalingMode"),
      mouse: fd.get("mouse"), mousepad: fd.get("mousepad"),
      keyboard: fd.get("keyboard"), headset: fd.get("headset"),
      monitor: fd.get("monitor"),
    };
    setBusy(true);
    await handle(
      () => editId ? specsApi.update(editId, data as any) : specsApi.add(data as any),
      editId ? "Updated" : "Added"
    );
    setBusy(false);
    setShowForm(false); setEditId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gear Specs</h2>
        <button onClick={() => open()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"><Plus className="w-4 h-4" /> Add Spec</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="mb-8 p-6 rounded-xl border border-border bg-card space-y-4">
          <FormHeader title={editId ? "Edit Spec" : "New Spec"} onClose={() => { setShowForm(false); setEditId(null); }} />
          <Input name="gameName" label="Game Name *" defaultValue={editing?.gameName} required />
          <ImageField value={gameImage} onChange={setGameImage} label="Game Image" />
          <div className="grid md:grid-cols-4 gap-4">
            <Input name="dpi" label="DPI" type="number" defaultValue={editing?.dpi} />
            <Input name="sensitivity" label="Sensitivity" defaultValue={editing?.sensitivity} />
            <Input name="edpi" label="eDPI" type="number" defaultValue={editing?.edpi} />
            <Input name="hz" label="Polling (Hz)" type="number" defaultValue={editing?.hz} />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Input name="zoomSens" label="Zoom Sens" defaultValue={editing?.zoomSens} />
            <Input name="resolution" label="Resolution" defaultValue={editing?.resolution} />
            <Input name="aspectRatio" label="Aspect" defaultValue={editing?.aspectRatio} />
            <Input name="scalingMode" label="Scaling" defaultValue={editing?.scalingMode} />
          </div>
          <Input name="crosshair" label="Crosshair Code" defaultValue={editing?.crosshair} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="mouse" label="Mouse" defaultValue={editing?.mouse} />
            <Input name="mousepad" label="Mousepad" defaultValue={editing?.mousepad} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Input name="keyboard" label="Keyboard" defaultValue={editing?.keyboard} />
            <Input name="headset" label="Headset" defaultValue={editing?.headset} />
            <Input name="monitor" label="Monitor" defaultValue={editing?.monitor} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground"><input name="mouseAccel" type="checkbox" defaultChecked={!!editing?.mouseAccel} /> Mouse Acceleration</label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground"><input name="rawInput" type="checkbox" defaultChecked={editing?.rawInput as boolean ?? true} /> Raw Input</label>
          </div>
          <SubmitBtn editing={!!editId} busy={busy} />
        </form>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              {item.gameImage ? <img src={item.gameImage} alt="" className="w-12 h-12 rounded-lg object-cover" /> :
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-muted-foreground" /></div>}
              <div>
                <h4 className="font-medium">{item.gameName}</h4>
                <p className="text-sm text-muted-foreground">{item.mouse} | DPI: {item.dpi}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => open(item.id)} className="p-2 rounded-lg hover:bg-secondary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("Delete?")) handle(() => specsApi.remove(item.id), "Deleted"); }} className="p-2 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= SPONSORS ================= */
function SponsorsMgr() {
  const items = useSponsors();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const editing = items.find((i) => i.id === editId);

  const open = (id?: string) => {
    setEditId(id ?? null);
    const it = items.find((i) => i.id === id);
    setLogoUrl((it?.logoUrl as string) || "");
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string, description: fd.get("description") as string,
      logoUrl, websiteUrl: fd.get("websiteUrl") as string,
      couponCode: fd.get("couponCode") as string,
      discountText: fd.get("discountText") as string,
      featured: fd.get("featured") === "on",
      order: Number(fd.get("order")) || 0,
    };
    setBusy(true);
    await handle(
      () => editId ? sponsorsApi.update(editId, data) : sponsorsApi.add(data),
      editId ? "Updated" : "Added"
    );
    setBusy(false);
    setShowForm(false); setEditId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sponsors</h2>
        <button onClick={() => open()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"><Plus className="w-4 h-4" /> Add Sponsor</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="mb-8 p-6 rounded-xl border border-border bg-card space-y-4">
          <FormHeader title={editId ? "Edit Sponsor" : "New Sponsor"} onClose={() => { setShowForm(false); setEditId(null); }} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="name" label="Name *" defaultValue={editing?.name} required />
            <Input name="discountText" label="Discount Text" defaultValue={editing?.discountText} placeholder="-10%" />
          </div>
          <Textarea name="description" label="Description" rows={2} defaultValue={editing?.description} />
          <ImageField value={logoUrl} onChange={setLogoUrl} label="Logo" />
          <Input name="websiteUrl" label="Website URL" defaultValue={editing?.websiteUrl} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="couponCode" label="Coupon Code" defaultValue={editing?.couponCode} />
            <Input name="order" label="Order" type="number" defaultValue={editing?.order} />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input name="featured" type="checkbox" defaultChecked={!!editing?.featured} /> Featured</label>
          <SubmitBtn editing={!!editId} busy={busy} />
        </form>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              {item.logoUrl ? <img src={item.logoUrl} alt="" className="w-12 h-12 object-contain rounded-lg bg-secondary p-1" /> :
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center"><HeartHandshake className="w-6 h-6 text-muted-foreground" /></div>}
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center gap-2">
                  {item.discountText && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">{item.discountText}</span>}
                  {item.couponCode && <span className="text-xs text-muted-foreground font-mono">{item.couponCode}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => open(item.id)} className="p-2 rounded-lg hover:bg-secondary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("Delete?")) handle(() => sponsorsApi.remove(item.id), "Deleted"); }} className="p-2 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STEAM ================= */
function SteamMgr() {
  const items = useSteam();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const editing = items.find((i) => i.id === editId);

  const open = (id?: string) => {
    setEditId(id ?? null);
    const it = items.find((i) => i.id === id);
    setImageUrl((it?.imageUrl as string) || "");
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      appId: fd.get("appId") as string, name: fd.get("name") as string,
      imageUrl, hoursPlayed: fd.get("hoursPlayed") as string,
      achievementsEarned: Number(fd.get("achievementsEarned")) || 0,
      achievementsTotal: Number(fd.get("achievementsTotal")) || 0,
      featured: fd.get("featured") === "on",
    };
    setBusy(true);
    await handle(
      () => editId ? steamApi.update(editId, data) : steamApi.add(data),
      editId ? "Updated" : "Added"
    );
    setBusy(false);
    setShowForm(false); setEditId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Steam Games</h2>
        <button onClick={() => open()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"><Plus className="w-4 h-4" /> Add Game</button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="mb-8 p-6 rounded-xl border border-border bg-card space-y-4">
          <FormHeader title={editId ? "Edit Game" : "New Game"} onClose={() => { setShowForm(false); setEditId(null); }} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="appId" label="App ID" defaultValue={editing?.appId} placeholder="730" />
            <Input name="name" label="Game Name *" defaultValue={editing?.name} required />
          </div>
          <ImageField value={imageUrl} onChange={setImageUrl} />
          <div className="grid md:grid-cols-3 gap-4">
            <Input name="hoursPlayed" label="Hours Played" defaultValue={editing?.hoursPlayed} />
            <Input name="achievementsEarned" label="Earned" type="number" defaultValue={editing?.achievementsEarned} />
            <Input name="achievementsTotal" label="Total" type="number" defaultValue={editing?.achievementsTotal} />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input name="featured" type="checkbox" defaultChecked={!!editing?.featured} /> Featured</label>
          <SubmitBtn editing={!!editId} busy={busy} />
        </form>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-16 h-10 rounded object-cover" /> :
                <div className="w-16 h-10 rounded bg-secondary flex items-center justify-center"><Gamepad2 className="w-5 h-5 text-muted-foreground" /></div>}
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.hoursPlayed}h | {item.achievementsEarned}/{item.achievementsTotal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => open(item.id)} className="p-2 rounded-lg hover:bg-secondary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm("Delete?")) handle(() => steamApi.remove(item.id), "Deleted"); }} className="p-2 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= GALLERY ================= */
function GalleryMgr() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Image Gallery</h2>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
          <ImageIcon className="w-4 h-4" /> Open Gallery
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Upload images here, then pick them when creating portfolio items, products, sponsors, etc.
        <br />Images are stored on the server and visible to all visitors. Max 5MB per image.
      </p>
      {open && <GalleryModal onClose={() => setOpen(false)} />}
    </div>
  );
}

/* ================= SOCIALS ================= */
function SocialsMgr() {
  const s = useSocials();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    await handle(() => setSocials({
      discord: fd.get("discord") as string,
      steamUrl: fd.get("steamUrl") as string,
      youtube: fd.get("youtube") as string,
      twitch: fd.get("twitch") as string,
      twitter: fd.get("twitter") as string,
      github: fd.get("github") as string,
    }), "Saved");
    setBusy(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Social Links</h2>
      <form onSubmit={submit} className="space-y-4 max-w-2xl">
        <Input name="discord" label="Discord username/tag" defaultValue={s.discord} />
        <Input name="steamUrl" label="Steam profile URL" defaultValue={s.steamUrl} />
        <Input name="youtube" label="YouTube URL" defaultValue={s.youtube} />
        <Input name="twitch" label="Twitch URL" defaultValue={s.twitch} />
        <Input name="twitter" label="Twitter / X URL" defaultValue={s.twitter} />
        <Input name="github" label="GitHub URL" defaultValue={s.github} />
        <SubmitBtn editing={false} busy={busy} />
      </form>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard() {
  const ready = useDataReady();
  const [tab, setTab] = useState<Tab>("site");

  return (
    <div className="min-h-screen pt-12 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your site content</p>
          </div>
          <button
            onClick={() => { clearAdminPw(); window.location.reload(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                }`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
        {!ready ? <p className="text-muted-foreground">Loading...</p> : (
          <>
            {tab === "site" && <SiteMgr />}
            {tab === "portfolio" && <PortfolioMgr />}
            {tab === "products" && <ProductsMgr />}
            {tab === "specs" && <SpecsMgr />}
            {tab === "sponsors" && <SponsorsMgr />}
            {tab === "steam" && <SteamMgr />}
            {tab === "gallery" && <GalleryMgr />}
            {tab === "socials" && <SocialsMgr />}
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [logged, setLogged] = useState(() => isAdmin());
  if (!logged) return <LoginForm onLogin={() => setLogged(true)} />;
  return <Dashboard />;
}
