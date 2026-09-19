"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

interface ChannelData {
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

export default function ChannelsPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const connectChannel = async () => {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/channels/connect", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Canais</h1>
          <p className="text-muted-foreground">
            Gerencie seus canais conectados e acompanhe métricas reais
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadChannels} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={connectChannel} disabled={connecting}>
            {connecting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Youtube className="h-4 w-4 mr-2" />
            )}
            {connecting ? "Conectando..." : "Conectar meu Canal"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="py-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && channels.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum canal conectado</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Conecte seu canal do YouTube usando a sua conta Google para ver métricas no dashboard e gerenciar todos os seus canais.
            </p>
            <Button onClick={connectChannel} disabled={connecting}>
              <Youtube className="h-4 w-4 mr-2" />
              Conectar meu Canal via YouTube
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                {channel.stats?.thumbnail ? (
                  <img
                    src={channel.stats.thumbnail}
                    alt={channel.channelTitle}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <Youtube className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{channel.channelTitle}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {channel.channelHandle || channel.channelId}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="badge-primary">
                      {channel.isPrimary ? "Principal" : "Conectado"}
                    </span>
                    <span className="badge-primary">
                      {channel.stats ? "Verificado" : "Conectado"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {channel.stats ? (
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>{formatNumber(channel.stats.subscribers)} inscritos</span>
                  <span>{formatNumber(channel.stats.totalViews)} views</span>
                  <span>{channel.stats.videos} vídeos</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Canal conectado — dados de métricas disponíveis no dashboard.
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a
                    href={`https://youtube.com/channel/${channel.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver no YouTube
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => disconnectChannel(channel.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}