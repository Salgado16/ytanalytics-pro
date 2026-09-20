import { NextResponse } from 'next/server';

export async function GET() {
  const mockStats = {
    views: '1.458.200',
    subscribers: '+12.450',
    watchTime: '84.200h',
    estimatedRevenue: 'R$ 8.940,00',
  };

  return NextResponse.json(mockStats, { status: 200 });
}
