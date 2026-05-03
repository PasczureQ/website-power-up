import { usePortfolio } from "@/hooks/useLocalData";
import { useState } from "react";
import { Briefcase, Gamepad2, Building2, FolderOpen, ExternalLink, Play } from "lucide-react";

type Category = "all" | "work" | "project" | "roblox_game" | "company" | "other";
const cats: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "project", label: "Projects" },
  { id: "roblox_game", label: "Roblox Games" },
  { id: "company", label: "Companies" },
  { id: "other", label: "Other" },
];

export default function Portfolio() {
  const [active, setActive] = useState<Category>("all");
  const items = usePortfolio();
  const [video, setVideo] = useState<string | null>(null);
  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div className="min-h-screen">
      <section className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Portfolio</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              My work, projects, Roblox games, and companies.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active === c.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id as number} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-ring transition-all">
                <div className="relative h-52 overflow-hidden bg-secondary">
                  {item.imageUrl ? (
                    <img src={item.imageUrl as string} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="w-16 h-16 text-muted-foreground/40" />
                    </div>
                  )}
                  {item.videoUrl && (
                    <button onClick={() => setVideo(item.videoUrl as string)} className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                    </button>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm text-xs font-medium capitalize">
                      {(item.category as string).replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{item.title as string}</h3>
                  {(item.description as string) && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.description as string}</p>
                  )}
                  {(item.link as string) && (
                    <a href={item.link as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm hover:underline">
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>No items.</p>
            </div>
          )}
        </div>
      </section>
      {video && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4" onClick={() => setVideo(null)}>
          <div className="w-full max-w-4xl aspect-video">
            <iframe src={video} className="w-full h-full rounded-xl" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}
