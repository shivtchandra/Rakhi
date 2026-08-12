export const DEV_FONT = "/fonts/NotoSansDevanagari-Regular.ttf";
export const GOLD = "#D9A93E";
export const GOLD_DARK = "#8a6416";
export const SILVER = "#D1D5DB";
export const SILVER_DARK = "#4B5563";
export const BRONZE = "#CD7F32";
export const BRONZE_DARK = "#7C2D12";
export const PEARL = "#F3ECDD";

export type ThreadType = "silk" | "cotton";

export type StyleParams = {
  petals: number;
  stones: number;
  beads: number;
  goldRim: boolean;
  fieldR: number;
  beadR: number;
  metal: number;
  threadType: ThreadType;
};

export function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const t = amt < 0 ? 0 : 255;
    return Math.round((t - v) * Math.abs(amt) + v);
  });
  return "#" + ch.map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function threadMaterial(type: ThreadType) {
  return type === "silk"
    ? { roughness: 0.55, metalness: 0.08 }
    : { roughness: 0.9, metalness: 0 };
}
