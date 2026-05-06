import { Link } from "react-router-dom";
import { useSocials, useSiteContent } from "@/hooks/useLocalData";
import { ExternalLink, ChevronRight } from "lucide-react";

export default function Home() {
  const socials = useSocials();
  const hero = useSiteContent<{ title?: string; tagline?: string; subtitle?: string }>("hero", {});
  const about = useSiteContent<string>("about", "");

  const title = hero?.title?.trim() || "PASZCZUREQ";

  const socialLinks: Array<{ key: string; label: string; href?: string }> = [
    { key: "discord", label: socials.discord ? `Discord — ${socials.discord}` : "" },
    { key: "steamUrl", label: "Steam", href: socials.steamUrl },
    { key: "youtube", label: "YouTube", href: socials.youtube },
    { key: "twitch", label: "Twitch", href: socials.twitch },
    { key: "twitter", label: "Twitter / X", href: socials.twitter },
    { key: "github", label: "GitHub", href: socials.github },
  ].filter((l) => l.label || l.href);

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6">{title}</h1>
          {hero?.tagline && (
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">{hero.tagline}</p>
          )}
          {hero?.subtitle && (
            <p className="text-muted-foreground/70 mb-10 max-w-xl mx-auto">{hero.subtitle}</p>
          )}
        </div>
      </section>

      {about && (
        <section className="py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">About</h2>
            <p className="text-muted-foreground whitespace-pre-line">{about}</p>
          </div>
        </section>
      )}

      {socialLinks.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Connect</h2>
            <div className="space-y-3">
              {socialLinks.map((l) => l.href ? (
                <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-ring transition-colors">
                  <span className="text-sm font-medium">{l.label}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ) : (
                <div key={l.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border">
                  <span className="text-sm font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
