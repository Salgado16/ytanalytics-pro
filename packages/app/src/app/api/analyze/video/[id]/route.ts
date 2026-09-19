import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const transcription = await prisma.transcription.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!transcription) {
      return NextResponse.json({ error: "Transcrição não encontrada" }, { status: 404 });
    }

    return NextResponse.json(transcription);
  } catch (error) {
    console.error("Error fetching transcription:", error);
    return NextResponse.json({ error: "Erro ao buscar transcrição" }, { status: 500 });
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

    await prisma.transcription.delete({
      where: { id: params.id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transcription:", error);
    return NextResponse.json({ error: "Erro ao excluir transcrição" }, { status: 500 });
  }
}