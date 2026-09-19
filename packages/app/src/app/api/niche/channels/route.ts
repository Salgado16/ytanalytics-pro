import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "trending";
    const category = searchParams.get("category") || "";
    const country = searchParams.get("country") || "BR";
    const minSubs = parseInt(searchParams.get("minSubscribers") || "0");
    const maxSubs = parseInt(searchParams.get("maxSubscribers") || "10000000");
    const sortBy = searchParams.get("sortBy") || "viralScore";

    // In production, this would query a cached database of channels
    // For now, return mock data based on type
    const mockChannels = generateMockChannels(type, country, minSubs, maxSubs);
    
    // Apply filters
    let filtered = mockChannels.filter(c => {
      if (category && !c.topicCategories.includes(category)) return false;
      if (c.subscriberCount < minSubs || c.subscriberCount > maxSubs) return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "viralScore") return b.viralScore - a.viralScore;
      if (sortBy === "growthRate") return b.growthRate - a.growthRate;
      if (sortBy === "subscriberCount") return b.subscriberCount - a.subscriberCount;
      return b.avgViewsPerVideo - a.avgViewsPerVideo;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Niche channels error:", error);
    return NextResponse.json({ error: "Erro ao buscar canais" }, { status: 500 });
  }
}

function generateMockChannels(type: string, country: string, minSubs: number, maxSubs: number) {
  const categories = [
    "Tecnologia", "Games", "Educação", "Entretenimento", "Vlog", "Beleza", 
    "Fitness", "Culinária", "Finanças", "Música", "Comédia", "Ciência"
  ];

  const channels = [];
  const count = type === "trending" ? 20 : type === "rising" ? 15 : 10;

  for (let i = 0; i < count; i++) {
    const subCount = Math.floor(Math.random() * (maxSubs - minSubs) + minSubs);
    const viewCount = subCount * Math.floor(Math.random() * 50 + 10);
    const videoCount = Math.floor(Math.random() * 500 + 10);
    const topicCategories = categories.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3 + 1));
    
    const growthRate = type === "rising" 
      ? Math.random() * 100 + 50 
      : type === "trending" 
        ? Math.random() * 50 + 20 
        : Math.random() * 30;

    channels.push({
      channelId: `UC${Math.random().toString(36).substr(2, 22)}`,
      title: `Canal ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      description: `Descrição do canal ${type} sobre ${topicCategories.join(", ")}`,
      subscriberCount: subCount,
      viewCount,
      videoCount,
      country,
      topicCategories,
      growthRate,
      viralScore: Math.random() * 1000,
      avgViewsPerVideo: viewCount / videoCount,
      uploadFrequency: Math.random() * 5 + 1,
      lastUploadAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      thumbnails: {
        default: { url: `https://picsum.photos/80/80?random=${i + 100}` },
        medium: { url: `https://picsum.photos/240/240?random=${i + 100}` },
        high: { url: `https://picsum.photos/800/800?random=${i + 100}` },
      },
    });
  }

  return channels;
}