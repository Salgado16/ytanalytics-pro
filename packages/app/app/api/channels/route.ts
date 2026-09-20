import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mockChannels = [
      {
        id: '1',
        name: 'Tech & Futuro Brasil',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        subscribers: '142.500',
        totalViews: '12.8M',
        videosCount: 248,
        status: 'Ativo',
        niche: 'Tecnologia & IA',
      },
      {
        id: '2',
        name: 'Cortes de PodCast Pro',
        avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150',
        subscribers: '89.200',
        totalViews: '8.4M',
        videosCount: 512,
        status: 'Ativo',
        niche: 'Entretenimento',
      },
    ];

    return NextResponse.json(mockChannels, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
