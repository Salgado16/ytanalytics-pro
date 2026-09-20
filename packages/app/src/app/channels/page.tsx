"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Users,
  Plus,
  Eye,
  Youtube,
  Trash2,
  RefreshCw,
  Link2,
  CheckCircle2,
  BarChart2,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui";
import { VideoItem } from "./VideoItem";
import { VideosSection } from "./VideosSection";

export interface ChannelData {
  id: string;
  channelId: string;
  channelTitle: string;
  channelHandle?: string;
  isPrimary: boolean;
  createdAt: string;
  stats?: {
    subscribers: number;
    totalViews: number;
    videos: number;
    thumbnail?: string;
  };
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail?: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  duration?: string;
  ctr?: number;
  retention?: number;
}

export default function ChannelsPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());
  const [channelVideos, setChannelVideos] = useState<Record<string, VideoData[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [loadingStats, setLoadingStats] = useState<Set<string>>(new Set());

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/channels", { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao carregar canais");
      const data = await res.json();
      setChannels(data || []);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar canais");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega stats de um canal específico
  const loadChannelStats = useCallback(async (channelId: string) => {
    setLoadingStats(prev => new Set(prev).add(channelId));
    try {
      const res = await fetch(`/api/channels/${channelId}/stats`, { cache: "no-store" });
      if (res.ok) {
        const stats = await res.json();
        setChannels(prev => prev.map(c => 
          c.id === channelId ? { ...c, stats } : c
        ));
      }
    } catch (e) {
      console.error("Error loading channel stats:", e);
    } finally {
      setLoadingStats(prev => {
        const next = new Set(prev);
        next.delete(channelId);
        return next;
      });
    }
  }, []);

  const connectChannel = async () => {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/channels/connect", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/api/auth/callback";
          return;
        }
        setError(json.error || "Erro ao conectar canal");
      } else {
        await loadChannels();
      }
    } catch (e: any) {
      setError(e.message || "Erro ao conectar canal");
    } finally {
      setConnecting(false);
    }
  };

  // Auto-conecta se veio do callback OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true" && channels.length === 0) {
      connectChannel();
    }
  }, [channels.length, connectChannel]);

  // Carrega stats de todos os canais que não têm
  useEffect(() => {
    channels.forEach(channel => {
      if (!channel.stats && !loadingStats.has(channel.id)) {
        loadChannelStats(channel.id);
      }
    });
  }, [channels, loadingStats, loadChannelStats]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const disconnectChannel = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/channels/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover canal");
      await loadChannels();
    } catch (e: any) {
      setError(e.message || "Erro ao remover canal");
    }
  };

  const loadChannelVideos = async (channelId: string) => {
    setLoadingVideos(prev => new Set(prev).add(channelId));
    try {
      const res = await fetch(`/api/channels/${channelId}/videos`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setChannelVideos(prev => ({ ...prev, [channelId]: data || [] }));
      }
    } catch (e) {
      console.error("Error loading channel videos:", e);
    } finally {
      setLoadingVideos(prev => {
        const next = new Set(prev);
        next.delete(channelId);
        return next;
      });
    }
  };

  const toggleChannelExpand = (channelId: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelId)) {
      newExpanded.delete(channelId);
    } else {
      newExpanded.add(channelId);
      if (!channelVideos[channelId] && !loadingVideos.has(channelId)) {
        loadChannelVideos(channelId);
      }
    }
    setExpandedChannels(newExpanded);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de Canais</h1>
          <p className="page-subtitle">Gerencie seus canais conectados e acompanhe métricas reais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadChannels} disabled={loading} className="btn-sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={connectChannel} disabled={connecting} className="btn-primary">
            {connecting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Youtube className="h-4 w-4 mr-2" />
            )}
            {connecting ? "Conectando..." : "Conectar Novo Canal"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 animate-in">
          <CardContent className="flex items-center justify-between py-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Carregando canais...</span>
          </div>
        </div>
      )}

      {!loading && channels.length === 0 && (
        <Card className="border-dashed border-2 animate-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum canal conectado</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Conecte seu canal do YouTube usando a sua conta Google para ver métricas no dashboard e gerenciar todos os seus canais.
            </p>
            <Button onClick={connectChannel} disabled={connecting} className="btn-primary">
              <Youtube className="h-4 w-4 mr-2" />
              Conectar meu Canal via YouTube
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && channels.length > 0 && (
        <div className="section">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {channels.map((channel) => (
              <Card key={channel.id} className="channel-card animate-in group">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    {channel.stats?.thumbnail ? (
                      <img
                        src={channel.stats.thumbnail}
                        alt={channel.channelTitle}
                        className="channel-avatar"
                      />
                    ) : (
                      <div className="channel-placeholder">
                        <Youtube className="h-8 w-8" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{channel.channelTitle}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {channel.channelHandle || channel.channelId}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <span className={cn(
                            "badge-primary text-xs px-2 py-0.5",
                            channel.isPrimary && "bg-primary"
                          )}>
                            {channel.isPrimary ? "Principal" : "Conectado"}
                          </span>
                        </div>
                      </div>
                      {channel.stats && (
                        <div className="channel-stats mt-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {formatNumber(channel.stats.subscribers)} inscritos
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatNumber(channel.stats.totalViews)} views
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart2 className="h-3 w-3" />
                            {channel.stats.videos} vídeos
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => toggleChannelExpand(channel.id)}
                        title={expandedChannels.has(channel.id) ? "Recolher vídeos" : "Ver vídeos"}
                      >
                        {expandedChannels.has(channel.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => toggleChannelExpand(channel.id)}
                          >
                            {expandedChannels.has(channel.id) ? "Recolher vídeos" : "Ver vídeos"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`https://youtube.com/channel/${channel.channelId}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver no YouTube
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => disconnectChannel(channel.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover canal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex gap-2">
                    <Link
                      href={`https://youtube.com/channel/${channel.channelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Eye className="h-4 w-4" />
                      Ver no YouTube
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => disconnectChannel(channel.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div
                    className={cn(
                      "mt-4 transition-all duration-300 overflow-hidden",
                      expandedChannels.has(channel.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <VideosSection
                      channel={channel}
                      expandedChannels={expandedChannels}
                      loadingVideos={loadingVideos}
                      channelVideos={channelVideos}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}