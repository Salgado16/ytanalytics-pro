import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "BR";
    const limit = parseInt(searchParams.get("limit") || "50");

    const yt = createPublicYouTubeClient();
    const videos = await yt.getViralVideos(country, Math.min(limit, 50));
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Viral videos error:", error);
    return NextResponse.json({ error: "Erro ao buscar vídeos virais" }, { status: 500 });
  }
}