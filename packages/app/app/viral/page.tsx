'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TrendingUp, Flame, Eye } from 'lucide-react';

const VIRAL_VIDEOS = [
  {
    id: '1',
    title: 'Criei um Canal do Zero com IA e Ganhei R$ 15.000 em 30 Dias',
    channel: 'Negócios Digitais Pro',
    views: '450.000',
    multiplier: '12.4x',
    published: 'Há 3 dias',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    niche: 'Finanças & IA'
  },
  {
    id: '2',
    title: 'Por Que Todo Mundo Está Migrando Para Esta Nova Ferramenta?',
    channel: 'Tech Reviews BR',
    views: '280.000',
    multiplier: '8.1x',
    published: 'Há 5 dias',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    niche: 'Tecnologia'
  },
  {
    id: '3',
    title: 'O Maior Segredo de Retenção Que os Grandes Youtubers Escondem',
    channel: 'Mestre dos Vídeos',
    views: '620.000',
    multiplier: '15.2x',
    published: 'Há 1 semana',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    niche: 'Crescimento no YouTube'
  }
];

export default function ViralPage() {
  const [selectedNiche, setSelectedNiche] = useState('Todos');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Radar de Vídeos Virais <Flame className="h-6 w-6 text-red-500 fill-red-500/20" />
            </h1>
            <p className="text-sm text-slate-400 mt-1">Vídeos que estão desproporcionalmente virais no seu nicho neste momento.</p>
          </div>

          <div className="flex gap-2">
            {['Todos', 'Tecnologia', 'Finanças & IA', 'Crescimento no YouTube'].map((niche) => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedNiche === niche
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VIRAL_VIDEOS.map((video) => (
            <div key={video.id} className="bg-[#111115] border border-slate-800 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all group">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> {video.multiplier} Acima da Média
                </span>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-400 font-medium">{video.channel} • {video.published}</p>
                <h3 className="font-bold text-white text-base leading-snug line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-400" /> {video.views} visualizações
                  </span>
                  <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{video.niche}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
