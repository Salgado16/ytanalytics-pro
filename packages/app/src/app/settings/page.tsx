"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Youtube,
  Key,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Switch } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";

export default function SettingsPage() {
  const { user, session } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "youtube", label: "YouTube", icon: Youtube },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
    { id: "security", label: "Segurança", icon: Shield },
  ];

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie sua conta, conexões e preferências
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? "Salvo!" : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt={user.name || ""} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-muted-foreground">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-1/2">
                    Alterar Foto
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" defaultValue={user?.name || ""} placeholder="Seu nome" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      defaultValue="Criador de conteúdo no YouTube"
                      placeholder="Conte um pouco sobre você..."
                      className="input min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
</Card>
        </TabsContent>

        <TabsContent value="youtube">
          <Card>
            <CardHeader>
              <CardTitle>Conexão com YouTube</CardTitle>
              <CardDescription>Gerencie canais conectados e permissões</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Canal Principal</h4>
                    <p className="text-sm text-muted-foreground">@seucanal • 156.000 inscritos</p>
                    <p className="text-xs text-green-600">Conectado • Atualizado há 2 horas</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Ver Analytics</Button>
                  <Button variant="outline" size="sm">Desconectar</Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Adicionar Novo Canal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Conecte canais adicionais para gerenciar múltiplos canais em um só lugar.
                </p>
                <Button>
                  <Youtube className="h-4 w-4 mr-2" />
                  Conectar Canal via OAuth
                </Button>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Permissões Concedidas</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" /> Ler dados do canal (youtube.readonly)
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" /> Gerenciar vídeos (youtube.force-ssl)
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" /> Analytics (yt-analytics.readonly)
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" /> Monetização (yt-analytics-monetary.readonly)
                  </li>
                </ul>
              </div>
            </CardContent>
</Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize a interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "light", label: "Claro", icon: <Sun className="h-5 w-5" /> },
                    { value: "dark", label: "Escuro", icon: <Moon className="h-5 w-5" /> },
                    { value: "system", label: "Sistema", icon: <Monitor className="h-5 w-5" /> },
                  ].map((theme) => (
                    <Button
                      key={theme.value}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-24"
                    >
                      {theme.icon}
                      <span>{theme.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Idioma</Label>
                <select className="input w-64">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="pt-PT">Português (Portugal)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div className="space-y-4">
                <Label>Voz Padrão do TTS</Label>
                <select className="input w-64">
                  <option value="google-pt-BR">Google Português (Brasil)</option>
                  <option value="google-pt-PT">Google Português (Portugal)</option>
                  <option value="google-en-US">Google English (US)</option>
                  <option value="elevenlabs">ElevenLabs (Premium)</option>
                </select>
              </div>
            </CardContent>
</Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure como e quando receber alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email</h4>
                <div className="space-y-3">
                  {[
                    { id: "email", label: "Notificações por Email", desc: "Receba atualizações por email" },
                    { id: "weeklyReport", label: "Relatório Semanal", desc: "Resumo semanal de performance" },
                    { id: "viralAlerts", label: "Alertas de Virais", desc: "Notifique quando vídeo viralizar" },
                    { id: "newComments", label: "Novos Comentários", desc: "Alertas de comentários importantes" },
                    { id: "milestones", label: "Marcos", desc: "Celebre conquistas de inscritos/views" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-medium">Push (Navegador)</h4>
                <div className="space-y-3">
                  {[
                    { id: "push", label: "Notificações Push", desc: "Receba alertas no navegador" },
                    { id: "pushViral", label: "Apenas Virais", desc: "Só notifique virais (reduz spam)" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={item.id === "push"} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
</Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>Configure integrações com serviços externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "pixabay", name: "Pixabay API", desc: "Busca de imagens e vídeos livres", url: "https://pixabay.com/api/docs/" },
                { id: "pexels", name: "Pexels API", desc: "Busca de fotos e vídeos profissionais", url: "https://www.pexels.com/api/documentation/" },
                { id: "openai", name: "OpenAI API", desc: "GPT para roteiros, títulos, ideias", url: "https://platform.openai.com/api-keys" },
                { id: "elevenlabs", name: "ElevenLabs API", desc: "TTS premium com vozes realistas", url: "https://elevenlabs.io/api" },
                { id: "assemblyai", name: "AssemblyAI API", desc: "Transcrição de alta precisão", url: "https://www.assemblyai.com/docs/" },
              ].map((api) => (
                <div key={api.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{api.name}</h4>
                      <a href={api.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        Obter chave
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.desc}</p>
                  </div>
                  <Input
                    type="password"
                    placeholder="Cole sua API key aqui"
                    className="w-64"
                  />
                </div>
              ))}
            </CardContent>
</Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie acesso e sessões</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Sessões Ativas</h4>
                <div className="space-y-3">
                  {[
                    { device: "Chrome no Windows", location: "São Paulo, BR", current: true, lastActive: "Agora" },
                    { device: "Chrome no Android", location: "Rio de Janeiro, BR", current: false, lastActive: "2 horas atrás" },
                    { device: "Safari no iPhone", location: "São Paulo, BR", current: false, lastActive: "1 dia atrás" },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Monitor className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{session.device} {session.current && <Badge variant="secondary" className="ml-2 text-xs">Atual</Badge>}</p>
                          <p className="text-sm text-muted-foreground">{session.location} • {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Revogar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Autenticação de Dois Fatores</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione uma camada extra de segurança à sua conta.
                </p>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Ativar 2FA
                </Button>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ações irreversíveis. Use com cuidado.
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive">Exportar Dados</Button>
                  <Button variant="destructive">Excluir Conta</Button>
                </div>
              </div>
            </CardContent>
</Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Missing icons
function Sun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function Monitor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}