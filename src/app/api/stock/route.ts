import { NextResponse } from "next/server";

import { readStore } from "@/lib/store/db";

export const dynamic = "force-dynamic";

/** Stock por talla, para marcar agotadas en la ficha de producto. */
export async function GET() {
  const { inventory, settings } = await readStore();
  return NextResponse.json(
    { inventory, checkoutEnabled: settings.checkoutEnabled },
    { headers: { "Cache-Control": "no-store" } },
  );
}
