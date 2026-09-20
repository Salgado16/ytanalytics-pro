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
  ChevronDown,
  Menu,
  X,
  Zap,
  Target,
  BarChart2,
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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "D" },
  { name: "Canais", href: "/channels", icon: Users, shortcut: "C" },
  { name: "Niche Finder", href: "/niche", icon: Target, shortcut: "N" },
  { name: "Vídeos Virais", href: "/viral", icon: TrendingUp, shortcut: "V" },
  { name: "Biblioteca de Skills", href: "/skills", icon: BookOpen, shortcut: "S" },
  { name: "Referências", href: "/references", icon: Library, shortcut: "R" },
  { name: "Mídia (Pixabay/Pexels)", href: "/media", icon: Zap, shortcut: "M" },
  { name: "Text-to-Speech", href: "/tts", icon: Mic, shortcut: "T" },
  { name: "Transcrições", href: "/transcriptions", icon: FileText, shortcut: "X" },
  { name: "Ferramentas de Texto", href: "/text-tools", icon: Scissors, shortcut: "F" },
  { name: "Quadro de Ideias", href: "/ideas", icon: Lightbulb, shortcut: "I" },
  { name: "Configurações", href: "/settings", icon: Settings, shortcut: "," },
];

const quickActions = [
  { name: "Nova Ideia", href: "/ideas", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  { name: "Buscar Nicho", href: "/niche", icon: Search, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  { name: "Novo TTS", href: "/tts", icon: Mic, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "Transcrever", href: "/transcriptions", icon: FileText, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  { name: "Buscar Mídia", href: "/media", icon: Zap, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Ferramentas", href: "/text-tools", icon: Scissors, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
  { name: "Skills", href: "/skills", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  { name: "Vídeos Virais", href: "/viral", icon: TrendingUp, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
];

const themes = [
  { value: "light" as const, label: "Claro", icon: "☀️" },
  { value: "dark" as const, label: "Escuro", icon: "🌙" },
  { value: "system" as const, label: "Sistema", icon: "💻" },
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
        "sidebar transition-all duration-300 ease-out",
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl gradient-text">
              <LayoutDashboard className="h-6 w-6" />
              <span>YT Analytics</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("h-10 w-10 rounded-xl", collapsed && "justify-center")}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" role="navigation" aria-label="Navegação principal">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "sidebar-link group transition-all duration-200",
                  isActive ? "sidebar-link-active" : "",
                  collapsed && "justify-center px-3"
                )}
                title={collapsed ? `${item.name} (${item.shortcut})` : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!collapsed && (
                  <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/60 bg-muted/50 rounded">
                    {item.shortcut}
                  </kbd>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Quick Actions + Theme/Language */}
        <div className="border-t p-3 space-y-4">
          {!collapsed && (
            <div className="space-y-3 animate-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ações Rápidas
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="quick-action group"
                  >
                    <div className={cn("quick-action-icon rounded-xl flex items-center justify-center mx-auto", action.bg)}>
                      <action.icon className={cn("h-5 w-5", action.color)} />
                    </div>
                    <span className="quick-action-text text-sm font-medium truncate">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3 animate-in">
            {!collapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Aparência
              </p>
            )}
            
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={collapsed ? "ghost" : "outline"}
                  size={collapsed ? "icon" : "sm"}
                  className={cn(
                    "w-full justify-between gap-2 transition-colors",
                    collapsed ? "h-10" : "h-10"
                  )}
                >
                  {!collapsed && (
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{themes.find((t) => t.value === theme)?.icon}</span>
                      <span className="flex-1 text-left capitalize truncate">{themes.find((t) => t.value === theme)?.label}</span>
                    </div>
                  )}
                  {collapsed && (
                    <span className="text-lg">
                      {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻"}
                    </span>
                  )}
                  {!collapsed && <ChevronDown className="h-4 w-4 opacity-50" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36" align="end">
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn("flex items-center gap-2", theme === t.value && "bg-accent")}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={collapsed ? "ghost" : "outline"}
                  size={collapsed ? "icon" : "sm"}
                  className={cn(
                    "w-full justify-between gap-2 transition-colors",
                    collapsed ? "h-10" : "h-10"
                  )}
                >
                  {!collapsed && (
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{languages.find((l) => l.value === language)?.flag}</span>
                      <span className="flex-1 text-left truncate">{languages.find((l) => l.value === language)?.label}</span>
                    </div>
                  )}
                  {collapsed && <span className="text-lg">🌐</span>}
                  {!collapsed && <ChevronDown className="h-4 w-4 opacity-50" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.value}
                    onClick={() => setLanguage(l.value)}
                    className={cn("flex items-center gap-2", language === l.value && "bg-accent")}
                  >
                    <span className="text-lg">{l.flag}</span>
                    <span>{l.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {collapsed && (
              <div className="flex flex-col items-center gap-2 pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10" title="Tema">
                      {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {themes.map((t) => (
                      <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn("flex items-center gap-2", theme === t.value && "bg-accent")}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span>{t.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10" title="Idioma">
                      🌐
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languages.map((l) => (
                      <DropdownMenuItem
                        key={l.value}
                        onClick={() => setLanguage(l.value)}
                        className={cn("flex items-center gap-2", language === l.value && "bg-accent")}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span>{l.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* User Info - Collapsed */}
          {collapsed && (
            <div className="pt-4 border-t">
              <Button variant="ghost" size="icon" className="h-10 w-10 mx-auto" title="Menu do usuário">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}