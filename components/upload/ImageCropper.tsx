"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2, Minus, Plus, RotateCw } from "lucide-react";

/**
 * Reusable crop dialog. Give it an image (object URL or data URL) and get back
 * a cropped Blob. Square by default (logos, avatars); pass `aspect` for
 * anything else. Renders as a modal over the page.
 */
export default function ImageCropper({
  src,
  aspect = 1,
  round = false,
  title = "Adjust your image",
  outputSize = 512,
  onCancel,
  onDone,
}: {
  src: string;
  aspect?: number;
  round?: boolean;
  title?: string;
  /** Longest output edge in pixels. */
  outputSize?: number;
  onCancel: () => void;
  onDone: (blob: Blob) => void | Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  const confirm = async () => {
    if (!area || busy) return;
    setBusy(true);
    try {
      const blob = await cropToBlob(src, area, rotation, outputSize, aspect);
      await onDone(blob);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-deep/70 px-4" onClick={() => !busy && onCancel()}>
      <div className="w-full max-w-[520px] rounded-[28px] bg-canvas p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">{title}</h2>
        <p className="mt-2 text-[14px] text-muted">Drag to move. Pinch or use the slider to zoom.</p>

        <div className="relative mt-5 h-[320px] w-full overflow-hidden rounded-[20px] bg-ink-deep">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            cropShape={round ? "round" : "rect"}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.2))} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink">
            <Minus size={16} />
          </button>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom" className="flex-1 accent-ink" />
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink">
            <Plus size={16} />
          </button>
          <button type="button" aria-label="Rotate" onClick={() => setRotation((r) => (r + 90) % 360)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink">
            <RotateCw size={16} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="inline-flex h-11 items-center rounded-full border border-line px-5 text-[14.5px] font-medium text-ink disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={confirm} disabled={busy || !area} className="inline-flex h-11 items-center gap-2 rounded-full bg-mint px-6 text-[14.5px] font-medium text-ink-deep disabled:opacity-50">
            {busy ? <Loader2 size={16} className="animate-spin" /> : null} Use this
          </button>
        </div>
      </div>
    </div>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

/** Render the chosen area (with rotation) to a canvas and export a PNG blob. */
export async function cropToBlob(src: string, area: Area, rotation: number, outputSize: number, aspect: number): Promise<Blob> {
  const img = await loadImage(src);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const bw = img.width * cos + img.height * sin;
  const bh = img.width * sin + img.height * cos;

  // Draw the rotated source onto a bounding canvas first.
  const stage = document.createElement("canvas");
  stage.width = Math.round(bw);
  stage.height = Math.round(bh);
  const sctx = stage.getContext("2d");
  if (!sctx) throw new Error("Canvas is not available.");
  sctx.translate(bw / 2, bh / 2);
  sctx.rotate(rad);
  sctx.drawImage(img, -img.width / 2, -img.height / 2);

  const outW = aspect >= 1 ? outputSize : Math.round(outputSize * aspect);
  const outH = aspect >= 1 ? Math.round(outputSize / aspect) : outputSize;
  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("Canvas is not available.");
  octx.drawImage(stage, area.x, area.y, area.width, area.height, 0, 0, outW, outH);

  return new Promise((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not export the image."))), "image/png"));
}
