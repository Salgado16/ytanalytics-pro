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

    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 });
    }

    const mediaType = type === "video" ? "videos/" : "";
    const url = `https://pixabay.com/api/${mediaType}?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&lang=pt&safesearch=true`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro na API do Pixabay");
    }

    const data = await response.json();
    
    const results = data.hits.map((item: any) => ({
      id: item.id.toString(),
      type: type,
      source: "pixabay",
      sourceId: item.id.toString(),
      url: type === "video" ? item.videos?.large?.url : item.largeImageURL,
      thumbnail: type === "video" ? item.videos?.large?.url : item.webformatURL,
      width: item.imageWidth || item.width,
      height: item.imageHeight || item.height,
      duration: item.duration,
      tags: item.tags.split(", ").slice(0, 10),
      author: item.user,
      authorUrl: item.userImageURL,
      license: "Free for commercial use",
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Pixabay search error:", error);
    return NextResponse.json({ error: "Erro ao buscar no Pixabay" }, { status: 500 });
  }
}