import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "BR";
    const limit = parseInt(searchParams.get("limit") || "50");

    const videos = generateMockViralVideos(country, limit);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Viral videos error:", error);
    return NextResponse.json({ error: "Erro ao buscar vídeos virais" }, { status: 500 });
  }
}

function generateMockViralVideos(country: string, limit: number) {
  const categories = [
    { id: "1", name: "Filmes e Animação" },
    { id: "2", name: "Autos e Veículos" },
    { id: "10", name: "Música" },
    { id: "17", name: "Esportes" },
    { id: "20", name: "Jogos" },
    { id: "22", name: "Pessoas e Blogs" },
    { id: "23", name: "Comédia" },
    { id: "24", name: "Entretenimento" },
    { id: "26", name: "Como Fazer e Estilo" },
    { id: "27", name: "Educação" },
    { id: "28", name: "Ciência e Tecnologia" },
  ];

  const titles = [
    "Você NÃO VAI ACREDITAR no que aconteceu!",
    "O SEGREDO que ninguém te conta sobre...",
    "Testei por 30 dias e o resultado CHOCANTE",
    "Erro FATAL que TODO INICIANTE comete",
    "De ZERO a PRO em apenas 7 dias",
    "A VERDADE por trás de...",
    "NUNCA MAIS cometa esse erro!",
    "Como eu fiz R$ 10.000 com...",
    "O MELHOR {topic} de 2024!",
    "PARE de fazer isso AGORA mesmo!",
  ];

  const videos = [];
  for (let i = 0; i < limit; i++) {
    const viewCount = Math.floor(Math.random() * 5000000 + 100000);
    const likeCount = Math.floor(viewCount * (Math.random() * 0.08 + 0.02));
    const commentCount = Math.floor(viewCount * (Math.random() * 0.005 + 0.001));
    const category = categories[Math.floor(Math.random() * categories.length)];
    const hoursAgo = Math.floor(Math.random() * 72 + 1);
    const publishedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    
    const velocity = viewCount / hoursAgo;
    const viralScore = Math.min(1000, velocity / 100 + likeCount / 1000 + commentCount / 100);
    const trendScore = Math.min(1000, viralScore * (1 + Math.random()));

    videos.push({
      videoId: `v${Math.random().toString(36).substr(2, 9)}`,
      channelId: `UC${Math.random().toString(36).substr(2, 22)}`,
      channelTitle: `Canal Viral ${i + 1}`,
      title: titles[Math.floor(Math.random() * titles.length)].replace("{topic}", category.name),
      description: `Descrição do vídeo viral sobre ${category.name.toLowerCase()}...`,
      publishedAt,
      thumbnails: {
        default: { url: `https://picsum.photos/120/90?random=${i + 200}` },
        medium: { url: `https://picsum.photos/320/180?random=${i + 200}` },
        high: { url: `https://picsum.photos/480/360?random=${i + 200}` },
      },
      viewCount,
      likeCount,
      commentCount,
      duration: `PT${Math.floor(Math.random() * 20 + 3)}M${Math.floor(Math.random() * 60)}S`,
      tags: [category.name.toLowerCase(), "viral", "trending", "2024", "brasil"],
      categoryId: category.id,
      viralScore,
      velocity,
      trendScore,
    });
  }

  // Sort by viral score
  videos.sort((a, b) => b.viralScore - a.viralScore);
  return videos;
}