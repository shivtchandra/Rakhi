import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), ".data", "rakhis");

export type LocalRakhiRecord = {
  id: string;
  style: string;
  threadColor: string;
  beadColor: string;
  charm: string;
  name: string;
  message: string;
  songName?: string;
  spotifyEmbedUrl?: string;
  createdAt: string;
};

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true });
}

export async function saveLocalRakhi(record: LocalRakhiRecord): Promise<void> {
  await ensureDir();
  const file = path.join(DIR, `${record.id}.json`);
  await fs.writeFile(file, JSON.stringify(record), "utf8");
}

export async function loadLocalRakhi(id: string): Promise<LocalRakhiRecord | null> {
  try {
    const file = path.join(DIR, `${id}.json`);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as LocalRakhiRecord;
  } catch {
    return null;
  }
}
