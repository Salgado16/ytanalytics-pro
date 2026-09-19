"use client";

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, BarChart2, TrendingUp, Target, ExternalLink, Copy, Download } from 'lucide-react';

interface VideoData {
  videoId: string | null;
  title?: string;
  channelName?: string;
  viewCount?: string;
}

export default function App({ videoId }: { videoId: string | null }) {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<VideoData>({ videoId });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideoData(videoId);
    }
  }, [videoId]);

  const fetchVideoData = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      if (response.ok) {
        const data = await response.json();
        setData(prev => ({ ...prev, title: data.title, channelName: data.author_name }));
      }
    } catch (error) {
      console.error('Failed to fetch video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyVideoUrl = () => {
    if (data.videoId) {
      navigator.clipboard.writeText(`https://youtube.com/watch?v=${data.videoId}`);
    }
  };

  const openInApp = () => {
    if (data.videoId) {
      window.open(`http://localhost:3000/video/${data.videoId}`, '_blank');
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[2147483647] w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 font-sans text-sm transition-all duration-300">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">YT Analytics</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
          {data.videoId && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {data.title || 'Carregando...'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {data.channelName || 'Canal desconhecido'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-3 h-3" />
                <span>{data.viewCount || 'Visualizações: --'}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={openInApp}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChart2 className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-medium">Ver no App</span>
            </button>
            <button
              onClick={copyVideoUrl}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-medium">Copiar Link</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-xs">Score Viral</span>
              <span className="text-xs font-bold text-green-600">87</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs">CTR Estimado</span>
              <span className="text-xs font-bold text-blue-600">6.2%</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BarChart2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs">AVD</span>
              <span className="text-xs font-bold text-purple-600">4:32</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <a
              href={`http://localhost:3000/video/${data.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Análise Completa no Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}