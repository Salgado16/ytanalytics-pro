import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const titleTemplates = {
  seo: [
    "Como {keyword} em {year}: Guia Completo",
    "{keyword}: Tudo o que você precisa saber",
    "Guia Definitivo de {keyword} para Iniciantes",
    "{number} Dicas de {keyword} que Funcionam",
    "Melhor {keyword} de {year}: Review e Comparação",
  ],
  clickbait: [
    "PARE de {keyword} ERRADO! (Descubra o Segredo)",
    "O {keyword} que NINGUÉM te conta...",
    "Você NÃO VAI ACREDITAR no que {keyword} fez!",
    "Erro FATAL ao {keyword} - Evite isso!",
    "Testei {keyword} por 30 dias - RESULTADO CHOCANTE",
  ],
  educational: [
    "Aprenda {keyword} do Zero ao Avançado",
    "{keyword} Explicado de Forma Simples",
    "Fundamentos de {keyword}: Aula Completa",
    "Domine {keyword} em {number} Passos",
    "Erros Comuns em {keyword} e Como Evitar",
  ],
  viral: [
    "{number} Coisas que {keyword} MUDARAM minha vida",
    "De ZERO a {keyword}: Minha Jornada Completa",
    "O Segredo do {keyword} que VIRALIZOU",
    "{keyword} vs {alternative}: Qual é MELHOR?",
    "Por que TODO MUNDO está falando de {keyword}?",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { text, style = "seo" } = body;

    if (!text) {
      return NextResponse.json({ error: "Texto obrigatório" }, { status: 400 });
    }

    const keywords = extractKeywords(text);
    const mainKeyword = keywords[0] || text.slice(0, 30);
    const templates = titleTemplates[style as keyof typeof titleTemplates] || titleTemplates.seo;

    const titles = templates.map((template, i) => {
      let title = template
        .replace(/{keyword}/g, mainKeyword)
        .replace(/{year}/g, new Date().getFullYear().toString())
        .replace(/{number}/g, (i + 3).toString())
        .replace(/{alternative}/g, keywords[1] || "Alternativa");
      
      // Ensure length is good for YouTube (60-70 chars ideal)
      if (title.length > 70) {
        title = title.slice(0, 67) + "...";
      }
      
      return {
        title,
        style,
        score: calculateTitleScore(title, style),
        length: title.length,
      };
    });

    // Sort by score
    titles.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      titles,
      keywords,
      recommendations: generateRecommendations(mainKeyword, style),
    });
  } catch (error) {
    console.error("Title optimization error:", error);
    return NextResponse.json({ error: "Erro ao otimizar título" }, { status: 500 });
  }
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function calculateTitleScore(title: string, style: string): number {
  let score = 50;
  
  // Length check (ideal 50-60 chars)
  if (title.length >= 50 && title.length <= 65) score += 15;
  else if (title.length > 65) score -= 10;
  
  // Numbers boost CTR
  if (/\d/.test(title)) score += 10;
  
  // Power words
  const powerWords = ['segredo', 'melhor', 'pior', 'erro', 'dica', 'truque', 'guia', 'completo', 'definitivo', 'shock', 'chocante', 'incrível'];
  for (const word of powerWords) {
    if (title.toLowerCase().includes(word)) score += 5;
  }
  
  // Style specific
  if (style === 'clickbait' && /[!?]/.test(title)) score += 10;
  if (style === 'seo' && /como|guia|tutorial|melhor|review/.test(title.toLowerCase())) score += 10;
  if (style === 'educational' && /aprenda|fundamentos|passo|erro/.test(title.toLowerCase())) score += 10;
  if (style === 'viral' && /jornada|vida|mudou|segredo|viralizou/.test(title.toLowerCase())) score += 10;
  
  // Questions boost engagement
  if (title.includes('?')) score += 5;
  
  // Brackets/parentheses
  if (/[\[\(]/.test(title)) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function generateRecommendations(keyword: string, style: string): string[] {
  const base = [
    `Mantenha entre 50-60 caracteres para melhor CTR`,
    `Inclua a palavra-chave principal no início: "${keyword}"`,
    `Adicione números específicos (ex: "5 dicas", "3 erros")`,
    `Use palavras de poder: segredo, melhor, erro, guia, definitivo`,
    `Teste 2-3 variações no A/B testing do YouTube Studio`,
  ];
  
  if (style === 'clickbait') {
    base.push('Cuidado: não prometa o que o vídeo não entrega');
    base.push('Use curiosidade genuína, não clickbait falso');
  }
  if (style === 'seo') {
    base.push('Otimize também a descrição com a palavra-chave nas 2 primeiras linhas');
    base.push('Adicione timestamps e capítulos para melhor retenção');
  }
  
  return base;
}