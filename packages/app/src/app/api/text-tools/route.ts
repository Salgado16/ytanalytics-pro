import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const tools = await prisma.textTool.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching text tools:", error);
    return NextResponse.json({ error: "Erro ao buscar ferramentas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const tool = await prisma.textTool.create({
      data: {
        userId: session.user.id,
        ...body,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.error("Error saving text tool:", error);
    return NextResponse.json({ error: "Erro ao salvar ferramenta" }, { status: 500 });
  }
}