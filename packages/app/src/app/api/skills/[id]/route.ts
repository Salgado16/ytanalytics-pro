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

    const skill = await prisma.skill.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, category, tags, content, sourceUrl } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Campos obrigatórios: title, description, category" }, { status: 400 });
    }

    const updated = await prisma.skill.update({
      where: { id: skill.id },
      data: {
        title,
        description,
        category,
        tags: tags || [],
        content: content || "",
        sourceUrl: sourceUrl || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json({ error: "Erro ao atualizar skill" }, { status: 500 });
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

    const skill = await prisma.skill.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill não encontrada" }, { status: 404 });
    }

    await prisma.skill.delete({ where: { id: skill.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Erro ao remover skill" }, { status: 500 });
  }
}