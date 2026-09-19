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
  } catch (error) {
    console.error("Niche search error:", error);
    return NextResponse.json({ error: "Erro na busca. Tente novamente." }, { status: 500 });
  }
}