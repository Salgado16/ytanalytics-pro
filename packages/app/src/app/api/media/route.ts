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

    const assets = await prisma.mediaAsset.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Erro ao buscar mídia" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const asset = await prisma.mediaAsset.create({
      data: {
        userId: session.user.id,
        ...body,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error saving media:", error);
    return NextResponse.json({ error: "Erro ao salvar mídia" }, { status: 500 });
  }
}