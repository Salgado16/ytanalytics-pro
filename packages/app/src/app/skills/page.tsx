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
  BookOpen,
  Code,
  Palette,
  Zap,
  Brain,
  Globe,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Badge } from "@/components/ui";

const CATEGORIES = [
  { value: "programming", label: "Programação", icon: Code },
  { value: "design", label: "Design", icon: Palette },
  { value: "marketing", label: "Marketing", icon: Zap },
  { value: "writing", label: "Escrita", icon: BookOpen },
  { value: "analysis", label: "Análise", icon: Brain },
  { value: "languages", label: "Idiomas", icon: Globe },
  { value: "other", label: "Outro", icon: BookOpen },
];

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  sourceUrl?: string;
  createdAt: string;
}

export default function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "programming",
    tags: "",
    content: "",
    sourceUrl: "",
  });

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/skills", { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao carregar skills");
      const data = await res.json();
      setSkills(data || []);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar skills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "programming", tags: "", content: "", sourceUrl: "" });
    setEditingSkill(null);
    setShowForm(false);
  };

  const openForm = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        title: skill.title,
        description: skill.description,
        category: skill.category,
        tags: skill.tags.join(", "),
        content: skill.content,
        sourceUrl: skill.sourceUrl || "",
      });
    } else {
      setEditingSkill(null);
      setFormData({ title: "", description: "", category: "programming", tags: "", content: "", sourceUrl: "" });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          content: formData.content,
          sourceUrl: formData.sourceUrl || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar");
      await loadSkills();
      resetForm();
    } catch (e: any) {
      setError(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta skill?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover");
      await loadSkills();
    } catch (e: any) {
      setError(e.message || "Erro ao remover");
    }
  };

  const categoryConfig = CATEGORIES.find((c) => c.value === formData.category) || CATEGORIES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Skills</h1>
          <p className="text-muted-foreground">
            Organize e documente suas competências técnicas e criativas
          </p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Skill
        </Button>
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

      {!loading && skills.length === 0 && !showForm && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma skill cadastrada</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Adicione suas competências para consultar rapidamente e usar nos seus projetos.
            </p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeira Skill
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => {
          const cat = CATEGORIES.find((c) => c.value === skill.category) || CATEGORIES[0];
          const Icon = cat.icon;
          return (
            <Card key={skill.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{skill.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {cat.label}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                {skill.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skill.tags.slice(0, 5).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs h-5">
                        {tag}
                      </Badge>
                    ))}
                    {skill.tags.length > 5 && (
                      <Badge variant="secondary" className="text-xs h-5">
                        +{skill.tags.length - 5}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {new Date(skill.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openForm(skill)}
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
                <CardTitle>{editingSkill ? "Editar Skill" : "Nova Skill"}</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para {editingSkill ? "atualizar" : "criar"} sua skill
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
                    placeholder="Ex: React Avançado"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Categoria *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input w-full"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Descrição *
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva brevemente esta skill..."
                    rows={3}
                    required
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
                    placeholder="Ex: hooks, context, performance, typescript"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Conteúdo / Anotações
                  </label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Detalhes, exemplos de código, links úteis..."
                    rows={4}
                  />
                </div>

                <div>
                  <label htmlFor="sourceUrl" className="block text-sm font-medium mb-1">
                    URL de referência (opcional)
                  </label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

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
                    {editingSkill ? "Salvar alterações" : "Criar Skill"}
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