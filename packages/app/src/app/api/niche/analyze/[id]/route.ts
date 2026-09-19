import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In production, fetch real data from YouTube API
    // For now, return mock analysis
    const analysis = {
      channelId: params.id,
      overview: {
        totalViews: Math.floor(Math.random() * 100000000 + 1000000),
        totalSubscribers: Math.floor(Math.random() * 5000000 + 10000),
        totalVideos: Math.floor(Math.random() * 1000 + 50),
        avgViewsPerVideo: Math.floor(Math.random() * 500000 + 10000),
        uploadFrequency: (Math.random() * 4 + 1).toFixed(1),
        channelAge: Math.floor(Math.random() * 5 + 1),
      },
      performance: {
        viralScore: Math.floor(Math.random() * 1000),
        growthRate: (Math.random() * 100).toFixed(1),
        engagementRate: (Math.random() * 10).toFixed(2),
        ctr: (Math.random() * 10).toFixed(1),
        avgRetention: (Math.random() * 30 + 40).toFixed(1),
      },
      contentStrategy: {
        mainTopics: ["Tecnologia", "Reviews", "Tutoriais"],
        videoTypes: [
          { type: "Reviews", count: 45, avgViews: 150000 },
          { type: "Tutoriais", count: 30, avgViews: 200000 },
          { type: "Comparativos", count: 15, avgViews: 180000 },
          { type: "Unboxing", count: 10, avgViews: 120000 },
        ],
        uploadSchedule: "Terça e Quinta às 19h",
        thumbnailStyle: "Rosto + Texto Grande + Seta",
        titlePattern: "Como [Tópico] em [Tempo] | [Benefício]",
      },
      audience: {
        topCountries: ["Brasil (85%)", "Portugal (8%)", "EUA (4%)", "Outros (3%)"],
        ageGroups: ["18-24 (35%)", "25-34 (40%)", "35-44 (15%)", "45+ (10%)"],
        genderSplit: "Masculino (65%) / Feminino (35%)",
        interests: ["Tecnologia", "Programação", "Gadgets", "IA"],
      },
      monetization: {
        estimatedMonthlyRevenue: `R$ ${(Math.random() * 50000 + 5000).toFixed(0)}`,
        rpm: (Math.random() * 5 + 2).toFixed(2),
        revenueSources: [
          { source: "Ads", percentage: 60 },
          { source: "Patrocínios", percentage: 25 },
          { source: "Afiliados", percentage: 10 },
          { source: "Produtos Próprios", percentage: 5 },
        ],
      },
      recommendations: [
        "Aumentar frequência para 3 vídeos/semana para acelerar crescimento",
        "Testar thumbnails sem rosto (estilo minimalista) para variar CTR",
        "Criar série semanal fixa para construir hábito no público",
        "Explorar Shorts para atrair novo público (potencial 30% mais subscritos)",
        "Parceria com canais de programação (cross-pollination de audiências)",
      ],
      competitors: [
        { name: "Canal Concorrente 1", subscribers: 1200000, similarity: 85 },
        { name: "Canal Concorrente 2", subscribers: 800000, similarity: 72 },
        { name: "Canal Concorrente 3", subscribers: 450000, similarity: 68 },
      ],
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Channel analysis error:", error);
    return NextResponse.json({ error: "Erro na análise" }, { status: 500 });
  }
}