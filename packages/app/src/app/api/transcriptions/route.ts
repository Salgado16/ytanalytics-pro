import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessToken } from "@/lib/yt-token";
import { YouTubeApiClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[transcriptions] session:", session?.user?.id, session?.accessToken ? "has accessToken" : "no accessToken");
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const action = searchParams.get("action");

    if (!videoId) {
      return NextResponse.json({ error: "videoId obrigatório" }, { status: 400 });
    }

    const accessToken = await getAccessToken(request);
    console.log("[transcriptions] accessToken:", accessToken ? "ok" : "null/expired");
    if (!accessToken) {
      return NextResponse.json(
        { error: "Sessão do YouTube expirada. Faça login novamente ou reconecte o canal." },
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
        { error: "Sem permissão para acessar legendas deste vídeo. O vídeo pode não ter legendas, ser privado, ou seu token não tem escopo youtube.force-ssl." },
        { status: 403 }
      );
    }
    if (error?.response?.status === 401) {
      return NextResponse.json(
        { error: "Token expirado ou inválido. Faça login novamente." },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: error?.response?.data?.error?.message || error?.message || "Erro ao buscar legendas" }, { status: 500 });
  }
}