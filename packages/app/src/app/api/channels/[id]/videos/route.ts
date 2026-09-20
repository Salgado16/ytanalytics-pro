import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessToken } from "@/lib/yt-token";
import { YouTubeApiClient } from "@/lib/youtube-api";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get channel videos (latest 20)
    const videosData = await yt.getChannelVideos(params.id, 20);
    const videoIds = (videosData.items || [])
      .map((item: any) => item.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get video details with statistics
    const videoDetails = await yt.getVideosDetails(videoIds);

    const videos = videoDetails.map((v: any) => {
      const stats = v.statistics || {};
      const snippet = v.snippet || {};
      const contentDetails = v.contentDetails || {};

      return {
        id: v.id,
        title: snippet.title,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
        views: parseInt(stats.viewCount || "0"),
        likes: parseInt(stats.likeCount || "0"),
        comments: parseInt(stats.commentCount || "0"),
        publishedAt: snippet.publishedAt,
        duration: contentDetails.duration,
        ctr: undefined, // Would need Analytics API
        retention: undefined, // Would need Analytics API
      };
    });

    return NextResponse.json(videos);
  } catch (error: any) {
    console.error("Error fetching channel videos:", error?.message || error);
    if (error?.response?.status === 403) {
      return NextResponse.json(
        { error: "Sem permissão para acessar vídeos deste canal." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Erro ao buscar vídeos do canal" }, { status: 500 });
  }
}