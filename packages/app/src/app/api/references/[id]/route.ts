import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const reference = await prisma.reference.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!reference) {
      return NextResponse.json({ error: "Referência não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const { title, type, url, thumbnail, description, tags, channelId, videoId } = body;

    if (!title || !type || !url) {
      return NextResponse.json({ error: "Campos obrigatórios: title, type, url" }, { status: 400 });
    }

    const updated = await prisma.reference.update({
      where: { id: reference.id },
      data: {
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating reference:", error);
    return NextResponse.json({ error: "Erro ao atualizar referência" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const reference = await prisma.reference.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!reference) {
      return NextResponse.json({ error: "Referência não encontrada" }, { status: 404 });
    }

    await prisma.reference.delete({ where: { id: reference.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting reference:", error);
    return NextResponse.json({ error: "Erro ao remover referência" }, { status: 500 });
  }
}