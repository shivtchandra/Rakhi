import { NextResponse } from "next/server";
import { saveLocalRakhi, type LocalRakhiRecord } from "@/lib/localRakhiStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LocalRakhiRecord;
    if (!body?.id || !body?.message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const record: LocalRakhiRecord = {
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
    };
    await saveLocalRakhi(record);
    return NextResponse.json({ id: record.id });
  } catch (err) {
    console.error("POST /api/rakhi failed", err);
    return NextResponse.json({ error: "Could not save rakhi" }, { status: 500 });
  }
}
