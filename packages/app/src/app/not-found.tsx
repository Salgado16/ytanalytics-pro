import Link from 'next/link';
import { Tv, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="h-16 w-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 shadow-xl shadow-red-500/10">
        <Tv className="h-8 w-8" />
      </div>
      <h1 className="text-6xl font-black tracking-tight text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mb-2">Página Não Encontrada</h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        A página que você está tentando acessar não existe ou foi movida.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar ao Painel Principal</span>
      </Link>
    </div>
  );
}
