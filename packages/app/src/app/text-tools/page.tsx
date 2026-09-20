"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTextTools } from "@/hooks/useTextTools";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Type,
  Scissors,
  Hash,
  Award,
  Copy,
  Download,
  Save,
  History,
  RotateCcw,
  Maximize2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<any>; color: string }) => {
  return (
    <Card className="stat-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const copyOutput = (output: any) => {
  if (!output) return "";
  if (output.hashtags) return output.hashtags.join(", ");
  if (output.titles) return output.titles.map((t: any) => t.title).join("\n");
  if (output.parts) return output.parts.join("\n\n---\n\n");
  return JSON.stringify(output, null, 2);
};

const tools = [
  { id: "character_count", label: "Contador de Caracteres", icon: Type, description: "Conta caracteres, palavras, linhas e parágrafos" },
  { id: "text_splitter", label: "Divisor de Texto", icon: Scissors, description: "Divide texto longo em partes menores para Shorts, Reels, etc" },
  { id: "hashtag_generator", label: "Gerador de Hashtags", icon: Hash, description: "Gera hashtags relevantes baseadas no seu conteúdo" },
  { id: "title_optimizer", label: "Otimizador de Títulos", icon: Award, description: "Sugere títulos otimizados para CTR e SEO" },
];

export default function TextToolsPage() {
  const { user } = useAuth();
  const { characterCount, wordCount, splitText, generateHashtags, optimizeTitle, saveResult, history } = useTextTools();
  const [activeTool, setActiveTool] = useState("character_count");
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [splitSettings, setSplitSettings] = useState({ method: "chars" as "chars" | "words" | "sentences" | "paragraphs", maxSize: 2000, overlap: 0 });
  const [hashtagCount, setHashtagCount] = useState(10);
  const [titleStyle, setTitleStyle] = useState<"clickbait" | "seo" | "educational" | "viral">("seo");
  const [processing, setProcessing] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    switch (activeTool) {
      case "character_count":
        setOutput(characterCount(inputText));
        break;
      case "word_count":
        setOutput(wordCount(inputText));
        break;
      case "text_splitter":
        setOutput(splitText(inputText, splitSettings.method, splitSettings.maxSize, splitSettings.overlap));
        break;
      case "hashtag_generator":
        setProcessing(true);
        generateHashtags(inputText, hashtagCount).then((res) => {
          setOutput(res);
          setProcessing(false);
        });
        break;
      case "title_optimizer":
        setProcessing(true);
        optimizeTitle(inputText, titleStyle).then((res) => {
          setOutput(res);
          setProcessing(false);
        });
        break;
    }
  };

  const handleSave = () => {
    if (!output) return;
    saveResult({
      type: activeTool as any,
      input: inputText,
      output: JSON.stringify(output),
      settings: activeTool === "text_splitter" ? splitSettings : activeTool === "hashtag_generator" ? { count: hashtagCount } : activeTool === "title_optimizer" ? { style: titleStyle } : {},
    });
  };

  const toolConfig = tools.find((t) => t.id === activeTool)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ferramentas de Texto</h1>
          <p className="text-muted-foreground">
            Utilitários para otimizar seus roteiros, títulos e descrições
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ferramentas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "primary" : "outline"}
                className="w-full justify-start gap-3"
                onClick={() => { setActiveTool(tool.id); setOutput(null); }}
              >
                <tool.icon className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{toolConfig.label}</CardTitle>
            <CardDescription>{toolConfig.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="inputText">Texto de Entrada</Label>
              <div className="relative mt-1">
                <Textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeTool === "character_count" || activeTool === "word_count"
                    ? "Cole seu texto aqui para análise..."
                    : activeTool === "text_splitter"
                    ? "Cole o texto longo que deseja dividir..."
                    : activeTool === "hashtag_generator"
                    ? "Descreva seu vídeo/tópico para gerar hashtags..."
                    : "Digite seu título atual ou tema do vídeo..."}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(inputText)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setInputText("")}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {activeTool === "text_splitter" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Método de Divisão</Label>
                  <select
                    value={splitSettings.method}
                    onChange={(e) => setSplitSettings({ ...splitSettings, method: e.target.value as any })}
                    className="input mt-1"
                  >
                    <option value="chars">Por Caracteres</option>
                    <option value="words">Por Palavras</option>
                    <option value="sentences">Por Frases</option>
                    <option value="paragraphs">Por Parágrafos</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="maxSize">Tamanho Máximo por Parte</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    value={splitSettings.maxSize}
                    onChange={(e) => setSplitSettings({ ...splitSettings, maxSize: parseInt(e.target.value) })}
                    min="100"
                    max="10000"
                  />
                </div>
                <div>
                  <Label htmlFor="overlap">Sobreposição (caracteres)</Label>
                  <Input
                    id="overlap"
                    type="number"
                    value={splitSettings.overlap}
                    onChange={(e) => setSplitSettings({ ...splitSettings, overlap: parseInt(e.target.value) })}
                    min="0"
                    max="500"
                  />
                </div>
              </div>
            )}

            {activeTool === "hashtag_generator" && (
              <div>
                <Label htmlFor="hashtagCount">Número de Hashtags</Label>
                <Input
                  id="hashtagCount"
                  type="number"
                  value={hashtagCount}
                  onChange={(e) => setHashtagCount(parseInt(e.target.value))}
                  min="5"
                  max="30"
                  className="mt-1 w-32"
                />
              </div>
            )}

            {activeTool === "title_optimizer" && (
              <div>
                <Label>Estilo do Título</Label>
                <div className="flex gap-2 mt-2">
                  {[
                    { value: "seo", label: "SEO", desc: "Otimizado para busca" },
                    { value: "clickbait", label: "Clickbait", desc: "Alta curiosidade" },
                    { value: "educational", label: "Educativo", desc: "Claro e direto" },
                    { value: "viral", label: "Viral", desc: "Engajamento máximo" },
                  ].map((opt) => (
                    <Button
                      key={opt.value}
                      variant={titleStyle === opt.value ? "primary" : "outline"}
                      onClick={() => setTitleStyle(opt.value as any)}
                      className="flex-1 flex-col text-left gap-1"
                    >
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button size="lg" onClick={handleAnalyze} disabled={processing || !inputText.trim()} className="flex-1">
                {processing ? "Processando..." : activeTool === "character_count" || activeTool === "word_count" ? "Analisar" : "Gerar"}
              </Button>
              {output && (
                <Button variant="outline" onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Resultado
                </Button>
              )}
            </div>

            {output && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border bg-muted/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Resultado</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(copyOutput(output))}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {activeTool === "hashtag_generator" && output.hashtags && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Hash className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {output.hashtags.length} hashtags • {output.source === "youtube_real_data" ? "Dados reais do YouTube" : "Fallback"}
                        </span>
                      </div>

                      <div className="p-4 rounded-lg bg-background border border-border/50 font-mono text-sm select-all">
                        {output.hashtags.join(", ")}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {output.tags?.slice(0, 20).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10 hover:text-primary" onClick={() => navigator.clipboard.writeText(tag)}>
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {output.titleSuggestions && output.titleSuggestions.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-muted-foreground">Sugestões de Títulos</span>
                          </div>
                          <div className="space-y-2">
                            {output.titleSuggestions.slice(0, 5).map((title: string, i: number) => (
                              <div key={i} className="p-3 rounded-lg bg-background border border-border/50 group hover:border-primary/30 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-sm flex-1">{title}</p>
                                  <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(title)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{title.length} caracteres</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTool === "title_optimizer" && output.titles && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {output.titles.length} títulos • Estilo: {output.titles[0]?.style || "seo"}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {output.titles.map((item: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">{item.style?.toUpperCase() || "SEO"}</span>
                                  <span className="text-xs text-muted-foreground">{item.source || "template"}</span>
                                  <span className="text-xs text-muted-foreground">{item.length} chars</span>
                                  {item.score && <span className="text-xs font-medium text-green-600 dark:text-green-400">Score: {item.score}/100</span>}
                                </div>
                                <p className="font-medium text-base line-clamp-1">{item.title}</p>
                                {item.reason && <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>}
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(item.title)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeTool === "character_count" || activeTool === "word_count") && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <StatCard label="Caracteres" value={output.characters || 0} icon={Type} color="text-blue-500" />
                      <StatCard label="Palavras" value={output.words || 0} icon={Scissors} color="text-green-500" />
                      <StatCard label="Linhas" value={output.lines || 0} icon={Type} color="text-purple-500" />
                      <StatCard label="Parágrafos" value={output.paragraphs || 0} icon={FileText} color="text-orange-500" />
                    </div>
                  )}

                  {activeTool === "text_splitter" && output.parts && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{output.parts.length} partes geradas (máx. {output.maxSize} chars cada)</p>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {output.parts.map((part: string, i: number) => (
                          <div key={i} className="p-3 rounded-lg bg-background border border-border/50 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Parte {i + 1} • {part.length} chars</span>
                            <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(part)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {history.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Histórico Recente</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {history.slice(0, 8).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs capitalize">{item.type.replace("_", " ")}</Badge>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-mono">
                      {typeof item.output === "string" ? item.output.slice(0, 200) : JSON.stringify(item.output).slice(0, 200)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}