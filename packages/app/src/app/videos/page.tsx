'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MOCK_VIDEOS } from '@/lib/mock-data';
import { Search, Filter, ChevronDown, Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VideoData {
  id: string;
  title: string;
  views: string;
  likes: string;
  ctr: string;
  duration: string;
  published: string;
}

const extendedVideos: VideoData[] = [
  ...MOCK_VIDEOS,
  { id: 'v4', title: 'Monetização no YouTube: Guia Completo 2026', views: '87K', likes: '7.2K', ctr: '8.9%', duration: '22:15', published: 'Há 2 semanas' },
  { id: 'v5', title: 'Shorts vs Vídeos Longos: O Que Dá Mais Dinheiro?', views: '156K', likes: '14.1K', ctr: '12.3%', duration: '16:40', published: 'Há 3 semanas' },
  { id: 'v6', title: 'Como Fazer Thumbnails Que Convertem (Teste A/B)', views: '203K', likes: '18.9K', ctr: '15.7%', duration: '19:30', published: 'Há 1 mês' },
  { id: 'v7', title: 'SEO para YouTube: Rankear #1 em Qualquer Nicho', views: '134K', likes: '11.8K', ctr: '10.2%', duration: '24:05', published: 'Há 1 mês' },
  { id: 'v8', title: 'Equipamento para Iniciantes: O Que Comprar Primeiro?', views: '76K', likes: '6.4K', ctr: '7.8%', duration: '13:20', published: 'Há 2 meses' },
];

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'ctr' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const filteredVideos = useMemo(() => {
    let result = [...extendedVideos];

    if (searchQuery) {
      result = result.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filterPeriod !== 'all') {
      const days = filterPeriod === '7d' ? 7 : filterPeriod === '30d' ? 30 : 90;
      result = result.filter(v => {
        const published = v.published.toLowerCase();
        if (published.includes('dia')) return true;
        if (published.includes('semana')) return days >= 7;
        if (published.includes('mês') || published.includes('mes')) return days >= 30;
        return true;
      });
    }

    result.sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortBy === 'views') {
        aVal = parseFloat(a.views.replace('K', '')) * 1000;
        bVal = parseFloat(b.views.replace('K', '')) * 1000;
      } else if (sortBy === 'likes') {
        aVal = parseFloat(a.likes.replace('K', '')) * 1000;
        bVal = parseFloat(b.likes.replace('K', '')) * 1000;
      } else if (sortBy === 'ctr') {
        aVal = parseFloat(a.ctr.replace('%', ''));
        bVal = parseFloat(b.ctr.replace('%', ''));
      } else {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [searchQuery, sortBy, sortOrder, filterPeriod]);

  const handleExport = () => {
    const csv = ['Título,Visualizações,Curtidas,CTR,Duração,Publicado', ...filteredVideos.map(v => 
      `"${v.title}",${v.views},${v.likes},${v.ctr},${v.duration},${v.published}`
    )].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `videos-youtube-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Relatório exportado com sucesso!');
  };

  const periodLabels = { all: 'Todo período', '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias' };
  const sortLabels = { views: 'Visualizações', likes: 'Curtidas', ctr: 'CTR', date: 'Data' };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-white tracking-tight">Gerenciador de Vídeos</h1>
            <p className="text-sm text-slate-400 mt-1">Todos os vídeos publicados e suas estatísticas detalhadas.</p>
          </div>
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <button
              onClick={handleExport}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="bg-[#111115] border border-slate-800 rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-xs sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar vídeos pelo título..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 placeholder-slate-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  <span>{periodLabels[filterPeriod]}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {filterMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-[#111115] border border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-slide-down">
                    {Object.entries(periodLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setFilterPeriod(key as typeof filterPeriod); setFilterMenuOpen(false); }}
                        className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                          filterPeriod === key ? 'bg-red-600/10 text-red-400' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors"
                >
                  <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60">
            <div className="px-4 py-3 bg-slate-900/30 border-b border-slate-800/50 hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <span className="col-span-5">Título</span>
              <span className="col-span-2 text-right"><Eye className="h-3 w-3 inline mr-1" /> Views</span>
              <span className="col-span-1 text-right"><Heart className="h-3 w-3 inline mr-1" /> Likes</span>
              <span className="col-span-1 text-right">CTR</span>
              <span className="col-span-1 text-center">Duração</span>
              <span className="col-span-2 text-right"><Calendar className="h-3 w-3 inline mr-1" /> Publicado</span>
            </div>
            
            {filteredVideos.map((video, index) => (
              <div 
                key={video.id} 
                className="p-4 flex items-center gap-4 hover:bg-slate-900/40 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">{video.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="h-3 w-3" /><Calendar className="h-3 w-3" /> {video.published}</span>
                    <span className="flex items-center gap-1"><span className="h-3 w-3" /> {video.duration}</span>
                  </p>
                </div>
                <div className="hidden md:grid grid-cols-5 gap-4 items-center text-right">
                  <div className="col-span-2 font-bold text-slate-200 text-sm">{video.views}</div>
                  <div className="col-span-1 font-bold text-emerald-400 text-sm">{video.likes}</div>
                  <div className="col-span-1 font-bold text-blue-400 text-sm">{video.ctr}</div>
                  <div className="col-span-1 text-center text-slate-400 text-sm">{video.duration}</div>
                  <div className="col-span-2 text-slate-400 text-sm">{video.published}</div>
                </div>
                <div className="md:hidden w-full grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/50 text-xs">
                  <div className="flex items-center justify-center gap-1 text-slate-300"><Eye className="h-3 w-3" /> {video.views}</div>
                  <div className="flex items-center justify-center gap-1 text-emerald-400"><Heart className="h-3 w-3" /> {video.likes}</div>
                  <div className="flex items-center justify-center gap-1 text-blue-400">{video.ctr}</div>
                </div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Nenhum vídeo encontrado com esses filtros</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}