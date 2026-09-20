"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Library,
  Mic,
  FileText,
  Scissors,
  Lightbulb,
  Search,
  TrendingUp,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Separator } from "@/components/ui";
import { useThemeLanguage } from "@/context/ThemeLanguageContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Canais", href: "/channels", icon: Users },
  { name: "Biblioteca de Skills", href: "/skills", icon: BookOpen },
  { name: "Referências", href: "/references", icon: Library },
  { name: "Mídia (Pixabay/Pexels)", href: "/media", icon: Plus },
  { name: "Text-to-Speech", href: "/tts", icon: Mic },
  { name: "Transcrições", href: "/transcriptions", icon: FileText },
  { name: "Ferramentas de Texto", href: "/text-tools", icon: Scissors },
  { name: "Quadro de Ideias", href: "/ideas", icon: Lightbulb },
  { name: "Niche Finder", href: "/niche", icon: Search },
  { name: "Vídeos Virais", href: "/viral", icon: TrendingUp },
  { name: "Configurações", href: "/settings", icon: Settings },
];

const themes = [
  { value: "light" as const, label: "Claro", icon: Sun },
  { value: "dark" as const, label: "Escuro", icon: Moon },
  { value: "system" as const, label: "Sistema", icon: Monitor },
];

const languages = [
  { value: "pt-BR" as const, label: "Português (BR)", flag: "🇧🇷" },
  { value: "en" as const, label: "English", flag: "🇺🇸" },
  { value: "es" as const, label: "Español", flag: "🇪🇸" },
];

export function Sidebar({ collapsed = false, onToggle }: { collapsed?: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme, language, setLanguage } = useThemeLanguage();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
              <LayoutDashboard className="h-6 w-6" />
              <span>YT Analytics</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("h-8 w-8", collapsed && "justify-center")}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" role="navigation" aria-label="Navegação principal">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.name : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          {!collapsed && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Atalhos
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Ideia
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Search className="h-4 w-4" />
                  Buscar Nicho
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Mic className="h-4 w-4" />
                  Novo TTS
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Transcrever
                </Button>
              </div>

              <Separator />

              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Aparência
              </p>
              <div className="space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const currentTheme = themes.find((t) => t.value === theme);
                          return currentTheme ? <currentTheme.icon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;
                        })()}
                        <span className="flex-1 text-left capitalize">{themes.find((t) => t.value === theme)?.label}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    {themes.map((t) => (
                      <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn("flex items-center gap-2", theme === t.value && "bg-accent")}
                      >
                        <t.icon className="h-4 w-4" />
                        <span>{t.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span>{languages.find((l) => l.value === language)?.flag}</span>
                        <span className="flex-1 text-left">{languages.find((l) => l.value === language)?.label}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-44" align="end">
                    {languages.map((l) => (
                      <DropdownMenuItem
                        key={l.value}
                        onClick={() => setLanguage(l.value)}
                        className={cn("flex items-center gap-2", language === l.value && "bg-accent")}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex flex-col items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Tema">
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {themes.map((t) => (
                    <DropdownMenuItem
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn("flex items-center gap-2", theme === t.value && "bg-accent")}
                    >
                      <t.icon className="h-4 w-4" />
                      <span>{t.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Idioma">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((l) => (
                    <DropdownMenuItem
                      key={l.value}
                      onClick={() => setLanguage(l.value)}
                      className={cn("flex items-center gap-2", language === l.value && "bg-accent")}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}