"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranscription } from "@/hooks/useTranscription";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  FileText,
  Upload,
  Mic,
  Video,
  Link2,
  Loader2,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pendente", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: Loader2 },
  processing: { label: "Processando", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", icon: Loader2 },
  completed: { label: "Concluído", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle },
  failed: { label: "Erro", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", icon: XCircle },
};

export default function TranscriptionsPage() {
  const { user } = useAuth();
  const { transcriptions, loading, createTranscription, deleteTranscription, pollTranscription } = useTranscription();
  const [showModal, setShowModal] = useState(false);
  const [sourceType, setSourceType] = useState<"video" | "audio" | "youtube_url">("youtube_url");
  const [sourceUrl, setSourceUrl] = useState("");
  const [language, setLanguage] = useState("pt-BR");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl.trim()) return;
    const result = await createTranscription(sourceType, sourceUrl, language);
    if (result) {
      setShowModal(false);
      setSourceUrl("");
      pollTranscription(result.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transcrições</h1>
          <p className="text-muted-foreground">
            Converta vídeos e áudios em texto com timestamps
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Nova Transcrição
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar transcrições..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Todas</Button>
          <Button variant="outline" size="sm">Concluídas</Button>
          <Button variant="outline" size="sm">Processando</Button>
          <Button variant="outline" size="sm">Erros</Button>
        </div>
      </div>

      {transcriptions.length === 0 && !loading ? (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma transcrição ainda</h3>
            <p className="text-muted-foreground mb-6">
              Faça upload de um arquivo de vídeo/áudio ou cole um link do YouTube
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Criar Primeira Transcrição
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transcriptions.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {t.sourceType === "youtube_url" ? (
                      <Video className="h-6 w-6 text-muted-foreground" />
                    ) : t.sourceType === "video" ? (
                      <Video className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <Mic className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium truncate">{t.sourceUrl}</h4>
                      <Badge variant="outline" className="text-xs">{t.language}</Badge>
                      <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", statusConfig[t.status].bg, statusConfig[t.status].color)}>
                        {(() => { const Icon = statusConfig[t.status].icon; return <Icon className="h-3 w-3" />; })()}
                        {statusConfig[t.status].label}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{formatRelativeTime(t.createdAt)}</p>
                    {t.error && (
                      <p className="text-sm text-red-600 mt-1">Erro: {t.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {t.status === "completed" && t.text && (
                      <Button variant="ghost" size="icon" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {t.status === "completed" && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteTranscription(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {expandedId === t.id && t.text && (
                  <div className="mt-4 p-4 rounded-lg bg-muted border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Transcrição Completa</span>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(t.text || "")}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                    <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm font-mono">
                      {t.text}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nova Transcrição</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tipo de Fonte</Label>
                  <div className="flex gap-2 mt-2">
                    {([
                      { value: "youtube_url", label: "YouTube URL", icon: Link2 },
                      { value: "video", label: "Arquivo de Vídeo", icon: Video },
                      { value: "audio", label: "Arquivo de Áudio", icon: Mic },
                    ] as const).map((opt) => (
                      <Button
                        key={opt.value}
                        variant={sourceType === opt.value ? "primary" : "outline"}
                        type="button"
                        onClick={() => setSourceType(opt.value)}
                        className="flex-1 gap-2"
                      >
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="sourceUrl">
                    {sourceType === "youtube_url" ? "URL do YouTube" : sourceType === "video" ? "Arquivo de Vídeo" : "Arquivo de Áudio"} *
                  </Label>
                  {sourceType === "youtube_url" ? (
                    <Input
                      id="sourceUrl"
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..."
                      required
                    />
                  ) : (
                    <Input
                      id="sourceUrl"
                      type="file"
                      accept={sourceType === "video" ? "video/*" : "audio/*"}
                      onChange={(e) => setSourceUrl(e.target.files?.[0]?.name || "")}
                      required
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input mt-1"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="pt-PT">Português (Portugal)</option>
                    <option value="en-US">Inglês (EUA)</option>
                    <option value="en-GB">Inglês (Reino Unido)</option>
                    <option value="es-ES">Espanhol</option>
                    <option value="fr-FR">Francês</option>
                    <option value="auto">Detectar Automaticamente</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading || !sourceUrl.trim()}>
                    {loading ? "Iniciando..." : "Iniciar Transcrição"}
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