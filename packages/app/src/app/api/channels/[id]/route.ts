import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const channel = await prisma.userChannel.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!channel) {
      return NextResponse.json({ error: "Canal não encontrado" }, { status: 404 });
    }

    await prisma.userChannel.delete({ where: { id: channel.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error removing channel:", error);
    return NextResponse.json({ error: "Erro ao remover canal" }, { status: 500 });
  }
}