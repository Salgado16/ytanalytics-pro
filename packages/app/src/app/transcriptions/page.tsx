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
  FileText,
  Download,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Youtube,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";

interface Caption {
  id: string;
  snippet: {
    videoId: string;
    language: string;
    name: string;
    trackKind: string;
    isDraft: boolean;
    isAutoSynced: boolean;
    status: string;
  };
}

export default function TranscriptionsPage() {
  const { user } = useAuth();
  const [videoId, setVideoId] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);

  const fetchCaptions = useCallback(async () => {
    if (!videoId.trim()) return;
    // Valida se parece com um videoId válido (11 chars alfanuméricos, -, _)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId.trim())) {
      setError("ID do vídeo inválido. Use um ID de 11 caracteres ou uma URL válida do YouTube.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/transcriptions?videoId=${encodeURIComponent(videoId.trim())}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao buscar legendas");
      }
      const data = await res.json();
      setCaptions(data || []);
      if (!data || data.length === 0) {
        setError("Nenhuma legenda encontrada para este vídeo. O vídeo pode não ter legendas ativadas.");
      }
    } catch (e: any) {
      setError(e.message || "Erro ao buscar legendas");
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  const downloadCaption = async (captionId: string, format: "srt" | "vtt" = "srt") => {
    setDownloading(captionId);
    setError(null);
    try {
      const res = await fetch(`/api/transcriptions?videoId=${encodeURIComponent(videoId)}&action=download&captionId=${captionId}&format=${format}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao baixar legenda");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `legenda_${captionId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess(`Legenda baixada em formato ${format.toUpperCase()}`);
    } catch (e: any) {
      setError(e.message || "Erro ao baixar legenda");
    } finally {
      setDownloading(null);
    }
  };

  const copyCaptionId = (captionId: string) => {
    navigator.clipboard.writeText(captionId);
    setSuccess("Caption ID copiado para a área de transferência");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transcrições (Legendas do YouTube)</h1>
        <p className="text-muted-foreground">
          Baixe legendas de qualquer vídeo do YouTube que tenha closed captions disponíveis.
          Use seu login OAuth do YouTube para acessar legendas de vídeos próprios ou públicos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            Buscar Legendas
          </CardTitle>
          <CardDescription>
            Cole o ID do vídeo ou a URL completa do YouTube
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: dQw4w9WgXcQ ou https://youtube.com/watch?v=dQw4w9WgXcQ"
              value={videoId}
              onChange={(e) => {
                const input = e.target.value;
                // Extrai videoId de várias formas de URL do YouTube
                const patterns = [
                  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
                  /^([a-zA-Z0-9_-]{11})$/ // ID direto
                ];
                let extracted = input;
                for (const pattern of patterns) {
                  const match = input.match(pattern);
                  if (match) {
                    extracted = match[1];
                    break;
                  }
                }
                setVideoId(extracted);
              }}
              className="flex-1"
            />
            <Button onClick={fetchCaptions} disabled={loading || !videoId.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            O ID do vídeo é extraído automaticamente da URL se você colar o link completo.
          </p>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="flex items-center gap-2 py-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="flex items-center gap-2 py-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </CardContent>
        </Card>
      )}

      {!loading && captions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Legendas Encontradas ({captions.length})
            </CardTitle>
            <CardDescription>
              Selecione uma legenda para baixar nos formatos SRT ou VTT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {captions.map((caption) => {
                const s = caption.snippet;
                const isSelected = selectedCaption === caption.id;
                return (
                  <div
                    key={caption.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isSelected ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedCaption(isSelected ? null : caption.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{s.name || s.language}</span>
                          <Badge variant="secondary" className="text-xs">
                            {s.language}
                          </Badge>
                          <Badge variant={s.trackKind === "ASR" ? "outline" : "default"} className="text-xs">
                            {s.trackKind === "ASR" ? "Automática" : "Manual"}
                          </Badge>
                          {s.isAutoSynced && (
                            <Badge variant="outline" className="text-xs">
                              Auto-sincronizada
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {s.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Caption ID: <code className="bg-muted px-1 rounded">{caption.id}</code>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); copyCaptionId(caption.id); }}
                          title="Copiar Caption ID"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); downloadCaption(caption.id, "srt"); }}
                          disabled={downloading === caption.id}
                        >
                          {downloading === caption.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          SRT
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); downloadCaption(caption.id, "vtt"); }}
                          disabled={downloading === caption.id}
                        >
                          {downloading === caption.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          VTT
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && videoId && captions.length === 0 && !error && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma legenda encontrada</h3>
            <p className="text-muted-foreground max-w-md">
              Este vídeo não possui legendas disponíveis via API do YouTube.
              Apenas vídeos com closed captions ativadas pelo criador ou geradas automaticamente
              pelo YouTube podem ter legendas extraídas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}