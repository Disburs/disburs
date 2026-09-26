"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import ImageCropper from "./ImageCropper";
import { getUploadConfig, signUpload, type UploadKind } from "@/lib/api";

/**
 * Pick → crop → upload. Reusable anywhere an image is needed (org logo,
 * avatar). Uploads go straight from the browser to Cloudinary using a
 * signature from the backend; the resulting secure URL is handed back.
 */
export default function ImageUpload({
  kind,
  value,
  onChange,
  label = "Upload image",
  round = false,
  aspect = 1,
  size = 96,
  disabled = false,
}: {
  kind: UploadKind;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  round?: boolean;
  aspect?: number;
  /** Preview size in px. */
  size?: number;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUploadConfig()
      .then((c) => !cancelled && setEnabled(c.enabled))
      .catch(() => !cancelled && setEnabled(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const pick = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 10 * 1024 * 1024) return setError("Please choose an image under 10 MB.");
    setPending(URL.createObjectURL(file));
  };

  const upload = async (blob: Blob) => {
    setUploading(true);
    setError(null);
    try {
      const sig = await signUpload(kind);
      const form = new FormData();
      Object.entries(sig.fields).forEach(([k, v]) => form.append(k, String(v)));
      form.append("file", blob, "image.png");
      const res = await fetch(sig.uploadUrl, { method: "POST", body: form });
      const body = (await res.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
      if (!res.ok || !body.secure_url) throw new Error(body.error?.message ?? "Upload failed. Please try again.");
      onChange(body.secure_url);
      if (pending) URL.revokeObjectURL(pending);
      setPending(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const radius = round ? "rounded-full" : "rounded-[20px]";
  const off = disabled || enabled === false;

  return (
    <div className="flex items-center gap-4">
      <div className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-line bg-subtle ${radius}`} style={{ width: size, height: size }}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus size={Math.round(size * 0.28)} className="text-faint" />
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-canvas/70">
            <Loader2 size={20} className="animate-spin text-accent" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => input.current?.click()} disabled={off || uploading} className="inline-flex h-10 cursor-pointer items-center rounded-full border border-line px-4 text-[14px] font-medium text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50">
            {value ? "Change" : label}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(null)} disabled={uploading} aria-label="Remove image" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:text-ink">
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <span className="text-[12.5px] text-muted">
          {enabled === false ? "Image uploads aren't configured yet." : "PNG or JPG, up to 10 MB. You can crop it next."}
        </span>
        {error && <span className="text-[12.5px] text-[#A32D1C]">{error}</span>}
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {pending && (
        <ImageCropper
          src={pending}
          aspect={aspect}
          round={round}
          title={kind === "org-logo" ? "Adjust your logo" : "Adjust your photo"}
          onCancel={() => {
            URL.revokeObjectURL(pending);
            setPending(null);
          }}
          onDone={upload}
        />
      )}
    </div>
  );
}
