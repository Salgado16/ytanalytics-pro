"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIdeasBoard } from "@/hooks/useIdeasBoard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Plus,
  Lightbulb,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Badge } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const STATUS_CONFIG = {
  backlog: { label: "Backlog", color: "bg-gray-100 dark:bg-gray-800" },
  researching: { label: "Pesquisando", color: "bg-blue-100 dark:bg-blue-900/30" },
  scripting: { label: "Roteirizando", color: "bg-indigo-100 dark:bg-indigo-900/30" },
  recording: { label: "Gravando", color: "bg-purple-100 dark:bg-purple-900/30" },
  editing: { label: "Editando", color: "bg-pink-100 dark:bg-pink-900/30" },
  scheduled: { label: "Agendado", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  published: { label: "Publicado", color: "bg-green-100 dark:bg-green-900/30" },
  archived: { label: "Arquivado", color: "bg-gray-100 dark:bg-gray-800" },
} as const;

const PRIORITY_COLORS = {
  low: "text-gray-600 dark:text-gray-400",
  medium: "text-blue-600 dark:text-blue-400",
  high: "text-orange-600 dark:text-orange-400",
  urgent: "text-red-600 dark:text-red-400",
};

export default function IdeasPage() {
  const { user } = useAuth();
  const { ideas, loading, createIdea, updateIdea, deleteIdea, moveIdea, getIdeasByStatus, statuses } = useIdeasBoard();
  const [showModal, setShowModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || idea.status === filterStatus;
    const matchesPriority = filterPriority === "all" || idea.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const idea = ideas.find((i) => i.id === draggableId);
    if (idea && destination.droppableId !== idea.status) {
      moveIdea(idea.id, destination.droppableId as any);
    }
  };

  const getStatusIdeas = (status: string) => {
    return filteredIdeas.filter((i) => i.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quadro de Ideias</h1>
            <p className="text-muted-foreground">
              Organize suas ideias de vídeos no estilo Kanban
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode("kanban")}>
              <GripVertical className="h-4 w-4 mr-1" />
              Kanban
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
              <ChevronRight className="h-4 w-4 mr-1" />
              Lista
            </Button>
            <Button onClick={() => { setEditingIdea(null); setShowModal(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ideia
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ideias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-40">
              <option value="all">Todos status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}</option>
              ))}
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="input w-40">
              <option value="all">Todas prioridades</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {statuses.map((status) => {
              const statusIdeas = getStatusIdeas(status);
              const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
              return (
                <Droppable key={status} droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-col min-w-[300px] max-w-[300px] rounded-xl bg-muted/50 p-3",
                        snapshot.isDraggingOver && "ring-2 ring-primary"
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs", config.color)}>
                            {config.label}
                          </span>
                          <span className="text-muted-foreground text-sm">({statusIdeas.length})</span>
                        </h3>
                      </div>
                      <div className="flex-1 space-y-3 min-h-[200px]">
                        {statusIdeas.map((idea, index) => (
                          <Draggable key={idea.id} draggableId={idea.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "p-3 rounded-lg border bg-card shadow-sm transition-shadow",
                                  snapshot.isDragging && "shadow-lg rotate-1"
                                )}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm">{idea.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {idea.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          <Tag className="h-3 w-3 mr-1" />
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                      <span className={cn("font-medium", PRIORITY_COLORS[idea.priority])}>
                                        {idea.priority}
                                      </span>
                                      {idea.scheduledAt && (
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {formatRelativeTime(idea.scheduledAt)}
                                        </span>
                                      )}
                                      {idea.estimatedDuration && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {idea.estimatedDuration}min
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => { setEditingIdea(idea); setShowModal(true); }}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteIdea(idea.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr className="table-row">
                      <th className="table-head">Ideia</th>
                      <th className="table-head">Status</th>
                      <th className="table-head">Prioridade</th>
                      <th className="table-head">Tags</th>
                      <th className="table-head">Agendado</th>
                      <th className="table-head">Criado</th>
                      <th className="table-head text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredIdeas.map((idea) => (
                      <tr key={idea.id} className="table-row">
                        <td className="table-cell">
                          <div>
                            <p className="font-medium">{idea.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{idea.description}</p>
                          </div>
                        </td>
                        <td className="table-cell">
                          <Badge variant="secondary">{STATUS_CONFIG[idea.status as keyof typeof STATUS_CONFIG].label}</Badge>
                        </td>
                        <td className="table-cell">
                          <span className={cn("font-medium", PRIORITY_COLORS[idea.priority])}>
                            {idea.priority}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-wrap gap-1">
                            {idea.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="table-cell">
                          {idea.scheduledAt ? formatRelativeTime(idea.scheduledAt) : "-"}
                        </td>
                        <td className="table-cell text-muted-foreground">
                          {formatRelativeTime(idea.createdAt)}
                        </td>
                        <td className="table-cell text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingIdea(idea); setShowModal(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteIdea(idea.id)}>
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
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingIdea ? "Editar Ideia" : "Nova Ideia"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      defaultValue={editingIdea?.title || ""}
                      placeholder="Título do vídeo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <textarea
                      id="description"
                      defaultValue={editingIdea?.description || ""}
                      placeholder="Descreva a ideia, ângulo, pontos principais..."
                      className="input min-h-[100px]"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        defaultValue={editingIdea?.status || "backlog"}
                        className="input mt-1"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <select
                        id="priority"
                        defaultValue={editingIdea?.priority || "medium"}
                        className="input mt-1"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      defaultValue={editingIdea?.tags.join(", ") || ""}
                      placeholder="tutorial, iniciante, youtube, crescimento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Palavras-chave Alvo (separadas por vírgula)</Label>
                    <Input
                      id="keywords"
                      defaultValue={editingIdea?.targetKeywords.join(", ") || ""}
                      placeholder="como crescer no youtube, dicas youtube, algoritmo youtube"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="estimatedDuration">Duração Estimada (min)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        defaultValue={editingIdea?.estimatedDuration || ""}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduledAt">Data de Publicação</Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        defaultValue={editingIdea?.scheduledAt ? editingIdea.scheduledAt.slice(0, 16) : ""}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="thumbnailIdeas">Ideias de Thumbnail (uma por linha)</Label>
                    <textarea
                      id="thumbnailIdeas"
                      defaultValue={editingIdea?.thumbnailIdeas.join("\n") || ""}
                      placeholder="Ideia 1&#10;Ideia 2&#10;Ideia 3"
                      className="input min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="references">Referências (URLs, uma por linha)</Label>
                    <textarea
                      id="references"
                      defaultValue={editingIdea?.references.join("\n") || ""}
                      placeholder="https://youtube.com/watch?v=...&#10;https://artigo.com/..."
                      className="input min-h-[80px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" onClick={() => setShowModal(false)}>
                      {editingIdea ? "Salvar Alterações" : "Criar Ideia"}
                    </Button>
                  </div>
                </form>
              </CardContent>
</Card>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}