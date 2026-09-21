'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MOCK_IDEAS } from '@/lib/mock-data';
import { Copy, Check, Sparkles, Brain, FileText, Zap, TrendingUp, Target, RefreshCw, Download, Plus, X, ChevronDown, Loader2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Idea {
  id: string;
  title: string;
  score: number;
  category: string;
  hook: string;
  outline: string[];
  thumbnailIdeas: string[];
  tags: string[];
  estimatedViews: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
}

const EXTENDED_IDEAS: Idea[] = MOCK_IDEAS.map((idea, i) => ({
  ...idea,
  outline: [
    `Introdução (0:00-0:30): ${idea.hook}`,
    'Contextualização do problema/oportunidade (0:30-1:30)',
    'Apresentação da solução/método principal (1:30-5:00)',
    'Demonstração prática passo a passo (5:00-12:00)',
    'Dicas avançadas e erros comuns (12:00-15:00)',
    'Call to action e próximo vídeo sugerido (15:00-fim)',
  ],
  thumbnailIdeas: [
    `Você vs ${idea.title.split(' ').slice(0, 3).join(' ')} - Antes/Depois`,
    `Número chocante: ${Math.floor(Math.random() * 50 + 10)}x mais resultados`,
    `O segredo que ninguém te conta sobre ${idea.title.split(' ').slice(-2).join(' ')}`,
  ],
  tags: ['IA', 'Tutorial', 'Produtividade', '2026'].slice(0, 3 + (i % 2)),
  estimatedViews: `${Math.floor(Math.random() * 200 + 50)}K - ${Math.floor(Math.random() * 300 + 200)}K`,
  difficulty: ['Fácil', 'Médio', 'Avançado'][i % 3] as 'Fácil' | 'Médio' | 'Avançado',
}));

const CATEGORIES = ['Todas', 'Alta Procura', 'Tendência', 'Urgente', 'Evergreen', 'Shorts'];
const NICHES = ['Geral', 'Tecnologia & IA', 'Finanças', 'Produtividade', 'Edição', 'Crescimento'];

export default function IdeasPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedNiche, setSelectedNiche] = useState('Geral');
  const [customTopic, setCustomTopic] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleGenerate = async () => {
    if (!customTopic.trim() && !selectedNiche) return;
    
    setGenerating(true);
    const loadingToast = toast.loading('Gerando ideias com IA...', { id: 'generate' });
    
    try {
      await new Promise(r => setTimeout(r, 2500));
      toast.success('Novas ideias geradas com sucesso!', { id: 'generate' });
      setCustomTopic('');
    } catch {
      toast.error('Erro ao gerar. Tente novamente.', { id: 'generate' });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyFullScript = (idea: Idea) => {
    const script = `# ROTEIRO COMPLETO: ${idea.title}

## GANCHO INICIAL
${idea.hook}

## ESTRUTURA DO VÍDEO
${idea.outline.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## IDEIAS DE THUMBNAIL
${idea.thumbnailIdeas.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## TAGS SUGERIDAS
${idea.tags.join(', ')}

## ESTIMATIVA
Visualizações: ${idea.estimatedViews}
Dificuldade: ${idea.difficulty}
Pontuação Viral: ${idea.score}/100`;

    navigator.clipboard.writeText(script);
    toast.success('Roteiro completo copiado!');
  };

  const filteredIdeas = EXTENDED_IDEAS.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todas' || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'bg-red-600/20 text-red-400 border-red-500/30';
    if (score >= 90) return 'bg-amber-600/20 text-amber-400 border-amber-500/30';
    return 'bg-green-600/20 text-green-400 border-green-500/30';
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Fácil': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Médio': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Avançado': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header + Generator */}
        <div className="animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                Gerador de Ideias & Roteiros IA
              </h1>
              <p className="text-sm text-slate-400 mt-1">Ideias de vídeos de alta demanda geradas com inteligência artificial para o seu nicho.</p>
            </div>
          </div>

          {/* Generator Form */}
          <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2"><Brain className="h-5 w-5" /> Gerar Novas Ideias</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Sobre o que você quer criar?</label>
                <input
                  type="text"
                  placeholder="Ex: Como usar IA para editar vídeos 10x mais rápido..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nicho</label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{generating ? 'Gerando...' : 'Gerar Ideias com IA'}</span>
            </button>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar ideias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => {
                const isExpanded = expandedIdea === idea.id;
                return (
                  <div key={idea.id} className="bg-[#111115] border border-slate-800 rounded-2xl overflow-hidden transition-all group">
                    {/* Card Header */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(idea.score)} flex items-center gap-1`}>
                          <TrendingUp className="h-3 w-3" /> Pontuação Viral: {idea.score}/100
                        </span>
                        <span className="text-xs text-slate-400">{idea.category}</span>
                      </div>
                      <h3 className="font-bold text-white text-base leading-snug">{idea.title}</h3>
                      <p className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <strong className="text-slate-200">Gancho Inicial:</strong> {idea.hook}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-900/50 border border-slate-700 rounded-full text-[10px] text-slate-400">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => setExpandedIdea(isExpanded ? null : idea.id)}
                        className="w-full flex items-center justify-between py-2 text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Ver Roteiro Completo
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-slide-down">
                          {/* Estimated Views & Difficulty */}
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Eye className="h-3 w-3" /> Estimado: {idea.estimatedViews} views
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getDifficultyColor(idea.difficulty)}`}>
                              {idea.difficulty}
                            </span>
                          </div>

                          {/* Outline */}
                          <div>
                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Estrutura do Roteiro</h4>
                            <ol className="space-y-1 text-sm text-slate-300">
                              {idea.outline.map((step, i) => (
                                <li key={i} className="flex items-start gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-800/50">
                                  <span className="text-xs font-bold text-purple-400 flex-shrink-0 w-6">{i + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Thumbnail Ideas */}
                          <div>
                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2"><Target className="h-4 w-4" /> Ideias de Thumbnail</h4>
                            <div className="space-y-1">
                              {idea.thumbnailIdeas.map((thumb, i) => (
                                <div key={i} className="p-2 bg-slate-900/50 rounded-lg border border-slate-800/50 flex items-center gap-2">
                                  <span className="text-xs font-bold text-purple-400">{i + 1}.</span>
                                  <span className="text-sm text-slate-300">{thumb}</span>
                                  <button onClick={() => handleCopy(`${idea.id}-thumb-${i}`, thumb)} className="ml-auto p-1 hover:bg-slate-700 rounded">
                                    <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                            <button onClick={() => handleCopy(idea.id, idea.title)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                              <Copy className="h-3.5 w-3.5" /> Copiar Título
                            </button>
                            <button onClick={() => handleCopyFullScript(idea)} className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg text-xs font-medium transition-colors border border-purple-500/30 flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" /> Copiar Roteiro Completo
                            </button>
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                              <Download className="h-3.5 w-3.5" /> Exportar .txt
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Brain className="h-16 w-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhuma ideia encontrada</h3>
              <p className="text-slate-400">Tente ajustar os filtros ou gerar novas ideias</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}