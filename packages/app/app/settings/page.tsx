'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Configurações da Conta</h1>
          <p className="text-sm text-slate-400 mt-1">Gerencie suas preferências de perfil, integrações e notificações.</p>
        </div>

        <div className="bg-[#111115] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xl">
              C
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Criador de Conteúdo Pro</h3>
              <p className="text-xs text-slate-400">criador@youtube.com</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white">Preferências da Plataforma</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <span className="text-sm text-slate-300">Notificações por Email de Vídeos Virais</span>
                <input type="checkbox" defaultChecked className="accent-red-600 h-4 w-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <span className="text-sm text-slate-300">Modo de Alta Precisão (Usar API Oficial do YouTube)</span>
                <input type="checkbox" defaultChecked className="accent-red-600 h-4 w-4" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
