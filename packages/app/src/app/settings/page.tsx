'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { User, Shield, Bell, Key, Tv, Globe, Moon, Sun, Monitor, Palette, Download, Trash2, LogOut, Save, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

type SettingsTab = 'perfil' | 'canais' | 'notificacoes' | 'seguranca' | 'aparencia' | 'dados';

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'perfil', label: 'Perfil', icon: <User className="h-4 w-4" /> },
  { id: 'canais', label: 'Canais Conectados', icon: <Tv className="h-4 w-4" /> },
  { id: 'notificacoes', label: 'Notificações', icon: <Bell className="h-4 w-4" /> },
  { id: 'seguranca', label: 'Segurança & Privacidade', icon: <Shield className="h-4 w-4" /> },
  { id: 'aparencia', label: 'Aparência', icon: <Palette className="h-4 w-4" /> },
  { id: 'dados', label: 'Dados & Exportação', icon: <Download className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    emailViral: true,
    emailWeekly: true,
    pushViral: true,
    pushMilestones: false,
    newsletter: false,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showStats: true,
    allowIndexing: false,
    dataCollection: true,
  });

  const handleSave = (section: string) => {
    toast.success(`${section} salvo com sucesso!`);
  };

  const handleDisconnectChannel = (channelName: string) => {
    if (confirm(`Tem certeza que deseja desconectar "${channelName}"?`)) {
      toast.success(`Canal "${channelName}" desconectado`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-300">
              <Key className="h-5 w-5" />
            </div>
            Configurações da Conta
          </h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie suas preferências de perfil, canais conectados, notificações e segurança.</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#111115] border border-slate-800 rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="border-b border-slate-800 overflow-x-auto">
            <nav className="flex gap-1 p-1 min-w-max" role="tablist" aria-label="Configurações">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="p-6">
            {/* PERFIL */}
            {activeTab === 'perfil' && (
              <div className="space-y-6" role="tabpanel" aria-labelledby="perfil">
                <div className="flex items-center gap-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-2xl border border-slate-700">
                    C
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">Criador de Conteúdo Pro</h3>
                    <p className="text-xs text-slate-400">criador@youtube.com</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Conta Verificada
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <Tv className="h-3 w-3" /> 2 Canais Conectados
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                    Editar Perfil
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2"><User className="h-4 w-4" /> Informações Pessoais</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nome de Exibição</label>
                        <input type="text" defaultValue="Criador de Conteúdo Pro" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Bio / Descrição</label>
                        <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 resize-none" placeholder="Conte um pouco sobre você..."></textarea>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Site / Link</label>
                        <input type="url" placeholder="https://seusite.com" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                      </div>
                    </div>
                    <button onClick={() => handleSave('Perfil')} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </button>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2"><Globe className="h-4 w-4" /> Redes Sociais</h4>
                    <div className="space-y-3">
                      {['YouTube', 'Instagram', 'Twitter/X', 'LinkedIn', 'TikTok'].map(platform => (
                        <div key={platform} className="flex items-center gap-3">
                          <span className="w-24 text-xs text-slate-400 font-medium">{platform}</span>
                          <input type="url" placeholder={`@usuario_${platform.toLowerCase()}`} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CANAIS CONECTADOS */}
            {activeTab === 'canais' && (
              <div className="space-y-6" role="tabpanel" aria-labelledby="canais">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Canais Conectados ao YouTube</h3>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <Tv className="h-4 w-4" /> Conectar Novo Canal
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Tech & Futuro Brasil', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', subs: '142.500', status: 'Ativo' as const, lastSync: 'Há 2 horas', niche: 'Tecnologia & IA' },
                    { name: 'Cortes de PodCast Pro', avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150', subs: '89.200', status: 'Ativo' as const, lastSync: 'Há 5 horas', niche: 'Entretenimento' },
                  ].map((channel, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                      <img src={channel.avatar} alt={channel.name} className="h-14 w-14 rounded-full border border-slate-700 object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{channel.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${channel.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {channel.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{channel.niche} • {channel.subs} inscritos</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Última sincronização: {channel.lastSync}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors">
                          Ver Métricas
                        </button>
                        <button onClick={() => handleDisconnectChannel(channel.name)} className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/30">
                          Desconectar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 bg-slate-900/30 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-400" /> Importante</h4>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li className="flex items-center gap-2">• A desconexão remove o acesso aos dados do canal, mas não exclui o canal do YouTube</li>
                    <li className="flex items-center gap-2">• Você pode reconectar a qualquer momento via OAuth do Google</li>
                    <li className="flex items-center gap-2">• Dados históricos são mantidos por 30 dias após desconexão</li>
                  </ul>
                </div>
              </div>
            )}

            {/* NOTIFICAÇÕES */}
            {activeTab === 'notificacoes' && (
              <div className="space-y-6" role="tabpanel" aria-labelledby="notificacoes">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Bell className="h-4 w-4" /> Notificações por Email</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'emailViral', label: 'Alertas de Vídeos Virais', desc: 'Receba email quando um vídeo do seu nicho passar de 10x a média' },
                      { id: 'emailWeekly', label: 'Resumo Semanal', desc: 'Relatório consolidado de métricas toda segunda-feira' },
                      { id: 'emailMonthly', label: 'Relatório Mensal Completo', desc: 'Análise profunda de tendências e oportunidades do mês' },
                    ].map(item => (
                      <label key={item.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800/50 cursor-pointer hover:border-slate-700 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={notifications[item.id as keyof typeof notifications]}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [item.id]: e.target.checked }))}
                          className="accent-red-600 h-5 w-5 mt-0.5 shrink-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Bell className="h-4 w-4" /> Notificações Push (No App)</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'pushViral', label: 'Vídeos Virais em Tempo Real', desc: 'Notificação imediata quando detectamos viral no seu nicho' },
                      { id: 'pushMilestones', label: 'Marcos de Crescimento', desc: 'Comemore 10K, 100K, 1M inscritos e visualizações' },
                      { id: 'pushWeekly', label: 'Resumo Semanal Push', desc: 'Receba o resumo semanal também como notificação no app' },
                    ].map(item => (
                      <label key={item.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800/50 cursor-pointer hover:border-slate-700 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={notifications[item.id as keyof typeof notifications]}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [item.id]: e.target.checked }))}
                          className="accent-red-600 h-5 w-5 mt-0.5 shrink-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => handleSave('Notificações')} className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                  <Save className="h-4 w-4 mr-2" /> Salvar Preferências
                </button>
              </div>
            )}

            {/* SEGURANÇA & PRIVACIDADE */}
            {activeTab === 'seguranca' && (
              <div className="space-y-6" role="tabpanel" aria-labelledby="seguranca">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Shield className="h-4 w-4" /> Autenticação e Acesso</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Autenticação de Dois Fatores (2FA)</p>
                          <p className="text-xs text-slate-400">Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                          Ativar 2FA
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Gerenciar Sessões Ativas</p>
                          <p className="text-xs text-slate-400">Veja e revogue dispositivos conectados</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                          Ver Sessões
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Alterar Senha</p>
                          <p className="text-xs text-slate-400">Atualize sua senha de acesso</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                          Alterar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Shield className="h-4 w-4" /> Privacidade dos Dados</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'publicProfile', label: 'Perfil Público', desc: 'Permitir que outros criadores vejam seu perfil e canais' },
                      { id: 'showStats', label: 'Exibir Estatísticas Públicas', desc: 'Mostrar métricas agregadas no seu perfil público' },
                      { id: 'allowIndexing', label: 'Permitir Indexação em Buscadores', desc: 'Seu perfil pode aparecer no Google e outros buscadores' },
                      { id: 'dataCollection', label: 'Coleta de Dados para Melhorias', desc: 'Nos ajuda a melhorar a plataforma com dados anônimos' },
                    ].map(item => (
                      <label key={item.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800/50 cursor-pointer hover:border-slate-700 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={privacy[item.id as keyof typeof privacy]}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, [item.id]: e.target.checked }))}
                          className="accent-red-600 h-5 w-5 mt-0.5 shrink-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-3"><AlertCircle className="h-4 w-4" /> Zona de Perigo</h4>
                  <p className="text-sm text-slate-300 mb-4">Estas ações são irreversíveis. Tenha certeza antes de prosseguir.</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700">
                      <Download className="h-4 w-4 mr-2" /> Baixar Meus Dados
                    </button>
                    <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-sm font-medium transition-colors border border-red-500/30">
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir Conta Permanentemente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* APARÊNCIA */}
            {activeTab === 'aparencia' && (
              <div className="space-y-6" role="tabpanel" aria-labelledby="aparencia">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Moon className="h-4 w-4" /> Tema</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Escuro', icon: <Moon className="h-5 w-5" />, desc: 'Fundo escuro (padrão)' },
                      { id: 'light', label: 'Claro', icon: <Sun className="h-5 w-5" />, desc: 'Fundo claro' },
                      { id: 'system', label: 'Sistema', icon: <Monitor className="h-5 w-5" />, desc: 'Segue preferência do SO' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setTheme(opt.id as typeof theme); handleSave('Tema'); }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${theme === opt.id ? 'border-red-500 bg-red-600/10' : 'border-slate-700 hover:border-slate-600'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                            {opt.icon}
                          </div>
                        </div>
                        <p className="font-medium text-white">{opt.label}</p>
                        <p className="text-xs text-slate-400">{opt.desc}</p>
                        {theme === opt.id && <div className="mt-2 h-1 bg-red-500 rounded-full animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Palette className="h-4 w-4" /> Cor de Destaque</h4>
                  <div className="flex gap-3">
                    {['#FF0000', '#FF6B35', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'].map(color => (
                      <button
                        key={color}
                        className={`h-10 w-10 rounded-xl border-2 transition-all ${color === '#FF0000' ? 'border-red-500 scale-110' : 'border-slate-700 hover:border-slate-600'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Cor ${color}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">A cor vermelha (#FF0000) é a padrão da marca YouTube</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Palette className="h-4 w-4" /> Densidade da Interface</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['Compacto', 'Confortável', 'Espaçoso'].map((density, i) => (
                      <button key={density} className={`p-4 rounded-xl border-2 text-left transition-all ${i === 1 ? 'border-red-500 bg-red-600/10' : 'border-slate-700 hover:border-slate-600'}`}>
                        <p className="font-medium text-white">{density}</p>
                        <p className="text-xs text-slate-400 mt-1">{i === 0 ? 'Mais conteúdo por tela' : i === 1 ? 'Equilibrado (padrão)' : 'Mais espaço visual'}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DADOS & EXPORTAÇÃO */}
            {activeTab === 'dados' && (
              <div className="space-y-6" role="tabpanel" aria-labelledby="dados">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Download className="h-4 w-4" /> Exportar Dados</h4>
                  <p className="text-sm text-slate-400">Baixe relatórios completos dos seus canais em formato CSV ou JSON</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {[
                      { title: 'Métricas do Dashboard', desc: 'Visualizações, inscritos, watch time, receita', icon: <BarChart3 className="h-5 w-5" />, format: 'CSV' },
                      { title: 'Lista de Vídeos', desc: 'Todos os vídeos com estatísticas detalhadas', icon: <Tv className="h-5 w-5" />, format: 'CSV' },
                      { title: 'Dados Completos (JSON)', desc: 'Backup total incluindo configurações e histórico', icon: <Download className="h-5 w-5" />, format: 'JSON' },
                    ].map((item, i) => (
                      <button key={i} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl text-left hover:border-red-500/50 hover:bg-red-600/10 transition-colors flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-red-600/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30">{item.format}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Trash2 className="h-4 w-4 text-red-400" /> Limpar Cache e Dados Locais</h4>
                  <p className="text-sm text-slate-400">Remove dados temporários, cache de imagens e preferências locais do navegador</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                      Limpar Cache
                    </button>
                    <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-sm font-medium transition-colors border border-red-500/30">
                      Resetar Todas as Preferências
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Shield className="h-4 w-4" /> LGPD & Conformidade</h4>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>• Seus dados são armazenados de forma segura no Brasil</p>
                    <p>• Você tem direito à portabilidade, retificação e exclusão dos seus dados</p>
                    <p>• Não vendemos seus dados para terceiros</p>
                    <p>• Cookies essenciais são usados para autenticação e preferências</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                      Solicitar Meus Dados (LGPD)
                    </button>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors">
                      Política de Privacidade
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}