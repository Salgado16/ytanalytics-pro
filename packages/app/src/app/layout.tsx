import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YouTube Analytics Suite | Gestão de Canais e Métricas',
  description: 'Dashboard completo em Português para criadores de conteúdo do YouTube acompanharem métricas, vídeos virais e roteiros com IA.',
  keywords: ['YouTube', 'analytics', 'criadores', 'dashboard', 'métricas', 'vídeos virais'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} dark`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-[#0A0A0C] text-slate-100 antialiased font-sans" style={{ fontFamily: 'var(--font-plus-jakarta-sans), system-ui, sans-serif' }}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'bg-[#111115] border border-slate-800 text-slate-100',
              description: 'text-slate-400',
              actionButton: 'bg-slate-800 hover:bg-slate-700',
              cancelButton: 'text-slate-400 hover:text-slate-200',
            }
          }}
        />
      </body>
    </html>
  );
}
