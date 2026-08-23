import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db, isFirebaseConfigured } from "./firebase";
import { saveSong } from "./songStore";
import { parseSpotifyLink } from "./spotify";
import type { RakhiStyle, Charm } from "@/data/styles";

export type RakhiConfig = {
  id: string;
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  name: string;
  message: string;
  recipientName?: string;
  recipientType?: "brother" | "sister" | "cousin" | "chosen-sibling";
  senderName?: string;
  source?: string;
  parentRakhiId?: string;
  /** Present when a local audio file was attached (audio lives in IndexedDB). */
  songName?: string;
  /** Spotify embed URL when a Spotify link was pasted. */
  spotifyEmbedUrl?: string;
  /** Sender UPI ID or phone number for shagun. */
  upiId?: string;
  createdAt?: Timestamp | string;
};

const LOCAL_KEY = "rakhibox:local";
const WRITE_TIMEOUT_MS = 8000;
const EMBED_V1 = "v1_";
const EMBED_V2 = "v2_";

const STYLES_ORDER = [
  "traditional",
  "minimal",
  "cute",
  "premium",
  "festive",
  "silk",
  "rudraksha",
  "silver",
  "royal",
] as const;
const CHARMS_ORDER = ["om", "heart", "initial", "gem"] as const;

type Stored = Omit<RakhiConfig, "createdAt">;

/** Legacy v1 JSON blob (kept so old links still open). */
type EmbedPayloadV1 = {
  s: RakhiStyle;
  t: string;
  b: string;
  c: Charm;
  n: string;
  m: string;
  sn?: string;
  sp?: string;
};

function readLocal(): Record<string, Stored> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}") as Record<string, Stored>;
  } catch {
    return {};
  }
}

function writeLocal(id: string, data: Stored) {
  if (typeof window === "undefined") return;
  try {
    const all = readLocal();
    all[id] = data;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn("localStorage write failed:", err);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function toBase64Url(raw: string): string {
  const bytes = new TextEncoder().encode(raw);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(id: string): string {
  const padded = id.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function stripHash(hex: string): string {
  return hex.replace(/^#/, "").toUpperCase();
}

function withHash(hex: string): string {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

/** Compact Spotify: kind letter + 22-char id (e.g. t6Ma6CdqX6tW8Mj1whQdsZS). */
function compactSpotify(embedOrLink: string): string | null {
  const parsed = parseSpotifyLink(embedOrLink);
  if (!parsed) return null;
  return `${parsed.kind[0]}${parsed.id}`;
}

function expandSpotify(compact: string): string | null {
  const kindMap: Record<string, string> = {
    t: "track",
    a: "album",
    p: "playlist",
    e: "episode",
    s: "show",
  };
  const kind = kindMap[compact[0]];
  const id = compact.slice(1);
  if (!kind || !/^[a-zA-Z0-9]{22}$/.test(id)) return null;
  return `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator&theme=0`;
}

/**
 * Compact v2: legacy fields followed by optional recipient and attribution fields.
 * Spotify is track-id only (not full embed URL) — that was most of the old length.
 */
export function encodeRakhiId(payload: Stored): string {
  const sIdx = Math.max(0, STYLES_ORDER.indexOf(payload.style as (typeof STYLES_ORDER)[number]));
  const cIdx = Math.max(0, CHARMS_ORDER.indexOf(payload.charm as (typeof CHARMS_ORDER)[number]));
  const spotify = payload.spotifyEmbedUrl ? compactSpotify(payload.spotifyEmbedUrl) ?? "" : "";
  const parts = [
    String(sIdx),
    stripHash(payload.threadColor),
    stripHash(payload.beadColor),
    String(cIdx),
    payload.name || "",
    payload.message,
    spotify,
    payload.songName ? "1" : "",
    payload.upiId ?? "",
    payload.recipientName ?? "",
    payload.recipientType ?? "",
    payload.senderName ?? "",
    payload.source ?? "",
    payload.parentRakhiId ?? "",
  ];
  while (parts.length > 6 && parts[parts.length - 1] === "") parts.pop();
  return EMBED_V2 + toBase64Url(parts.join("\u001f"));
}

function decodeV2(body: string): Stored | null {
  try {
    const parts = fromBase64Url(body).split("\u001f");
    if (parts.length < 6) return null;
    const [sRaw, t, b, cRaw, n, m, sp = "", sn = "", upi = "", recipientName = "", recipientType = "", senderName = "", source = "", parentRakhiId = ""] = parts;
    const sIdx = Number(sRaw);
    const cIdx = Number(cRaw);
    if (!Number.isInteger(sIdx) || sIdx < 0 || sIdx >= STYLES_ORDER.length) return null;
    if (!Number.isInteger(cIdx) || cIdx < 0 || cIdx >= CHARMS_ORDER.length) return null;
    if (!t || !b || !m) return null;
    const spotifyEmbedUrl = sp ? expandSpotify(sp) : null;
    const id = EMBED_V2 + body;
    return {
      id,
      style: STYLES_ORDER[sIdx],
      threadColor: withHash(t),
      beadColor: withHash(b),
      charm: CHARMS_ORDER[cIdx],
      name: n ?? "",
      message: m,
      ...(sn === "1" ? { songName: "song" } : {}),
      ...(spotifyEmbedUrl ? { spotifyEmbedUrl } : {}),
      ...(upi ? { upiId: upi } : {}),
      ...(recipientName ? { recipientName } : {}),
      ...(["brother", "sister", "cousin", "chosen-sibling"].includes(recipientType)
        ? { recipientType: recipientType as RakhiConfig["recipientType"] }
        : {}),
      ...(senderName ? { senderName } : {}),
      ...(source ? { source } : {}),
      ...(parentRakhiId ? { parentRakhiId } : {}),
    };
  } catch {
    return null;
  }
}

function decodeV1(body: string): Stored | null {
  try {
    const raw = JSON.parse(fromBase64Url(body)) as EmbedPayloadV1;
    if (!raw?.s || !raw?.m || !raw?.t || !raw?.b || !raw?.c) return null;
    return {
      id: EMBED_V1 + body,
      style: raw.s,
      threadColor: raw.t,
      beadColor: raw.b,
      charm: raw.c,
      name: raw.n ?? "",
      message: raw.m,
      ...(raw.sn ? { songName: raw.sn } : {}),
      ...(raw.sp ? { spotifyEmbedUrl: raw.sp } : {}),
    };
  } catch {
    return null;
  }
}

export function decodeRakhiId(id: string): Stored | null {
  if (id.startsWith(EMBED_V2)) return decodeV2(id.slice(EMBED_V2.length));
  if (id.startsWith(EMBED_V1)) return decodeV1(id.slice(EMBED_V1.length));
  return null;
}

export type CreateRakhiInput = Omit<RakhiConfig, "id" | "createdAt"> & {
  songDataUrl?: string;
};

export async function createRakhi(data: CreateRakhiInput): Promise<string> {
  const { songDataUrl, ...rest } = data;

  const useEmbed = !isFirebaseConfigured() || !db;
  const id = useEmbed ? encodeRakhiId({ id: "pending", ...rest }) : nanoid(8);

  const payload: Stored = {
    id,
    ...rest,
    ...(songDataUrl && rest.songName ? { songName: rest.songName } : {}),
  };

  if (useEmbed) {
    if (songDataUrl && rest.songName) {
      await saveSong(id, rest.songName, songDataUrl);
    }
    writeLocal(id, payload);
    return id;
  }

  if (songDataUrl && rest.songName) {
    await saveSong(id, rest.songName, songDataUrl);
  }

  try {
    const { songName, ...firestoreFields } = payload;
    await withTimeout(
      setDoc(doc(db!, "rakhis", id), {
        ...firestoreFields,
        ...(songName ? { songName } : {}),
        createdAt: serverTimestamp(),
      }),
      WRITE_TIMEOUT_MS,
      "Firebase write"
    );
    writeLocal(id, payload);
    return id;
  } catch (err) {
    console.warn("Firebase create failed, embedding in link:", err);
    const embedId = encodeRakhiId(payload);
    const embedded: Stored = { ...payload, id: embedId };
    if (songDataUrl && rest.songName) {
      await saveSong(embedId, rest.songName, songDataUrl);
    }
    writeLocal(embedId, embedded);
    return embedId;
  }
}

export async function getRakhi(id: string): Promise<RakhiConfig | null> {
  const embedded = decodeRakhiId(id);
  if (embedded) return embedded;

  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDoc(doc(db, "rakhis", id)), WRITE_TIMEOUT_MS, "Firebase read");
      if (snap.exists()) {
        return { id: snap.id, ...(snap.data() as Omit<RakhiConfig, "id">) };
      }
    } catch (err) {
      console.warn("Firebase read failed, trying local:", err);
    }
  }

  const local = readLocal()[id];
  return local ?? null;
}

export { isFirebaseConfigured };
