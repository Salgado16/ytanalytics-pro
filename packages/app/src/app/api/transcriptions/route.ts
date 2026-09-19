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

    const transcriptions = await prisma.transcription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transcriptions);
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return NextResponse.json({ error: "Erro ao buscar transcrições" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { sourceType, sourceUrl, language } = body;

    if (!sourceUrl) {
      return NextResponse.json({ error: "URL obrigatória" }, { status: 400 });
    }

    const transcription = await prisma.transcription.create({
      data: {
        userId: session.user.id,
        sourceType,
        sourceUrl,
        language: language || "pt-BR",
        status: "pending",
      },
    });

    // Trigger async processing (in production, use a queue)
    processTranscription(transcription.id, sourceType, sourceUrl, language || "pt-BR");

    return NextResponse.json(transcription);
  } catch (error) {
    console.error("Error creating transcription:", error);
    return NextResponse.json({ error: "Erro ao criar transcrição" }, { status: 500 });
  }
}

async function processTranscription(id: string, sourceType: string, sourceUrl: string, language: string) {
  try {
    await prisma.transcription.update({
      where: { id },
      data: { status: "processing" },
    });

    // In production, integrate with AssemblyAI, Whisper, or other services
    // For now, simulate processing
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Mock result
    const mockText = `Esta é uma transcrição simulada do vídeo/áudio: ${sourceUrl}. Em produção, isso seria processado por AssemblyAI, OpenAI Whisper, ou similar.`;
    const mockSegments = [
      { start: 0, end: 5, text: "Olá, bem-vindo ao meu canal!", confidence: 0.95 },
      { start: 5, end: 12, text: "Hoje vamos falar sobre como crescer no YouTube.", confidence: 0.92 },
      { start: 12, end: 20, text: "Vou compartilhar 5 dicas essenciais.", confidence: 0.89 },
    ];

    await prisma.transcription.update({
      where: { id },
      data: {
        status: "completed",
        text: mockText,
        segments: mockSegments,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Transcription processing error:", error);
    await prisma.transcription.update({
      where: { id },
      data: {
        status: "failed",
        error: "Erro no processamento",
      },
    });
  }
}