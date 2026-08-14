import { NextResponse } from "next/server";
import { getCountFromServer, collection } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const revalidate = 300; // cache 5 minutes

export async function GET() {
  let count = 0;

  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getCountFromServer(collection(db, "rakhis"));
      count = snap.data().count;
    } catch (err) {
      console.warn("Firebase count failed:", err);
    }
  }

  // Fall back to local .data files if Firebase returned nothing
  if (count === 0) {
    try {
      const dir = path.join(process.cwd(), ".data", "rakhis");
      const files = await fs.readdir(dir);
      count = files.filter((f) => f.endsWith(".json")).length;
    } catch {
      count = 0;
    }
  }

  return NextResponse.json({ count }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
