import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessToken } from "@/lib/yt-token";
import { YouTubeApiClient } from "@/lib/youtube-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getUserYouTubeToken(userId: string): Promise<string | null> {
  // Primeiro tenta pegar do canal conectado no banco (tem refresh token persistente)
  const userChannel = await prisma.userChannel.findFirst({
    where: { userId, isPrimary: true },
    orderBy: { createdAt: "desc" },
  });

  if (userChannel?.accessToken) {
    // Verifica se token não expirou (com margem de 5 min)
    if (userChannel.tokenExpiry && new Date(userChannel.tokenExpiry) > new Date(Date.now() + 5 * 60 * 1000)) {
      return userChannel.accessToken;
    }
    // Se expirou, tenta renovar com refresh token do banco
    if (userChannel.refreshToken) {
      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: userChannel.refreshToken,
            grant_type: "refresh_token",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const newExpiry = new Date(Date.now() + data.expires_in * 1000);
          await prisma.userChannel.update({
            where: { id: userChannel.id },
            data: {
              accessToken: data.access_token,
              tokenExpiry: newExpiry,
              refreshToken: data.refresh_token ?? userChannel.refreshToken,
            },
          });
          return data.access_token;
        }
      } catch (e) {
        console.error("Error refreshing token from DB:", e);
      }
    }
  }

  // Fallback: tenta pegar do JWT (login direto)
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[transcriptions] session:", session?.user?.id);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const action = searchParams.get("action");

    if (!videoId) {
      return NextResponse.json({ error: "videoId obrigatório" }, { status: 400 });
    }

    // Tenta pegar token do canal conectado no banco
    let accessToken = await getUserYouTubeToken(session.user.id);
    
    // Fallback para JWT token
    if (!accessToken) {
      accessToken = await getAccessToken(request);
    }
    
    console.log("[transcriptions] accessToken:", accessToken ? "ok" : "null/expired");
    if (!accessToken) {
      return NextResponse.json(
        { error: "Canal do YouTube não conectado ou token expirado. Vá em /channels e clique em 'Conectar Novo Canal'." },
        { status: 401 }
      );
    }

    const yt = new YouTubeApiClient(accessToken);

    if (action === "download") {
      const captionId = searchParams.get("captionId");
      const format = searchParams.get("format") || "srt";
      if (!captionId) {
        return NextResponse.json({ error: "captionId obrigatório para download" }, { status: 400 });
      }
      const caption = await yt.downloadCaption(captionId, format);
      return new NextResponse(caption, {
        headers: {
          "Content-Type": format === "srt" ? "text/plain" : "application/xml",
          "Content-Disposition": `attachment; filename="caption_${captionId}.${format}"`,
        },
      });
    }

    const captions = await yt.getVideoCaptions(videoId);
    console.log("[transcriptions] captions found:", captions.length);
    return NextResponse.json(captions);
  } catch (error: any) {
    console.error("[transcriptions] Error:", error?.response?.data || error?.message || error);
    if (error?.response?.status === 403) {
      return NextResponse.json(
        { error: "Sem permissão para acessar legendas deste vídeo. O vídeo pode não ter legendas, ser privado, ou seu canal não tem acesso a este recurso." },
        { status: 403 }
      );
    }
    if (error?.response?.status === 401) {
      return NextResponse.json(
        { error: "Token expirado ou inválido. Reconecte o canal em /channels." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error?.response?.data?.error?.message || error?.message || "Erro ao buscar legendas" }, { status: 500 });
  }
}