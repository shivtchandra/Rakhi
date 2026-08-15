export type LoadedImage = {
  img: HTMLImageElement;
  revoke: () => void;
};

export async function loadImageFromFile(file: File): Promise<LoadedImage> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  await img.decode();
  return { img, revoke: () => URL.revokeObjectURL(url) };
}

export type PhotoSource = {
  draw: CanvasImageSource;
  width: number;
  height: number;
  revoke: () => void;
};

/**
 * Loads a photo with EXIF orientation baked in, matching how <img> displays it.
 * Canvas drawImage ignores EXIF orientation by default, which otherwise makes
 * exported composites rotated/mis-sized relative to the on-screen preview.
 */
export async function loadPhotoOriented(file: File): Promise<PhotoSource> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { draw: bitmap, width: bitmap.width, height: bitmap.height, revoke: () => bitmap.close() };
    } catch {
      // fall through to <img> path below
    }
  }
  const loaded = await loadImageFromFile(file);
  return {
    draw: loaded.img,
    width: loaded.img.naturalWidth,
    height: loaded.img.naturalHeight,
    revoke: loaded.revoke,
  };
}

export async function svgToImage(svg: SVGSVGElement): Promise<LoadedImage> {
  const serialized = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([serialized], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  await img.decode();
  return { img, revoke: () => URL.revokeObjectURL(url) };
}

export async function blobToImage(blob: Blob): Promise<LoadedImage> {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  await img.decode();
  return { img, revoke: () => URL.revokeObjectURL(url) };
}

export type StickerRect = {
  /** Sticker center and size, in fractions (0-1) of the photo's width/height. */
  cxFrac: number;
  cyFrac: number;
  widthFrac: number;
  /** Rotation in degrees, applied around the sticker's own center. */
  rotationDeg?: number;
};

export async function compositeToBlob({
  photo,
  stickerImg,
  rect,
  maxDim = 1600,
}: {
  photo: PhotoSource;
  stickerImg: HTMLImageElement;
  rect: StickerRect;
  maxDim?: number;
}): Promise<Blob> {
  const naturalW = photo.width;
  const naturalH = photo.height;
  const scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
  const canvasW = Math.round(naturalW * scale);
  const canvasH = Math.round(naturalH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.drawImage(photo.draw, 0, 0, canvasW, canvasH);

  const stickerW = rect.widthFrac * canvasW;
  const stickerH = stickerW * (stickerImg.naturalHeight / stickerImg.naturalWidth);
  const stickerCx = rect.cxFrac * canvasW;
  const stickerCy = rect.cyFrac * canvasH;

  ctx.save();
  ctx.translate(stickerCx, stickerCy);
  if (rect.rotationDeg) ctx.rotate((rect.rotationDeg * Math.PI) / 180);
  ctx.drawImage(stickerImg, -stickerW / 2, -stickerH / 2, stickerW, stickerH);
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not export image"));
    }, "image/png");
  });
}
