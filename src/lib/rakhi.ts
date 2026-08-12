import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db, isFirebaseConfigured } from "./firebase";
import { saveSong } from "./songStore";
import type { RakhiStyle, Charm } from "@/data/styles";

export type RakhiConfig = {
  id: string;
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  name: string;
  message: string;
  /** Present when a local audio file was attached (audio lives in IndexedDB). */
  songName?: string;
  /** Spotify embed URL when a Spotify link was pasted. */
  spotifyEmbedUrl?: string;
  createdAt?: Timestamp | string;
};

const LOCAL_KEY = "rakhibox:local";
const WRITE_TIMEOUT_MS = 8000;
const EMBED_PREFIX = "v1_";

type Stored = Omit<RakhiConfig, "createdAt">;

/** Compact payload for URL-embedded links (no server DB required). */
type EmbedPayload = {
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

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
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

export function encodeRakhiId(payload: Stored): string {
  const embed: EmbedPayload = {
    s: payload.style,
    t: payload.threadColor,
    b: payload.beadColor,
    c: payload.charm,
    n: payload.name,
    m: payload.message,
    ...(payload.songName ? { sn: payload.songName } : {}),
    ...(payload.spotifyEmbedUrl ? { sp: payload.spotifyEmbedUrl } : {}),
  };
  return EMBED_PREFIX + toBase64Url(JSON.stringify(embed));
}

export function decodeRakhiId(id: string): Stored | null {
  if (!id.startsWith(EMBED_PREFIX)) return null;
  try {
    const raw = JSON.parse(fromBase64Url(id.slice(EMBED_PREFIX.length))) as EmbedPayload;
    if (!raw?.s || !raw?.m || !raw?.t || !raw?.b || !raw?.c) return null;
    return {
      id,
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

async function saveViaApi(payload: Stored): Promise<boolean> {
  try {
    const res = await fetch("/api/rakhi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function loadViaApi(id: string): Promise<Stored | null> {
  try {
    const res = await fetch(`/api/rakhi/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as Stored;
  } catch {
    return null;
  }
}

export type CreateRakhiInput = Omit<RakhiConfig, "id" | "createdAt"> & {
  songDataUrl?: string;
};

export async function createRakhi(data: CreateRakhiInput): Promise<string> {
  const { songDataUrl, ...rest } = data;

  // Without Firebase, embed the config in the link id so it works on Vercel
  // (server filesystem is read-only) and across devices with no database.
  const useEmbed = !isFirebaseConfigured() || !db;
  const id = useEmbed ? encodeRakhiId({ id: "pending", ...rest }) : nanoid(8);

  const payload: Stored = {
    id,
    ...rest,
    ...(songDataUrl && rest.songName ? { songName: rest.songName } : {}),
  };

  // Re-encode with final id for embed path (id already includes payload)
  if (useEmbed) {
    // id already encodes the config; keep song in IndexedDB under this id when present
    if (songDataUrl && rest.songName) {
      await saveSong(id, rest.songName, songDataUrl);
    }
    writeLocal(id, payload);
    // Best-effort server cache (works on local next; no-op / fails quietly on Vercel)
    void saveViaApi(payload);
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

  const fromApi = await loadViaApi(id);
  if (fromApi) return fromApi;

  const local = readLocal()[id];
  return local ?? null;
}

export { isFirebaseConfigured };
