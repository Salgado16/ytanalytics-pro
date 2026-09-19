"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female" | "neutral";
  previewUrl?: string;
}

export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const loadVoices = useCallback(() => {
    if (!synthRef.current) return;
    const availableVoices = synthRef.current.getVoices();
    const mappedVoices: Voice[] = availableVoices.map((v) => ({
      id: v.name,
      name: v.name,
      language: v.lang,
      gender: v.name.toLowerCase().includes("female") ? "female" : 
              v.name.toLowerCase().includes("male") ? "male" : "neutral",
    }));
    setVoices(mappedVoices);
    if (!selectedVoice && mappedVoices.length > 0) {
      const ptVoice = mappedVoices.find(v => v.language.startsWith("pt")) || mappedVoices[0];
      setSelectedVoice(ptVoice);
    }
  }, [selectedVoice]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !selectedVoice) {
      setError("Nenhuma voz disponível");
      return;
    }

    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synthRef.current.getVoices().find(v => v.name === selectedVoice.id) || null;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = selectedVoice.language;

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
      setError(null);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onerror = (event) => {
      setError(`Erro na síntese: ${event.error}`);
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onpause = () => setPaused(true);
    utterance.onresume = () => setPaused(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [selectedVoice, rate, pitch, volume]);

  const pause = useCallback(() => {
    if (synthRef.current?.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  }, []);

  return {
    speaking,
    paused,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    error,
    speak,
    pause,
    resume,
    stop,
  };
}