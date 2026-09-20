"use client";

import { ChannelData, VideoData } from "./page";
import { VideoItem } from "./VideoItem";
import { Button } from "@/components/ui";
import { RefreshCw, BarChart2, Eye, TrendingUp, Clock } from "lucide-react";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

interface VideosSectionProps {
  channel: ChannelData;
  expandedChannels: Set<string>;
  loadingVideos: Set<string>;
  channelVideos: Record<string, VideoData[]>;
}

export function VideosSection({
  channel,
  expandedChannels,
  loadingVideos,
  channelVideos,
}: {
  channel: ChannelData;
  expandedChannels: Set<string>;
  loadingVideos: Set<string>;
  channelVideos: Record<string, VideoData[]>;
}) {
  const isExpanded = expandedChannels.has(channel.id);
  if (!isExpanded) return null;

  const isLoadingVideos = loadingVideos.has(channel.id);
  const videos = channelVideos[channel.id] || [];

  if (loadingVideos.has(channel.id)) {
    return (
      <div className="mt-4 flex items-center justify-center py-4">
        <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
        <span className="text-sm text-muted-foreground">Carregando vídeos...</span>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="mt-4 text-center py-8 text-muted-foreground">
        <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhum vídeo encontrado neste canal</p>
      </div>
    );
  }

  return (
    <div className="mt-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Últimos {videos.length} vídeos
        </span>
        <span className="text-xs text-muted-foreground">
          Clique para ver métricas detalhadas
        </span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {videos.slice(0, 8).map(video => (
          <VideoItem key={video.id} video={video} />
        ))}
        {videos.length > 8 && (
          <Button variant="ghost" size="sm" className="w-full mt-2">
            Ver todos os {videos.length} vídeos →
          </Button>
        )}
      </div>
    </div>
  );
}