import { HeartHandshake, ExternalLink, Tag, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useSponsors } from "@/hooks/useLocalData";

export default function Sponsors() {
  const sponsors = useSponsors();
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(null), 2000); };

  const featured = sponsors.filter((s) => s.featured);
  const regular = sponsors.filter((s) => !s.featured);

  return (
    <div className="min-h-screen">
      <section className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Sponsors</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Exclusive deals and coupon codes from my partners.</p>
          </div>
          {featured.length > 0 && (
            <div className="mb-16">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center">Featured Partners</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featured.map((s) => (
                  <div key={s.id as number} className="group relative rounded-2xl border border-border bg-gradient-to-br from-card to-secondary p-8 hover:border-ring transition-all">
                    <div className="flex items-start gap-6">
                      {s.logoUrl ? (
                        <img src={s.logoUrl as string} alt="" className="w-20 h-20 object-contain rounded-xl bg-secondary p-2" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center"><HeartHandshake className="w-10 h-10 text-muted-foreground" /></div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{s.name as string}</h3>
                        {(s.description as string) && <p className="text-muted-foreground text-sm mb-4">{s.description as string}</p>}
                        <div className="flex items-center gap-3 flex-wrap">
                          {(s.discountText as string) && (
                            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                              <Tag className="w-4 h-4" />{s.discountText as string}
                            </span>
                          )}
                          {(s.couponCode as string) && (
                            <button onClick={() => copy(s.couponCode as string)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-all">
                              <span className="font-mono text-sm">{s.couponCode as string}</span>
                              {copied === s.couponCode ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                            </button>
                          )}
                        </div>
                        {(s.websiteUrl as string) && (
                          <a href={s.websiteUrl as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground">
                            Visit Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((s) => (
              <div key={s.id as number} className="rounded-xl border border-border bg-card p-6 hover:bg-secondary transition-all">
                <div className="text-center mb-4">
                  {s.logoUrl ? (
                    <img src={s.logoUrl as string} alt="" className="h-16 object-contain mx-auto mb-4" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4"><HeartHandshake className="w-8 h-8 text-muted-foreground" /></div>
                  )}
                  <h3 className="text-lg font-bold">{s.name as string}</h3>
                  {(s.description as string) && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.description as string}</p>}
                </div>
                <div className="space-y-3">
                  {(s.discountText as string) && (
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm">{s.discountText as string}</span>
                    </div>
                  )}
                  {(s.couponCode as string) && (
                    <button onClick={() => copy(s.couponCode as string)} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border hover:bg-secondary">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{s.couponCode as string}</span>
                      {copied === s.couponCode ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  )}
                  {(s.websiteUrl as string) && (
                    <a href={s.websiteUrl as string} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary text-sm hover:bg-muted">
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {sponsors.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <HeartHandshake className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>No sponsors yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
