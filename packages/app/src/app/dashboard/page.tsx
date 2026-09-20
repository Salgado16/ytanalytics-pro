"use client";

import { useEffect, useState } from "react";
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
  Eye,
  TrendingUp,
  DollarSign,
  Clock,
  Youtube,
  RefreshCw,
  Lightbulb,
  Search,
  Mic,
  FileText,
  Image,
  Scissors,
  BookOpen,
  BarChart2,
  Zap,
  Target,
  Mic2,
  FileText as FileTextIcon,
  Scissors as ScissorsIcon,
  BookOpen as BookOpenIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DashboardData {
  channel: {
    id: string;
    title: string;
    description?: string;
    customUrl?: string;
    thumbnail?: string;
    country?: string;
    subscribers: number;
    totalViews: number;
    videos: number;
    publishedAt?: string;
  };
  period: {
    days: number;
    startDate: string;
    endDate: string;
    views: number;
    watchTime: number;
    subscribersGained: number;
    subscribersLost: number;
    revenue?: number;
  };
  series: { date: string; views: number; watchTime: number; subscribers: number }[];
  recentVideos: {
    id: string;
    title: string;
    thumbnail?: string;
    views: number;
    likes: number;
    comments: number;
    publishedAt: string;
  }[];
}

const quickActions = [
  { name: "Nova Ideia", href: "/ideas", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Buscar Nicho", href: "/niche", icon: Search, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  { name: "Text-to-Speech", href: "/tts", icon: Mic, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Transcrever", href: "/transcriptions", icon: FileTextIcon, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  { name: "Buscar Mídia", href: "/media", icon: Image, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Ferramentas Texto", href: "/text-tools", icon: ScissorsIcon, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
  { name: "Skills", href: "/skills", icon: BookOpenIcon, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  { name: "Vídeos Virais", href: "/viral", icon: TrendingUp, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  { name: "Niche Finder", href: "/niche", icon: Target, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30" },
  { name: "Referências", href: "/references", icon: BookOpen, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  { name: "Skills", href: "/skills", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  { name: "Configurações", href: "/settings", icon: Zap, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/30" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erro ao carregar dados do canal");
        setData(null);
      } else {
        setData(json);
      }
    } catch (e) {
      setError("Falha ao conectar com o servidor. Tente novamente.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const stats = data
    ? [
        {
          name: "Visualizações totais",
          value: formatNumber(data.channel.totalViews),
          change:
            data.period.views > 0
              ? `+${formatNumber(data.period.views)} em ${data.period.days}d`
              : `${data.period.days} dias`,
          icon: Eye,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
          trend: data.period.views > 0 ? "+" : "",
        },
        {
          name: "Inscritos",
          value: formatNumber(data.channel.subscribers),
          change:
            data.period.subscribersGained - data.period.subscribersLost > 0
              ? `+${formatNumber(data.period.subscribersGained - data.period.subscribersLost)} em ${data.period.days}d`
              : `${formatNumber(data.period.subscribersGained - data.period.subscribersLost)} em ${data.period.days}d`,
          icon: Users,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          trend: data.period.subscribersGained - data.period.subscribersLost > 0 ? "+" : "",
        },
        {
          name: "Tempo de exibição",
          value:
            data.period.watchTime >= 3600
              ? `${(data.period.watchTime / 60).toFixed(0)}h`
              : `${formatNumber(data.period.watchTime)} min`,
          change: `em ${data.period.days} dias`,
          icon: Clock,
          color: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-100 dark:bg-purple-900/30",
          trend: "",
        },
        {
          name: "Receita estimada",
          value:
            data.period.revenue !== undefined
              ? `R$ ${formatNumber(Math.round(data.period.revenue || 0))}`
              : "—",
          change:
            data.period.revenue !== undefined
              ? `em ${data.period.days} dias`
              : "canal não monetizado",
          icon: DollarSign,
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          trend: data.period.revenue !== undefined ? "+" : "",
        },
      ]
    : [];

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {data
              ? `Bem-vindo, ${user?.name || "Criador"}! Dados reais do canal ${data.channel.title || ""}.`
              : "Bem-vindo! Acompanhe o desempenho do seu canal."}
          </p>
        </div>
        <div className="flex gap-2">
          {loading && (
            <Button variant="outline" disabled className="btn-sm">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Carregando...
            </Button>
          )}
          {!loading && (
            <Button variant="outline" onClick={loadStats} className="btn-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 animate-in">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Youtube className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <Button onClick={loadStats} className="btn-primary btn-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24 animate-in">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Carregando dados do canal...</span>
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="metric-grid animate-in">
            {stats.map((stat) => (
              <Card key={stat.name} className="stat-card stat-card-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3 animate-in">
            {/* Views Chart */}
            <Card className="lg:col-span-2 chart-container">
              <CardHeader>
                <CardTitle>Visualizações — últimos {data.period.days} dias</CardTitle>
                <CardDescription>Dados reais da YouTube Analytics API</CardDescription>
              </CardHeader>
              <CardContent>
                {data.series.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.series}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(d: string) => d.slice(5)}
                          fontSize={11}
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <YAxis
                          fontSize={11}
                          tickFormatter={(v: number) => formatNumber(v)}
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value: number, name: string) => [
                            formatNumber(value),
                            name === "views" ? "Visualizações" : name === "watchTime" ? "Min assistidos" : "Inscritos",
                          ]}
                          labelFormatter={(label: string) => label}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: "8px" }}
                          formatter={(value) => [
                            value === "views" ? "Visualizações" : value === "watchTime" ? "Min assistidos" : "Inscritos",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                          name="Visualizações"
                          animationDuration={800}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-16">
                    Sem dados de visualizações no período.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Channel Info */}
            <Card>
              <CardHeader>
                <CardTitle>Dados do canal</CardTitle>
                <CardDescription>{data.channel.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {data.channel.thumbnail ? (
                    <img
                      src={data.channel.thumbnail}
                      alt={data.channel.title}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Youtube className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{data.channel.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {data.channel.customUrl || data.channel.country || data.channel.id}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xl font-bold">{formatNumber(data.channel.subscribers)}</p>
                    <p className="text-xs text-muted-foreground">Inscritos</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xl font-bold">{formatNumber(data.channel.totalViews)}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xl font-bold">{formatNumber(data.channel.videos)}</p>
                    <p className="text-xs text-muted-foreground">Vídeos</p>
                  </div>
                </div>
                {data.channel.publishedAt && (
                  <p className="text-xs text-muted-foreground">
                    Canal desde {new Date(data.channel.publishedAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
                <Link
                  href="/channels"
                  className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                  Gerenciar canais
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 animate-in">
            {/* Recent Videos */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Vídeos recentes</CardTitle>
                  <CardDescription>Seus últimos uploads com desempenho real</CardDescription>
                </div>
                <Link href="/channels" className="text-sm text-primary hover:underline">
                  Ver todos →
                </Link>
              </CardHeader>
              <CardContent>
                {data.recentVideos.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentVideos.map((video) => (
                      <Link
                        key={video.id}
                        href={`https://youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-card group"
                      >
                        <div className="relative shrink-0 h-24 w-40 rounded-xl overflow-hidden">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="video-thumbnail"
                            />
                          ) : (
                            <div className="video-thumbnail flex items-center justify-center bg-muted">
                              <BarChart2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <span className="text-xs text-white/90">{formatRelativeTime(video.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="video-info min-w-0">
                          <h4 className="video-title line-clamp-2">{video.title}</h4>
                          <div className="video-meta">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatNumber(video.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {formatNumber(video.likes)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart2 className="h-3 w-3" />
                              {formatNumber(video.comments)}
                            </span>
                          </div>
                          <p className="video-time">
                            {formatRelativeTime(video.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-16">
                    Nenhum vídeo encontrado no canal.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Ferramentas mais usadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="quick-action group"
                    >
                      <div className={cn("quick-action-icon rounded-xl flex items-center justify-center mx-auto", action.bg)}>
                        <action.icon className={cn("h-5 w-5", action.color)} />
                      </div>
                      <span className="quick-action-text text-sm font-medium truncate">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}