"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Trash2,
  History,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

const mockHistory = [
  {
    id: "1",
    text: "Bem-vindo ao meu canal! Hoje vamos falar sobre como crescer no YouTube...",
    voice: "Google Português do Brasil",
    language: "pt-BR",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    text: "Neste vídeo vou mostrar os melhores equipamentos para começar...",
    voice: "Google Português do Brasil",
    language: "pt-BR",
    createdAt: "2024-01-10T14:30:00Z",
  },
];

export default function TTSPage() {
  const { user } = useAuth();
  const { speak, pause, resume, stop, speaking, paused, voices, selectedVoice, setSelectedVoice, rate, setRate, pitch, setPitch, volume, setVolume } = useTextToSpeech();
  const [text, setText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleSpeak = () => {
    if (text.trim()) {
      speak(text);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Text-to-Speech</h1>
          <p className="text-muted-foreground">
            Converta texto em áudio natural para seus vídeos
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Editor de Texto</CardTitle>
            <CardDescription>Digite ou cole o texto que deseja converter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole seu roteiro aqui...&#10;&#10;Dica: Use pontuação para pausas naturais. Vírgulas = pausa curta. Pontos = pausa longa."
              className="min-h-[300px] font-mono text-sm"
              rows={15}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{text.length} caracteres</span>
              <span>{text.trim() ? text.trim().split(/\s+/).length : 0} palavras</span>
              <span>{text.split("\n").length} linhas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controles de Voz</CardTitle>
            <CardDescription>Configure a narração</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="voice">Voz</Label>
              <select
                id="voice"
                value={selectedVoice?.id || ""}
                onChange={(e) => setSelectedVoice(voices.find(v => v.id === e.target.value) || null)}
                className="input mt-1"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} ({voice.language})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {voices.length === 0 ? "Carregando vozes do sistema..." : `${voices.length} vozes disponíveis`}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="rate">Velocidade: {rate}x</Label>
                <input
                  id="rate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pitch">Tom: {pitch}x</Label>
                <input
                  id="pitch"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <Label htmlFor="volume">Volume: {Math.round(volume * 100)}%</Label>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleSpeak}
                disabled={speaking || !text.trim()}
              >
                {speaking && !paused ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Pausar
                  </>
                ) : paused ? (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Continuar
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Gerar Áudio
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={stop}
                disabled={!speaking && !paused}
              >
                <VolumeX className="h-5 w-5 mr-2" />
                Parar
              </Button>
            </div>

            {speaking && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  {paused ? "⏸ Pausado" : "▶ Reproduzindo..."}
                </p>
              </div>
            )}
          </CardContent>
</Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Histórico Recente</CardTitle>
            <CardDescription>Suas últimas gerações de áudio</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <History className="h-4 w-4 mr-1" />
            {showHistory ? "Ocultar" : "Ver mais"}
          </Button>
        </CardHeader>
        <CardContent>
          {showHistory && mockHistory.length > 0 ? (
            <div className="space-y-3">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.text}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{item.voice}</span>
                      <span>{item.language}</span>
                      <span>{formatRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum histórico ainda. Gere seu primeiro áudio acima!</p>
            </div>
          )}
        </CardContent>
</Card>
    </div>
  );
}