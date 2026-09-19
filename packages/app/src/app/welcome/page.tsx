import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-4xl">
          📊
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">YTAnalytics Pro</h1>
          <p className="text-muted-foreground">
            Sua suíte completa de analytics, crescimento e ferramentas para o YouTube.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Conectar com o Google
          </Link>
          <Link
            href="/dashboard"
            className="block w-full px-4 py-3 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
          >
            Ir para o Dashboard
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2 text-left text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>🔥</span> Viral Score, Niche Finder, Ideias em Kanban
          </div>
          <div className="flex items-center gap-2">
            <span>🎨</span> Banco de Mídia (Pixabay, Pexels) + Gerador de Imagens
          </div>
          <div className="flex items-center gap-2">
            <span>🔊</span> TTS, Transcrições e Ferramentas de Texto
          </div>
        </div>
      </div>
    </div>
  );
}