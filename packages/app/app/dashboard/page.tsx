'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MOCK_METRICS, MOCK_VIDEOS } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel Geral de Desempenho</h1>
          <p className="text-sm text-slate-400 mt-1">Visão unificada das métricas dos seus canais nos últimos 28 dias.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_METRICS.map((metric, idx) => (
            <div key={idx} className="bg-[#111115] border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <p className="text-xs text-slate-400 font-medium">{metric.title}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Visualizações Diárias</h3>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">Últimos 28 dias</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-8 px-2">
            {[45, 60, 52, 78, 90, 84, 110, 95, 120, 140, 135, 160, 180, 210].map((val, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-red-600/20 to-red-600 rounded-t-sm hover:opacity-80 transition-opacity relative group" style={{ height: `${val / 2.2}%` }}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val * 100}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Vídeos de Maior Desempenho</h3>
          <div className="divide-y divide-slate-800/60">
            {MOCK_VIDEOS.map((video) => (
              <div key={video.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{video.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Publicado: {video.published} • Duração: {video.duration}</p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{video.views}</p>
                    <p className="text-[10px] text-slate-400">Views</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400">{video.ctr}</p>
                    <p className="text-[10px] text-slate-400">CTR</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
