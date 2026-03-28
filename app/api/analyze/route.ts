import { NextRequest, NextResponse } from "next/server";
import { analyzeWasteImage } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "No imageUrl provided" }, { status: 400 });
    }

    const analysis = await analyzeWasteImage(imageUrl);
    return NextResponse.json(analysis);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
