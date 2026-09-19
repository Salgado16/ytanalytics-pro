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
  Search,
  TrendingUp,
  Rocket,
  Users,
  Eye,
  BarChart2,
  Target,
  Filter,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { formatNumber, formatRelativeTime, getColorForScore, getBgColorForScore, cn } from "@/lib/utils";

const STATUS_CONFIG = {
  trending: { label: "Em Alta", color: "bg-red-100 text-red-800" },
  rising: { label: "Subindo", color: "bg-blue-100 text-blue-800" },
  new: { label: "Novo", color: "bg-green-100 text-green-800" },
  viral: { label: "Viral", color: "bg-purple-100 text-purple-800" },
};

const sortOptions = [
  { value: "viralScore", label: "Score Viral" },
  { value: "growthRate", label: "Taxa de Crescimento" },
  { value: "subscriberCount", label: "Inscritos" },
  { value: "avgViewsPerVideo", label: "Média de Views/Vídeo" },
];

export default function NichePage() {
  const { user } = useAuth();
  const { trendingChannels, risingChannels, newChannels, viralVideos, loading, filters, setFilters, searchNiche, analyzeChannel } = useNicheFinder();
  const [activeTab, setActiveTab] = useState<"trending" | "rising" | "new" | "viral">("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const currentChannels = activeTab === "trending" ? trendingChannels : activeTab === "rising" ? risingChannels : newChannels;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const results = await searchNiche(searchQuery);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Niche Finder</h1>
          <p className="text-muted-foreground">
            Descubra nichos promissores, canais em crescimento e conteúdo viral
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSearch} className="flex-1 sm:max-w-xs">
            <Search className="h-4 w-4 mr-2" />
            <Input
              placeholder="Buscar nicho ou tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-4">
        <Button variant={activeTab === "trending" ? "primary" : "outline"} onClick={() => { setActiveTab("trending"); setShowSearchResults(false); }}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Em Alta
        </Button>
        <Button variant={activeTab === "rising" ? "primary" : "outline"} onClick={() => { setActiveTab("rising"); setShowSearchResults(false); }}>
          <Rocket className="h-4 w-4 mr-2" />
          Subindo
        </Button>
        <Button variant={activeTab === "new" ? "primary" : "outline"} onClick={() => { setActiveTab("new"); setShowSearchResults(false); }}>
          <Users className="h-4 w-4 mr-2" />
          Novos
        </Button>
        <Button variant={activeTab === "viral" ? "primary" : "outline"} onClick={() => { setActiveTab("viral"); setShowSearchResults(false); }}>
          <Target className="h-4 w-4 mr-2" />
          Virais
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <label htmlFor="country" className="sr-only">País</label>
          <select id="country" value={filters.country} onChange={(e) => setFilters({...filters, country: e.target.value})} className="input pl-10">
            <option value="BR">Brasil</option>
            <option value="US">EUA</option>
            <option value="PT">Portugal</option>
            <option value="MX">México</option>
            <option value="AR">Argentina</option>
            <option value="CO">Colômbia</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <label htmlFor="sortBy" className="sr-only">Ordenar por</label>
          <select id="sortBy" value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})} className="input pl-10">
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="relative flex-1 min-w-[150px]">
          <label htmlFor="minSubs" className="sr-only">Mín. Inscritos</label>
          <Input id="minSubs" type="number" placeholder="Mín. Inscritos" value={filters.minSubscribers} onChange={(e) => setFilters({...filters, minSubscribers: parseInt(e.target.value)})} className="pl-10" />
        </div>
        <div className="relative flex-1 min-w-[150px]">
          <label htmlFor="maxSubs" className="sr-only">Máx. Inscritos</label>
          <Input id="maxSubs" type="number" placeholder="Máx. Inscritos" value={filters.maxSubscribers} onChange={(e) => setFilters({...filters, maxSubscribers: parseInt(e.target.value)})} className="pl-10" />
        </div>
      </div>

      {showSearchResults && searchResults.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resultados da Busca: "{searchQuery}"</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowSearchResults(false)}>
              Fechar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((channel: any) => (
                <ChannelCard
                  key={channel.channelId}
                  channel={channel}
                  expanded={expandedChannel === channel.channelId}
                  onToggle={() => setExpandedChannel(expandedChannel === channel.channelId ? null : channel.channelId)}
                  onAnalyze={() => analyzeChannel(channel.channelId)}
                />
              ))}
            </div>
          </CardContent>
</Card>
      )}

      {activeTab === "viral" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {viralVideos.slice(0, 20).map((video) => (
            <ViralVideoCard key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentChannels.map((channel) => (
            <ChannelCard
              key={channel.channelId}
              channel={channel}
              expanded={expandedChannel === channel.channelId}
              onToggle={() => setExpandedChannel(expandedChannel === channel.channelId ? null : channel.channelId)}
              onAnalyze={() => analyzeChannel(channel.channelId)}
            />
          ))}
        </div>
      )}

      {currentChannels.length === 0 && !loading && !showSearchResults && (
        <Card className="text-center py-16">
          <CardContent>
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum canal encontrado</h3>
            <p className="text-muted-foreground">Ajuste os filtros ou busque por um nicho específico</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChannelCard({ channel, expanded, onToggle, onAnalyze }: any) {
  const config = STATUS_CONFIG[channel.status as keyof typeof STATUS_CONFIG];
  
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={channel.thumbnails?.high?.url || channel.thumbnails?.medium?.url || channel.thumbnails?.default?.url}
          alt={channel.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className={channel.growthRate > 50 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
            {channel.growthRate > 50 ? "🚀 Crescendo" : "📈 Estável"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{channel.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{channel.description?.slice(0, 100)}...</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-2xl font-bold">{formatNumber(channel.subscriberCount)}</p>
            <p className="text-xs text-muted-foreground">Inscritos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatNumber(channel.viewCount)}</p>
            <p className="text-xs text-muted-foreground">Views Totais</p>
          </div>
          <div>
            <p className="text-xl font-bold {getColorForScore(channel.viralScore)}">{channel.viralScore.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Score Viral</p>
          </div>
          <div>
            <p className="text-xl font-bold {getColorForScore(channel.growthRate)}">{channel.growthRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Crescimento</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {channel.topicCategories?.slice(0, 3).map((cat: string) => (
            <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatNumber(channel.videoCount)} vídeos</span>
            <span>•</span>
            <span>{formatNumber(Math.round(channel.avgViewsPerVideo))} views/vídeo</span>
            <span>•</span>
            <span>{channel.uploadFrequency.toFixed(1)} vídeos/semana</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onToggle}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onAnalyze}>
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://youtube.com/channel/${channel.channelId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
      {expanded && (
        <div className="border-t p-4 bg-muted/30">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Último upload</span>
              <span>{formatRelativeTime(channel.lastUploadAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">País</span>
              <span>{channel.country || "Não informado"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frequência</span>
              <span>{channel.uploadFrequency.toFixed(1)} vídeos/semana</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Velocidade viral</span>
              <span className={getColorForScore(channel.viralScore)}>{channel.viralScore.toFixed(0)}/1000</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function ViralVideoCard({ video }: any) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between">
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Viral: {video.viralScore.toFixed(0)}
          </Badge>
          <Badge variant="outline" className="text-xs">{video.duration}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{video.channelTitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div>
            <p className="font-bold">{formatNumber(video.viewCount)}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div>
            <p className="font-bold">{formatNumber(video.likeCount)}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
          <div>
            <p className="font-bold">{formatNumber(video.commentCount)}</p>
            <p className="text-xs text-muted-foreground">Comentários</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags?.slice(0, 4).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatRelativeTime(video.publishedAt)}</span>
          <div className="flex gap-1">
            <span className={getBgColorForScore(video.velocity) + " px-2 py-0.5 rounded text-xs"}>
              Velocidade: {video.velocity.toFixed(1)}/h
            </span>
            <span className={getBgColorForScore(video.trendScore) + " px-2 py-0.5 rounded text-xs"}>
              Tendência: {video.trendScore.toFixed(0)}
            </span>
          </div>
        </div>
      </CardContent>
</Card>
  );
}