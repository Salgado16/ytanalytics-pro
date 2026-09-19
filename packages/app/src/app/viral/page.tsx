"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNicheFinder } from "@/hooks/useNicheFinder";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  TrendingUp,
  Filter,
  ExternalLink,
  Clock,
  Heart,
  MessageSquare,
  Eye,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { RefreshCw } from "lucide-react";
import { formatNumber, formatRelativeTime, formatDuration, getColorForScore, getBgColorForScore } from "@/lib/utils";
import { cn } from "@/lib/utils";

const categories = [
  { id: "0", name: "Todos" },
  { id: "1", name: "Filmes e Animação" },
  { id: "2", name: "Autos e Veículos" },
  { id: "10", name: "Música" },
  { id: "15", name: "Animais" },
  { id: "17", name: "Esportes" },
  { id: "18", name: "Curta-metragens" },
  { id: "19", name: "Viagens e Eventos" },
  { id: "20", name: "Jogos" },
  { id: "21", name: "Videoblog" },
  { id: "22", name: "Pessoas e Blogs" },
  { id: "23", name: "Comédia" },
  { id: "24", name: "Entretenimento" },
  { id: "25", name: "Notícias e Política" },
  { id: "26", name: "Como Fazer e Estilo" },
  { id: "27", name: "Educação" },
  { id: "28", name: "Ciência e Tecnologia" },
  { id: "29", name: "ONGs e Ativismo" },
];

export default function ViralPage() {
  const { user } = useAuth();
  const { viralVideos, loading, fetchViralVideos } = useNicheFinder();
  const [filters, setFilters] = useState({
    country: "BR",
    category: "0",
    minViews: 0,
    maxViews: 100000000,
    sortBy: "viralScore" as "viralScore" | "velocity" | "trendScore" | "viewCount",
    timeRange: "24h",
  });
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const sortedVideos = [...viralVideos].sort((a, b) => {
    if (filters.sortBy === "viralScore") return b.viralScore - a.viralScore;
    if (filters.sortBy === "velocity") return b.velocity - a.velocity;
    if (filters.sortBy === "trendScore") return b.trendScore - a.trendScore;
    return b.viewCount - a.viewCount;
  });

  const filteredVideos = sortedVideos.filter((video) => {
    if (filters.category !== "0" && video.categoryId !== filters.category) return false;
    if (video.viewCount < filters.minViews) return false;
    if (video.viewCount > filters.maxViews) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vídeos Virais</h1>
          <p className="text-muted-foreground">
            Descubra o que está viralizando agora no YouTube
          </p>
        </div>
        <Button variant="outline" onClick={fetchViralVideos}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[150px]">
          <label htmlFor="country" className="sr-only">País</label>
          <select id="country" value={filters.country} onChange={(e) => setFilters({...filters, country: e.target.value})} className="input pl-10">
            <option value="BR">Brasil</option>
            <option value="US">EUA</option>
            <option value="PT">Portugal</option>
            <option value="MX">México</option>
            <option value="AR">Argentina</option>
            <option value="CO">Colômbia</option>
            <option value="global">Global</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <label htmlFor="category" className="sr-only">Categoria</label>
          <select id="category" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="input pl-10">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <label htmlFor="sortBy" className="sr-only">Ordenar por</label>
          <select id="sortBy" value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})} className="input pl-10">
            <option value="viralScore">Score Viral</option>
            <option value="velocity">Velocidade (views/h)</option>
            <option value="trendScore">Tendência</option>
            <option value="viewCount">Total de Views</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="relative flex-1 min-w-[150px]">
          <label htmlFor="timeRange" className="sr-only">Período</label>
          <select id="timeRange" value={filters.timeRange} onChange={(e) => setFilters({...filters, timeRange: e.target.value})} className="input pl-10">
            <option value="1h">Última hora</option>
            <option value="24h">Últimas 24h</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVideos.slice(0, 50).map((video) => (
          <ViralVideoCard
            key={video.videoId}
            video={video}
            expanded={expandedVideo === video.videoId}
            onToggle={() => setExpandedVideo(expandedVideo === video.videoId ? null : video.videoId)}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && !loading && (
        <Card className="text-center py-16">
          <CardContent>
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum vídeo viral encontrado</h3>
            <p className="text-muted-foreground">Ajuste os filtros para ver mais resultados</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}

function ViralVideoCard({ video, expanded, onToggle }: any) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video group">
        <img
          src={video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url}
          alt={video.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between">
          <Badge variant="secondary" className="bg-red-100 text-red-800 font-medium">
            <Target className="h-3 w-3 mr-1" />
            {video.viralScore.toFixed(0)}
          </Badge>
          <Badge variant="outline" className="text-xs">{formatDuration(parseISO8601Duration(video.duration))}</Badge>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className={getBgColorForScore(video.velocity) + " text-xs"}>
            <Zap className="h-3 w-3 mr-1" />
            {video.velocity.toFixed(1)}/h
          </Badge>
          <Badge variant="secondary" className={getBgColorForScore(video.trendScore) + " text-xs"}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {video.trendScore.toFixed(0)}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{video.channelTitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="font-bold text-lg">{formatNumber(video.viewCount)}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="font-bold text-lg">{formatNumber(video.likeCount)}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="font-bold text-lg">{formatNumber(video.commentCount)}</p>
            <p className="text-xs text-muted-foreground">Comentários</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags?.slice(0, 4).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {video.tags && video.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">+{video.tags.length - 4}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatRelativeTime(video.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {(video.likeCount / video.viewCount * 100).toFixed(1)}%
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {(video.commentCount / video.viewCount * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onToggle}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
      {expanded && (
        <div className="border-t p-4 bg-muted/30 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Score Viral" value={video.viralScore.toFixed(0)} icon={<Target className="h-4 w-4" />} color="red" />
            <MetricCard label="Velocidade" value={`${video.velocity.toFixed(1)}/h`} icon={<Zap className="h-4 w-4" />} color="yellow" />
            <MetricCard label="Tendência" value={video.trendScore.toFixed(0)} icon={<TrendingUp className="h-4 w-4" />} color="blue" />
            <MetricCard label="Engajamento" value={`${((video.likeCount + video.commentCount) / video.viewCount * 100).toFixed(2)}%`} icon={<Heart className="h-4 w-4" />} color="green" />
          </div>
          <div className="flex flex-wrap gap-1">
            {video.tags?.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <div className="pt-2 border-t flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Abrir no YouTube
              </a>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function MetricCard({ label, value, icon, color }: any) {
  const colorMap: Record<string, string> = {
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
  };
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 mb-1">
        <span className={cn("p-1.5 rounded", colorMap[color])}>{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  return hours * 3600 + minutes * 60 + seconds;
}