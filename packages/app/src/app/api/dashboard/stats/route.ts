import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/yt-token";
import { YouTubeApiClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

const DAYS = 28;

interface AnalyticsRow {
  date: string;
  views: number;
  watchTime: number;
  subscribersGained: number;
  subscribersLost: number;
  revenue: number;
}

function toISODate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function analyzeRows(rows: AnalyticsRow[]) {
  let views = 0;
  let watchTime = 0;
  let subscribersGained = 0;
  let subscribersLost = 0;
  let revenue = 0;

  for (const row of rows) {
    views += row.views || 0;
    watchTime += row.watchTime || 0;
    subscribersGained += row.subscribersGained || 0;
    subscribersLost += row.subscribersLost || 0;
    revenue += row.revenue || 0;
  }

  return { views, watchTime, subscribersGained, subscribersLost, revenue };
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Sessão do YouTube não disponível. Faça login novamente." },
        { status: 401 }
      );
    }

    const yt = new YouTubeApiClient(accessToken);
    const channel = (await yt.getMyChannel()) as any;

    if (!channel) {
      return NextResponse.json(
        { error: "Nenhum canal encontrado para sua conta Google." },
        { status: 404 }
      );
    }

    const startDate = toISODate(DAYS);
    const endDate = toISODate(0);

    let channelRows: any[] = [];
    const fullMetrics = [
      "views",
      "subscribersGained",
      "subscribersLost",
      "estimatedMinutesWatched",
      "revenue",
      "rpm",
    ];
    const safeMetrics = [
      "views",
      "subscribersGained",
      "subscribersLost",
      "estimatedMinutesWatched",
    ];

    try {
      channelRows = await yt.getChannelAnalytics(startDate, endDate, fullMetrics);
    } catch (analyticsError: any) {
      console.warn("Full analytics failed (likely not monetized), retrying safe:", analyticsError?.message || analyticsError);
      try {
        channelRows = await yt.getChannelAnalytics(startDate, endDate, safeMetrics);
      } catch (safeError) {
        console.error("Safe analytics also failed:", safeError);
        channelRows = [];
      }
    }

    const channelStats = analyzeRows(channelRows);

    const series = channelRows
      .map((row) => ({
        date: row.date,
        views: row.views ?? 0,
        watchTime: row.estimatedMinutesWatched ?? 0,
        subscribers: (row.subscribersGained ?? 0) - (row.subscribersLost ?? 0),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    let recentVideos: any[] = [];
    try {
      const search = await yt.getChannelVideos(channel.id, 6);
      const ids = (search.items || []).map((v: any) => v.id.videoId || v.id).filter(Boolean);
      if (ids.length > 0) {
        const videos = await yt.getVideosDetails(ids);
        recentVideos = videos.map((v: any) => ({
          id: v.id,
          title: v.snippet?.title,
          thumbnail:
            v.snippet?.thumbnails?.medium?.url ||
            v.snippet?.thumbnails?.default?.url,
          views: parseInt(v.statistics?.viewCount || "0", 10),
          likes: parseInt(v.statistics?.likeCount || "0", 10),
          comments: parseInt(v.statistics?.commentCount || "0", 10),
          publishedAt: v.snippet?.publishedAt,
        }));
      }
    } catch (videoError) {
      console.error("Error fetching recent videos:", videoError);
    }

    const stats = channel.statistics || {};
    const subscribers = parseInt(stats.subscriberCount || "0", 10);
    const totalViews = parseInt(stats.viewCount || "0", 10);
    const videos = parseInt(stats.videoCount || "0", 10);

    return NextResponse.json({
      channel: {
        id: channel.id,
        title: channel.snippet?.title || channel.title,
        description: channel.snippet?.description,
        customUrl: channel.snippet?.customUrl,
        thumbnail:
          channel.snippet?.thumbnails?.medium?.url ||
          channel.snippet?.thumbnails?.default?.url,
        country: channel.snippet?.country,
        subscribers,
        totalViews,
        videos,
        publishedAt: channel.snippet?.publishedAt,
        hiddenSubscriberCount: stats.hiddenSubscriberCount === "true" || stats.hiddenSubscriberCount === true,
      },
      period: {
        days: DAYS,
        startDate,
        endDate,
        views: channelStats.views,
        watchTime: channelStats.watchTime,
        subscribersGained: channelStats.subscribersGained,
        subscribersLost: channelStats.subscribersLost,
        revenue: channelStats.revenue,
      },
      series,
      recentVideos,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error?.message || error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do canal. Tente novamente." },
      { status: 500 }
    );
  }
}