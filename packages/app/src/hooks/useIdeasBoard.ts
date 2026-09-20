"use client";

import { useState, useCallback, useEffect } from "react";

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "researching" | "scripting" | "recording" | "editing" | "scheduled" | "published" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  targetKeywords: string[];
  estimatedDuration?: number;
  thumbnailIdeas: string[];
  references: string[];
  scheduledAt?: string;
  publishedAt?: string;
  videoId?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUSES: Idea["status"][] = [
  "backlog",
  "researching",
  "scripting",
  "recording",
  "editing",
  "scheduled",
  "published",
  "archived",
];

export function useIdeasBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/ideas";
          return;
        }
        throw new Error("Erro ao buscar ideias");
      }
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const createIdea = useCallback(async (idea: Omit<Idea, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idea),
      });
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/ideas";
          return null;
        }
        throw new Error("Erro ao criar ideia");
      }
      const data = await res.json();
      setIdeas((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIdea = useCallback(async (id: string, updates: Partial<Idea>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/ideas";
          return null;
        }
        throw new Error("Erro ao atualizar ideia");
      }
      const data = await res.json();
      setIdeas((prev) => prev.map((i) => (i.id === id ? data : i)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIdea = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" });
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth/signin?callbackUrl=/ideas";
          return;
        }
        throw new Error("Erro ao excluir ideia");
      }
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const moveIdea = useCallback(async (id: string, newStatus: Idea["status"]) => {
    return updateIdea(id, { status: newStatus, updatedAt: new Date().toISOString() });
  }, [updateIdea]);

  const getIdeasByStatus = useCallback((status: Idea["status"]) => {
    return ideas.filter((i) => i.status === status);
  }, [ideas]);

  const getIdeasByPriority = useCallback((priority: Idea["priority"]) => {
    return ideas.filter((i) => i.priority === priority);
  }, [ideas]);

  const reorderIdeas = useCallback((status: Idea["status"], fromIndex: number, toIndex: number) => {
    const statusIdeas = ideas.filter((i) => i.status === status);
    const otherIdeas = ideas.filter((i) => i.status !== status);
    const [moved] = statusIdeas.splice(fromIndex, 1);
    statusIdeas.splice(toIndex, 0, moved);
    setIdeas([...otherIdeas, ...statusIdeas]);
  }, [ideas]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return {
    ideas,
    loading,
    error,
    statuses: STATUSES,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    moveIdea,
    getIdeasByStatus,
    getIdeasByPriority,
    reorderIdeas,
  };
}