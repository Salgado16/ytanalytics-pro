'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MOCK_IDEAS } from '@/lib/mock-data';
import { Copy, Check } from 'lucide-react';

export default function IdeasPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gerador de Ideias & Roteiros IA</h1>
          <p className="text-sm text-slate-400 mt-1">Ideias de vídeos de alta demanda geradas com inteligência artificial para o seu nicho.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_IDEAS.map((idea) => (
            <div key={idea.id} className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                    Pontuação Viral: {idea.score}/100
                  </span>
                  <span className="text-xs text-slate-400">{idea.category}</span>
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{idea.title}</h3>
                <p className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-200">Gancho Inicial:</strong> {idea.hook}
                </p>
              </div>

              <button
                onClick={() => handleCopy(idea.id, idea.title)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 rounded-xl transition-colors"
              >
                {copiedId === idea.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedId === idea.id ? 'Copiado!' : 'Copiar Ideia'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
