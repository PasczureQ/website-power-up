import { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, Trash2 } from "lucide-react";
import { useGallery } from "@/hooks/useLocalData";
import { galleryApi, uploadImage } from "@/lib/localData";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageField({ value, onChange, label = "Image" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or pick from gallery"
          className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4" /> Gallery
        </button>
      </div>
      {value && (
        <img src={value} alt="" className="mt-2 h-20 rounded-lg object-cover border border-border" />
      )}
      {open && <GalleryModal onPick={(url) => { onChange(url); setOpen(false); }} onClose={() => setOpen(false)} />}
    </div>
  );
}

export function GalleryModal({ onPick, onClose }: { onPick?: (url: string) => void; onClose: () => void }) {
  const gallery = useGallery();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        try {
          await uploadImage(file);
        } catch (err: any) {
          toast.error(`${file.name}: ${err.message || "upload failed"}`);
        }
      }
      toast.success("Uploaded");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-lg">Image Gallery</h3>
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" /> {busy ? "Uploading..." : "Upload"}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto">
          {gallery.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No images yet. Upload some to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((img) => (
                <div key={img.id as string} className="relative group rounded-lg overflow-hidden border border-border bg-secondary">
                  <img src={img.url as string} alt={img.name as string} className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {onPick && (
                      <button
                        onClick={() => onPick(img.url as string)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium"
                      >
                        Use
                      </button>
                    )}
                    <button
                      onClick={() => galleryApi.remove(img.id as string)}
                      className="p-1.5 bg-destructive text-destructive-foreground rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs px-2 py-1 truncate">
                    {img.name as string}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
