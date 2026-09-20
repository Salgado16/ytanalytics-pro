import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const yt = createPublicYouTubeClient();
    const results = await yt.searchChannels(query, 20);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Niche search error:", error?.response?.data || error?.message || error);
    const msg = error?.response?.data?.error?.message || error?.message || "Erro na busca";
    return NextResponse.json({ error: msg, details: error?.response?.data?.error }, { status: 500 });
  }
}