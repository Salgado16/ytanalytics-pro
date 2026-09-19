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
  Plus,
  Eye,
  BarChart2,
  Settings,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

const mockChannels = [
  {
    id: "UC123",
    title: "Meu Canal Principal",
    handle: "@meucanal",
    subscribers: 156000,
    views: 2400000,
    videos: 245,
    thumbnail: "https://picsum.photos/80/80?random=10",
    connected: true,
  },
  {
    id: "UC456",
    title: "Canal Secundário",
    handle: "@canalsecundario",
    subscribers: 23000,
    views: 450000,
    videos: 89,
    thumbnail: "https://picsum.photos/80/80?random=11",
    connected: true,
  },
];

export default function ChannelsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Canais</h1>
          <p className="text-muted-foreground">
            Gerencie seus canais conectados e acompanhe métricas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Conectar Novo Canal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockChannels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                <img
                  src={channel.thumbnail}
                  alt={channel.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground">{channel.handle}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{formatNumber(channel.subscribers)} inscritos</span>
                    <span>{formatNumber(channel.views)} visualizações</span>
                    <span>{channel.videos} vídeos</span>
                  </div>
                </div>
                <span className="badge-primary">Conectado</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Vídeos
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-2">
          <CardContent className="flex h-48 flex-col items-center justify-center text-muted-foreground">
            <Plus className="h-12 w-12 mb-3 opacity-50" />
            <h3 className="font-medium mb-1">Adicionar Canal</h3>
            <p className="text-sm text-center">Conecte seu canal do YouTube via OAuth</p>
            <Button className="mt-3" variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Conectar via YouTube
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canais Conectados</CardTitle>
          <CardDescription>Detalhes completos e ações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Canal</th>
                  <th className="table-head">Inscritos</th>
                  <th className="table-head">Visualizações</th>
                  <th className="table-head">Vídeos</th>
                  <th className="table-head">Último Upload</th>
                  <th className="table-head">Status</th>
                  <th className="table-head text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {mockChannels.map((channel) => (
                  <tr key={channel.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <img
                          src={channel.thumbnail}
                          alt={channel.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{channel.title}</p>
                          <p className="text-sm text-muted-foreground">{channel.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{formatNumber(channel.subscribers)}</td>
                    <td className="table-cell">{formatNumber(channel.views)}</td>
                    <td className="table-cell">{channel.videos}</td>
                    <td className="table-cell text-muted-foreground">2 dias atrás</td>
                    <td className="table-cell">
                      <span className="badge-primary">Ativo</span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}