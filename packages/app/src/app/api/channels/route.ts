import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { YouTubeApiClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const channels = await prisma.userChannel.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });

    const result = await Promise.all(
      channels.map(async (channel) => {
        const stats =
          channel.accessToken
            ? await fetchChannelStats(channel.accessToken, channel.channelId)
            : undefined;
        return {
          id: channel.id,
          channelId: channel.channelId,
          channelTitle: channel.channelTitle,
          channelHandle: channel.channelHandle,
          isPrimary: channel.isPrimary,
          createdAt: channel.createdAt.toISOString(),
          stats,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json({ error: "Erro ao buscar canais" }, { status: 500 });
  }
}

async function fetchChannelStats(accessToken: string, channelId: string) {
  try {
    const yt = new YouTubeApiClient(accessToken);
    const channel = (await yt.getChannelById(channelId)) as any;
    if (!channel) return undefined;

    const stats = channel.statistics || {};
    return {
      subscribers: parseInt(stats.subscriberCount || "0", 10),
      totalViews: parseInt(stats.viewCount || "0", 10),
      videos: parseInt(stats.videoCount || "0", 10),
      thumbnail:
        channel.snippet?.thumbnails?.medium?.url ||
        channel.snippet?.thumbnails?.default?.url,
    };
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const channel = await prisma.userChannel.create({
      data: {
        userId: session.user.id,
        ...body,
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error("Error creating channel:", error);
    return NextResponse.json({ error: "Erro ao criar canal" }, { status: 500 });
  }
}