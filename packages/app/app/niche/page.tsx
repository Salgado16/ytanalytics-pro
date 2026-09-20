'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DollarSign } from 'lucide-react';

const NICHES = [
  { name: 'Inteligência Artificial & SaaS', rpm: 'R$ 28,50 - R$ 45,00', competition: 'Média', demand: 'Altíssima' },
  { name: 'Finanças Pessoais & Investimentos', rpm: 'R$ 35,00 - R$ 60,00', competition: 'Alta', demand: 'Alta' },
  { name: 'Desenvolvimento de Software', rpm: 'R$ 22,00 - R$ 38,00', competition: 'Baixa', demand: 'Média' },
  { name: 'Edição de Vídeo & Design', rpm: 'R$ 18,00 - R$ 30,00', competition: 'Média', demand: 'Alta' },
];

export default function NichePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pesquisa & Análise de Nichos</h1>
          <p className="text-sm text-slate-400 mt-1">Descubra os nichos mais lucrativos do YouTube e estimativas de pagamento por 1.000 visualizações (RPM).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NICHES.map((niche, idx) => (
            <div key={idx} className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
                  Procura: {niche.demand}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white">{niche.name}</h3>
                <p className="text-xs text-slate-400 mt-1">RPM Estimado no Brasil:</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{niche.rpm}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Concorrência: <strong className="text-slate-200">{niche.competition}</strong></span>
                <span className="text-red-400 font-semibold cursor-pointer hover:underline">Ver Canais Referência →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
