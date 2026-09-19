import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In production, fetch real data from YouTube API and analyze
    // For now, return mock analysis
    const analysis = {
      videoId: params.id,
      viralScore: Math.floor(Math.random() * 1000),
      seoScore: Math.floor(Math.random() * 100),
      retentionPrediction: Math.floor(Math.random() * 40 + 40),
      ctrPrediction: (Math.random() * 8 + 2).toFixed(1),
      
      titleAnalysis: {
        length: Math.floor(Math.random() * 30 + 40),
        hasKeyword: true,
        hasNumber: Math.random() > 0.5,
        hasBrackets: Math.random() > 0.7,
        hasQuestion: Math.random() > 0.8,
        powerWords: ["segredo", "melhor", "erro", "dica"].slice(0, Math.floor(Math.random() * 3 + 1)),
        suggestions: [
          "Adicione um número no início para aumentar CTR",
          "Inclua a palavra-chave principal nos primeiros 30 caracteres",
          "Teste adicionar [VÍDEO] ou (TUTORIAL) no final",
        ],
      },
      
      thumbnailAnalysis: {
        hasFace: Math.random() > 0.3,
        faceEmotion: ["surpresa", "alegria", "curiosidade", "choque"][Math.floor(Math.random() * 4)],
        textOverlay: Math.random() > 0.4,
        textWords: Math.floor(Math.random() * 4 + 1),
        contrast: Math.floor(Math.random() * 30 + 70),
        arrowOrPointer: Math.random() > 0.6,
        colorScheme: ["amarelo-preto", "vermelho-branco", "azul-laranja", "verde-branco"][Math.floor(Math.random() * 4)],
        suggestions: [
          "Aumente o contraste para destacar no feed mobile",
          "Reduza texto para no máximo 3 palavras",
          "Adicione seta direcionando para elemento principal",
        ],
      },
      
      contentAnalysis: {
        duration: Math.floor(Math.random() * 600 + 180),
        hookStrength: Math.floor(Math.random() * 30 + 70),
        structureScore: Math.floor(Math.random() * 30 + 60),
        engagementPoints: Math.floor(Math.random() * 8 + 3),
        ctaPlacement: ["início", "meio", "final", "início+final"][Math.floor(Math.random() * 4)],
        suggestions: [
          "Adicione gancho mais forte nos primeiros 5 segundos",
          "Inclua capítulo/pulo para retenção",
          "Posicione CTA no meio e final do vídeo",
        ],
      },
      
      tagsAnalysis: {
        count: Math.floor(Math.random() * 10 + 5),
        hasMainKeyword: true,
        hasLongTail: Math.random() > 0.5,
        hasBranded: Math.random() > 0.7,
        suggestions: [
          "Adicione 3-5 tags de cauda longa",
          "Inclua variações com erros de digitação comuns",
          "Use tags do canal concorrente bem-sucedido",
        ],
      },
      
      competitors: [
        { title: "Vídeo Concorrente 1", views: 500000, ctr: 8.2, avd: "5:30" },
        { title: "Vídeo Concorrente 2", views: 320000, ctr: 6.5, avd: "4:15" },
        { title: "Vídeo Concorrente 3", views: 180000, ctr: 7.1, avd: "3:45" },
      ],
      
      recommendations: [
        "Otimize título: adicione número e palavra-chave no início",
        "Thumbnail: teste versão com rosto expressivo + 3 palavras",
        "Estrutura: adicione gancho visual nos primeiros 3 segundos",
        "Tags: complete com 15 tags (atual: 8)",
        "CTA: posicione no minuto 2 e no final",
        "Considere criar Short deste tema para atrair novo público",
      ],
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json({ error: "Erro na análise" }, { status: 500 });
  }
}