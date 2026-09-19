"use client";

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
  BarChart2,
  ExternalLink,
  Plus,
  Lightbulb,
  Search,
  Mic,
  FileText,
  Image,
  Scissors,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const stats = [
  {
    name: "Visualizações Totais",
    value: "2.4M",
    change: "+12.5%",
    icon: Eye,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Inscritos",
    value: "156K",
    change: "+8.2%",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "Receita Estimada",
    value: "R$ 12.4K",
    change: "+15.3%",
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    name: "Tempo de Visualização",
    value: "485K h",
    change: "+5.7%",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
];

const recentVideos = [
  {
    id: "1",
    title: "Como crescer no YouTube em 2024",
    thumbnail: "https://picsum.photos/320/180?random=1",
    views: 125000,
    ctr: 8.5,
    avd: "4:32",
    publishedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Melhores equipamentos para começar",
    thumbnail: "https://picsum.photos/320/180?random=2",
    views: 89000,
    ctr: 6.2,
    avd: "3:45",
    publishedAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Estratégia de thumbnails que funcionam",
    thumbnail: "https://picsum.photos/320/180?random=3",
    views: 67000,
    ctr: 9.1,
    avd: "5:12",
    publishedAt: "2024-01-05",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name || "Criador"}! Acompanhe o desempenho do seu canal.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/channels/new">
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Conectar Canal
            </button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} vs mês anterior</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vídeos Recentes</CardTitle>
            <CardDescription>Seus últimos uploads e performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <div key={video.id} className="flex gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-20 w-36 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{video.title}</h4>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{formatNumber(video.views)} visualizações</span>
                      <span>CTR: {video.ctr}%</span>
                      <span>AVD: {video.avd}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(video.publishedAt)}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </div>
              ))}
              <Link href="/channels/videos" className="text-sm text-primary hover:underline">
                Ver todos os vídeos →
              </Link>
            </div>
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral do Canal</CardTitle>
            <CardDescription>Métricas dos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart2 className="h-full w-full text-muted-foreground" />
              <p className="text-center text-muted-foreground mt-4">
                Gráfico de performance (implementar com Recharts)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>Sugestões baseadas nos seus dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm">
                <strong>Otimize thumbnails:</strong> Seus últimos 3 vídeos têm CTR abaixo de 5%.
                Considere testar novos designs.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm">
                <strong>Horário ideal:</strong> Seus espectadores estão mais ativos às 19h-21h.
                Programe uploads para esse horário.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm">
                <strong>Tópico em alta:</strong> "IA para criadores" cresceu 240% esta semana.
                Considere fazer um vídeo sobre isso.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-sm">
                <strong>Retenção:</strong> Vídeos com 8-12 min têm melhor AVD no seu nicho.
                Ajuste a duração dos próximos conteúdos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}