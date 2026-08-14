"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import RakhiSVG from "@/components/RakhiSVG";
import type { RakhiSceneHandle } from "@/components/three/RakhiScene";
import { blobToImage, compositeToBlob, loadImageFromFile, type LoadedImage } from "@/lib/compositeImage";
import type { RakhiConfig } from "@/lib/rakhi";

const RakhiScene = dynamic(() => import("@/components/three/RakhiScene"), { ssr: false });

const MIN_SIZE_FRAC = 0.12;
const MAX_SIZE_FRAC = 0.7;
const DEFAULT_SIZE_FRAC = 0.36;
const MAX_INPUT_BYTES = 20 * 1024 * 1024;

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function WristPhotoStudio({
  rakhi,
  onClose,
}: {
  rakhi: RakhiConfig;
  onClose: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneApiRef = useRef<RakhiSceneHandle>(null);
  const stickerImgRef = useRef<LoadedImage | null>(null);

  const [capturing3D, setCapturing3D] = useState(true);
  const [stickerPngUrl, setStickerPngUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"" | "download" | "copy" | "share">("");

  const [cxFrac, setCxFrac] = useState(0.5);
  const [cyFrac, setCyFrac] = useState(0.5);
  const [sizeFrac, setSizeFrac] = useState(DEFAULT_SIZE_FRAC);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragStart = useRef<{ x: number; y: number; cxFrac: number; cyFrac: number } | null>(null);
  const pinchStart = useRef<{ dist: number; sizeFrac: number } | null>(null);

  const canCopy = typeof window !== "undefined" && !!navigator.clipboard && typeof window.ClipboardItem !== "undefined";
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  // Capture a real 3D render of the rakhi once, then use that PNG as the placeable sticker.
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const tryCapture = () => {
      if (cancelled) return;
      tries += 1;
      const api = sceneApiRef.current;
      if (!api) {
        if (tries < 120) setTimeout(tryCapture, 150);
        else setCapturing3D(false);
        return;
      }
      api.snapshot().then((blob) => {
        if (cancelled) return;
        if (blob) {
          blobToImage(blob).then((loaded) => {
            if (cancelled) {
              loaded.revoke();
              return;
            }
            stickerImgRef.current?.revoke();
            stickerImgRef.current = loaded;
            setStickerPngUrl(loaded.img.src);
            setCapturing3D(false);
          });
          return;
        }
        if (tries < 120) {
          setTimeout(tryCapture, 150);
        } else {
          setCapturing3D(false);
        }
      });
    };
    const id = setTimeout(tryCapture, 150);
    return () => {
      cancelled = true;
      clearTimeout(id);
      stickerImgRef.current?.revoke();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickPhoto = useCallback(() => fileInput.current?.click(), []);
  const pickCamera = useCallback(() => cameraInput.current?.click(), []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_INPUT_BYTES) {
      setError("That photo is too large. Try a smaller one.");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setAspect(probe.naturalWidth / probe.naturalHeight);
      setPhotoFile(file);
      setPhotoUrl(url);
      setCxFrac(0.5);
      setCyFrac(0.5);
      setSizeFrac(DEFAULT_SIZE_FRAC);
    };
    probe.onerror = () => setError("Couldn't read that photo.");
    probe.src = url;
  }, []);

  const onStickerPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, cxFrac, cyFrac };
      pinchStart.current = null;
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      pinchStart.current = { dist: dist(pts[0], pts[1]), sizeFrac };
      dragStart.current = null;
    }
  }, [cxFrac, cyFrac, sizeFrac]);

  const onStickerPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values());
      const ratio = dist(pts[0], pts[1]) / pinchStart.current.dist;
      const next = Math.min(MAX_SIZE_FRAC, Math.max(MIN_SIZE_FRAC, pinchStart.current.sizeFrac * ratio));
      setSizeFrac(next);
    } else if (pointers.current.size === 1 && dragStart.current) {
      const dx = (e.clientX - dragStart.current.x) / rect.width;
      const dy = (e.clientY - dragStart.current.y) / rect.height;
      setCxFrac(Math.min(1, Math.max(0, dragStart.current.cxFrac + dx)));
      setCyFrac(Math.min(1, Math.max(0, dragStart.current.cyFrac + dy)));
    }
  }, []);

  const endPointer = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 1) {
      const [remaining] = Array.from(pointers.current.entries());
      dragStart.current = { x: remaining[1].x, y: remaining[1].y, cxFrac, cyFrac };
      pinchStart.current = null;
    } else if (pointers.current.size === 0) {
      dragStart.current = null;
      pinchStart.current = null;
    }
  }, [cxFrac, cyFrac]);


  const buildComposite = useCallback(async () => {
    if (!photoFile || !stickerImgRef.current) throw new Error("Nothing to export yet");
    const photo = await loadImageFromFile(photoFile);
    try {
      return await compositeToBlob({
        photoImg: photo.img,
        stickerImg: stickerImgRef.current.img,
        rect: { cxFrac, cyFrac, widthFrac: sizeFrac },
      });
    } finally {
      photo.revoke();
    }
  }, [photoFile, cxFrac, cyFrac, sizeFrac]);

  const handleDownload = useCallback(async () => {
    setError(null);
    setBusy("download");
    try {
      const blob = await buildComposite();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rakhibox-wrist.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      setError("Couldn't create the image. Try again.");
    } finally {
      setBusy("");
    }
  }, [buildComposite]);

  const handleCopy = useCallback(async () => {
    setError(null);
    setBusy("copy");
    try {
      const item = new ClipboardItem({ "image/png": buildComposite() });
      await navigator.clipboard.write([item]);
    } catch {
      setError("Couldn't copy the image on this browser.");
    } finally {
      setBusy("");
    }
  }, [buildComposite]);

  const handleShare = useCallback(async () => {
    setError(null);
    setBusy("share");
    try {
      const blob = await buildComposite();
      const file = new File([blob], "rakhibox-wrist.png", { type: "image/png" });
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        setError("Sharing images isn't supported on this browser.");
        return;
      }
      await navigator.share({ files: [file], title: "My Rakhi" });
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setError("Couldn't share the image. Try downloading instead.");
      }
    } finally {
      setBusy("");
    }
  }, [buildComposite]);

  return (
    <div className="fixed inset-0 z-50 bg-plum flex flex-col">
      <div className="flex items-center justify-between px-5 pt-safe py-4">
        <p className="text-cream-ink/80 text-sm font-display italic">Wear it for real</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-cream-ink/70 hover:text-cream-ink text-2xl leading-none px-2"
        >
          ×
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-5 pb-safe overflow-y-auto">
        {!photoUrl && (
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <p className="text-cream-ink/70 text-sm leading-relaxed">
              Add a photo of your wrist, then place the charm on it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={pickCamera} className="btn-pill px-8 py-3.5">
                Take a photo
              </button>
              <button
                type="button"
                onClick={pickPhoto}
                className="rounded-full border border-cream-ink/30 text-cream-ink/80 text-sm px-8 py-3.5 hover:bg-cream-ink/10"
              >
                Choose from gallery
              </button>
            </div>
          </div>
        )}

        {photoUrl && (
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <div
              ref={stageRef}
              className="relative w-full rounded-2xl overflow-hidden select-none touch-none bg-black/20"
              style={{ aspectRatio: aspect }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Your wrist" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />

              <div
                onPointerDown={onStickerPointerDown}
                onPointerMove={onStickerPointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
                className="absolute cursor-grab active:cursor-grabbing touch-none"
                style={{
                  left: `${cxFrac * 100}%`,
                  top: `${cyFrac * 100}%`,
                  width: `${sizeFrac * 100}%`,
                  aspectRatio: 1,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {stickerPngUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stickerPngUrl}
                    alt="Your rakhi"
                    draggable={false}
                    className="w-full h-full object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]"
                  />
                ) : (
                  <RakhiSVG
                    style={rakhi.style}
                    threadColor={rakhi.threadColor}
                    beadColor={rakhi.beadColor}
                    charm={rakhi.charm}
                    initial={rakhi.name}
                    className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)] opacity-70"
                  />
                )}
              </div>
            </div>

            <label className="w-full flex items-center gap-3 text-cream-ink/60 text-xs">
              Size
              <input
                type="range"
                min={MIN_SIZE_FRAC}
                max={MAX_SIZE_FRAC}
                step={0.01}
                value={sizeFrac}
                onChange={(e) => setSizeFrac(Number(e.target.value))}
                className="flex-1"
              />
            </label>

            {error && <p className="text-sm text-lacquer-bright text-center">{error}</p>}

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {canShare && (
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={busy !== ""}
                  className="btn-pill flex-1 min-w-[9rem] disabled:opacity-60"
                >
                  {busy === "share" ? "Sharing..." : "Share"}
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                disabled={busy !== ""}
                className="rounded-full border border-cream-ink/30 text-cream-ink/80 text-sm px-6 py-3 hover:bg-cream-ink/10 flex-1 min-w-[9rem] disabled:opacity-60"
              >
                {busy === "download" ? "Saving..." : "Download"}
              </button>
              {canCopy && (
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={busy !== ""}
                  className="rounded-full border border-cream-ink/30 text-cream-ink/80 text-sm px-6 py-3 hover:bg-cream-ink/10 flex-1 min-w-[9rem] disabled:opacity-60"
                >
                  {busy === "copy" ? "Copying..." : "Copy"}
                </button>
              )}
            </div>

            <button type="button" onClick={pickPhoto} className="text-cream-ink/50 text-xs underline underline-offset-2">
              Change photo
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onFileChange}
      />
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={onFileChange}
      />

      {/* Offscreen one-shot 3D capture — produces the real rakhi PNG used as the sticker above. */}
      {capturing3D && (
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, pointerEvents: "none" }}
        >
          <RakhiScene
            style={rakhi.style}
            threadColor={rakhi.threadColor}
            beadColor={rakhi.beadColor}
            charm={rakhi.charm}
            initial={rakhi.name}
            apiRef={sceneApiRef}
            still
          />
        </div>
      )}
    </div>
  );
}
