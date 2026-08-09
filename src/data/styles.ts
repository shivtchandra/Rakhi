export type RakhiStyle = "traditional" | "minimal" | "cute" | "premium";
export type Charm = "om" | "heart" | "initial" | "gem";

export const STYLES: { id: RakhiStyle; label: string; blurb: string }[] = [
  { id: "traditional", label: "Traditional Thread", blurb: "Classic woven look" },
  { id: "minimal", label: "Minimal Modern", blurb: "Clean, single-line" },
  { id: "cute", label: "Cute & Fun", blurb: "Playful, rounded beads" },
  { id: "premium", label: "Premium Gold", blurb: "Metallic shine accent" },
];

export const CHARMS: { id: Charm; label: string }[] = [
  { id: "om", label: "Om" },
  { id: "heart", label: "Heart" },
  { id: "initial", label: "Initial" },
  { id: "gem", label: "Gem" },
];

export const DEFAULT_THREAD_COLOR = "#C0392B";
export const DEFAULT_BEAD_COLOR = "#F4C430";

export const THREAD_SWATCHES = ["#C0392B", "#E67E22", "#EC6F9E", "#9B59B6", "#3B7DD8", "#7BA05B"];
export const BEAD_SWATCHES = ["#F4C430", "#E5E5E5", "#E8B4A0", "#2E7D5B", "#D9A7E0"];
