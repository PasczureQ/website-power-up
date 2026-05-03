import { useState } from "react";
import { Crosshair, Monitor, Mouse, Keyboard, Headphones, Gamepad2, Settings, Copy, Check } from "lucide-react";
import { useSpecs } from "@/hooks/useLocalData";

export default function Specs() {
  const specs = useSpecs();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const active = specs.find((s) => s.id === activeId) || specs[0];

  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopied(t);
    setTimeout(() => setCopied(null), 2000);
  };

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <section className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Gear & Settings</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">My gaming setup and configurations.</p>
          </div>
          {specs.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {specs.map((s) => (
                <button
                  key={s.id as number}
                  onClick={() => setActiveId(s.id as number)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all ${
                    active?.id === s.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-ring"
                  }`}
                >
                  {(s.gameImage as string) ? (
                    <img src={s.gameImage as string} alt="" className="w-8 h-8 rounded object-cover" />
                  ) : <Gamepad2 className="w-5 h-5" />}
                  <span className="font-medium">{s.gameName as string}</span>
                </button>
              ))}
            </div>
          )}
          {active ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"><Mouse className="w-5 h-5" /></div>
                  <h2 className="text-xl font-bold">Mouse Settings</h2>
                </div>
                <div className="space-y-4">
                  {(active.dpi as number) && <Row label="DPI" value={active.dpi as number} />}
                  {(active.sensitivity as string) && <Row label="Sensitivity" value={active.sensitivity as string} />}
                  {(active.edpi as number) && <Row label="eDPI" value={active.edpi as number} />}
                  {(active.hz as number) && <Row label="Polling Rate" value={`${active.hz}Hz`} />}
                  {(active.zoomSens as string) && <Row label="Zoom Sensitivity" value={active.zoomSens as string} />}
                  <Row label="Mouse Acceleration" value={<span className={active.mouseAccel ? "text-accent" : "text-destructive"}>{active.mouseAccel ? "ON" : "OFF"}</span>} />
                  <Row label="Raw Input" value={<span className={active.rawInput ? "text-accent" : "text-destructive"}>{active.rawInput ? "ON" : "OFF"}</span>} />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"><Monitor className="w-5 h-5" /></div>
                  <h2 className="text-xl font-bold">Display</h2>
                </div>
                <div className="space-y-4">
                  {(active.resolution as string) && <Row label="Resolution" value={active.resolution as string} />}
                  {(active.aspectRatio as string) && <Row label="Aspect Ratio" value={active.aspectRatio as string} />}
                  {(active.scalingMode as string) && <Row label="Scaling Mode" value={active.scalingMode as string} />}
                </div>
                {(active.crosshair as string) && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3 mb-4"><Crosshair className="w-5 h-5 text-muted-foreground" /><h3 className="font-semibold">Crosshair</h3></div>
                    <div className="p-3 rounded-lg bg-secondary flex items-center justify-between">
                      <code className="text-sm font-mono truncate max-w-[80%]">{active.crosshair as string}</code>
                      <button onClick={() => copy(active.crosshair as string)} className="p-2 rounded hover:bg-muted">
                        {copied === active.crosshair ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"><Settings className="w-5 h-5" /></div>
                  <h2 className="text-xl font-bold">My Gear</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Mouse, label: "Mouse", value: active.mouse },
                    { icon: Monitor, label: "Mousepad", value: active.mousepad },
                    { icon: Keyboard, label: "Keyboard", value: active.keyboard },
                    { icon: Headphones, label: "Headset", value: active.headset },
                    { icon: Monitor, label: "Monitor", value: active.monitor },
                  ].filter((g) => g.value).map((g) => (
                    <div key={g.label} className="p-4 rounded-lg bg-secondary">
                      <g.icon className="w-5 h-5 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">{g.label}</p>
                      <p className="text-sm font-medium">{g.value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p>No gear settings yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
