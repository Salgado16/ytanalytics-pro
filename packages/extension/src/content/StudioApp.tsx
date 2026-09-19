"use client";

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, BarChart2, TrendingUp, Target, ExternalLink, Copy, Download, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface VideoData {
  videoId: string | null;
  title?: string;
  description?: string;
  tags?: string;
  thumbnail?: string;
}

export default function StudioApp() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<VideoData>({ videoId: null });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchStudioData();
  }, []);

  const fetchStudioData = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STUDIO_DATA' });
      setData(response);
    } catch (error) {
      console.error('Failed to fetch studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeVideo = async () => {
    if (!data.videoId) return;
    setAnalyzing(true);
    try {
      const response = await fetch(`http://localhost:3000/api/analyze/video/${data.videoId}`);
      if (response.ok) {
        const result = await response.json();
        setAnalysis(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[2147483647] w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 font-sans text-sm transition-all duration-300">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">Studio Analytics</span>
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
              {data.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {data.description.slice(0, 100)}...
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={analyzeVideo}
              disabled={analyzing || !data.videoId}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <BarChart2 className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-medium">{analyzing ? 'Analisando...' : 'Analisar Vídeo'}</span>
            </button>
            <button
              onClick={() => data.videoId && window.open(`http://localhost:3000/video/${data.videoId}`, '_blank')}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-medium">Ver no App</span>
            </button>
          </div>

          {analysis && (
            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white">Análise Rápida</h5>
              
              <div className="grid grid-cols-2 gap-2">
                <MetricCard 
                  label="Score Viral" 
                  value={analysis.viralScore?.toFixed(0) || '--'} 
                  icon={<Target className="w-4 h-4" />} 
                  color={analysis.viralScore > 70 ? 'green' : analysis.viralScore > 40 ? 'yellow' : 'red'}
                />
                <MetricCard 
                  label="CTR Estimado" 
                  value={analysis.ctr ? `${analysis.ctr}%` : '--'} 
                  icon={<TrendingUp className="w-4 h-4" />} 
                  color={analysis.ctr > 5 ? 'green' : analysis.ctr > 3 ? 'yellow' : 'red'}
                />
                <MetricCard 
                  label="SEO Score" 
                  value={analysis.seoScore?.toFixed(0) || '--'} 
                  icon={<BarChart2 className="w-4 h-4" />} 
                  color={analysis.seoScore > 70 ? 'green' : analysis.seoScore > 40 ? 'yellow' : 'red'}
                />
                <MetricCard 
                  label="Retenção Est." 
                  value={analysis.retention ? `${analysis.retention}%` : '--'} 
                  icon={<Target className="w-4 h-4" />} 
                  color={analysis.retention > 50 ? 'green' : analysis.retention > 30 ? 'yellow' : 'red'}
                />
              </div>

              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sugestões</h6>
                  {analysis.suggestions.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-yellow-800 dark:text-yellow-200">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pontos Fortes</h6>
                  {analysis.strengths.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-green-800 dark:text-green-200">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: 'green' | 'yellow' | 'red' }) {
  const colorMap = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <div className={`p-2 rounded-lg ${colorMap[color]}`}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}