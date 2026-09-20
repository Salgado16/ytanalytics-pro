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

    // Retorna canais básicos primeiro (rápido), stats em background se tiver token
    const result = channels.map((channel) => ({
      id: channel.id,
      channelId: channel.channelId,
      channelTitle: channel.channelTitle,
      channelHandle: channel.channelHandle,
      isPrimary: channel.isPrimary,
      createdAt: channel.createdAt.toISOString(),
      stats: undefined, // stats carregados separadamente via /api/channels/[id]/stats
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json({ error: "Erro ao buscar canais" }, { status: 500 });
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