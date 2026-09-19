import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessToken } from "@/lib/yt-token";
import { YouTubeApiClient } from "@/lib/youtube-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const accessToken = await getAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Sessão do YouTube não disponível. Faça login novamente." },
        { status: 401 }
      );
    }

    const yt = new YouTubeApiClient(accessToken);
    const channel = (await yt.getMyChannel()) as any;

    if (!channel) {
      return NextResponse.json(
        { error: "Nenhum canal encontrado para sua conta Google." },
        { status: 404 }
      );
    }

    const account = await prisma.account.findFirst({
      where: { userId: session.user.id, provider: "google" },
    });

    const now = Date.now();
    const expiresInMs = (account?.expires_at ? account.expires_at * 1000 : now + 24 * 60 * 60 * 1000) - now;
    const tokenExpiry = new Date(now + Math.max(expiresInMs, 60 * 60 * 1000));

    const saved = await prisma.userChannel.upsert({
      where: { channelId: channel.id },
      update: {
        userId: session.user.id,
        channelTitle: channel.snippet?.title || "Meu Canal",
        channelHandle: channel.snippet?.customUrl || null,
        accessToken,
        refreshToken: (account?.refresh_token as string) || "",
        tokenExpiry,
      },
      create: {
        userId: session.user.id,
        channelId: channel.id,
        channelTitle: channel.snippet?.title || "Meu Canal",
        channelHandle: channel.snippet?.customUrl || null,
        accessToken,
        refreshToken: (account?.refresh_token as string) || "",
        tokenExpiry,
        isPrimary: true,
      },
    });

    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("Error connecting channel:", error?.message || error);
    return NextResponse.json(
      { error: "Erro ao conectar canal. Tente novamente." },
      { status: 500 }
    );
  }
}