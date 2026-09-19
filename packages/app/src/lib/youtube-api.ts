import axios, { AxiosInstance } from "axios";
import { Channel, Video, ChannelAnalytics, VideoAnalytics, NicheChannel, ViralVideo } from "@ytanalytics-pro/shared";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_ANALYTICS_BASE = "https://youtubeanalytics.googleapis.com/v2";

export class YouTubeApiClient {
  private client: AxiosInstance;
  private analyticsClient: AxiosInstance;
  private accessToken: string;

  constructor(accessToken?: string, apiKey?: string) {
    this.accessToken = accessToken || "";
    this.client = axios.create({
      baseURL: YOUTUBE_API_BASE,
      headers: accessToken && !apiKey ? { Authorization: `Bearer ${accessToken}` } : {},
      params: apiKey ? { key: apiKey } : undefined,
    });
    this.analyticsClient = axios.create({
      baseURL: YOUTUBE_ANALYTICS_BASE,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  }

  async getMyChannel(): Promise<Channel | null> {
    const response = await this.client.get("/channels", {
      params: { part: "snippet,statistics,brandingSettings,topicDetails,status", mine: true },
    });
    return response.data.items[0] || null;
  }

  async getChannelById(channelId: string): Promise<Channel | null> {
    const response = await this.client.get("/channels", {
      params: { part: "snippet,statistics,brandingSettings,topicDetails,status", id: channelId },
    });
    return response.data.items[0] || null;
  }

  async getChannelVideos(channelId: string, maxResults = 50, pageToken?: string) {
    const response = await this.client.get("/search", {
      params: {
        part: "snippet",
        channelId,
        maxResults,
        order: "date",
        type: "video",
        pageToken,
      },
    });
    return response.data;
  }

  async getVideosDetails(videoIds: string[]): Promise<Video[]> {
    const chunks = this.chunkArray(videoIds, 50);
    const allVideos: Video[] = [];

    for (const chunk of chunks) {
      const response = await this.client.get("/videos", {
        params: {
          part: "snippet,contentDetails,statistics,status,topicDetails,player,recordingDetails",
          id: chunk.join(","),
        },
      });
      allVideos.push(...response.data.items);
    }

    return allVideos;
  }

  async getVideoAnalytics(
    videoId: string,
    startDate: string,
    endDate: string,
    metrics = "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost,likes,dislikes,comments,shares,impressions,clickThroughRate"
  ): Promise<VideoAnalytics[]> {
    const response = await this.analyticsClient.get("/reports", {
      params: {
        ids: "channel==MINE",
        startDate,
        endDate,
        metrics,
        dimensions: "day",
        filters: `video==${videoId}`,
        sort: "day",
      },
    });

    return response.data.rows?.map((row: any[]) => ({
      videoId,
      date: row[0],
      views: row[1],
      estimatedMinutesWatched: row[2],
      averageViewDuration: row[3],
      averageViewPercentage: row[4],
      subscribersGained: row[5],
      subscribersLost: row[6],
      likes: row[7],
      dislikes: row[8],
      comments: row[9],
      shares: row[10],
      impressions: row[11],
      ctr: row[12],
      revenue: row[13],
      rpm: row[14],
    })) || [];
  }

  async getChannelAnalytics(
    startDate: string,
    endDate: string,
    metrics: string[] = [
      "views",
      "subscribersGained",
      "subscribersLost",
      "estimatedMinutesWatched",
      "averageViewDuration",
      "averageViewPercentage",
      "revenue",
      "rpm",
      "impressions",
      "clickThroughRate",
    ]
  ): Promise<ChannelAnalytics[]> {
    const expected = [
      "views",
      "subscribersGained",
      "subscribersLost",
      "estimatedMinutesWatched",
      "averageViewDuration",
      "averageViewPercentage",
      "revenue",
      "rpm",
      "impressions",
      "clickThroughRate",
    ];

    const response = await this.analyticsClient.get("/reports", {
      params: {
        ids: "channel==MINE",
        startDate,
        endDate,
        metrics: metrics.join(","),
        dimensions: "day",
        sort: "day",
      },
    });

    const rowOf = (row: any[], metric: string) => {
      const index = metrics.indexOf(metric);
      return index >= 0 ? Number(row[index + 1] ?? 0) : undefined;
    };

    return response.data.rows?.map((row: any[]) => ({
      channelId: "mine",
      date: row[0],
      views: rowOf(row, "views"),
      subscribersGained: rowOf(row, "subscribersGained"),
      subscribersLost: rowOf(row, "subscribersLost"),
      estimatedMinutesWatched: rowOf(row, "estimatedMinutesWatched"),
      averageViewDuration: expected.includes("averageViewDuration")
        ? rowOf(row, "averageViewDuration")
        : undefined,
      averageViewPercentage: expected.includes("averageViewPercentage")
        ? rowOf(row, "averageViewPercentage")
        : undefined,
      revenue: rowOf(row, "revenue"),
      rpm: rowOf(row, "rpm"),
      impressions: rowOf(row, "impressions"),
      ctr: rowOf(row, "clickThroughRate"),
    })) || [];
  }

  async searchChannels(query: string, maxResults = 25): Promise<NicheChannel[]> {
    const response = await this.client.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "channel",
        maxResults,
        order: "relevance",
      },
    });

    const channelIds = response.data.items.map((item: any) => item.id.channelId).join(",");
    const channelsResponse = await this.client.get("/channels", {
      params: {
        part: "snippet,statistics,topicDetails",
        id: channelIds,
      },
    });

    return channelsResponse.data.items.map((channel: any) => this.mapToNicheChannel(channel));
  }

  async getTrendingChannels(regionCode = "BR", maxResults = 50): Promise<NicheChannel[]> {
    const response = await this.client.get("/channels", {
      params: {
        part: "snippet,statistics,topicDetails",
        chart: "mostPopular",
        regionCode,
        maxResults,
      },
    });

    return response.data.items.map((channel: any) => this.mapToNicheChannel(channel));
  }

  async getViralVideos(regionCode = "BR", maxResults = 50): Promise<ViralVideo[]> {
    const response = await this.client.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        chart: "mostPopular",
        regionCode,
        maxResults,
        videoCategoryId: "0",
      },
    });

    return response.data.items.map((video: any) => this.mapToViralVideo(video));
  }

  async getVideoComments(videoId: string, maxResults = 100) {
    const response = await this.client.get("/commentThreads", {
      params: {
        part: "snippet,replies",
        videoId,
        maxResults,
        order: "relevance",
      },
    });
    return response.data;
  }

  async getChannelSections(channelId: string) {
    const response = await this.client.get("/channelSections", {
      params: { part: "snippet,contentDetails", channelId },
    });
    return response.data;
  }

  async getVideoCaptions(videoId: string) {
    const response = await this.client.get("/captions", {
      params: { part: "snippet", videoId },
    });
    return response.data.items || [];
  }

  async downloadCaption(captionId: string, format = "srt") {
    const response = await this.client.get(`/captions/${captionId}`, {
      params: { tfmt: format },
      responseType: "text",
    });
    return response.data;
  }

  private mapToNicheChannel(channel: any): NicheChannel {
    const stats = channel.statistics || {};
    const snippet = channel.snippet || {};
    const topicDetails = channel.topicDetails || {};

    const videoCount = parseInt(stats.videoCount || "0");
    const viewCount = parseInt(stats.viewCount || "0");
    const subscriberCount = parseInt(stats.subscriberCount || "0");

    return {
      channelId: channel.id,
      title: snippet.title,
      description: snippet.description,
      subscriberCount,
      viewCount,
      videoCount,
      country: snippet.country,
      topicCategories: this.formatTopicCategories(topicDetails.topicCategories),
      growthRate: this.calculateGrowthRate(subscriberCount, videoCount),
      viralScore: this.calculateViralScore(viewCount, subscriberCount, videoCount),
      avgViewsPerVideo: videoCount > 0 ? viewCount / videoCount : 0,
      uploadFrequency: this.estimateUploadFrequency(channel),
      lastUploadAt: snippet.publishedAt,
      thumbnails: snippet.thumbnails,
    };
  }

  private formatTopicCategories(categories?: string[]): string[] {
    if (!categories || categories.length === 0) return [];
    const seen = new Set<string>();
    const formatted: string[] = [];
    for (const category of categories) {
      const parts = category.split("/").filter(Boolean);
      const last = parts[parts.length - 1] || "";
      const label = last.replace(/[_-]/g, " ");
      const display = label.charAt(0).toUpperCase() + label.slice(1);
      if (!seen.has(display)) {
        seen.add(display);
        formatted.push(display);
      }
    }
    return formatted.slice(0, 6);
  }

  private mapToViralVideo(video: any): ViralVideo {
    const stats = video.statistics || {};
    const snippet = video.snippet || {};
    const contentDetails = video.contentDetails || {};

    const viewCount = parseInt(stats.viewCount || "0");
    const likeCount = parseInt(stats.likeCount || "0");
    const commentCount = parseInt(stats.commentCount || "0");
    const subscriberCount = 1; // Would need channel stats

    return {
      videoId: video.id,
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      title: snippet.title,
      description: snippet.description,
      publishedAt: snippet.publishedAt,
      thumbnails: snippet.thumbnails,
      viewCount,
      likeCount,
      commentCount,
      duration: contentDetails.duration,
      tags: snippet.tags || [],
      categoryId: snippet.categoryId,
      viralScore: this.calculateVideoViralScore(viewCount, likeCount, commentCount),
      velocity: this.calculateVelocity(viewCount, snippet.publishedAt),
      trendScore: this.calculateTrendScore(viewCount, likeCount, commentCount, snippet.publishedAt),
    };
  }

  private calculateGrowthRate(subscribers: number, videos: number): number {
    if (videos === 0) return 0;
    return Math.min((subscribers / videos) * 100, 1000);
  }

  private calculateViralScore(views: number, subscribers: number, videos: number): number {
    if (subscribers === 0 || videos === 0) return 0;
    const viewsPerSub = views / subscribers;
    const viewsPerVideo = views / videos;
    return Math.min((viewsPerSub * 0.6 + viewsPerVideo * 0.4) / 1000, 1000);
  }

  private calculateVideoViralScore(views: number, likes: number, comments: number): number {
    const engagementRate = likes + comments * 2;
    return Math.min((views * 0.7 + engagementRate * 0.3) / 10000, 1000);
  }

  private calculateVelocity(views: number, publishedAt: string): number {
    const hoursSincePublish = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSincePublish <= 0) return views;
    return views / hoursSincePublish;
  }

  private calculateTrendScore(views: number, likes: number, comments: number, publishedAt: string): number {
    const velocity = this.calculateVelocity(views, publishedAt);
    const engagement = likes + comments * 2;
    return Math.min((velocity * 0.6 + engagement * 0.4) / 100, 1000);
  }

  private estimateUploadFrequency(channel: any): number {
    return 3; // Placeholder - would need historical data
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export function createYouTubeClient(accessToken: string) {
  return new YouTubeApiClient(accessToken);
}

export function createPublicYouTubeClient() {
  return new YouTubeApiClient(undefined, process.env.YOUTUBE_API_KEY || "");
}