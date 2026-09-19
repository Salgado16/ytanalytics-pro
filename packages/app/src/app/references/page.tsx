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
  Plus,
  Trash2,
  Film,
  Music,
  Image,
  BookOpen,
  Link2,
  ExternalLink,
  Save,
  X,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Badge } from "@/components/ui";

const TYPES = [
  { value: "video", label: "Vídeo", icon: Film },
  { value: "channel", label: "Canal", icon: Film },
  { value: "article", label: "Artigo", icon: BookOpen },
  { value: "image", label: "Imagem", icon: Image },
  { value: "audio", label: "Áudio", icon: Music },
  { value: "link", label: "Link", icon: Link2 },
];

interface Reference {
  id: string;
  title: string;
  type: string;
  url: string;
  thumbnail?: string;
  description?: string;
  tags: string[];
  channelId?: string;
  videoId?: string;
  createdAt: string;
}

export default function ReferencesPage() {
  const { user } = useAuth();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRef, setEditingRef] = useState<Reference | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "video",
    url: "",
    thumbnail: "",
    description: "",
    tags: "",
    channelId: "",
    videoId: "",
  });

  const loadReferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/references", { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao carregar referências");
      const data = await res.json();
      setReferences(data || []);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar referências");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  const filteredRefs = references.filter((ref) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ref.title.toLowerCase().includes(q) ||
      ref.description?.toLowerCase().includes(q) ||
      ref.tags.some((t) => t.toLowerCase().includes(q)) ||
      ref.type.toLowerCase().includes(q)
    );
  });

  const resetForm = () => {
    setFormData({ title: "", type: "video", url: "", thumbnail: "", description: "", tags: "", channelId: "", videoId: "" });
    setEditingRef(null);
    setShowForm(false);
  };

  const openForm = (ref?: Reference) => {
    if (ref) {
      setEditingRef(ref);
      setFormData({
        title: ref.title,
        type: ref.type,
        url: ref.url,
        thumbnail: ref.thumbnail || "",
        description: ref.description || "",
        tags: ref.tags.join(", "),
        channelId: ref.channelId || "",
        videoId: ref.videoId || "",
      });
    } else {
      setEditingRef(null);
      setFormData({ title: "", type: "video", url: "", thumbnail: "", description: "", tags: "", channelId: "", videoId: "" });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editingRef ? `/api/references/${editingRef.id}` : "/api/references";
      const method = editingRef ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          url: formData.url,
          thumbnail: formData.thumbnail || undefined,
          description: formData.description || undefined,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          channelId: formData.channelId || undefined,
          videoId: formData.videoId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar");
      await loadReferences();
      resetForm();
    } catch (e: any) {
      setError(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta referência?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/references/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover");
      await loadReferences();
    } catch (e: any) {
      setError(e.message || "Erro ao remover");
    }
  };

  const typeConfig = TYPES.find((t) => t.value === formData.type) || TYPES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referências</h1>
          <p className="text-muted-foreground">
            Salve e organize inspirações, canais, vídeos e artigos
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Referência
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar referências..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && filteredRefs.length === 0 && !showForm && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Film className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma referência salva</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Adicione vídeos, canais, artigos ou links que te inspiram para consultar depois.
            </p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeira Referência
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRefs.map((ref) => {
          const type = TYPES.find((t) => t.value === ref.type) || TYPES[0];
          const Icon = type.icon;
          return (
            <Card key={ref.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{ref.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {type.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(ref.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {ref.thumbnail && (
                  <img
                    src={ref.thumbnail}
                    alt={ref.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                {ref.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ref.description}</p>
                )}
                {ref.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ref.tags.slice(0, 4).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs h-5">
                        {tag}
                      </Badge>
                    ))}
                    {ref.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs h-5">
                        +{ref.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {new Date(ref.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openForm(ref)}
                    className="text-primary hover:bg-primary/10"
                  >
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{editingRef ? "Editar Referência" : "Nova Referência"}</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para {editingRef ? "atualizar" : "criar"} sua referência
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Título *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Como editar vídeos no Premiere"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">
                    Tipo *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input w-full"
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium mb-1">
                    URL *
                  </label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... ou https://..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium mb-1">
                    Thumbnail (URL da imagem)
                  </label>
                  <Input
                    id="thumbnail"
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Descrição / Notas
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Por que isso é relevante? O que aprender?"
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Ex: edição, premiere, tutorial, cortes"
                  />
                </div>

                {formData.type === "video" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="videoId" className="block text-sm font-medium mb-1">
                        Video ID (YouTube)
                      </label>
                      <Input
                        id="videoId"
                        value={formData.videoId}
                        onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                        placeholder="dQw4w9WgXcQ"
                      />
                    </div>
                    <div>
                      <label htmlFor="channelId" className="block text-sm font-medium mb-1">
                        Channel ID (YouTube)
                      </label>
                      <Input
                        id="channelId"
                        value={formData.channelId}
                        onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                        placeholder="UC..."
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingRef ? "Salvar alterações" : "Criar Referência"}
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