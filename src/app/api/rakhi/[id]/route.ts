import { NextResponse } from "next/server";
import { loadLocalRakhi } from "@/lib/localRakhiStore";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const record = await loadLocalRakhi(id);
    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (err) {
    console.error("GET /api/rakhi/[id] failed", err);
    return NextResponse.json({ error: "Could not load rakhi" }, { status: 500 });
  }
}
