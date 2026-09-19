import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const popularHashtags: Record<string, string[]> = {
  youtube: ["youtube", "youtuber", "youtubebrasil", "canal", "inscritos", "visualizacoes", "monetizacao", "algorithm", "crescimento", "dicas"],
  tutorial: ["tutorial", "como fazer", "passo a passo", "aprenda", "dica", "truque", "facil", "rapido", "iniciante", "avancado"],
  gaming: ["gaming", "games", "gameplay", "gamer", "jogos", "live", "streamer", "esports", "pcgaming", "console"],
  tech: ["tecnologia", "tech", "review", "unboxing", "smartphone", "notebook", "gadget", "ia", "inteligencia artificial", "programacao"],
  education: ["educacao", "estudo", "aprendizado", "curso", "aula", "faculdade", "vestibular", "enem", "concurso", "certificacao"],
  lifestyle: ["lifestyle", "vlog", "rotina", "produtividade", "habitos", "minimalismo", "organizacao", "financas", "investimentos", "carreira"],
  entertainment: ["entretenimento", "humor", "comedia", "sketch", "parodia", "reacao", "desafio", "viral", "trending", "memes"],
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { text, count = 10 } = body;

    if (!text) {
      return NextResponse.json({ error: "Texto obrigatório" }, { status: 400 });
    }

    // Extract keywords from text
    const keywords = extractKeywords(text);
    
    // Match with popular categories
    let hashtags: string[] = [];
    for (const keyword of keywords) {
      const lower = keyword.toLowerCase();
      for (const [category, tags] of Object.entries(popularHashtags)) {
        if (tags.some(t => lower.includes(t) || t.includes(lower))) {
          hashtags.push(...tags.slice(0, 3));
        }
      }
    }

    // Add generic YouTube hashtags
    hashtags.push(...["youtube", "youtuber", "brasil", "conteudo", "video"]);

    // Remove duplicates and limit
    const uniqueHashtags = [...new Set(hashtags)].slice(0, count);

    // Format with #
    const formatted = uniqueHashtags.map(h => `#${h.replace(/\s+/g, "")}`);

    return NextResponse.json({
      hashtags: formatted,
      keywords,
      suggestions: generateSuggestions(keywords),
    });
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json({ error: "Erro ao gerar hashtags" }, { status: 500 });
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production use NLP
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  // Count frequency
  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  // Return top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function generateSuggestions(keywords: string[]): string[] {
  const suggestions: string[] = [];
  for (const keyword of keywords.slice(0, 5)) {
    suggestions.push(`${keyword} dicas`);
    suggestions.push(`${keyword} tutorial`);
    suggestions.push(`${keyword} 2024`);
    suggestions.push(`como ${keyword}`);
    suggestions.push(`melhor ${keyword}`);
  }
  return [...new Set(suggestions)].slice(0, 15);
}