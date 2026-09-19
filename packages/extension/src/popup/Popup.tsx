"use client";

import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Youtube, BarChart2, TrendingUp, Target, Settings, 
  ExternalLink, RefreshCw, LogIn, LogOut, ChevronRight 
} from 'lucide-react';

interface ChannelData {
  id: string;
  title: string;
  subscribers: string;
  views: string;
  thumbnail: string;
}

const chrome = (window as any).chrome;

function Popup() {
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    loadChannels();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'CHECK_AUTH' });
      setAuthenticated(response.authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const loadChannels = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_CHANNELS' });
      if (response.channels) {
        setChannels(response.channels);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    chrome.runtime.sendMessage({ type: 'OAUTH_LOGIN' });
    window.close();
  };

  const handleLogout = () => {
    chrome.runtime.sendMessage({ type: 'OAUTH_LOGOUT' });
    setAuthenticated(false);
    setChannels([]);
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    window.close();
  };

  const openVideoAnalysis = (videoId: string) => {
    chrome.tabs.create({ url: `http://localhost:3000/video/${videoId}` });
    window.close();
  };

  return (
    <div className="w-80 p-4 bg-white dark:bg-gray-900 min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">YT Analytics</span>
        </div>
        <div className="flex items-center gap-1">
          {authenticated ? (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Conectado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Desconectado
            </span>
          )}
        </div>
      </div>

      {!authenticated ? (
        <div className="space-y-3 text-center py-8">
          <BarChart2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">Conecte sua conta do YouTube</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acesse analytics, viral score, niche finder e mais
          </p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Conectar com Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Seus Canais</h3>
            <button onClick={loadChannels} disabled={loading} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <RefreshCw className={loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
            </button>
          </div>

          {channels.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p>Nenhum canal conectado</p>
              <button onClick={handleLogin} className="mt-2 text-sm text-orange-500 hover:underline">
                Adicionar canal
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {channels.map((channel) => (
                <div key={channel.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <img
                    src={channel.thumbnail}
                    alt={channel.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{channel.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {channel.subscribers} inscritos · {channel.views} views
                    </p>
                  </div>
                  <button
                    onClick={() => openVideoAnalysis(channel.id)}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={openDashboard}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChart2 className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => chrome.tabs.create({ url: 'http://localhost:3000/niche' })}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-xs font-medium">Niche Finder</span>
            </button>
            <button
              onClick={() => chrome.tabs.create({ url: 'http://localhost:3000/viral' })}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span className="text-xs font-medium">Vídeos Virais</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-medium">Sair</span>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir App Completo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount the React app
if (typeof window !== 'undefined') {
  const container = document.getElementById('app');
  if (container) {
    createRoot(container).render(<Popup />);
  }
}