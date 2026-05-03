import { useState } from "react";
import { Mouse, Search, Star, ExternalLink, X } from "lucide-react";
import { useProducts } from "@/hooks/useLocalData";

const cats = ["all", "mouse", "mousepad", "keyboard", "headset", "monitor", "controller", "other"];

export default function Products() {
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Record<string, unknown> | null>(null);
  const all = useProducts();
  const filtered = (active === "all" ? all : all.filter((p) => p.category === active)).filter(
    (p) => (p.name as string).toLowerCase().includes(q.toLowerCase()) || (p.brand as string).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <section className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Gaming peripherals curated and reviewed.</p>
          </div>
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border placeholder:text-muted-foreground focus:outline-none focus:border-ring"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  active === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id as number}
                onClick={() => setSel(p)}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-ring transition-all cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden p-4">
                  {p.imageUrl ? (
                    <img src={p.imageUrl as string} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Mouse className="w-16 h-16 text-muted-foreground/40" />
                    </div>
                  )}
                  {(p.rating as string) && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/70 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{p.rating as string}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{p.brand as string}</p>
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">{p.name as string}</h3>
                  <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-1 rounded">{p.category as string}</span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Mouse className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>No products found.</p>
            </div>
          )}
        </div>
      </section>
      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4" onClick={() => setSel(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSel(null)} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-secondary hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-secondary p-6 flex items-center justify-center">
                  {sel.imageUrl ? (
                    <img src={sel.imageUrl as string} alt="" className="max-h-64 object-contain" />
                  ) : <Mouse className="w-32 h-32 text-muted-foreground/40" />}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{sel.brand as string}</p>
                  <h2 className="text-2xl font-bold mb-3">{sel.name as string}</h2>
                  {(sel.description as string) && <p className="text-muted-foreground text-sm mb-4">{sel.description as string}</p>}
                  {(sel.productUrl as string) && (
                    <a href={sel.productUrl as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
                      Buy Now <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              {sel.specs && Object.keys(sel.specs as Record<string, string>).length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-bold mb-4">Specifications</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.entries(sel.specs as Record<string, string>).map(([k, v]) => (
                      <div key={k} className="flex justify-between p-3 rounded-lg bg-secondary">
                        <span className="text-sm text-muted-foreground capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
