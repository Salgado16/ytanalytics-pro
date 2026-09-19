import { z } from "zod";

export const ChannelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  customUrl: z.string().optional(),
  publishedAt: z.string().datetime(),
  thumbnails: z.object({
    default: z.object({ url: z.string(), width: z.number(), height: z.number() }),
    medium: z.object({ url: z.string(), width: z.number(), height: z.number() }),
    high: z.object({ url: z.string(), width: z.number(), height: z.number() }),
  }).optional(),
  statistics: z.object({
    viewCount: z.string(),
    subscriberCount: z.string(),
    hiddenSubscriberCount: z.boolean(),
    videoCount: z.string(),
  }).optional(),
  brandingSettings: z.object({
    channel: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.string(),
      featuredChannelsUrls: z.array(z.string()).optional(),
    }).optional(),
    image: z.object({
      bannerExternalUrl: z.string().optional(),
    }).optional(),
  }).optional(),
  topicCategories: z.array(z.string()).optional(),
  status: z.object({
    privacyStatus: z.string(),
    isLinked: z.boolean(),
    longUploadsStatus: z.string(),
    madeForKids: z.boolean(),
  }).optional(),
});

export type Channel = z.infer<typeof ChannelSchema>;

export const VideoSchema = z.object({
  id: z.string(),
  channelId: z.string(),
  title: z.string(),
  description: z.string(),
  publishedAt: z.string().datetime(),
  thumbnails: z.object({
    default: z.object({ url: z.string(), width: z.number(), height: z.number() }),
    medium: z.object({ url: z.string(), width: z.number(), height: z.number() }),
    high: z.object({ url: z.string(), width: z.number(), height: z.number() }),
    standard: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
    maxres: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
  }),
  tags: z.array(z.string()).optional(),
  categoryId: z.string(),
  liveBroadcastContent: z.string(),
  defaultLanguage: z.string().optional(),
  localized: z.object({
    title: z.string(),
    description: z.string(),
  }).optional(),
  contentDetails: z.object({
    duration: z.string(),
    dimension: z.string(),
    definition: z.string(),
    caption: z.string(),
    licensedContent: z.boolean(),
    contentRating: z.record(z.string()).optional(),
    projection: z.string(),
  }).optional(),
  statistics: z.object({
    viewCount: z.string(),
    likeCount: z.string(),
    dislikeCount: z.string().optional(),
    favoriteCount: z.string(),
    commentCount: z.string(),
  }).optional(),
  player: z.object({
    embedHtml: z.string(),
  }).optional(),
  topicDetails: z.object({
    topicCategories: z.array(z.string()),
    relevantTopicIds: z.array(z.string()),
  }).optional(),
  recordingDetails: z.record(z.unknown()).optional(),
  fileDetails: z.record(z.unknown()).optional(),
  processingDetails: z.record(z.unknown()).optional(),
  suggestions: z.record(z.unknown()).optional(),
});

export type Video = z.infer<typeof VideoSchema>;

export const VideoAnalyticsSchema = z.object({
  videoId: z.string(),
  date: z.string().date(),
  views: z.number(),
  estimatedMinutesWatched: z.number(),
  averageViewDuration: z.number(),
  averageViewPercentage: z.number(),
  subscribersGained: z.number(),
  subscribersLost: z.number(),
  likes: z.number(),
  dislikes: z.number(),
  comments: z.number(),
  shares: z.number(),
  impressions: z.number().optional(),
  ctr: z.number().optional(),
  revenue: z.number().optional(),
  rpm: z.number().optional(),
});

export type VideoAnalytics = z.infer<typeof VideoAnalyticsSchema>;

export const ChannelAnalyticsSchema = z.object({
  channelId: z.string(),
  date: z.string().date(),
  views: z.number(),
  subscribersGained: z.number(),
  subscribersLost: z.number(),
  estimatedMinutesWatched: z.number(),
  averageViewDuration: z.number(),
  averageViewPercentage: z.number(),
  revenue: z.number().optional(),
  rpm: z.number().optional(),
  impressions: z.number().optional(),
  ctr: z.number().optional(),
});

export type ChannelAnalytics = z.infer<typeof ChannelAnalyticsSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
  sourceUrl: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ReferenceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  type: z.enum(["video", "article", "image", "audio", "document"]),
  url: z.string(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  channelId: z.string().optional(),
  videoId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Reference = z.infer<typeof ReferenceSchema>;

export const MediaAssetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["image", "video"]),
  source: z.enum(["pixabay", "pexels", "upload", "youtube"]),
  sourceId: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  width: z.number(),
  height: z.number(),
  duration: z.number().optional(),
  tags: z.array(z.string()),
  author: z.string().optional(),
  authorUrl: z.string().optional(),
  license: z.string(),
  createdAt: z.string().datetime(),
});

export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const TTSRequestSchema = z.object({
  text: z.string(),
  voice: z.string().optional(),
  language: z.string().optional(),
  speed: z.number().min(0.5).max(2).default(1),
  pitch: z.number().min(0).max(2).default(1),
});

export type TTSRequest = z.infer<typeof TTSRequestSchema>;

export const TranscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sourceType: z.enum(["video", "audio", "youtube_url"]),
  sourceUrl: z.string(),
  sourceId: z.string().optional(),
  language: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  text: z.string().optional(),
  segments: z.array(z.object({
    start: z.number(),
    end: z.number(),
    text: z.string(),
    confidence: z.number().optional(),
  })).optional(),
  error: z.string().optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type Transcription = z.infer<typeof TranscriptionSchema>;

export const TextToolSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["character_count", "word_count", "text_splitter", "hashtag_generator", "title_optimizer"]),
  input: z.string(),
  output: z.string(),
  settings: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
});

export type TextTool = z.infer<typeof TextToolSchema>;

export const IdeaSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["backlog", "researching", "scripting", "recording", "editing", "scheduled", "published", "archived"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  tags: z.array(z.string()),
  targetKeywords: z.array(z.string()),
  estimatedDuration: z.number().optional(),
  thumbnailIdeas: z.array(z.string()).optional(),
  references: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional(),
  videoId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Idea = z.infer<typeof IdeaSchema>;

export const NicheChannelSchema = z.object({
  channelId: z.string(),
  title: z.string(),
  description: z.string(),
  subscriberCount: z.number(),
  viewCount: z.number(),
  videoCount: z.number(),
  country: z.string().optional(),
  topicCategories: z.array(z.string()),
  growthRate: z.number(),
  viralScore: z.number(),
  avgViewsPerVideo: z.number(),
  uploadFrequency: z.number(),
  lastUploadAt: z.string().datetime(),
  thumbnails: z.object({
    default: z.object({ url: z.string() }),
    medium: z.object({ url: z.string() }),
    high: z.object({ url: z.string() }),
  }).optional(),
});

export type NicheChannel = z.infer<typeof NicheChannelSchema>;

export const ViralVideoSchema = z.object({
  videoId: z.string(),
  channelId: z.string(),
  channelTitle: z.string(),
  title: z.string(),
  description: z.string(),
  publishedAt: z.string().datetime(),
  thumbnails: z.object({
    default: z.object({ url: z.string() }),
    medium: z.object({ url: z.string() }),
    high: z.object({ url: z.string() }),
  }),
  viewCount: z.number(),
  likeCount: z.number(),
  commentCount: z.number(),
  duration: z.string(),
  tags: z.array(z.string()),
  categoryId: z.string(),
  viralScore: z.number(),
  velocity: z.number(),
  trendScore: z.number(),
});

export type ViralVideo = z.infer<typeof ViralVideoSchema>;

export const UserSettingsSchema = z.object({
  userId: z.string(),
  youtubeConnected: z.boolean(),
  youtubeChannelId: z.string().optional(),
  defaultLanguage: z.string().default("pt-BR"),
  ttsVoice: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    weeklyReport: z.boolean().default(true),
    viralAlerts: z.boolean().default(true),
  }),
  apiKeys: z.object({
    pixabay: z.string().optional(),
    pexels: z.string().optional(),
    openai: z.string().optional(),
    elevenlabs: z.string().optional(),
    assemblyai: z.string().optional(),
  }).optional(),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

export const PixabayImageSchema = z.object({
  id: z.number(),
  pageURL: z.string(),
  type: z.string(),
  tags: z.string(),
  previewURL: z.string(),
  previewWidth: z.number(),
  previewHeight: z.number(),
  webformatURL: z.string(),
  webformatWidth: z.number(),
  webformatHeight: z.number(),
  largeImageURL: z.string(),
  largeImageWidth: z.number(),
  largeImageHeight: z.number(),
  imageWidth: z.number(),
  imageHeight: z.number(),
  imageSize: z.number(),
  views: z.number(),
  downloads: z.number(),
  collections: z.number(),
  likes: z.number(),
  comments: z.number(),
  user_id: z.number(),
  user: z.string(),
  userImageURL: z.string(),
});

export type PixabayImage = z.infer<typeof PixabayImageSchema>;

export const PexelsPhotoSchema = z.object({
  id: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.string(),
  photographer: z.string(),
  photographer_url: z.string(),
  photographer_id: z.number(),
  avg_color: z.string(),
  src: z.object({
    original: z.string(),
    large2x: z.string(),
    large: z.string(),
    medium: z.string(),
    small: z.string(),
    portrait: z.string(),
    landscape: z.string(),
    tiny: z.string(),
  }),
  liked: z.boolean(),
  alt: z.string(),
});

export type PexelsPhoto = z.infer<typeof PexelsPhotoSchema>;

export const PexelsVideoSchema = z.object({
  id: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.string(),
  image: z.string(),
  duration: z.number(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
  }),
  video_files: z.array(z.object({
    id: z.number(),
    quality: z.string(),
    file_type: z.string(),
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    link: z.string(),
  })),
  video_pictures: z.array(z.object({
    id: z.number(),
    picture: z.string(),
    nr: z.number(),
  })),
});

export type PexelsVideo = z.infer<typeof PexelsVideoSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export type { z };