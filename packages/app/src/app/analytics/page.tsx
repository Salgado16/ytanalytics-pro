'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TrendingUp, Users, Target, BarChart3, Eye, Clock, DollarSign, Calendar, Filter, ChevronDown, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  period: string;
  views: number;
  watchTime: number;
  subscribers: number;
  revenue: number;
  ctr: number;
  retention: number;
  rpm: number;
}

const MOCK_ANALYTICS: Record<string, AnalyticsData> = {
  '7d': { period: 'Últimos 7 dias', views: 145800, watchTime: 8420, subscribers: 1245, revenue: 2890, ctr: 10.4, retention: 64.2, rpm: 19.8 },
  '28d': { period: 'Últimos 28 dias', views: 1458200, watchTime: 84200, subscribers: 12450, revenue: 28940, ctr: 10.4, retention: 64.2, rpm: 19.8 },
  '90d': { period: 'Últimos 90 dias', views: 4892000, watchTime: 284000, subscribers: 42100, revenue: 98400, ctr: 9.8, retention: 61.5, rpm: 20.1 },
};

const DAILY_DATA = {
  '7d': [
    { day: 'Seg', views: 18200, watchTime: 1050, subscribers: 156, revenue: 362 },
    { day: 'Ter', views: 21400, watchTime: 1230, subscribers: 189, revenue: 425 },
    { day: 'Qua', views: 19800, watchTime: 1140, subscribers: 167, revenue: 393 },
    { day: 'Qui', views: 23100, watchTime: 1340, subscribers: 201, revenue: 458 },
    { day: 'Sex', views: 26700, watchTime: 1560, subscribers: 234, revenue: 530 },
    { day: 'Sáb', views: 19800, watchTime: 1140, subscribers: 167, revenue: 393 },
    { day: 'Dom', views: 16800, watchTime: 960, subscribers: 131, revenue: 329 },
  ],
  '28d': [
    { day: 'Sem 1', views: 324000, watchTime: 18700, subscribers: 2890, revenue: 6450 },
    { day: 'Sem 2', views: 387000, watchTime: 22300, subscribers: 3120, revenue: 7700 },
    { day: 'Sem 3', views: 356000, watchTime: 20500, subscribers: 2980, revenue: 7080 },
    { day: 'Sem 4', views: 391200, watchTime: 22700, subscribers: 3460, revenue: 7710 },
  ],
  '90d': [
    { day: 'Jan', views: 1450000, watchTime: 84000, subscribers: 12400, revenue: 28900 },
    { day: 'Fev', views: 1680000, watchTime: 97000, subscribers: 14200, revenue: 33500 },
    { day: 'Mar', views: 1762000, watchTime: 103000, subscribers: 15500, revenue: 36000 },
  ],
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '28d' | '90d'>('28d');
  const [chartMetric, setChartMetric] = useState<'views' | 'watchTime' | 'subscribers' | 'revenue'>('views');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const data = MOCK_ANALYTICS[selectedPeriod];
  const chartData = DAILY_DATA[selectedPeriod];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.loading('Atualizando métricas avançadas...', { id: 'analytics-refresh' });
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Métricas atualizadas com dados mais recentes!', { id: 'analytics-refresh' });
    setIsRefreshing(false);
  };

  const handleExport = () => {
    const csv = ['Métrica,Valor', ...Object.entries(data).map(([k, v]) => `${k},${v}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Relatório exportado!');
  };

  const maxChartValue = Math.max(...chartData.map(d => d[chartMetric]));
  const metricLabels = { views: 'Visualizações', watchTime: 'Horas Assistidas', subscribers: 'Inscritos', revenue: 'Receita (R$)' };
  const metricIcons = { views: Eye, watchTime: Clock, subscribers: Users, revenue: DollarSign };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              Métricas Avançadas
            </h1>
            <p className="text-sm text-slate-400 mt-1">Análise profunda de retenção, CTR, origens de tráfego e desempenho financeiro.</p>
          </div>
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <button onClick={handleExport} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" /> Exportar
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Atualizar
            </button>
          </div>
        </div>

        {/* Period Selector + Chart Metric */}
        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Período:</span>
              <div className="flex gap-1 bg-slate-900/50 border border-slate-700 rounded-xl p-1">
                {(['7d', '28d', '90d'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPeriod === p
                        ? 'bg-red-600 text-white shadow-sm shadow-red-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === '7d' ? '7 dias' : p === '28d' ? '28 dias' : '90 dias'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs text-slate-400">Gráfico:</span>
              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value as typeof chartMetric)}
                className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="views">Visualizações</option>
                <option value="watchTime">Horas Assistidas</option>
                <option value="subscribers">Inscritos</option>
                <option value="revenue">Receita</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
          {[
            { label: 'Visualizações Totais', value: formatNumber(data.views), change: '+18,4%', positive: true, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Novos Inscritos', value: `+${formatNumber(data.subscribers)}`, change: '+8,2%', positive: true, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Tempo de Exibição', value: `${formatNumber(data.watchTime)}h`, change: '+14,1%', positive: true, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            { label: 'Receita Estimada', value: formatCurrency(data.revenue), change: '+22,5%', positive: true, icon: DollarSign, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          ].map((metric, i) => (
            <div key={metric.label} className="bg-[#111115] border border-slate-800/80 rounded-2xl p-5 space-y-2 animate-slide-up" style={{ animationDelay: `${200 + i * 50}ms` }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">{metric.label}</p>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${metric.bg}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${metric.positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '250ms' }}>
          {[
            { label: 'CTR Médio', value: `${data.ctr}%`, icon: Target, color: 'text-blue-400', desc: '+2,1% acima do nicho' },
            { label: 'Retenção Média', value: `${data.retention}%`, icon: Target, color: 'text-emerald-400', desc: 'Alta fidelidade' },
            { label: 'RPM Estimado', value: `R$ ${data.rpm.toFixed(2)}`, icon: DollarSign, color: 'text-amber-400', desc: 'Por 1.000 visualizações' },
          ].map((metric, i) => (
            <div key={metric.label} className="bg-[#111115] border border-slate-800 rounded-2xl p-5 space-y-2 animate-slide-up" style={{ animationDelay: `${300 + i * 50}ms` }}>
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <p className="text-xs text-slate-400 font-medium">{metric.label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-slate-400">{metric.desc}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> {metricLabels[chartMetric]} — {data.period}
            </h3>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-8 px-2">
            {chartData.map((item, i) => {
              const value = item[chartMetric];
              const height = (value / maxChartValue) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center" style={{ minWidth: '40px' }}>
                  <div className="w-full bg-gradient-to-t from-red-600/20 to-red-600 rounded-t-sm relative group" style={{ height: `${height}%` }}>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {chartMetric === 'revenue' ? formatCurrency(value) : formatNumber(value)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-[#111115] border border-slate-800 rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white">Detalhamento Diário/Semanal</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  {['Período', 'Visualizações', 'Horas Assistidas', 'Inscritos', 'Receita', 'CTR', 'Retenção'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {chartData.map((item, i) => (
                  <tr key={item.day} className="hover:bg-slate-900/40 transition-colors animate-slide-up" style={{ animationDelay: `${450 + i * 50}ms` }}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-200">{item.day}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{formatNumber(item.views)}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{formatNumber(item.watchTime)}h</td>
                    <td className="px-4 py-3 text-sm text-emerald-400 font-bold">+{formatNumber(item.subscribers)}</td>
                    <td className="px-4 py-3 text-sm text-amber-400 font-bold">{formatCurrency(item.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-blue-400 font-bold">{data.ctr}%</td>
                    <td className="px-4 py-3 text-sm text-emerald-400 font-bold">{data.retention}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}