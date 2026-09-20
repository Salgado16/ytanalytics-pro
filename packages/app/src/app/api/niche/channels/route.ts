import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";
import type { NicheChannel } from "@ytanalytics-pro/shared";

export const dynamic = "force-dynamic";

const TRENDING_QUERIES = [
  "popular", "tendência", "viral", "música", "games", "tecnologia", "entretenimento", "vlog", "comédia", "esporte",
];

const RISING_QUERIES = [
  "crescendo", "novo canal", "em alta", "trending", "descubra",
];

const NEW_QUERIES = [
  "iniciante", "começando", "primeiro vídeo", "novo youtuber", "tutorial",
];

const FALLBACK_CHANNELS: NicheChannel[] = [
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
    channelId: "UCwVQIkAtyZzQSA-OY1rsGig",
    title: "Chill Music Lab",
    description: "Choose the soundtrack for your most productive self",
    subscriberCount: 1310000,
    viewCount: 221873370,
    videoCount: 335,
    country: "US",
    topicCategories: ["Music", "Electronic"],
    growthRate: 1000,
    viralScore: 265.0,
    avgViewsPerVideo: 662308,
    uploadFrequency: 3,
    lastUploadAt: "2019-07-05T21:39:11Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/9LeiGd-HuRoT2JAYw40zA_Fm6EJ4E5Kp7UNHuozdtVN4gtu6Ht4KcKAUMebLyDoHUGTdL0okeA=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/9LeiGd-HuRoT2JAYw40zA_Fm6EJ4E5Kp7UNHuozdtVN4gtu6Ht4KcKAUMebLyDoHUGTdL0okeA=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/9LeiGd-HuRoT2JAYw40zA_Fm6EJ4E5Kp7UNHuozdtVN4gtu6Ht4KcKAUMebLyDoHUGTdL0okeA=s800-c-k-c0x00ffffff-no-rj" } },
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
  {
    channelId: "UCPG7VLW5ERyzfvcxglNKLEQ",
    title: "Titi Games",
    description: "Hi, Im Titi! Welcome to my gaming channel! Where I will be doing Roblox Adventures",
    subscriberCount: 1130000,
    viewCount: 435997226,
    videoCount: 387,
    country: "US",
    topicCategories: ["Games", "Simulation", "Roleplay"],
    growthRate: 1000,
    viralScore: 450.8,
    avgViewsPerVideo: 1126607,
    uploadFrequency: 3,
    lastUploadAt: "2017-08-13T03:07:08Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/ytc/AIdro_mMZN4dMDADIK-xwCAI6f5jjh6Q4-Lmoc4Lfq5mj7spK5I=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/ytc/AIdro_mMZN4dMDADIK-xwCAI6f5jjh6Q4-Lmoc4Lfq5mj7spK5I=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/ytc/AIdro_mMZN4dMDADIK-xwCAI6f5jjh6Q4-Lmoc4Lfq5mj7spK5I=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCGu9-9FqQtXAitxkOnHzz6Q",
    title: "King Games",
    description: "We are very glad that you come to our channel King Games, watch the video and subscribe!",
    subscriberCount: 5750000,
    viewCount: 5195988663,
    videoCount: 6651,
    country: "US",
    topicCategories: ["Games", "Racing", "Simulation"],
    growthRate: 1000,
    viralScore: 313.0,
    avgViewsPerVideo: 781234,
    uploadFrequency: 3,
    lastUploadAt: "2015-02-20T00:24:05Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/Gte3frMn1Wy7DBYNXFj5PCWXTsVFZojC3NnXm5Ogx-WrEces8XEzPsHk6M2KcL1wokSJqXyvFw=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/Gte3frMn1Wy7DBYNXFj5PCWXTsVFZojC3NnXm5Ogx-WrEces8XEzPsHk6M2KcL1wokSJqXyvFw=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/Gte3frMn1Wy7DBYNXFj5PCWXTsVFZojC3NnXm5Ogx-WrEces8XEzPsHk6M2KcL1wokSJqXyvFw=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCJ2ZDzMRgSrxmwphstrm8Ww",
    title: "Smosh Games",
    description: "Video games, board games and more!",
    subscriberCount: 8610000,
    viewCount: 4288335438,
    videoCount: 4342,
    country: "US",
    topicCategories: ["Games", "Entertainment", "Film"],
    growthRate: 1000,
    viralScore: 395.3,
    avgViewsPerVideo: 987640,
    uploadFrequency: 3,
    lastUploadAt: "2011-07-07T21:11:55Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/ytc/AIdro_noAvfLiftnnGZwsTFt6GD4UKSxhNJRIUWntPUL47rziiXo=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/ytc/AIdro_noAvfLiftnnGZwsTFt6GD4UKSxhNJRIUWntPUL47rziiXo=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/ytc/AIdro_noAvfLiftnnGZwsTFt6GD4UKSxhNJRIUWntPUL47rziiXo=s800-c-k-c0x00ffffff-no-rj" } },
  },
  {
    channelId: "UCu9MlvKLAt8JNQf5dYda7Aw",
    title: "Games For Kids Hub",
    description: "You found our gaming channel! We love doing art on Art for Kids Hub...but here we play games.",
    subscriberCount: 980000,
    viewCount: 264903684,
    videoCount: 269,
    country: "US",
    topicCategories: ["Games", "Adventure", "Roleplay"],
    growthRate: 1000,
    viralScore: 394.0,
    avgViewsPerVideo: 984772,
    uploadFrequency: 3,
    lastUploadAt: "2016-02-05T18:36:47Z",
    thumbnails: { default: { url: "https://yt3.ggpht.com/ytc/AIdro_kNDgCmF9eyikuS7jm1ryPX32NpcKRPFc4wte_sYSF6Pdg=s88-c-k-c0x00ffffff-no-rj" }, medium: { url: "https://yt3.ggpht.com/ytc/AIdro_kNDgCmF9eyikuS7jm1ryPX32NpcKRPFc4wte_sYSF6Pdg=s240-c-k-c0x00ffffff-no-rj" }, high: { url: "https://yt3.ggpht.com/ytc/AIdro_kNDgCmF9eyikuS7jm1ryPX32NpcKRPFc4wte_sYSF6Pdg=s800-c-k-c0x00ffffff-no-rj" } },
  },
];

function getFallbackChannels(type: string): NicheChannel[] {
  const shuffled = [...FALLBACK_CHANNELS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

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
        const results = await yt.searchChannels(q, 10);
        for (const c of results) {
          if (!seen.has(c.channelId)) seen.set(c.channelId, c);
        }
      } catch (e: any) {
        const isQuotaExceeded = e?.response?.data?.error?.code === 429 || e?.message?.includes("quota");
        if (isQuotaExceeded) {
          console.warn(`Quota exceeded for "${q}", using fallback`);
          const fallbacks = getFallbackChannels(type);
          for (const c of fallbacks) {
            if (!seen.has(c.channelId)) seen.set(c.channelId, c);
          }
          break;
        }
        console.error(`Search failed for "${q}":`, e);
      }
    }

    let channels = [...seen.values()];

    if (channels.length === 0) {
      channels = getFallbackChannels(type);
    }

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
    return NextResponse.json(getFallbackChannels("trending").slice(0, 30));
  }
}