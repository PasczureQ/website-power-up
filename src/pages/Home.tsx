import { Link } from "react-router-dom";
import { usePortfolio, useSteam, useSponsors, useSocials } from "@/hooks/useLocalData";
import {
  Gamepad2, Trophy, Clock, ExternalLink, ChevronRight,
  Monitor, Keyboard, Mouse, Headphones, Briefcase, HeartHandshake,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) {
        setDone(true);
        const start = performance.now();
        const animate = (t: number) => {
          const p = Math.min((t - start) / 1500, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, done]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const portfolio = usePortfolio("company");
  const steam = useSteam();
  const sponsors = useSponsors();
  const socials = useSocials();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(600px at ${mouse.x}px ${mouse.y}px, hsl(var(--accent) / 0.15), transparent 40%)` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">Available for opportunities</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6">PASZCZUREQ</h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Developer, Entrepreneur & Gaming Enthusiast
          </p>
          <p className="text-muted-foreground/70 mb-10 max-w-xl mx-auto">
            Building Iravis, creating Roblox games, and showcasing the best gaming peripherals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/portfolio" className="group px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
              View My Work <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products" className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-all">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: steam.length, l: "Steam Games" },
              { v: portfolio.length, l: "Companies" },
              { v: sponsors.length, l: "Partners" },
              { v: 500, l: "Hours Played", s: "+" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-4xl font-black mb-2"><AnimatedCounter value={s.v} suffix={s.s || ""} /></div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect / Discord + Setup */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Connect</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Hit me up on Discord or any of these — always open to new projects and ideas.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary border border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5865F2] to-purple-500" />
                  <div>
                    <p className="font-semibold">{socials.discord || "PaszczureQ"}</p>
                    <p className="text-sm text-muted-foreground">Discord</p>
                  </div>
                </div>
                {socials.steamUrl && (
                  <a href={socials.steamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-ring transition-colors">
                    <span className="text-sm font-medium">Steam Profile</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
                {socials.youtube && (
                  <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-ring transition-colors">
                    <span className="text-sm font-medium">YouTube</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
                {socials.twitch && (
                  <a href={socials.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-ring transition-colors">
                    <span className="text-sm font-medium">Twitch</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-ring transition-colors">
                    <span className="text-sm font-medium">Twitter / X</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-ring transition-colors">
                    <span className="text-sm font-medium">GitHub</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 to-primary/5 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-lg font-semibold mb-4">Current Setup</h3>
                <div className="space-y-3">
                  {[
                    { icon: Mouse, label: "Mouse", value: "Logitech G Pro X" },
                    { icon: Keyboard, label: "Keyboard", value: "Wooting 60HE" },
                    { icon: Headphones, label: "Headset", value: "HyperX Cloud II" },
                    { icon: Monitor, label: "Monitor", value: "ZOWIE XL2566K 360Hz" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-24">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Companies & Ventures</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Building and growing innovative projects.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {portfolio.map((c) => (
              <div key={c.id as number} className="group p-6 rounded-xl border border-border bg-card hover:bg-secondary transition-all">
                <div className="flex items-start gap-4">
                  {c.imageUrl ? (
                    <img src={c.imageUrl as string} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{c.title as string}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{c.description as string}</p>
                    {(c.link as string) && (
                      <a href={c.link as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm hover:underline">
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steam */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Steam Library</h2>
              <p className="text-muted-foreground">Games I play and my achievements</p>
            </div>
            <Link to="/portfolio" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steam.slice(0, 6).map((g) => (
              <div key={g.id as number} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-ring transition-all">
                {(g.imageUrl as string) && (
                  <div className="relative h-40 overflow-hidden">
                    <img src={g.imageUrl as string} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold truncate">{g.name as string}</h3>
                    </div>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" /><span>{g.hoursPlayed as string}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span>{(g.achievementsEarned as number) ?? 0}/{(g.achievementsTotal as number) ?? 0}</span>
                    </div>
                  </div>
                  {((g.achievementsTotal as number) ?? 0) > 0 && (
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-accent rounded-full h-2"
                        style={{ width: `${(((g.achievementsEarned as number) ?? 0) / ((g.achievementsTotal as number) || 1)) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {steam.length === 0 && (
            <div className="text-center py-16">
              <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No games yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Partners & Sponsors</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Exclusive deals and coupon codes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.slice(0, 3).map((s) => (
              <div key={s.id as number} className="p-6 rounded-xl border border-border bg-card hover:bg-secondary transition-all text-center">
                {s.logoUrl ? (
                  <img src={s.logoUrl as string} alt="" className="h-16 object-contain mx-auto mb-4" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <HeartHandshake className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{s.name as string}</h3>
                {(s.discountText as string) && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                    {s.discountText as string}
                  </span>
                )}
                {(s.couponCode as string) && (
                  <p className="text-sm text-muted-foreground font-mono">{s.couponCode as string}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
