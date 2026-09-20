'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MOCK_VIDEOS } from '@/lib/mock-data';
import { Search } from 'lucide-react';

export default function VideosPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gerenciador de Vídeos</h1>
            <p className="text-sm text-slate-400 mt-1">Todos os vídeos publicados e suas estatísticas detalhadas.</p>
          </div>
        </div>

        <div className="bg-[#111115] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar vídeos pelo título..." 
              className="bg-transparent text-sm text-white focus:outline-none w-full"
            />
          </div>

          <div className="divide-y divide-slate-800/60">
            {MOCK_VIDEOS.map((video) => (
              <div key={video.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors">
                <div>
                  <h4 className="text-sm font-semibold text-white">{video.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Duração: {video.duration} • {video.published}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-200 font-bold">{video.views} views</span>
                  <span className="text-xs text-emerald-400 font-bold">{video.ctr} CTR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
