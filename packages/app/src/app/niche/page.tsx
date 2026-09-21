'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DollarSign, TrendingUp, Target, Users, BarChart3, Flame, Eye, ExternalLink, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';

interface NicheData {
  name: string;
  rpmMin: number;
  rpmMax: number;
  competition: 'Baixa' | 'Média' | 'Alta';
  demand: 'Baixa' | 'Média' | 'Alta' | 'Altíssima';
  growth: number;
  topChannels: { name: string; subs: string; avgViews: string; multiplier: number }[];
  keywords: string[];
  category: string;
}

const NICHES: NicheData[] = [
  {
    name: 'Inteligência Artificial & SaaS',
    rpmMin: 28.50,
    rpmMax: 45.00,
    competition: 'Média',
    demand: 'Altíssima',
    growth: 180,
    category: 'Tecnologia',
    keywords: ['IA', 'ChatGPT', 'Automação', 'Ferramentas', 'SaaS'],
    topChannels: [
      { name: 'Tech & Futuro Brasil', subs: '142.5K', avgViews: '180K', multiplier: 12.4 },
      { name: 'IA na Prática', subs: '89.2K', avgViews: '156K', multiplier: 8.7 },
      { name: 'Automação Inteligente', subs: '67.3K', avgViews: '134K', multiplier: 15.2 },
    ],
  },
  {
    name: 'Finanças Pessoais & Investimentos',
    rpmMin: 35.00,
    rpmMax: 60.00,
    competition: 'Alta',
    demand: 'Alta',
    growth: 95,
    category: 'Finanças',
    keywords: ['Investimentos', 'Renda Fixa', 'Ações', 'Criptomoedas', 'FIRE'],
    topChannels: [
      { name: 'Primo Rico', subs: '6.2M', avgViews: '450K', multiplier: 6.1 },
      { name: 'Finanças do Criador', subs: '340K', avgViews: '89K', multiplier: 9.3 },
      { name: 'Investidor Inteligente', subs: '280K', avgViews: '76K', multiplier: 5.8 },
    ],
  },
  {
    name: 'Desenvolvimento de Software',
    rpmMin: 22.00,
    rpmMax: 38.00,
    competition: 'Baixa',
    demand: 'Média',
    growth: 65,
    category: 'Tecnologia',
    keywords: ['React', 'Python', 'Node.js', 'Carreira Dev', 'Tutoriais'],
    topChannels: [
      { name: 'Dev na Prática', subs: '180K', avgViews: '45K', multiplier: 7.2 },
      { name: 'Código Fonte TV', subs: '95K', avgViews: '32K', multiplier: 5.4 },
    ],
  },
  {
    name: 'Edição de Vídeo & Design',
    rpmMin: 18.00,
    rpmMax: 30.00,
    competition: 'Média',
    demand: 'Alta',
    growth: 120,
    category: 'Criativo',
    keywords: ['Premiere', 'After Effects', 'CapCut', 'Thumbnails', 'Motion Design'],
    topChannels: [
      { name: 'Edição Pro', subs: '210K', avgViews: '95K', multiplier: 8.9 },
      { name: 'Design para YouTube', subs: '156K', avgViews: '78K', multiplier: 10.2 },
    ],
  },
  {
    name: 'Shorts & Conteúdo Vertical',
    rpmMin: 5.00,
    rpmMax: 15.00,
    competition: 'Baixa',
    demand: 'Altíssima',
    growth: 320,
    category: 'Crescimento',
    keywords: ['Shorts', 'Reels', 'TikTok', 'Viral', 'Rápido'],
    topChannels: [
      { name: 'Shorts Master', subs: '450K', avgViews: '280K', multiplier: 18.5 },
      { name: 'Viral Lab', subs: '120K', avgViews: '156K', multiplier: 14.7 },
    ],
  },
  {
    name: 'Produtividade & Estilo de Vida',
    rpmMin: 12.00,
    rpmMax: 25.00,
    competition: 'Média',
    demand: 'Alta',
    growth: 85,
    category: 'Lifestyle',
    keywords: ['Produtividade', 'Rotina', 'Hábitos', 'Organização', 'Ferramentas'],
    topChannels: [
      { name: 'Produtividade Diária', subs: '320K', avgViews: '110K', multiplier: 6.8 },
    ],
  },
];

const getCompetitionColor = (comp: string) => {
  switch (comp) {
    case 'Baixa': return 'text-green-400 bg-green-500/10 border-green-500/20';
    case 'Média': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'Alta': return 'text-red-400 bg-red-500/10 border-red-500/20';
  }
};

const getDemandColor = (demand: string) => {
  switch (demand) {
    case 'Altíssima': return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'Alta': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'Média': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'Baixa': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
};

const getGrowthBadge = (growth: number) => {
  if (growth >= 150) return { label: `+${growth}%`, className: 'bg-red-600/20 text-red-400 border-red-500/30', icon: <Flame className="h-3 w-3 fill-current" /> };
  if (growth >= 80) return { label: `+${growth}%`, className: 'bg-amber-600/20 text-amber-400 border-amber-500/30', icon: <TrendingUp className="h-3 w-3" /> };
  return { label: `+${growth}%`, className: 'bg-green-600/20 text-green-400 border-green-500/30', icon: <Target className="h-3 w-3" /> };
};

export default function NichePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedNiche, setExpandedNiche] = useState<string | null>(null);

  const categories = ['Todas', ...new Set(NICHES.map(n => n.category))];
  
  const filteredNiches = NICHES.filter(niche => {
    const matchesSearch = niche.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      niche.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todas' || niche.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="h-5 w-5" />
            </div>
            Pesquisa & Análise de Nichos
          </h1>
          <p className="text-sm text-slate-400 mt-1">Descubra os nichos mais lucrativos do YouTube, RPM estimado no Brasil, canais de referência e oportunidades de crescimento.</p>
        </div>

        {/* Filters */}
        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar nicho, palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer w-full sm:w-48"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Niches Grid */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
          {filteredNiches.map((niche, index) => {
            const compColor = getCompetitionColor(niche.competition);
            const demandColor = getDemandColor(niche.demand);
            const growth = getGrowthBadge(niche.growth);
            const isExpanded = expandedNiche === niche.name;
            const avgRPM = ((niche.rpmMin + niche.rpmMax) / 2).toFixed(2);

            return (
              <div key={niche.name} className="bg-[#111115] border border-slate-800 rounded-2xl overflow-hidden transition-all">
                {/* Main Card */}
                <button
                  onClick={() => setExpandedNiche(isExpanded ? null : niche.name)}
                  className="w-full p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-white truncate">{niche.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${compColor}`}>
                          Concorrência: {niche.competition}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${demandColor}`}>
                          Procura: {niche.demand}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${growth.className} flex items-center gap-1`}>
                          {growth.icon} {growth.label} Crescimento
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Categoria: {niche.category} • Palavras-chave: {niche.keywords.slice(0, 3).join(', ')}...</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:ml-auto">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">RPM Estimado (Brasil)</p>
                      <p className="text-2xl font-extrabold text-emerald-400">R$ {avgRPM}</p>
                      <p className="text-[10px] text-slate-500">R$ {niche.rpmMin.toFixed(2)} - R$ {niche.rpmMax.toFixed(2)}</p>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-slate-900/50 border-t border-slate-800/80 p-6 animate-slide-down space-y-6">
                    {/* Top Channels */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <Users className="h-4 w-4" /> Canais de Referência no Nicho
                        </h4>
                        <button className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                          Ver todos <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {niche.topChannels.map((channel, ci) => (
                          <div key={channel.name} className="bg-[#111115] border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white truncate">{channel.name}</p>
                              <span className="text-xs text-slate-400">{channel.subs} inscritos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                                <p className="text-xs text-slate-400">Média Views</p>
                                <p className="font-bold text-slate-100 text-sm">{channel.avgViews}</p>
                              </div>
                              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                                <p className="text-xs text-slate-400">Multiplicador</p>
                                <p className="font-bold text-red-400 text-sm">{channel.multiplier}x</p>
                              </div>
                            </div>
                            {channel.multiplier >= 10 && (
                              <span className="inline-block px-2 py-0.5 bg-red-600/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30">
                                Viral Extremo
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keywords & Opportunity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" /> Palavras-chave de Alta Procura
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {niche.keywords.map(kw => (
                            <span key={kw} className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-full text-xs text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" /> Oportunidade de Entrada
                        </h4>
                        <div className="space-y-2 text-sm text-slate-300">
                          <p>• Nicho com <span className="font-bold text-emerald-400">RPM médio de R$ {avgRPM}</span> - acima da média do Brasil (R$ 8-15)</p>
                          <p>• Crescimento de <span className="font-bold">{growth.label}</span> nos últimos 6 meses</p>
                          <p>• Concorrência <span className="font-bold">{niche.competition.toLowerCase()}</span> - {niche.competition === 'Baixa' ? 'oportunidade ideal para novos canais' : niche.competition === 'Média' ? 'espaço para diferenciação' : 'exige estratégia forte de conteúdo'}</p>
                          <p>• Procura <span className="font-bold">{niche.demand.toLowerCase()}</span> - {niche.demand === 'Altíssima' ? 'audience garantida para bons conteúdos' : 'público engajado e qualificado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredNiches.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Target className="h-16 w-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhum nicho encontrado</h3>
            <p className="text-slate-400">Tente ajustar a busca ou categoria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}