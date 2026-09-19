import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";
import type { NicheChannel } from "@ytanalytics-pro/shared";

export const dynamic = "force-dynamic";

const TRENDING_QUERIES = [
  "popular",
  "tendência",
  "viral",
  "música",
  "games",
  "tecnologia",
  "entretenimento",
  "vlog",
  "comédia",
  "esporte",
];

const RISING_QUERIES = [
  "crescendo",
  "novo canal",
  "em alta",
  "trending",
  "descubra",
];

const NEW_QUERIES = [
  "iniciante",
  "começando",
  "primeiro vídeo",
  "novo youtuber",
  "tutorial",
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

    const queries =
      type === "trending"
        ? TRENDING_QUERIES
        : type === "rising"
        ? RISING_QUERIES
        : NEW_QUERIES;

    const term = category && category !== "all" ? category : null;
    const searchTerms = term ? [term] : queries.slice(0, 5);

    const seen = new Map<string, NicheChannel>();

    for (const q of searchTerms) {
      try {
        const results = await yt.searchChannels(q, 15);
        for (const c of results) {
          if (!seen.has(c.channelId)) seen.set(c.channelId, c);
        }
      } catch (e) {
        console.error(`Search failed for "${q}":`, e);
      }
    }

    let channels = [...seen.values()];

    channels = channels.filter((c) => {
      if (term && !c.topicCategories.some((cat) => cat.toLowerCase().includes(term.toLowerCase()))) {
        return false;
      }
      if (c.subscriberCount < minSubs || c.subscriberCount > maxSubs) return false;
      return true;
    });

    channels.sort((a, b) => {
      if (sortBy === "viralScore") return (b.viralScore || 0) - (a.viralScore || 0);
      if (sortBy === "growthRate") return (b.growthRate || 0) - (a.growthRate || 0);
      if (sortBy === "subscriberCount") return b.subscriberCount - a.subscriberCount;
      return (b.avgViewsPerVideo || 0) - (a.avgViewsPerVideo || 0);
    });

    return NextResponse.json(channels.slice(0, 30));
  } catch (error) {
    console.error("Niche channels error:", error);
    return NextResponse.json({ error: "Erro ao buscar canais. Tente novamente." }, { status: 500 });
  }
}