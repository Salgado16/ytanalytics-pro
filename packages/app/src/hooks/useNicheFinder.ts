"use client";

import { useState, useCallback, useEffect } from "react";

export interface NicheChannel {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  country?: string;
  topicCategories: string[];
  growthRate: number;
  viralScore: number;
  avgViewsPerVideo: number;
  uploadFrequency: number;
  lastUploadAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

export interface ViralVideo {
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  tags: string[];
  categoryId: string;
  viralScore: number;
  velocity: number;
  trendScore: number;
}

export function useNicheFinder() {
  const [trendingChannels, setTrendingChannels] = useState<NicheChannel[]>([]);
  const [risingChannels, setRisingChannels] = useState<NicheChannel[]>([]);
  const [newChannels, setNewChannels] = useState<NicheChannel[]>([]);
  const [viralVideos, setViralVideos] = useState<ViralVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    country: "BR",
    minSubscribers: 0,
    maxSubscribers: 10000000,
    sortBy: "viralScore" as "viralScore" | "growthRate" | "subscriberCount" | "avgViewsPerVideo",
  });

  const fetchTrendingChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type: "trending",
        category: filters.category,
        country: filters.country,
        minSubscribers: String(filters.minSubscribers),
        maxSubscribers: String(filters.maxSubscribers),
        sortBy: filters.sortBy,
      });
      const res = await fetch(`/api/niche/channels?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/niche";
          return;
        }
        throw new Error("Erro ao buscar canais em alta");
      }
      const data = await res.json();
      setTrendingChannels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchRisingChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type: "rising",
        category: filters.category,
        country: filters.country,
        minSubscribers: String(filters.minSubscribers),
        maxSubscribers: String(filters.maxSubscribers),
        sortBy: filters.sortBy,
      });
      const res = await fetch(`/api/niche/channels?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/niche";
          return;
        }
        throw new Error("Erro ao buscar canais subindo");
      }
      const data = await res.json();
      setRisingChannels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchNewChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type: "new",
        category: filters.category,
        country: filters.country,
        minSubscribers: String(filters.minSubscribers),
        maxSubscribers: String(filters.maxSubscribers),
        sortBy: filters.sortBy,
      });
      const res = await fetch(`/api/niche/channels?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/niche";
          return;
        }
        throw new Error("Erro ao buscar canais novos");
      }
      const data = await res.json();
      setNewChannels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchViralVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        country: filters.country,
        limit: "50",
      });
      const res = await fetch(`/api/niche/viral-videos?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/niche";
          return;
        }
        throw new Error("Erro ao buscar vídeos virais");
      }
      const data = await res.json();
      setViralVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [filters.country]);

  const searchNiche = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/niche/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/niche";
          return [];
        }
        throw new Error("Erro ao buscar nicho");
      }
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeChannel = useCallback(async (channelId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/niche/analyze/${channelId}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/niche";
          return null;
        }
        throw new Error("Erro ao analisar canal");
      }
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingChannels();
    fetchRisingChannels();
    fetchNewChannels();
    fetchViralVideos();
  }, [fetchTrendingChannels, fetchRisingChannels, fetchNewChannels, fetchViralVideos]);

  return {
    trendingChannels,
    risingChannels,
    newChannels,
    viralVideos,
    loading,
    error,
    filters,
    setFilters,
    fetchTrendingChannels,
    fetchRisingChannels,
    fetchNewChannels,
    fetchViralVideos,
    searchNiche,
    analyzeChannel,
  };
}