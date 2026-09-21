'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TrendingUp, Flame, Eye, Filter, Calendar, Target, BarChart3, RefreshCw } from 'lucide-react';

interface ViralVideo {
  id: string;
  title: string;
  channel: string;
  views: string;
  multiplier: number;
  published: string;
  thumbnail: string;
  niche: string;
  category: string;
}

const VIRAL_VIDEOS: ViralVideo[] = [
  { id: '1', title: 'Criei um Canal do Zero com IA e Ganhei R$ 15.000 em 30 Dias', channel: 'Negócios Digitais Pro', views: '450.000', multiplier: 12.4, published: 'Há 3 dias', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', niche: 'Finanças & IA', category: 'Educacional' },
  { id: '2', title: 'Por Que Todo Mundo Está Migrando Para Esta Nova Ferramenta?', channel: 'Tech Reviews BR', views: '280.000', multiplier: 8.1, published: 'Há 5 dias', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', niche: 'Tecnologia', category: 'Review' },
  { id: '3', title: 'O Maior Segredo de Retenção Que os Grandes Youtubers Escondem', channel: 'Mestre dos Vídeos', views: '620.000', multiplier: 15.2, published: 'Há 1 semana', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400', niche: 'Crescimento no YouTube', category: 'Estratégia' },
  { id: '4', title: 'Shorts que Viraram Ouro: Meu Processo Completo', channel: 'Criador Pro', views: '380.000', multiplier: 9.8, published: 'Há 2 dias', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', niche: 'Shorts & Reels', category: 'Tutorial' },
  { id: '5', title: 'Review: O Microfone Que Mudou Meu Áudio para Sempre', channel: 'Audio Tech BR', views: '195.000', multiplier: 6.3, published: 'Há 4 dias', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400', niche: 'Tecnologia', category: 'Review' },
  { id: '6', title: 'Como Encontrar Nichos Inexplorados no YouTube (Método 2026)', channel: 'Niche Hunter', views: '510.000', multiplier: 11.7, published: 'Há 6 dias', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', niche: 'Pesquisa de Nicho', category: 'Estratégia' },
  { id: '7', title: 'Automatizei 90% do Meu Canal com Estas 3 Ferramentas', channel: 'Automação Inteligente', views: '340.000', multiplier: 7.9, published: 'Há 1 semana', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', niche: 'Automação & IA', category: 'Tutorial' },
  { id: '8', title: 'A Verdade Sobre RPM no Brasil: Números Reais', channel: 'Finanças do Criador', views: '220.000', multiplier: 5.4, published: 'Há 3 dias', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', niche: 'Finanças & IA', category: 'Análise' },
  { id: '9', title: 'Thumbnail Perfeita: Testei 50 Variações e Isso Aconteceu', channel: 'Design para YouTube', views: '410.000', multiplier: 10.2, published: 'Há 2 dias', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', niche: 'Design & Thumbnails', category: 'Estudo de Caso' },
];

const niches = ['Todos', ...new Set(VIRAL_VIDEOS.map(v => v.niche))];
const categories = ['Todas', ...new Set(VIRAL_VIDEOS.map(v => v.category))];

export default function ViralPage() {
  const [selectedNiche, setSelectedNiche] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7d' | '30d'>('7d');
  const [minMultiplier, setMinMultiplier] = useState(0);
  const [sortBy, setSortBy] = useState<'multiplier' | 'views' | 'date'>('multiplier');

  const filteredVideos = useMemo(() => {
    let result = [...VIRAL_VIDEOS];

    if (selectedNiche !== 'Todos') {
      result = result.filter(v => v.niche === selectedNiche);
    }
    if (selectedCategory !== 'Todas') {
      result = result.filter(v => v.category === selectedCategory);
    }
    if (minMultiplier > 0) {
      result = result.filter(v => v.multiplier >= minMultiplier);
    }
    if (selectedPeriod !== 'all') {
      const days = selectedPeriod === '7d' ? 7 : 30;
      result = result.filter(v => {
        const pub = v.published.toLowerCase();
        if (pub.includes('dia')) return true;
        if (pub.includes('semana')) return days >= 7;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'multiplier') return b.multiplier - a.multiplier;
      if (sortBy === 'views') {
        const aViews = parseFloat(a.views.replace('.', ''));
        const bViews = parseFloat(b.views.replace('.', ''));
        return bViews - aViews;
      }
      return 0;
    });

    return result;
  }, [selectedNiche, selectedCategory, selectedPeriod, minMultiplier, sortBy]);

  const getMultiplierBadge = (multiplier: number) => {
    if (multiplier >= 10) return { label: `${multiplier}x`, className: 'bg-red-600/20 text-red-400 border-red-500/30', icon: <Flame className="h-3 w-3 fill-current" /> };
    if (multiplier >= 5) return { label: `${multiplier}x`, className: 'bg-amber-600/20 text-amber-400 border-amber-500/30', icon: <TrendingUp className="h-3 w-3" /> };
    return { label: `${multiplier}x`, className: 'bg-green-600/20 text-green-400 border-green-500/30', icon: <Target className="h-3 w-3" /> };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Flame className="h-5 w-5 fill-current" />
              </div>
              Radar de Vídeos Virais
            </h1>
            <p className="text-sm text-slate-400 mt-1">Vídeos que estão desproporcionalmente virais no seu nicho. Detectamos outliers de 5x a 15x acima da média.</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
              >
                {niches.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'all' | '7d' | '30d')}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="all">Todo período</option>
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs text-slate-400">Mín: </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={minMultiplier}
                onChange={(e) => setMinMultiplier(parseFloat(e.target.value) || 0)}
                className="w-20 bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
              <span className="text-xs text-slate-400">x</span>
            </div>
            <button
              onClick={() => { setSelectedNiche('Todos'); setSelectedCategory('Todas'); setSelectedPeriod('7d'); setMinMultiplier(0); }}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="bg-[#111115] border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{filteredVideos.length}</p>
            <p className="text-xs text-slate-400">Vídeos Detectados</p>
          </div>
          <div className="bg-[#111115] border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {filteredVideos.length > 0 ? Math.max(...filteredVideos.map(v => v.multiplier)).toFixed(1) : '0'}x
            </p>
            <p className="text-xs text-slate-400">Maior Multiplicador</p>
          </div>
          <div className="bg-[#111115] border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {filteredVideos.length > 0 ? filteredVideos.filter(v => v.multiplier >= 10).length : 0}
            </p>
            <p className="text-xs text-slate-400">Acima de 10x (Viral Extremo)</p>
          </div>
          <div className="bg-[#111115] border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {filteredVideos.length > 0 ? filteredVideos.filter(v => v.multiplier >= 5).length : 0}
            </p>
            <p className="text-xs text-slate-400">Acima de 5x (Alto Potencial)</p>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => {
                const badge = getMultiplierBadge(video.multiplier);
                return (
                  <div key={video.id} className="bg-[#111115] border border-slate-800 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1 font-black text-xs border ${badge.className}`}>
                        {badge.icon} {badge.label} Acima da Média
                      </span>
                      {video.multiplier >= 10 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-[10px] px-2 py-1 rounded animate-pulse">
                          VIRAL EXTREMO
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-400 font-medium">{video.channel} • {video.published}</p>
                      <h3 className="font-bold text-white text-base leading-snug line-clamp-2">{video.title}</h3>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-slate-300 font-bold flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-slate-400" /> {video.views} views
                        </span>
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{video.niche}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Target className="h-16 w-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhum vídeo viral encontrado</h3>
              <p className="text-slate-400">Tente ajustar os filtros para ver mais resultados</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}