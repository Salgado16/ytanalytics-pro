"use client";

import { useState, useCallback, useEffect } from "react";

interface MediaAsset {
  id: string;
  type: "image" | "video";
  source: "pixabay" | "pexels" | "upload" | "youtube";
  sourceId: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  duration?: number;
  tags: string[];
  author?: string;
  authorUrl?: string;
  license: string;
  createdAt: string;
}

export function useMediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Erro ao buscar mídia");
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPixabay = useCallback(async (query: string, type: "image" | "video" = "image") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/pixabay?q=${encodeURIComponent(query)}&type=${type}`);
      if (!res.ok) throw new Error("Erro ao buscar no Pixabay");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPexels = useCallback(async (query: string, type: "image" | "video" = "image") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/pexels?q=${encodeURIComponent(query)}&type=${type}`);
      if (!res.ok) throw new Error("Erro ao buscar no Pexels");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAsset = useCallback(async (asset: Omit<MediaAsset, "id" | "createdAt">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });
      if (!res.ok) throw new Error("Erro ao salvar mídia");
      const newAsset = await res.json();
      setAssets((prev) => [newAsset, ...prev]);
      return newAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir mídia");
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    searchPixabay,
    searchPexels,
    saveAsset,
    deleteAsset,
  };
}