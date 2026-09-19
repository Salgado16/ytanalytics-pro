import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "image";
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "20";

    if (!query) {
      return NextResponse.json({ error: "Query obrigatória" }, { status: 400 });
    }

    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 });
    }

    const endpoint = type === "video" ? "videos/search" : "search";
    const url = `https://api.pexels.com/${endpoint}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      throw new Error("Erro na API do Pexels");
    }

    const data = await response.json();
    
    const results = data.photos || data.videos || [];
    const formatted = results.map((item: any) => ({
      id: item.id.toString(),
      type: type,
      source: "pexels",
      sourceId: item.id.toString(),
      url: type === "video" ? item.video_files?.[0]?.link : item.src?.original,
      thumbnail: type === "video" ? item.image : item.src?.medium,
      width: item.width,
      height: item.height,
      duration: item.duration,
      tags: [], // Pexels doesn't provide tags directly
      author: item.photographer || item.user?.name,
      authorUrl: item.photographer_url || item.user?.url,
      license: "Free for commercial use",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Pexels search error:", error);
    return NextResponse.json({ error: "Erro ao buscar no Pexels" }, { status: 500 });
  }
}