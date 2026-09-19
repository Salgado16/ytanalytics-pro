import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";
import type { NicheChannel } from "@ytanalytics-pro/shared";

export const dynamic = "force-dynamic";

const SEARCH_POOL = [
  "tutorial",
  "vlog",
  "games",
  "música",
  "comédia",
  "tecnologia",
  "finanças",
  "culinária",
  "fitness",
  "educação",
  "ciência",
  "esporte",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "trending";
    const category = searchParams.get("category") || "";
    const country = searchParams.get("country") || "BR";
    const minSubs = parseInt(searchParams.get("minSubscribers") || "0");
    const maxSubs = parseInt(searchParams.get("maxSubscribers") || "10000000");
    const sortBy = searchParams.get("sortBy") || "viralScore";

    const yt = createPublicYouTubeClient();

    let channels: NicheChannel[] = [];

    if (type === "trending") {
      channels = await yt.getTrendingChannels(country, 30);
    } else if (type === "rising") {
      const trending = await yt.getTrendingChannels(country, 30);
      channels = trendedToRising(trending);
    } else {
      const seen = new Map<string, NicheChannel>();
      const term = category && category !== "all" ? category : null;
      const terms = term ? [term] : SEARCH_POOL.slice(0, 6);
      for (const t of terms) {
        try {
          const results = await yt.searchChannels(t, 15);
          for (const c of results) {
            if (!seen.has(c.channelId)) seen.set(c.channelId, c);
          }
        } catch (e) {
          console.error(`Search failed for "${t}":`, e);
        }
      }
      channels = [...seen.values()];
    }

    let filtered = channels.filter((c) => {
      if (category && category !== "all" && !c.topicCategories.some((cat) => cat.toLowerCase().includes(category.toLowerCase()))) {
        return false;
      }
      if (c.subscriberCount < minSubs || c.subscriberCount > maxSubs) return false;
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "viralScore") return (b.viralScore || 0) - (a.viralScore || 0);
      if (sortBy === "growthRate") return (b.growthRate || 0) - (a.growthRate || 0);
      if (sortBy === "subscriberCount") return b.subscriberCount - a.subscriberCount;
      return (b.avgViewsPerVideo || 0) - (a.avgViewsPerVideo || 0);
    });

    return NextResponse.json(filtered.slice(0, 30));
  } catch (error) {
    console.error("Niche channels error:", error);
    return NextResponse.json({ error: "Erro ao buscar canais. Tente novamente." }, { status: 500 });
  }
}

function trendedToRising(channels: NicheChannel[]): NicheChannel[] {
  return [...channels].map((c) => ({
    ...c,
    growthRate:
      c.subscriberCount > 0 && c.videoCount > 0
        ? Math.min((c.avgViewsPerVideo / Math.max(c.subscriberCount / c.videoCount, 1)) * 10, 1000)
        : 0,
  }));
}