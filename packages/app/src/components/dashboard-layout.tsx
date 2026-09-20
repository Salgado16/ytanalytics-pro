'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  X 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-[#111115] p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800/60">
          <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10">
            <Tv className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight leading-none text-white">YTAnalytics <span className="text-red-500 text-xs px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">PRO</span></h2>
            <p className="text-xs text-slate-400 mt-1">Gestão de Canais</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-800/60">
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
        <header className="h-16 border-b border-slate-800/80 bg-[#111115]/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-sm font-semibold text-slate-200 hidden sm:block">Painel de Crescimento YouTube</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isRefreshing ? 'animate-spin text-red-500' : ''}`} />
              <span>{isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}</span>
            </button>

            <button className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-8 flex-1">
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
