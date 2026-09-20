import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";
import type { ViralVideo } from "@ytanalytics-pro/shared";

export const dynamic = "force-dynamic";

const FALLBACK_VIRAL_VIDEOS: ViralVideo[] = [
  {
    videoId: "dQw4w9WgXcQ",
    channelId: "UC-9-kyTW8ZkZNDHQJ6FgpwQ",
    channelTitle: "Rick Astley",
    title: "Never Gonna Give You Up (Official Music Video)",
    description: "The official video for Never Gonna Give You Up by Rick Astley",
    publishedAt: "2009-10-25T06:57:33Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" } },
    viewCount: 1400000000,
    likeCount: 12000000,
    commentCount: 500000,
    duration: "PT3M32S",
    tags: ["rick astley", "never gonna give you up", "80s", "music"],
    categoryId: "10",
    viralScore: 1000,
    velocity: 100000,
    trendScore: 900,
  },
  {
    videoId: "kJQP7kiw5Fk",
    channelId: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
    channelTitle: "Luis Fonsi",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    description: "Despacito ft. Daddy Yankee",
    publishedAt: "2017-01-12T23:00:05Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/kJQP7kiw5Fk/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg" } },
    viewCount: 8300000000,
    likeCount: 52000000,
    commentCount: 4000000,
    duration: "PT4M41S",
    tags: ["despacito", "luis fonsi", "daddy yankee", "latin", "music"],
    categoryId: "10",
    viralScore: 1000,
    velocity: 500000,
    trendScore: 950,
  },
  {
    videoId: "YQHsXMglC9A",
    channelId: "UC-9-kyTW8ZkZNDHQJ6FgpwQ",
    channelTitle: "Ed Sheeran",
    title: "Ed Sheeran - Shape of You (Official Video)",
    description: "Shape of You (Official Video)",
    publishedAt: "2017-01-30T08:00:01Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/YQHsXMglC9A/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg" } },
    viewCount: 6000000000,
    likeCount: 30000000,
    commentCount: 2000000,
    duration: "PT3M53S",
    tags: ["ed sheeran", "shape of you", "pop", "music"],
    categoryId: "10",
    viralScore: 950,
    velocity: 400000,
    trendScore: 900,
  },
  {
    videoId: "fJ9rUzIMcZQ",
    channelId: "UCANLZYMidaCbLQWXBCom7SQ",
    channelTitle: "Alan Walker",
    title: "Alan Walker - Faded",
    description: "Alan Walker - Faded",
    publishedAt: "2015-12-03T15:00:01Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg" } },
    viewCount: 3500000000,
    likeCount: 25000000,
    commentCount: 1000000,
    duration: "PT3M32S",
    tags: ["alan walker", "faded", "edm", "music"],
    categoryId: "10",
    viralScore: 850,
    velocity: 200000,
    trendScore: 800,
  },
  {
    videoId: "CevxZvSJLk8",
    channelId: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
    channelTitle: "Katy Perry",
    title: "Katy Perry - Roar (Official)",
    description: "Roar (Official)",
    publishedAt: "2013-09-05T07:00:01Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/CevxZvSJLk8/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/CevxZvSJLk8/hqdefault.jpg" } },
    viewCount: 4000000000,
    likeCount: 15000000,
    commentCount: 1500000,
    duration: "PT3M42S",
    tags: ["katy perry", "roar", "pop", "music"],
    categoryId: "10",
    viralScore: 800,
    velocity: 180000,
    trendScore: 780,
  },
  {
    videoId: "JGwWNGJdvx8",
    channelId: "UCANLZYMidaCbLQWXBCom7SQ",
    channelTitle: "Imagine Dragons",
    title: "Imagine Dragons - Believer",
    description: "Believer (Official Video)",
    publishedAt: "2017-03-07T12:00:03Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/JGwWNGJdvx8/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg" } },
    viewCount: 2500000000,
    likeCount: 18000000,
    commentCount: 1000000,
    duration: "PT3M24S",
    tags: ["imagine dragons", "believer", "rock", "music"],
    categoryId: "10",
    viralScore: 780,
    velocity: 160000,
    trendScore: 760,
  },
  {
    videoId: "L_jWHffIx5E",
    channelId: "UC-9-kyTW8ZkZNDHQJ6FgpwQ",
    channelTitle: "The Weeknd",
    title: "The Weeknd - Blinding Lights (Official Video)",
    description: "Blinding Lights (Official Video)",
    publishedAt: "2020-01-21T12:00:05Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/L_jWHffIx5E/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/L_jWHffIx5E/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg" } },
    viewCount: 4200000000,
    likeCount: 20000000,
    commentCount: 2000000,
    duration: "PT3M20S",
    tags: ["the weeknd", "blinding lights", "pop", "music", "2020"],
    categoryId: "10",
    viralScore: 900,
    velocity: 350000,
    trendScore: 880,
  },
  {
    videoId: "kXYiU_JCYtU",
    channelId: "UCANLZYMidaCbLQWXBCom7SQ",
    channelTitle: "BTS",
    title: "BTS - Dynamite (Official MV)",
    description: "Dynamite (Official MV)",
    publishedAt: "2020-08-21T04:00:00Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/kXYiU_JCYtU/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg" } },
    viewCount: 1800000000,
    likeCount: 35000000,
    commentCount: 5000000,
    duration: "PT3M19S",
    tags: ["bts", "dynamite", "kpop", "music", "2020"],
    categoryId: "10",
    viralScore: 880,
    velocity: 300000,
    trendScore: 850,
  },
  {
    videoId: "C84BZQvWk9U",
    channelId: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
    channelTitle: "Post Malone",
    title: "Post Malone - Circles (Official Video)",
    description: "Circles (Official Video)",
    publishedAt: "2019-09-03T12:00:03Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/C84BZQvWk9U/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/C84BZQvWk9U/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/C84BZQvWk9U/hqdefault.jpg" } },
    viewCount: 1200000000,
    likeCount: 10000000,
    commentCount: 800000,
    duration: "PT3M34S",
    tags: ["post malone", "circles", "pop", "hip hop", "music"],
    categoryId: "10",
    viralScore: 750,
    velocity: 140000,
    trendScore: 740,
  },
  {
    videoId: "RgKAFK5djSk",
    channelId: "UCANLZYMidaCbLQWXBCom7SQ",
    channelTitle: "Wiz Khalifa",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    description: "See You Again ft. Charlie Puth (Official Video)",
    publishedAt: "2015-04-06T15:00:01Z",
    thumbnails: { default: { url: "https://i.ytimg.com/vi/RgKAFK5djSk/default.jpg" }, medium: { url: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg" }, high: { url: "https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg" } },
    viewCount: 6000000000,
    likeCount: 35000000,
    commentCount: 3000000,
    duration: "PT3M49S",
    tags: ["wiz khalifa", "see you again", "charlie puth", "rap", "music"],
    categoryId: "10",
    viralScore: 920,
    velocity: 450000,
    trendScore: 900,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "BR";
    const limit = parseInt(searchParams.get("limit") || "50");

    const yt = createPublicYouTubeClient();

    try {
      const videos = await yt.getViralVideos(country, Math.min(limit, 50));
      if (videos && videos.length > 0) {
        return NextResponse.json(videos);
      }
    } catch (e: any) {
      const isQuotaExceeded = e?.response?.data?.error?.code === 429 || e?.message?.includes("quota");
      if (isQuotaExceeded) {
        console.warn(`Quota exceeded for viral videos ${country}, using fallback`);
      }
    }

    return NextResponse.json(FALLBACK_VIRAL_VIDEOS.slice(0, limit));
  } catch (error) {
    console.error("Viral videos error:", error);
    return NextResponse.json(FALLBACK_VIRAL_VIDEOS.slice(0, 50));
  }
}