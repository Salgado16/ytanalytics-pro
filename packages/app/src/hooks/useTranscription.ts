"use client";

import { useState, useCallback, useEffect } from "react";

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface Transcription {
  id: string;
  sourceType: "video" | "audio" | "youtube_url";
  sourceUrl: string;
  sourceId?: string;
  language: string;
  status: "pending" | "processing" | "completed" | "failed";
  text?: string;
  segments?: TranscriptionSegment[];
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export function useTranscription() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/transcriptions");
      if (!res.ok) throw new Error("Erro ao buscar transcrições");
      const data = await res.json();
      setTranscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTranscription = useCallback(async (
    sourceType: "video" | "audio" | "youtube_url",
    sourceUrl: string,
    language = "pt-BR"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/transcriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceType, sourceUrl, language }),
      });
      if (!res.ok) throw new Error("Erro ao criar transcrição");
      const data = await res.json();
      setTranscriptions((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTranscription = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/transcriptions/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar transcrição");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTranscription = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/transcriptions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir transcrição");
      setTranscriptions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const pollTranscription = useCallback(async (id: string, interval = 5000) => {
    const checkStatus = async () => {
      const transcription = await getTranscription(id);
      if (transcription && (transcription.status === "completed" || transcription.status === "failed")) {
        setTranscriptions((prev) =>
          prev.map((t) => (t.id === id ? transcription : t))
        );
        return transcription;
      }
      return null;
    };

    const result = await checkStatus();
    if (!result) {
      setTimeout(() => pollTranscription(id, interval), interval);
    }
    return result;
  }, [getTranscription]);

  useEffect(() => {
    fetchTranscriptions();
  }, [fetchTranscriptions]);

  return {
    transcriptions,
    loading,
    error,
    fetchTranscriptions,
    createTranscription,
    getTranscription,
    deleteTranscription,
    pollTranscription,
  };
}