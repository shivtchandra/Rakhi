import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "./firebase";
import type { RakhiStyle, Charm } from "@/data/styles";

export type RakhiConfig = {
  id: string;
  style: RakhiStyle;
  threadColor: string;
  beadColor: string;
  charm: Charm;
  name: string;
  message: string;
  createdAt?: Timestamp;
};

export async function createRakhi(
  data: Omit<RakhiConfig, "id" | "createdAt">
): Promise<string> {
  const id = nanoid(8);
  await setDoc(doc(db, "rakhis", id), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return id;
}

export async function getRakhi(id: string): Promise<RakhiConfig | null> {
  const snap = await getDoc(doc(db, "rakhis", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<RakhiConfig, "id">) };
}
