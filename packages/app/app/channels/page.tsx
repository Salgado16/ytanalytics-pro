'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MOCK_CHANNELS, ChannelData } from '@/lib/mock-data';
import { Tv, Plus, CheckCircle2 } from 'lucide-react';

export default function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChannelUrl, setNewChannelUrl] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch('/api/channels');
        if (!res.ok) throw new Error('Falha na resposta da API');
        const data = await res.json();
        setChannels(data.length > 0 ? data : MOCK_CHANNELS);
      } catch (err) {
        setChannels(MOCK_CHANNELS);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelUrl) return;

    const newChannel: ChannelData = {
      id: String(Date.now()),
      name: 'Novo Canal Conectado',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      subscribers: '1.2K',
      totalViews: '45K',
      videosCount: 12,
      status: 'Ativo',
      niche: 'Geral',
    };

    setChannels([...channels, newChannel]);
    setNewChannelUrl('');
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestão de Canais</h1>
            <p className="text-sm text-slate-400 mt-1">Gerencie seus canais conectados e acompanhe métricas consolidadas em tempo real.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
            >
              <Plus className="h-4 w-4" />
              <span>Conectar Novo Canal</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-800"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map((channel) => (
              <div key={channel.id} className="bg-[#111115] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all space-y-4 relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img src={channel.avatar} alt={channel.name} className="h-14 w-14 rounded-full border border-slate-700 object-cover" />
                    <div>
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        {channel.name}
                        <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{channel.niche}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {channel.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                  <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-400">Inscritos</p>
                    <p className="font-bold text-slate-100 text-sm mt-0.5">{channel.subscribers}</p>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-400">Visualizações</p>
                    <p className="font-bold text-slate-100 text-sm mt-0.5">{channel.totalViews}</p>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-400">Vídeos</p>
                    <p className="font-bold text-slate-100 text-sm mt-0.5">{channel.videosCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111115] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Conectar Canal do YouTube</h3>
              <p className="text-xs text-slate-400">Cole a URL do seu canal para conectar automaticamente.</p>
              
              <form onSubmit={handleAddChannel} className="space-y-4">
                <input
                  type="text"
                  placeholder="https://youtube.com/@seucanal"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium"
                  >
                    Conectar Canal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
