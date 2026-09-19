"use client";

import { useState, useCallback, useEffect } from "react";

export interface TextToolResult {
  id: string;
  type: "character_count" | "word_count" | "text_splitter" | "hashtag_generator" | "title_optimizer";
  input: string;
  output: string;
  settings?: Record<string, any>;
  createdAt: string;
}

export function useTextTools() {
  const [history, setHistory] = useState<TextToolResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/text-tools");
      if (!res.ok) throw new Error("Erro ao buscar histórico");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const characterCount = useCallback((text: string) => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split("\n").length;
    const paragraphs = text.split("\n\n").filter(p => p.trim()).length;

    return {
      characters: chars,
      charactersNoSpaces: charsNoSpaces,
      words,
      lines,
      paragraphs,
    };
  }, []);

  const wordCount = useCallback((text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size;
    const avgWordLength = text.trim() 
      ? text.trim().split(/\s+/).reduce((sum, w) => sum + w.length, 0) / words 
      : 0;

    return {
      totalWords: words,
      uniqueWords,
      averageWordLength: Math.round(avgWordLength * 100) / 100,
    };
  }, []);

  const splitText = useCallback((
    text: string,
    method: "chars" | "words" | "sentences" | "paragraphs" = "chars",
    maxSize: number = 2000,
    overlap: number = 0
  ) => {
    let chunks: string[] = [];

    switch (method) {
      case "chars":
        for (let i = 0; i < text.length; i += maxSize - overlap) {
          chunks.push(text.slice(i, i + maxSize));
        }
        break;
      case "words":
        const words = text.split(/\s+/);
        let currentChunk = "";
        for (const word of words) {
          if ((currentChunk + " " + word).length > maxSize && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk += (currentChunk ? " " : "") + word;
          }
        }
        if (currentChunk) chunks.push(currentChunk.trim());
        break;
      case "sentences":
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let sentenceChunk = "";
        for (const sentence of sentences) {
          if ((sentenceChunk + " " + sentence).length > maxSize && sentenceChunk) {
            chunks.push(sentenceChunk.trim());
            sentenceChunk = sentence;
          } else {
            sentenceChunk += (sentenceChunk ? " " : "") + sentence;
          }
        }
        if (sentenceChunk) chunks.push(sentenceChunk.trim());
        break;
      case "paragraphs":
        chunks = text.split("\n\n").filter(p => p.trim());
        break;
    }

    return chunks;
  }, []);

  const generateHashtags = useCallback(async (text: string, count: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/text-tools/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, count }),
      });
      if (!res.ok) throw new Error("Erro ao gerar hashtags");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeTitle = useCallback(async (text: string, style: "clickbait" | "seo" | "educational" | "viral" = "seo") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/text-tools/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style }),
      });
      if (!res.ok) throw new Error("Erro ao otimizar título");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveResult = useCallback(async (result: Omit<TextToolResult, "id" | "createdAt">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/text-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Erro ao salvar resultado");
      const data = await res.json();
      setHistory((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    characterCount,
    wordCount,
    splitText,
    generateHashtags,
    optimizeTitle,
    saveResult,
    fetchHistory,
  };
}