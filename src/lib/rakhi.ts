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

type Stored = Omit<RakhiConfig, "createdAt">;

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

async function saveViaApi(payload: Stored): Promise<void> {
  const res = await fetch("/api/rakhi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Local API save failed (${res.status}): ${text}`);
  }
}

async function loadViaApi(id: string): Promise<Stored | null> {
  const res = await fetch(`/api/rakhi/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Local API read failed (${res.status})`);
  return (await res.json()) as Stored;
}

export type CreateRakhiInput = Omit<RakhiConfig, "id" | "createdAt"> & {
  songDataUrl?: string;
};

export async function createRakhi(data: CreateRakhiInput): Promise<string> {
  const id = nanoid(8);
  const { songDataUrl, ...rest } = data;
  const payload: Stored = {
    id,
    ...rest,
    ...(songDataUrl && rest.songName ? { songName: rest.songName } : {}),
  };

  if (songDataUrl && rest.songName) {
    await saveSong(id, rest.songName, songDataUrl);
  }

  // No Firebase → persist on the Next server so links work across devices on this host.
  if (!isFirebaseConfigured() || !db) {
    await saveViaApi(payload);
    writeLocal(id, payload);
    return id;
  }

  try {
    const { songName, ...firestoreFields } = payload;
    await withTimeout(
      setDoc(doc(db, "rakhis", id), {
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
    console.warn("Firebase create failed, falling back to local API:", err);
    await saveViaApi(payload);
    writeLocal(id, payload);
    return id;
  }
}

export async function getRakhi(id: string): Promise<RakhiConfig | null> {
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

  try {
    const fromApi = await loadViaApi(id);
    if (fromApi) return fromApi;
  } catch (err) {
    console.warn("Local API read failed:", err);
  }

  const local = readLocal()[id];
  return local ?? null;
}

export { isFirebaseConfigured };
