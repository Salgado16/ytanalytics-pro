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
    const { text, style = "seo" } = body;

    if (!text || text.trim().length < 2) {
      return NextResponse.json({ error: "Tópico muito curto" }, { status: 400 });
    }

    const topic = text.trim();
    const yt = createPublicYouTubeClient();

    // Buscar vídeos reais do nicho para basear títulos no que funciona
    let videoTitles: string[] = [];
    let videoTags: string[] = [];
    let topVideoTitles: string[] = [];

    try {
      const searchResults = await yt.searchVideos(topic, 8);
      if (searchResults?.items?.length) {
        const videoIds = searchResults.items
          .flatMap((item: any) => item.id?.videoId)
          .filter(Boolean)
          .slice(0, 6);
        
        if (videoIds.length) {
          const videosResponse = await yt.getVideosDetails(videoIds) as any[];
          for (const video of videosResponse) {
            if (video.snippet?.title) {
              videoTitles.push(video.snippet.title);
              // Ordenar por views para pegar os mais populares
            }
          }
          // Ordenar por views (estatísticas)
          topVideoTitles = videosResponse
            .sort((a: any, b: any) => 
              parseInt(b.statistics?.viewCount || "0") - parseInt(a.statistics?.viewCount || "0")
            )
            .slice(0, 3)
            .map((v: any) => v.snippet?.title)
            .filter(Boolean);
        }
      }
    } catch (e) {
      console.warn("YouTube search failed for titles:", e);
    }

    // YouTube Autocomplete para o que as pessoas REALMENTE buscam
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
            .slice(0, 6);
        }
      }
    } catch (e) {
      console.warn("Autocomplete failed:", e);
    }

    // Gerar títulos baseados em dados REAIS
    const titles = generateDataDrivenTitles(topic, topVideoTitles, autocompleteKeywords, style);

    return NextResponse.json({
      titles,
      keywords: extractCoreKeywords(topic),
      autocompleteKeywords,
      source: "youtube_real_data",
      videoAnalyzed: videoTitles.length,
    });
  } catch (error) {
    console.error("Title optimization error:", error);
    return NextResponse.json({ error: "Erro ao gerar títulos" }, { status: 500 });
  }
}

function extractCoreKeywords(topic: string): string[] {
  const stopWords = ["a", "o", "e", "de", "do", "da", "dos", "das", "em", "na", "no", "para", "com", "por", "como", "que", "qual", "quais", "um", "uma", "os", "as", "seu", "sua", "meu", "minha", "nosso", "nossa", "é", "são", "foi", "eram", "ser", "estar", "ter", "haver", "fazer", "dizer", "ver", "vir", "ir", "dar", "saber", "poder", "querer", "precisar", "dever", "gostar", "achar", "pensar", "sentir", "ouvir", "falar", "escrever", "ler", "estudar", "aprender", "ensinar"];
  
  return topic
    .toLowerCase()
    .replace(/[^\w\sà-ÿ]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w))
    .slice(0, 5);
}

function generateDataDrivenTitles(topic: string, topVideos: string[], autocomplete: string[], style: string): any[] {
  const mainTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  const year = new Date().getFullYear();
  const results: any[] = [];

  // 1. Títulos baseados nos vídeos MAIS VISTOS do nicho (o que FUNCIONA)
  if (topVideos.length > 0) {
    for (const vTitle of topVideos) {
      // Extrair padrão do título popular
      const cleanTitle = vTitle.replace(/[|#].*$/, "").trim();
      if (cleanTitle.length > 10 && cleanTitle.length < 80) {
        results.push({
          title: cleanTitle,
          style: "proven",
          score: 95,
          length: cleanTitle.length,
          source: "top_video",
          reason: "Baseado em vídeo de alta performance do nicho"
        });
      }
    }
  }

  // 2. Títulos baseados no que as pessoas REALMENTE buscam (autocomplete)
  for (const kw of autocomplete.slice(0, 3)) {
    const cleanKw = kw.replace(topic, "").trim();
    if (cleanKw.length > 3) {
      const templates = [
        `${mainTopic}: ${cleanKw.charAt(0).toUpperCase() + cleanKw.slice(1)}`,
        `${cleanKw.charAt(0).toUpperCase() + cleanKw.slice(1)} - ${mainTopic}`,
        `${mainTopic} - ${cleanKw}`,
      ];
      for (const t of templates) {
        if (t.length >= 40 && t.length <= 70) {
          results.push({
            title: t,
            style: "search_driven",
            score: 90,
            length: t.length,
            source: "autocomplete",
            reason: `Baseado em busca real: "${kw}"`
          });
        }
      }
    }
  }

  // 3. Templates otimizados por estilo (SEO, Educational, Story, List)
  const styleTemplates = {
    seo: [
      `${mainTopic}: Guia Completo ${year}`,
      `Como Entender ${mainTopic} de Forma Simples`,
      `${mainTopic} Explicado: Tudo o Que Você Precisa Saber`,
      `${mainTopic} para Iniciantes: Passo a Passo`,
      `Guia Definitivo de ${mainTopic} ${year}`,
    ],
    educational: [
      `Aprenda ${mainTopic} do Zero ao Avançado`,
      `Fundamentos de ${mainTopic}: Aula Completa`,
      `Domine ${mainTopic} em 5 Passos Simples`,
      `Erros Comuns em ${mainTopic} e Como Evitar`,
      `${mainTopic} Explicado para Leigos`,
    ],
    story: [
      `A História de ${mainTopic} Que Poucos Conhecem`,
      `${mainTopic}: Uma Jornada de Fé e Coragem`,
      `O Que Aconteceu com ${mainTopic}? (História Completa)`,
      `Lições de Vida da História de ${mainTopic}`,
      `Por Que ${mainTopic} Ainda Importa Hoje`,
    ],
    list: [
      `5 Lições Poderosas da História de ${mainTopic}`,
      `7 Fatos Surpreendentes Sobre ${mainTopic}`,
      `3 Momentos-Chave na História de ${mainTopic}`,
      `10 Coisas Que Você Não Sabia Sobre ${mainTopic}`,
      `Os 4 Pilares da História de ${mainTopic}`,
    ],
    viral: [
      `O Segredo de ${mainTopic} Que Mudou Tudo`,
      `Por Que Ninguém Te Contou Isso Sobre ${mainTopic}?`,
      `Testei ${mainTopic} Por 30 Dias - O Resultado`,
      `A Verdade Sobre ${mainTopic} Que Ninguém Conta`,
      `${mainTopic}: Isso Vai Te Surpreender`,
    ],
  };

  const templates = styleTemplates[style as keyof typeof styleTemplates] || styleTemplates.seo;
  
  for (const template of templates) {
    if (template.length >= 40 && template.length <= 70) {
      results.push({
        title: template,
        style,
        score: 75,
        length: template.length,
        source: "template",
        reason: `Template otimizado para ${style}`
      });
    }
  }

  // Remover duplicados, ordenar por score
  const unique = results
    .filter((r, i, arr) => arr.findIndex(x => x.title === r.title) === i)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return unique;
}