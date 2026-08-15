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
  photoImg,
  stickerImg,
  rect,
  maxDim = 1600,
}: {
  photoImg: HTMLImageElement;
  stickerImg: HTMLImageElement;
  rect: StickerRect;
  maxDim?: number;
}): Promise<Blob> {
  const naturalW = photoImg.naturalWidth;
  const naturalH = photoImg.naturalHeight;
  const scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
  const canvasW = Math.round(naturalW * scale);
  const canvasH = Math.round(naturalH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.drawImage(photoImg, 0, 0, canvasW, canvasH);

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
