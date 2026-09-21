'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Tv, 
  BarChart3, 
  Video, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Settings, 
  RefreshCw, 
  Bell, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Check,
  Youtube
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const mockChannels = [
  { id: '1', name: 'Tech & Futuro Brasil', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150' },
  { id: '2', name: 'Cortes de PodCast Pro', avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(mockChannels[0]);

  const navigation = [
    { name: 'Painel Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Meus Canais', href: '/channels', icon: Tv },
    { name: 'Métricas Avançadas', href: '/analytics', icon: BarChart3 },
    { name: 'Gerenciador de Vídeos', href: '/videos', icon: Video },
    { name: 'Ideias & Roteiros IA', href: '/ideas', icon: Lightbulb },
    { name: 'Radar Viral', href: '/viral', icon: TrendingUp },
    { name: 'Pesquisa de Nichos', href: '/niche', icon: Target },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    toast.loading('Atualizando dados dos canais...', { id: 'refresh' });
    
    try {
      // Simula chamada para APIs
      await Promise.all([
        fetch('/api/dashboard/stats').catch(() => null),
        fetch('/api/channels').catch(() => null),
      ]);
      toast.success('Dados atualizados com sucesso!', { id: 'refresh' });
    } catch {
      toast.error('Erro ao atualizar. Modo demonstração ativo.', { id: 'refresh' });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleChannelSwitch = (channel: typeof mockChannels[0]) => {
    setActiveChannel(channel);
    setChannelMenuOpen(false);
    toast.success(`Canal alterado para ${channel.name}`);
    // Aqui você faria a troca real de contexto do canal
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-[#111115] p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800/60 animate-slide-down">
          <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10 animate-pulse-glow">
            <Youtube className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight leading-none text-white">YTAnalytics <span className="text-red-500 text-xs px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">PRO</span></h2>
            <p className="text-xs text-slate-400 mt-1">Gestão de Canais</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5" role="navigation" aria-label="Menu principal">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all animate-slide-up ${index + 1}`}
                style={{ animationDelay: `${index * 50}ms` }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-800/60 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Criador Pro</p>
              <p className="text-[10px] text-slate-400 truncate">criador@youtube.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-[#111115]/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-sm font-semibold text-slate-200 hidden sm:block">Painel de Crescimento YouTube</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Channel Switcher */}
            <div className="relative">
              <button
                onClick={() => setChannelMenuOpen(!channelMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors"
                aria-label="Alternar canal"
                aria-expanded={channelMenuOpen}
              >
                <div className="h-6 w-6 rounded-full border border-slate-700 overflow-hidden flex items-center justify-center">
                  <img 
                    src={activeChannel.avatar} 
                    alt={activeChannel.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden sm:block truncate max-w-[120px]">{activeChannel.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${channelMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {channelMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-[#111115] border border-slate-800 rounded-xl shadow-xl shadow-black/50 py-1 animate-slide-down z-50">
                  {mockChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => handleChannelSwitch(channel)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                        activeChannel.id === channel.id
                          ? 'bg-red-600/10 text-red-400'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <img 
                        src={channel.avatar} 
                        alt={channel.name} 
                        className="h-7 w-7 rounded-full border border-slate-700 object-cover"
                      />
                      <span className="truncate flex-1">{channel.name}</span>
                      {activeChannel.id === channel.id && <Check className="h-4 w-4 text-red-500" />}
                    </button>
                  ))}
                  <hr className="border-slate-800 my-1" />
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                    <Youtube className="h-4 w-4" />
                    <span>Conectar novo canal</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
              <span>{isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}</span>
            </button>

            <button className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors relative" aria-label="Notificações">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-8 flex-1 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#111115] border-t border-slate-800 flex items-center justify-around z-40 px-2">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] ${
                isActive ? 'text-red-500 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
