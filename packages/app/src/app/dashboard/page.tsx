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
} from "lucide-react";
import Link from "next/link";
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
          color: "text-blue-600",
        },
        {
          name: "Inscritos",
          value: formatNumber(data.channel.subscribers),
          change:
            data.period.subscribersGained - data.period.subscribersLost > 0
              ? `+${formatNumber(data.period.subscribersGained - data.period.subscribersLost)} em ${data.period.days}d`
              : `${formatNumber(data.period.subscribersGained - data.period.subscribersLost)} em ${data.period.days}d`,
          icon: Users,
          color: "text-green-600",
        },
        {
          name: "Tempo de exibição",
          value:
            data.period.watchTime >= 3600
              ? `${(data.period.watchTime / 60).toFixed(0)}h`
              : `${formatNumber(data.period.watchTime)} min`,
          change: `em ${data.period.days} dias`,
          icon: Clock,
          color: "text-purple-600",
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
          color: "text-yellow-600",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {data
              ? `Bem-vindo, ${user?.name || "Criador"}! Dados reais do canal ${data.channel.title || ""}.`
              : "Bem-vindo! Acompanhe o desempenho do seu canal."}
          </p>
        </div>
        <div className="flex gap-2">
          {loading && (
            <button className="btn-outline" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Carregando...
            </button>
          )}
          {!loading && (
            <button className="btn-outline" onClick={loadStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Youtube className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button className="btn-primary" onClick={loadStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Visualizações — últimos {data.period.days} dias</CardTitle>
                <CardDescription>Dados reais da YouTube Analytics API</CardDescription>
              </CardHeader>
              <CardContent>
                {data.series.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.series}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(d: string) => d.slice(5)}
                          fontSize={11}
                        />
                        <YAxis fontSize={11} tickFormatter={(v: number) => formatNumber(v)} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatNumber(value),
                            name === "views" ? "Visualizações" : name === "watchTime" ? "Min assistidos" : "Inscritos",
                          ]}
                          labelFormatter={(label: string) => label}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={false}
                          name="Visualizações"
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
                      className="h-16 w-16 rounded-full object-cover"
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
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-lg font-bold">{formatNumber(data.channel.subscribers)}</p>
                    <p className="text-xs text-muted-foreground">Inscritos</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-lg font-bold">{formatNumber(data.channel.totalViews)}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-lg font-bold">{formatNumber(data.channel.videos)}</p>
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
                  className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <Youtube className="h-4 w-4" />
                  Gerenciar canais
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
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
                      <div key={video.id} className="flex gap-4">
                        <a
                          href={`https://youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-20 w-36 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-36 items-center justify-center rounded-lg bg-muted">
                              <BarChart2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </a>
                        <div className="flex-1 min-w-0">
                          <a
                            href={`https://youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            <h4 className="font-medium text-sm truncate">{video.title}</h4>
                          </a>
                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{formatNumber(video.views)} visualizações</span>
                            <span>{formatNumber(video.likes)} likes</span>
                            <span>{formatNumber(video.comments)} comentários</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(video.publishedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-16">
                    Nenhum vídeo encontrado no canal.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Ferramentas mais usadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/ideas" className="card-hover p-4 text-center">
                    <Lightbulb className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="font-medium">Nova Ideia</p>
                  </Link>
                  <Link href="/niche" className="card-hover p-4 text-center">
                    <Search className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="font-medium">Buscar Nicho</p>
                  </Link>
                  <Link href="/tts" className="card-hover p-4 text-center">
                    <Mic className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <p className="font-medium">Text-to-Speech</p>
                  </Link>
                  <Link href="/transcriptions" className="card-hover p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <p className="font-medium">Transcrever</p>
                  </Link>
                  <Link href="/media" className="card-hover p-4 text-center">
                    <Image className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="font-medium">Buscar Mídia</p>
                  </Link>
                  <Link href="/text-tools" className="card-hover p-4 text-center">
                    <Scissors className="h-8 w-8 mx-auto text-pink-600 mb-2" />
                    <p className="font-medium">Ferramentas Texto</p>
                  </Link>
                  <Link href="/skills" className="card-hover p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                    <p className="font-medium">Skills</p>
                  </Link>
                  <Link href="/viral" className="card-hover p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-red-600 mb-2" />
                    <p className="font-medium">Vídeos Virais</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}