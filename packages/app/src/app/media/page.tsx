"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Plus,
  Search,
  Image,
  Video,
  Download,
  Heart,
  User,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

const tabs = [
  { id: "my-library", label: "Minha Biblioteca", icon: Image },
  { id: "pixabay", label: "Pixabay", icon: Search },
  { id: "pexels", label: "Pexels", icon: Video },
];

export default function MediaPage() {
  const { user } = useAuth();
  const { assets, loading, searchPixabay, searchPexels, saveAsset, deleteAsset } = useMediaLibrary();
  const [activeTab, setActiveTab] = useState("my-library");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [pixabayResults, setPixabayResults] = useState<any[]>([]);
  const [pexelsResults, setPexelsResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      if (activeTab === "pixabay") {
        const results = await searchPixabay(searchQuery, mediaType);
        setPixabayResults(results);
      } else if (activeTab === "pexels") {
        const results = await searchPexels(searchQuery, mediaType);
        setPexelsResults(results);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleSaveAsset = async (asset: any, source: "pixabay" | "pexels") => {
    const newAsset = {
      type: mediaType,
      source,
      sourceId: asset.id.toString(),
      url: asset.url,
      thumbnail: asset.thumbnail,
      width: asset.width,
      height: asset.height,
      duration: asset.duration,
      tags: asset.tags || [],
      author: asset.author,
      authorUrl: asset.authorUrl,
      license: asset.license || "Free for commercial use",
    };
    await saveAsset(newAsset);
  };

  const downloadAsset = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao baixar");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Mídia</h1>
          <p className="text-muted-foreground">
            Busque e salve imagens e vídeos livres de direitos do Pixabay e Pexels
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "outline"}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2">
          <Button
            variant={mediaType === "image" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMediaType("image")}
          >
            <Image className="h-4 w-4 mr-1" />
            Imagens
          </Button>
          <Button
            variant={mediaType === "video" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMediaType("video")}
          >
            <Video className="h-4 w-4 mr-1" />
            Vídeos
          </Button>
        </div>
      </div>

      {activeTab !== "my-library" && (
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar no ${activeTab === "pixabay" ? "Pixabay" : "Pexels"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
            {searching ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      )}

      {activeTab === "my-library" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.filter((a) => a.type === mediaType).map((asset) => (
            <Card key={asset.id} className="group">
              <div className="relative aspect-video overflow-hidden">
                {asset.type === "video" ? (
                  <video
                    src={asset.url}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={asset.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      const ext = asset.type === "video" ? "mp4" : "jpg";
                      downloadAsset(asset.url, `${asset.id}.${ext}`);
                    }}
                    title="Baixar arquivo"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/90"
                    asChild
                  >
                    <a href={asset.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/90 text-red-600"
                    onClick={() => deleteAsset(asset.id)}
                    title="Remover da biblioteca"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <Badge variant="secondary" className="text-xs">{asset.source}</Badge>
                  <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium line-clamp-1">{asset.tags.slice(0, 3).join(", ")}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{asset.width}×{asset.height}</span>
                  <span>{formatRelativeTime(asset.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {assets.filter(a => a.type === mediaType).length === 0 && (
            <Card className="col-span-full text-center py-12">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Biblioteca vazia</h3>
              <p className="text-muted-foreground mb-4">
                Busque no Pixabay ou Pexels e salve seus favoritos
              </p>
            </Card>
          )}
        </div>
      )}

      {(activeTab === "pixabay" || activeTab === "pexels") && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(activeTab === "pixabay" ? pixabayResults : pexelsResults).map((item) => (
            <Card key={item.id} className="group">
              <div className="relative aspect-video overflow-hidden">
                {mediaType === "image" ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    preload="metadata"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <Button
                    variant="primary"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleSaveAsset(item, activeTab as "pixabay" | "pexels")}
                    title="Salvar na biblioteca"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      const ext = mediaType === "video" ? "mp4" : "jpg";
                      downloadAsset(item.url, `${item.id}.${ext}`);
                    }}
                    title="Baixar arquivo"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.user || item.photographer}
                  </span>
                  <Badge variant="outline">{activeTab}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {(activeTab === "pixabay" ? pixabayResults : pexelsResults).length === 0 && !searching && (
            <Card className="col-span-full text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum resultado</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Tente termos diferentes" : "Digite um termo e clique em Buscar"}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}