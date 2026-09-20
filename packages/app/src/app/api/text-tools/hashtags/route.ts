import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPublicYouTubeClient } from "@/lib/youtube-api";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { text, count = 15 } = body;

    if (!text || text.trim().length < 2) {
      return NextResponse.json({ error: "Tópico muito curto" }, { status: 400 });
    }

    const yt = createPublicYouTubeClient();
    const topic = text.trim();

    // 1. Buscar vídeos reais do nicho (usando search API para vídeos)
    let videoTags: string[] = [];
    let videoTitles: string[] = [];
    
    try {
      const searchRes = await yt.searchVideos(topic, 10);
      if (searchRes?.items?.length) {
        const videoIds = searchRes.items
          .map((item: any) => item.id?.videoId)
          .filter(Boolean)
          .slice(0, 8);
        
        if (videoIds.length) {
          const videosResponse = await yt.getVideosDetails(videoIds) as any[];
          for (const video of videosResponse) {
            if (video.snippet?.tags) {
              videoTags.push(...video.snippet.tags);
            }
            if (video.snippet?.title) {
              videoTitles.push(video.snippet.title);
            }
          }
        }
      }
    } catch (e) {
      console.warn("YouTube search failed, using fallback:", e);
    }

    // 2. YouTube Autocomplete / Suggest para keywords reais
    let autocompleteKeywords: string[] = [];
    try {
      const suggestUrl = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(topic)}`;
      const suggestRes = await fetch(suggestUrl);
      if (suggestRes.ok) {
        const suggestData = await suggestRes.json();
        if (suggestData[1]?.length) {
          autocompleteKeywords = suggestData[1]
            .map((s: any) => s[0])
            .filter((k: string) => k.toLowerCase() !== topic.toLowerCase())
            .slice(0, 8);
        }
      }
    } catch (e) {
      console.warn("Autocomplete failed:", e);
    }

    // 3. Extrair palavras-chave dos títulos dos vídeos reais
    const titleKeywords = videoTitles
      .flatMap(t => t.toLowerCase().split(/\s+/))
      .filter(w => w.length > 3)
      .filter(w => !["para", "como", "sobre", "tudo", "mais", "melhor", "novo", "ano", "dia", "video", "canal", "dicas", "guia", "completo", "definitivo", "passo", "passos", "facil", "rapido", "simples", "incrivel", "secreto", "segredo"].includes(w));

    // 4. Combinar e priorizar
    const allTags = [
      ...new Set([
        ...videoTags.slice(0, 20),        // Tags reais dos vídeos (prioridade 1)
        ...autocompleteKeywords,           // Sugestões do YouTube (prioridade 2)
        ...titleKeywords.slice(0, 10),     // Keywords dos títulos (prioridade 3)
        ...extractCoreKeywords(topic)      // Keywords do tópico original
      ])
    ];

    // Filtrar e limpar
    const cleanTags = allTags
      .map(t => t.toLowerCase().trim())
      .filter(t => t.length > 2 && t.length < 30)
      .filter(t => !/^\d+$/.test(t))
      .slice(0, count);

    // 5. Gerar variações de títulos baseadas em dados reais
    const titleSuggestions = generateRelevantTitles(topic, videoTitles, autocompleteKeywords);

    return NextResponse.json({
      hashtags: cleanTags.map(h => `#${h.replace(/\s+/g, "")}`),
      tags: cleanTags, // Versão limpa sem #
      keywords: cleanTags,
      autocompleteKeywords,
      titleSuggestions,
      source: "youtube_real_data",
      videoCount: videoTags.length > 0 ? videoTags.length : 0,
    });
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json({ error: "Erro ao gerar hashtags" }, { status: 500 });
  }
}

function extractCoreKeywords(topic: string): string[] {
  const stopWords = ["a", "o", "e", "de", "do", "da", "dos", "das", "em", "na", "no", "para", "com", "por", "como", "que", "qual", "quais", "um", "uma", "os", "as", "seu", "sua", "meu", "minha", "nosso", "nossa", "é", "são", "foi", "eram", "ser", "estar", "ter", "haver", "fazer", "dizer", "ver", "vir", "ir", "dar", "fazer", "saber", "poder", "querer", "precisar", "dever", "gostar", "achar", "pensar", "sentir", "ouvir", "falar", "escrever", "ler", "estudar", "aprender", "ensinar"];
  
  return topic
    .toLowerCase()
    .replace(/[^\w\sà-ÿ]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w))
    .slice(0, 5);
}

function generateRelevantTitles(topic: string, videoTitles: string[], autocompleteKeywords: string[]): string[] {
  const titles: string[] = [];
  const year = new Date().getFullYear();
  const mainTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  // Baseado nos títulos reais dos vídeos encontrados
  if (videoTitles.length > 0) {
    const patterns = [
      `${mainTopic}: ${videoTitles[0].split(":")[0] || "Análise Completa"}`,
      `${mainTopic} - ${videoTitles[0].split("|")[0]?.trim() || "Tudo Sobre"}`,
    ];
    titles.push(...patterns);
  }

  // Baseado em autocomplete do YouTube (o que as pessoas REALMENTE buscam)
  if (autocompleteKeywords.length > 0) {
    for (const kw of autocompleteKeywords.slice(0, 3)) {
      titles.push(`${mainTopic}: ${kw.charAt(0).toUpperCase() + kw.slice(1)}`);
      titles.push(`${kw.charAt(0).toUpperCase() + kw.slice(1)} - ${mainTopic}`);
    }
  }

  // Templates otimizados para YouTube (baseados no que funciona)
  const templates = [
    `${mainTopic}: Guia Completo ${year}`,
    `Como Entender ${mainTopic} de Forma Simples`,
    `${mainTopic} Explicado: Tudo o Que Você Precisa Saber`,
    `5 Pontos-Chave Sobre ${mainTopic}`,
    `O Que Ninguém Te Conta Sobre ${mainTopic}`,
    `${mainTopic} para Iniciantes: Passo a Passo`,
    `Erros Comuns ao Estudar ${mainTopic} e Como Evitar`,
    `${mainTopic} - Análise Profunda e Reflexão`,
    `Por Que ${mainTopic} Importa Hoje?`,
    `${year}: O Guia Definitivo de ${mainTopic}`,
  ];

  return [...new Set([...titles, ...templates])].slice(0, 10);
}