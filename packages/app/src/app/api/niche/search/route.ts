import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    // In production, this would search a database or call YouTube API
    // For now, return mock results
    const results = generateSearchResults(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Niche search error:", error);
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}

function generateSearchResults(query: string) {
  const results = [];
  const count = Math.floor(Math.random() * 10 + 5);
  
  for (let i = 0; i < count; i++) {
    const subCount = Math.floor(Math.random() * 1000000 + 10000);
    const viewCount = subCount * Math.floor(Math.random() * 30 + 5);
    const videoCount = Math.floor(Math.random() * 300 + 20);
    
    results.push({
      channelId: `UC${Math.random().toString(36).substr(2, 22)}`,
      title: `${query} ${["Brasil", "Oficial", "Canal", "TV", "Pro", "Expert"][Math.floor(Math.random() * 6)]} ${i + 1}`,
      description: `Canal sobre ${query} com dicas, tutoriais e análises completas`,
      subscriberCount: subCount,
      viewCount,
      videoCount,
      country: "BR",
      topicCategories: [query, "Tutorial", "Análise"],
      growthRate: Math.random() * 80 + 10,
      viralScore: Math.random() * 800 + 100,
      avgViewsPerVideo: viewCount / videoCount,
      uploadFrequency: Math.random() * 4 + 1,
      lastUploadAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      thumbnails: {
        default: { url: `https://picsum.photos/80/80?random=${i + 300}` },
        medium: { url: `https://picsum.photos/240/240?random=${i + 300}` },
        high: { url: `https://picsum.photos/800/800?random=${i + 300}` },
      },
    });
  }

  return results;
}