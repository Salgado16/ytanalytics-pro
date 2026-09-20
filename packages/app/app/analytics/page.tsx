'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TrendingUp, Users, Target } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Métricas Avançadas</h1>
          <p className="text-sm text-slate-400 mt-1">Análise profunda de retenção de público, taxa de cliques (CTR) e origens de tráfego.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-200">Taxa Média de CTR</h3>
            <p className="text-3xl font-extrabold text-white">10,4%</p>
            <p className="text-xs text-emerald-400">+2,1% acima da média do nicho</p>
          </div>

          <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-200">Espectadores Recorrentes</h3>
            <p className="text-3xl font-extrabold text-white">64,2%</p>
            <p className="text-xs text-slate-400">Alta fidelidade do canal</p>
          </div>

          <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-200">Duração Média da Visualização</h3>
            <p className="text-3xl font-extrabold text-white">7m 42s</p>
            <p className="text-xs text-emerald-400">Excelente retenção</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
