import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";
import type { NicheChannel } from "@ytanalytics-pro/shared";

export const dynamic = "force-dynamic";

const FALLBACK_SEARCH_RESULTS: NicheChannel[] = [
  {
    channelId: "UCMiJRAwDNSNzuYeN2uWa0pA",
    title: "Mrwhosetheboss",
    description: "Let's become the Greatest Tech Community on the Planet",
    subscriberCount: 22900000,
    viewCount: 9109582574,
    videoCount: 1934,
    country: "GB",
    topicCategories: ["Technology", "Lifestyle"],
    growthRate: 1000,
    viralScore: 1000,
    avgViewsPerVideo: 4710228,
    uploadFrequency: 3,
    lastUploadAt: "2011-04-20T12:10:24Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/ytc/AIdro_lruRqXcu0HALPqtLYA2bOuxiPWRgD6Gn389lG5BgVN2fw=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/ytc/AIdro_lruRqXcu0HALPqtLYA2bOuxiPWRgD6Gn389lG5BgVN2fw=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/ytc/AIdro_lruRqXcu0HALPqtLYA2bOuxiPWRgD6Gn389lG5BgVN2fw=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCEPL07qzVsOcHd3sMUws65g",
    title: "Trakin Tech",
    description: "Daily videos on Smartphone & Gadget Reviews, Unboxing videos, breaking Tech Stories and Tech News",
    subscriberCount: 15500000,
    viewCount: 3340165686,
    videoCount: 4626,
    country: "IN",
    topicCategories: ["Technology", "Lifestyle"],
    growthRate: 1000,
    viralScore: 288.9,
    avgViewsPerVideo: 722041,
    uploadFrequency: 3,
    lastUploadAt: "2011-11-02T02:58:54Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/CoxkM-bkUecdch2e4R7gaa5gyMAqrhKrYqyjTL0_kkJ1lUb44-cNA5tAOYKX1jAk1OVEU1qO6g=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/CoxkM-bkUecdch2e4R7gaa5gyMAqrhKrYqyjTL0_kkJ1lUb44-cNA5tAOYKX1jAk1OVEU1qO6g=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/CoxkM-bkUecdch2e4R7gaa5gyMAqrhKrYqyjTL0_kkJ1lUb44-cNA5tAOYKX1jAk1OVEU1qO6g=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCEPL07qzVsOcHd3sMUws65g",
    title: "Trakin Tech",
    description: "Daily videos on Smartphone & Gadget Reviews, Unboxing videos, breaking Tech Stories and Tech News",
    subscriberCount: 15500000,
    viewCount: 3340165686,
    videoCount: 4626,
    country: "IN",
    topicCategories: ["Technology", "Lifestyle"],
    growthRate: 1000,
    viralScore: 288.9,
    avgViewsPerVideo: 722041,
    uploadFrequency: 3,
    lastUploadAt: "2011-11-02T02:58:54Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/CoxkM-bkUecdch2e4R7gaa5gyMAqrhKrYqyjTL0_kkJ1lUb44-cNA5tAOYKX1jAk1OVEU1qO6g=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/CoxkM-bkUecdch2e4R7gaa5gyMAqrhKrYqyjTL0_kkJ1lUb44-cNA5tAOYKX1jAk1OVEU1qO6g=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/CoxkM-bkUecdch2e4R7gaa5gyMAqrhKrYqyjTL0_kkJ1lUb44-cNA5tAOYKX1jAk1OVEU1qO6g=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCXuqSBlHAE6Xw-yeJA0Tunw",
    title: "Linus Tech Tips",
    description: "Linus Tech Tips is a passionate team of professionally curious experts in consumer technology",
    subscriberCount: 16900000,
    viewCount: 9837995651,
    videoCount: 7928,
    country: "CA",
    topicCategories: ["Technology", "Lifestyle"],
    growthRate: 1000,
    viralScore: 496.7,
    avgViewsPerVideo: 1240917,
    uploadFrequency: 3,
    lastUploadAt: "2008-11-25T00:46:52Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/gnvYLhXy8FAlPXZ2RTrkrgj-5kyt0vdE2FUGVOiKGdEZIa-wN5A-7nwZBlWJLzUMmoh1NWAU=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/gnvYLhXy8FAlPXZ2RTrkrgj-5kyt0vdE2FUGVOiKGdEZIa-wN5A-7nwZBlWJLzUMmoh1NWAU=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/gnvYLhXy8FAlPXZ2RTrkrgj-5kyt0vdE2FUGVOiKGdEZIa-wN5A-7nwZBlWJLzUMmoh1NWAU=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCqg4qrLaf7VQ_QJw_RLCs1Q",
    title: "Brancoala Games",
    description: "Canal Brancoala Games, vídeos dos melhores jogos do Roblox",
    subscriberCount: 2520000,
    viewCount: 1049808938,
    videoCount: 1069,
    country: "BR",
    topicCategories: ["Games", "Action", "Adventure"],
    growthRate: 1000,
    viralScore: 393.0,
    avgViewsPerVideo: 982047,
    uploadFrequency: 3,
    lastUploadAt: "2020-07-08T11:56:32Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/o-voet-3gPw8dZL9KMZmXi1MgG27O-Nhcj-XcHSgKrb64vURv04rGa69QxVhAc8Z9JJJCfHz=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/o-voet-3gPw8dZL9KMZmXi1MgG27O-Nhcj-XcHSgKrb64vURv04rGa69QxVhAc8Z9JJJCfHz=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/o-voet-3gPw8dZL9KMZmXi1MgG27O-Nhcj-XcHSgKrb64vURv04rGa69QxVhAc8Z9JJJCfHz=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCDVS7-YYxiQ62r46KXmp-kw",
    title: "Luluca Games",
    description: "Olá! Eu sou a Luíza, mas todos me chamam de Luluca. Adoro jogos e adoro gravar vídeos",
    subscriberCount: 6130000,
    viewCount: 2286118215,
    videoCount: 1474,
    country: "BR",
    topicCategories: ["Games", "Simulation", "Adventure"],
    growthRate: 1000,
    viralScore: 620.6,
    avgViewsPerVideo: 1550962,
    uploadFrequency: 3,
    lastUploadAt: "2016-06-15T21:56:09Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/oEGUufypEaZSR5g-e6bNOdk95qD-zJvj7hNZst95O1Fkq7ySdAKRgkFS5SeU-ws6filYseup=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/oEGUufypEaZSR5g-e6bNOdk95qD-zJvj7hNZst95O1Fkq7ySdAKRgkFS5SeU-ws6filYseup=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/oEGUufypEaZSR5g-e6bNOdk95qD-zJvj7hNZst95O1Fkq7ySdAKRgkFS5SeU-ws6filYseup=s800-c-k-c0x00ffffff-no-rj" } },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const yt = createPublicYouTubeClient();

    try {
      const results = await yt.searchChannels(query, 20);
      return NextResponse.json(results);
    } catch (e: any) {
      const isQuotaExceeded = e?.response?.data?.error?.code === 429 || e?.message?.includes("quota");
      if (isQuotaExceeded) {
        console.warn(`Quota exceeded for search "${query}", using fallback`);
        return NextResponse.json(FALLBACK_SEARCH_RESULTS.slice(0, 10));
      }
      throw e;
    }
  } catch (error: any) {
    console.error("Niche search error:", error?.response?.data || error?.message || error);
    const msg = error?.response?.data?.error?.message || error?.message || "Erro na busca";
    return NextResponse.json({ error: msg, details: error?.response?.data?.error }, { status: 500 });
  }
}