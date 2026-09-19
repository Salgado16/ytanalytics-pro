"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Library,
  Plus,
  Search,
  Tag,
  Edit,
  Trash2,
  ExternalLink,
  Video,
  FileText,
  Image,
  Music,
  File,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

const mockReferences = [
  {
    id: "1",
    title: "Como Fazer Thumbnails Virais - YouTube",
    type: "video",
    url: "https://youtube.com/watch?v=abc123",
    thumbnail: "https://picsum.photos/320/180?random=20",
    description: "Tutorial completo sobre design de thumbnails com CTR alto",
    tags: ["thumbnail", "design", "CTR", "viral"],
    channelId: "UC123",
    videoId: "abc123",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "O Algoritmo do YouTube em 2024 - Artigo",
    type: "article",
    url: "https://blog.youtube/algorithm-2024",
    thumbnail: "https://picsum.photos/320/180?random=21",
    description: "Análise profunda das mudanças no algoritmo este ano",
    tags: ["algoritmo", "2024", "crescimento", "SEO"],
    channelId: "",
    videoId: "",
    createdAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "3",
    title: "Pack de Elementos para Thumbnails",
    type: "image",
    url: "https://figma.com/community/thumbnails-pack",
    thumbnail: "https://picsum.photos/320/180?random=22",
    description: "Set de setas, formas, textos prontos para thumbnails",
    tags: ["assets", "figma", "design", "gratuito"],
    channelId: "",
    videoId: "",
    createdAt: "2024-01-10T09:15:00Z",
  },
];

const types = [
  { value: "all", label: "Todos", icon: Library },
  { value: "video", label: "Vídeos", icon: Video },
  { value: "article", label: "Artigos", icon: FileText },
  { value: "image", label: "Imagens", icon: Image },
  { value: "audio", label: "Áudios", icon: Music },
  { value: "document", label: "Documentos", icon: File },
];

export default function ReferencesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingRef, setEditingRef] = useState<any>(null);

  const filteredRefs = mockReferences.filter((ref) => {
    const matchesSearch =
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || ref.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "audio": return <Music className="h-4 w-4" />;
      case "document": return <File className="h-4 w-4" />;
      default: return <Library className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referências</h1>
          <p className="text-muted-foreground">
            Salve vídeos, artigos, imagens e outros materiais de inspiração
          </p>
        </div>
        <Button onClick={() => { setEditingRef(null); setShowModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Referência
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar referências..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          {types.map((t) => (
            <Button
              key={t.value}
              variant={selectedType === t.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedType(t.value)}
            >
              <t.icon className="mr-1" />
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRefs.map((ref) => (
          <Card key={ref.id}>
            <div className="relative aspect-video overflow-hidden">
              {ref.thumbnail ? (
                <img src={ref.thumbnail} alt={ref.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  {getTypeIcon(ref.type)}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">{ref.type}</Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <h3 className="font-semibold line-clamp-1">{ref.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{ref.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-3">
                {ref.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(ref.createdAt)}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditingRef(ref); setShowModal(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRefs.length === 0 && (
          <Card className="col-span-full text-center py-12">
            <Library className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma referência encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedType !== "all"
                ? "Tente ajustar sua busca ou filtros"
                : "Comece salvando sua primeira referência"}
            </p>
            <Button onClick={() => { setEditingRef(null); setShowModal(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Referência
            </Button>
          </Card>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingRef ? "Editar Referência" : "Nova Referência"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="refUrl">URL *</Label>
                  <Input
                    id="refUrl"
                    type="url"
                    defaultValue={editingRef?.url || ""}
                    placeholder="https://youtube.com/watch?v=... ou https://artigo.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="refTitle">Título</Label>
                  <Input
                    id="refTitle"
                    defaultValue={editingRef?.title || ""}
                    placeholder="Título da referência (auto-preenchido se for YouTube)"
                  />
                </div>
                <div>
                  <Label htmlFor="refType">Tipo</Label>
                  <select
                    id="refType"
                    defaultValue={editingRef?.type || "video"}
                    className="input"
                  >
                    {types.slice(1).map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="refDescription">Descrição</Label>
                  <textarea
                    id="refDescription"
                    defaultValue={editingRef?.description || ""}
                    placeholder="Por que salvou esta referência? O que achou interessante?"
                    className="input min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="refTags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="refTags"
                    defaultValue={editingRef?.tags.join(", ") || ""}
                    placeholder="thumbnail, design, viral, CTR"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setShowModal(false)}>
                    {editingRef ? "Salvar Alterações" : "Salvar Referência"}
                  </Button>
                </div>
              </form>
            </CardContent>
</Card>
        </div>
      )}
    </div>
  );
}