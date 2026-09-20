import { NextRequest, NextResponse } from "next/server";
import { createPublicYouTubeClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

const FALLBACK_ANALYSIS = {
  channelId: "fallback",
  overview: {
    totalViews: 0,
    totalSubscribers: 0,
    totalVideos: 0,
    avgViewsPerVideo: 0,
    uploadFrequency: 0,
    channelAge: "0",
    lastUploadAt: null,
  },
  performance: {
    viralScore: 0,
    growthRate: "0",
    engagementRate: "0",
    avgRetention: "Não disponível",
  },
  contentStrategy: {
    mainTopics: [],
    videoTypes: [],
    uploadSchedule: "Sem dados",
    titlePattern: "Sem dados",
  },
  audience: {
    topCountries: ["Não disponível sem YouTube Analytics"],
    ageGroups: ["Não disponível sem YouTube Analytics"],
    genderSplit: "Não disponível sem YouTube Analytics",
    interests: [],
  },
  monetization: {
    estimatedMonthlyRevenue: "Estimativa sem acesso à monetização",
    rpm: "N/A",
    revenueSources: [
      { source: "Ads", percentage: 50 },
      { source: "Patrocínios", percentage: 30 },
      { source: "Afiliados", percentage: 15 },
      { source: "Produtos Próprios", percentage: 5 },
    ],
  },
  recommendations: ["Quota da API excedida. Tente novamente mais tarde ou aguarde reset diário."],
  competitors: [],
  dataSource: "Fallback - quota YouTube API excedida",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const yt = createPublicYouTubeClient();

    try {
      const channel = (await yt.getChannelById(params.id)) as any;

      if (!channel) {
        return NextResponse.json({ error: "Canal não encontrado" }, { status: 404 });
      }

      const snippet = channel.snippet || {};
      const stats = channel.statistics || {};
      const topicDetails = channel.topicDetails || {};

      const subscriberCount = parseInt(stats.subscriberCount || "0");
      const totalViews = parseInt(stats.viewCount || "0");
      const totalVideos = parseInt(stats.videoCount || "0");

      const videosData = await yt.getChannelVideos(params.id, 50);
      const videoIds = (videosData.items || [])
        .map((item: any) => item.id?.videoId)
        .filter(Boolean)
        .slice(0, 25);

      const videoDetails: any[] = videoIds.length > 0 ? await yt.getVideosDetails(videoIds) : [];

      const publishedDates = videoDetails
        .map((v) => new Date(v.snippet?.publishedAt).getTime())
        .filter((t) => !isNaN(t));

      let avgViewsPerVideo = 0;
      let avgRetention: number | null = null;
      if (videoDetails.length > 0) {
        const viewsSum = videoDetails.reduce(
          (sum, v) => sum + parseInt(v.statistics?.viewCount || "0"),
          0
        );
        avgViewsPerVideo = viewsSum / videoDetails.length;
      }

      const now = Date.now();
      const videosPerWeek = publishedDates.length >= 2 ? estimateVideosPerWeek(publishedDates, now) : 0;
      const lastUploadAt = publishedDates.length > 0 ? new Date(Math.max(...publishedDates)).toISOString() : null;

      const channelAgeYears = snippet.publishedAt
        ? Math.max((now - new Date(snippet.publishedAt).getTime()) / (365.25 * 24 * 3600 * 1000), 0.1)
        : 1;

      const growthRate =
        channelAgeYears > 0 ? Math.min((subscriberCount / channelAgeYears) / 1000, 1000) : 0;
      const engagementRate =
        videoDetails.length > 0
          ? Math.min(
            videoDetails.reduce((sum, v) => {
              const views = parseInt(v.statistics?.viewCount || "0");
              const likes = parseInt(v.statistics?.likeCount || "0");
              const comments = parseInt(v.statistics?.commentCount || "0");
              return sum + (views > 0 ? ((likes + comments) / views) * 100 : 0);
            }, 0) / videoDetails.length,
            100
          )
          : 0;
      const viralScore =
        subscriberCount > 0 && totalVideos > 0
          ? Math.min((avgViewsPerVideo / Math.max(totalViews / totalVideos, 1)) * 10, 1000)
          : 0;

      const titles = videoDetails.map((v) => v.snippet?.title || "");
      const tags = videoDetails.flatMap((v) => v.snippet?.tags || []);
      const topicLabels = formatTopics(topicDetails.topicCategories);
      const mainTopics = [...new Set([...topicLabels, ...tags.slice(0, 6)])].slice(0, 6);

      const videoTypes = buildVideoTypes(titles, avgViewsPerVideo);
      const titlePatterns = detectTitlePatterns(titles);
      const schedule = formatSchedule(publishedDates);
      const uploadFrequency = videosPerWeek > 0 ? videosPerWeek : 1;

      const competitors = await findCompetitors(yt, mainTopics, subscriberCount);

      const recommendations = buildRecommendations({
        uploadFrequency,
        engagementRate,
        avgViewsPerVideo,
        subscriberCount,
        lastUploadAt,
        videoDetailsCount: videoDetails.length,
        growthRate,
      });

      return NextResponse.json({
        channelId: params.id,
        overview: {
          totalViews,
          totalSubscribers: subscriberCount,
          totalVideos,
          avgViewsPerVideo: Math.round(avgViewsPerVideo),
          uploadFrequency,
          channelAge: channelAgeYears.toFixed(1),
          lastUploadAt,
        },
        performance: {
          viralScore: Math.round(viralScore),
          growthRate: growthRate.toFixed(1),
          engagementRate: engagementRate.toFixed(2),
          avgRetention: avgRetention ? (avgRetention as number).toFixed(1) : "Não disponível",
        },
        contentStrategy: {
          mainTopics,
          videoTypes,
          uploadSchedule: schedule,
          titlePattern: titlePatterns,
        },
        audience: {
          topCountries: ["Não disponível sem YouTube Analytics"],
          ageGroups: ["Não disponível sem YouTube Analytics"],
          genderSplit: "Não disponível sem YouTube Analytics",
          interests: tags.slice(0, 8),
        },
        monetization: {
          estimatedMonthlyRevenue: "Estimativa sem acesso à monetização",
          rpm: "N/A",
          revenueSources: [
            { source: "Ads", percentage: 50 },
            { source: "Patrocínios", percentage: 30 },
            { source: "Afiliados", percentage: 15 },
            { source: "Produtos Próprios", percentage: 5 },
          ],
        },
        recommendations,
        competitors,
        dataSource: "Dados públicos do YouTube (channel, vídeos e estatísticas reais)",
      });
    } catch (e: any) {
      const isQuotaExceeded = e?.response?.data?.error?.code === 429 || e?.message?.includes("quota");
      if (isQuotaExceeded) {
        console.warn(`Quota exceeded for analyze ${params.id}, using fallback`);
        return NextResponse.json({ ...FALLBACK_ANALYSIS, channelId: params.id });
      }
      throw e;
    }
  } catch (error) {
    console.error("Channel analysis error:", error);
    return NextResponse.json(FALLBACK_ANALYSIS, { status: 500 });
  }
}

function estimateVideosPerWeek(publishedDates: number[], now: number): number {
  const sorted = [...publishedDates].sort((a, b) => b - a);
  const newest = sorted[0];
  const oldest = sorted[sorted.length - 1];
  const spanMs = newest - oldest;
  if (spanMs <= 0) return 1;
  const spanWeeks = spanMs / (7 * 24 * 3600 * 1000);
  return parseFloat(((publishedDates.length - 1) / spanWeeks).toFixed(1));
}

function formatSchedule(publishedDates: number[]): string {
  const days = publishedDates.map((t) => new Date(t).getDay());
  const hours = publishedDates.map((t) => new Date(t).getHours());
  const count = (arr: number[], v: number) => arr.filter((x) => x === v).length;
  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  if (days.length === 0) return "Sem dados suficientes";
  const topDay = dayNames[days.reduce((a, b) => (count(days, a) >= count(days, b) ? a : b))];
  const topHour = hours.reduce((a, b) => (count(hours, a) >= count(hours, b) ? a : b));
  return `${topDay} por volta das ${String(topHour).padStart(2, "0")}h`;
}

function buildVideoTypes(titles: string[], avgViews: number): { type: string; count: number; avgViews: number }[] {
  const rules: [RegExp, string][] = [
    [/review|análise|análise|unboxing|test/i, "Reviews / Testes"],
    [/como|tutorial|guia|passo a passo|aprender/i, "Tutoriais / Guias"],
    [/top \d+|melhores|ranking|lista/i, "Rankings / Listas"],
    [/vs|versus|compar/gi, "Comparativos"],
    [/vlog|sti|meu dia|rotina/i, "Vlogs / Rotina"],
    [/shorts|curto|#shorts/i, "Shorts"],
    [/\?|curios|segredo|nunca|xocante|conta/i, "Curiosidades"],
  ];

  const result: { type: string; count: number; avgViews: number }[] = [];
  for (const [regex, label] of rules) {
    const matched = titles.filter((t) => regex.test(t));
    if (matched.length > 0) {
      result.push({ type: label, count: matched.length, avgViews: Math.round(avgViews) });
    }
  }
  if (result.length === 0) {
    result.push({ type: "Conteúdo principal", count: titles.length, avgViews: Math.round(avgViews) });
  }
  return result.slice(0, 5);
}

function detectTitlePatterns(titles: string[]): string {
  const patterns = [
    { regex: /(como|how to)/i, label: "Como [Tópico] em [Tempo]" },
    { regex: /(top \d+|melhore|ranking)/i, label: "Top [N] [Tópico]" },
    { regex: /(\?)/, label: "Pergunta chamativa no título" },
    { regex: /(vs|versus|compar)/i, label: "[A] vs [B]" },
    { regex: /(nunca|sempre|fatal|chocante|xocante|erro)/i, label: "Sensacionalismo controlado (nunca/erro/…)" },
  ];
  for (const p of patterns) {
    if (titles.some((t) => p.regex.test(t))) return p.label;
  }
  return "Sem padrão claro detectado";
}

function formatTopics(categories?: string[]): string[] {
  if (!categories || categories.length === 0) return [];
  return categories
    .map((c) => {
      const last = c.split("/").filter(Boolean).pop() || "";
      const label = last.replace(/[_-]/g, " ");
      return label.charAt(0).toUpperCase() + label.slice(1);
    })
    .slice(0, 6);
}

async function findCompetitors(yt: any, topics: string[], subscribers: number): Promise<any[]> {
  try {
    const queries = topics.slice(0, 3);
    const results: any[] = [];
    for (const q of queries) {
      const channels = await yt.searchChannels(q, 5);
      for (const c of channels) {
        if (c.channelId && c.subscriberCount > 0 && Math.abs(c.subscriberCount - subscribers) / Math.max(subscribers, 1) < 3) {
          results.push({
            name: c.title,
            subscribers: c.subscriberCount,
            similarity: Math.min(Math.round(100 - Math.abs(c.subscriberCount - subscribers) / Math.max(subscribers, 1) * 50), 95),
          });
        }
      }
    }
    const unique = new Map<string, any>();
    for (const r of results) unique.set(r.name, r);
    return [...unique.values()].slice(0, 3);
  } catch (e) {
    return [];
  }
}

function buildRecommendations({
  uploadFrequency,
  engagementRate,
  avgViewsPerVideo,
  subscriberCount,
  lastUploadAt,
  videoDetailsCount,
  growthRate,
}: any): string[] {
  const recs: string[] = [];
  if (uploadFrequency < 2) recs.push("Aumentar a frequência de uploads para pelo menos 2 vídeos por semana pode acelerar o crescimento.");
  if (uploadFrequency >= 2 && uploadFrequency < 5) recs.push("A frequência atual é boa. Considere manter consistência para o algoritmo priorizar o canal.");
  else if (uploadFrequency >= 5) recs.push("Frequência alta detectada. Mantenha a consistência, mas priorize qualidade para proteger a retenção.");
  if (engagementRate < 3) recs.push("Engajamento abaixo de 3%. Estimule comentários com perguntas no final e responda sua audiência.");
  else if (engagementRate < 6) recs.push("Engajamento saudável. Considere criar enquetes/comunidade para fortalecer o vínculo com inscritos.");
  if (avgViewsPerVideo > 0 && subscriberCount > 0) {
    const ratio = avgViewsPerVideo / subscriberCount;
    if (ratio < 0.3) recs.push("Views por vídeo bem abaixo do número de inscritos. Revise títulos, thumbnails e divulgação.");
    else if (ratio > 2) recs.push("Views acima do esperado para a base de inscritos — ótimo sinal para investir em mais uploads.");
  }
  if (lastUploadAt && Date.now() - new Date(lastUploadAt).getTime() > 30 * 24 * 3600 * 1000) {
    recs.push("Nenhum upload nas últimas 4 semanas. Retomar a regularidade deve melhorar a distribuição.");
  }
  if (growthRate < 10) recs.push("Crescimento lento. Considere explorar Shorts para atrair novo público.");
  if (videoDetailsCount === 0) recs.push("Sem vídeos públicos suficientes para análise aprofundada de estratégia.");
  if (recs.length === 0) recs.push("Nenhuma recomendação crítica no momento. Mantenha a estratégia atual e monitore.");
  return recs.slice(0, 5);
}