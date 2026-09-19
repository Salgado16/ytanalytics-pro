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
  BookOpen,
  Plus,
  Search,
  Tag,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

const mockSkills = [
  {
    id: "1",
    title: "Estrutura de Roteiro Perfeito",
    description: "Template completo para roteiros de vídeos educativos com gancho, desenvolvimento e CTA.",
    category: "Roteiro",
    tags: ["educativo", "template", "gancho", "CTA"],
    content: "# Estrutura de Roteiro Perfeito\n\n## 1. Gancho (0-15s)\n- Pergunta intrigante\n- Promessa de valor\n- Preview do resultado\n\n## 2. Introdução (15-30s)\n- Apresentação rápida\n- Credibilidade\n- Roadmap do vídeo\n\n## 3. Desenvolvimento (30s-80%)\n- Pontos principais\n- Exemplos práticos\n- Visual aids\n\n## 4. Conclusão (últimos 20%)\n- Resumo\n- Próximos passos\n- CTA claro",
    sourceUrl: "https://example.com",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Thumbnail que Converte",
    description: "Princípios de design para thumbnails com CTR acima de 8%.",
    category: "Design",
    tags: ["thumbnail", "CTR", "design", "psicologia"],
    content: "# Thumbnail que Converte\n\n## Elementos Essenciais\n1. **Rosto com expressão** - Aumenta CTR em 30%\n2. **Texto mínimo (3-4 palavras)** - Legível no mobile\n3. **Contraste alto** - Destaca no feed\n4. **Seta/seta visual** - Direciona o olhar\n\n## Cores que Funcionam\n- Amarelo + Preto (alto contraste)\n- Vermelho + Branco (urgência)\n- Azul + Laranja (complementar)\n\n## Teste A/B\n- Teste 2 versões por 24h\n- Mínimo 1000 impressões cada\n- Escolha winner por CTR",
    sourceUrl: "",
    createdAt: "2024-01-08T14:30:00Z",
  },
  {
    id: "3",
    title: "SEO para YouTube 2024",
    description: "Checklist completo de otimização para busca e sugeridos.",
    category: "SEO",
    tags: ["SEO", "tags", "título", "descrição", "algoritmo"],
    content: "# SEO para YouTube 2024\n\n## Título (60 chars)\n- Palavra-chave no início\n- Benefício claro\n- Curiosidade/emoção\n\n## Descrição\n- 2 primeiras linhas: resumo + link\n- Timestamps\n- Links sociais\n- Hashtags (3-5)\n\n## Tags\n- 5-8 tags relevantes\n- Mix: broad + specific + long-tail\n- Incluir erros comuns de digitação\n\n## Arquivo de vídeo\n- Nome do arquivo: keyword-principal.mp4\n- Legendas fechadas (SRT)\n- Capítulos",
    sourceUrl: "https://youtube.com/creator-academy",
    createdAt: "2024-01-05T09:15:00Z",
  },
];

const categories = ["Todos", "Roteiro", "Design", "SEO", "Edição", "Crescimento", "Monetização", "Equipamento"];

export default function SkillsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Skills</h1>
          <p className="text-muted-foreground">
            Salve e organize conhecimentos, templates e referências para seus vídeos
          </p>
        </div>
        <Button onClick={() => { setEditingSkill(null); setShowModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Skill
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{skill.description}</p>
                </div>
                <Badge variant="outline">{skill.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {skill.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(skill.createdAt)}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingSkill(skill); setShowModal(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  {skill.sourceUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={skill.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSkills.length === 0 && (
          <Card className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma skill encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "Todos"
                ? "Tente ajustar sua busca ou filtros"
                : "Comece salvando sua primeira skill"}
            </p>
            <Button onClick={() => { setEditingSkill(null); setShowModal(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Skill
            </Button>
          </Card>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingSkill ? "Editar Skill" : "Nova Skill"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    defaultValue={editingSkill?.title || ""}
                    placeholder="Ex: Estrutura de Roteiro Perfeito"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    defaultValue={editingSkill?.category || "Roteiro"}
                    className="input"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <textarea
                    id="description"
                    defaultValue={editingSkill?.description || ""}
                    placeholder="Resumo do que esta skill ensina..."
                    className="input min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    defaultValue={editingSkill?.tags.join(", ") || ""}
                    placeholder="roteiro, template, gancho, CTA"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Conteúdo Completo (Markdown)</Label>
                  <textarea
                    id="content"
                    defaultValue={editingSkill?.content || ""}
                    placeholder="Conteúdo detalhado da skill..."
                    className="input min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="sourceUrl">URL de Referência (opcional)</Label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    defaultValue={editingSkill?.sourceUrl || ""}
                    placeholder="https://exemplo.com"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={() => setShowModal(false)}>
                    {editingSkill ? "Salvar Alterações" : "Criar Skill"}
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