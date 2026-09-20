import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouTube Analytics Suite | Gestão de Canais e Métricas',
  description: 'Dashboard completo em Português para criadores de conteúdo do YouTube acompanharem métricas, vídeos virais e roteiros com IA.',
  keywords: ['YouTube', 'analytics', 'criadores', 'dashboard', 'métricas', 'vídeos virais'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#0A0A0C] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
