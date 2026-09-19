import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const references = await prisma.reference.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(references);
  } catch (error) {
    console.error("Error fetching references:", error);
    return NextResponse.json({ error: "Erro ao buscar referências" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, url, thumbnail, description, tags, channelId, videoId } = body;

    if (!title || !type || !url) {
      return NextResponse.json({ error: "Campos obrigatórios: title, type, url" }, { status: 400 });
    }

    const reference = await prisma.reference.create({
      data: {
        userId: session.user.id,
        title,
        type,
        url,
        thumbnail: thumbnail || null,
        description: description || null,
        tags: tags || [],
        channelId: channelId || null,
        videoId: videoId || null,
      },
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    console.error("Error creating reference:", error);
    return NextResponse.json({ error: "Erro ao criar referência" }, { status: 500 });
  }
}