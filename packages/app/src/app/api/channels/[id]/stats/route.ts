import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { YouTubeApiClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const channel = await prisma.userChannel.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!channel?.accessToken) {
      return NextResponse.json({ error: "Canal sem token de acesso" }, { status: 400 });
    }

    const yt = new YouTubeApiClient(channel.accessToken);
    const channelData = (await yt.getChannelById(channel.channelId)) as any;

    if (!channelData) {
      return NextResponse.json({ error: "Canal não encontrado na API" }, { status: 404 });
    }

    const stats = channelData.statistics || {};
    return NextResponse.json({
      subscribers: parseInt(stats.subscriberCount || "0", 10),
      totalViews: parseInt(stats.viewCount || "0", 10),
      videos: parseInt(stats.videoCount || "0", 10),
      thumbnail:
        channelData.snippet?.thumbnails?.medium?.url ||
        channelData.snippet?.thumbnails?.default?.url,
    });
  } catch (error: any) {
    console.error("Error fetching channel stats:", error?.message || error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}