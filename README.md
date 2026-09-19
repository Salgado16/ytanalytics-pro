# YouTube Analytics Suite

Plataforma completa de analytics e growth para criadores do YouTube, com extensão para navegador e dashboard web.

## 🚀 Features

### 📊 Dashboard & Analytics
- Visão geral do canal (views, subscritos, revenue, watch time)
- Analytics por vídeo (CTR, AVD, retention, traffic sources)
- Gráficos de crescimento e tendências
- Alertas de picos virais e marcos

### 🎯 Gestão de Canais
- Múltiplos canais via OAuth
- Sincronização automática de dados
- Métricas comparativas entre canais

### 📚 Biblioteca de Skills
- Templates de roteiros, thumbnails, títulos
- Categorização por tipo (SEO, Design, Edição, Crescimento)
- Busca e filtros avançados
- Markdown support

### 🔗 Referências
- Salve vídeos, artigos, imagens, áudios
- Tags e categorização
- Integração com YouTube (auto-preenchimento)

### 🎨 Mídia (Pixabay + Pexels)
- Busca integrada de imagens e vídeos livres
- Download direto para biblioteca
- Filtros por tipo, orientação, cor

### 🎤 Text-to-Speech
- Múltiplas vozes do sistema
- Controle de velocidade, tom, volume
- Histórico de gerações
- Exportação de áudio

### 📝 Transcrições
- YouTube URL, upload de arquivo
- Múltiplos idiomas
- Timestamps e segmentos
- Exportação TXT/SRT

### ✂️ Ferramentas de Texto
- Contador de caracteres/palavras
- Divisor de texto (chars, palavras, frases, parágrafos)
- Gerador de hashtags inteligente
- Otimizador de títulos (SEO, Clickbait, Educacional, Viral)

### 💡 Quadro de Ideias (Kanban)
- Status: Backlog → Pesquisando → Roteirizando → Gravando → Editando → Agendado → Publicado
- Prioridades, tags, palavras-chave
- Drag & drop
- Agendamento e links de referência

### 🎯 Niche Finder
- Canais em alta, subindo, novos
- Filtros por país, categoria, tamanho
- Score viral e taxa de crescimento
- Busca por nicho/tema

### 🔥 Vídeos Virais
- Trending por país e categoria
- Score viral, velocidade, tendência
- Métricas de engajamento
- Filtros avançados

## 🛠 Tech Stack

### App (Next.js 14)
- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js (Google OAuth + YouTube scopes)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: Zustand + React Hook Form
- **APIs**: YouTube Data v3, YouTube Analytics, Pixabay, Pexels, OpenAI, ElevenLabs, AssemblyAI

### Extension (Manifest V3 + WXT)
- **Framework**: WXT + React
- **Content Scripts**: YouTube watch pages + Studio
- **Background**: OAuth, API calls, storage
- **Popup**: Quick stats, channel switcher

## 📦 Estrutura do Projeto

```
youtube-analytics-suite/
├── package.json                    # Root workspace
├── packages/
│   ├── shared/                     # Tipos TypeScript + Zod schemas
│   │   └── src/index.ts
│   ├── app/                        # Next.js Dashboard
│   │   ├── prisma/schema.prisma    # Database schema
│   │   ├── src/
│   │   │   ├── app/                # App Router pages
│   │   │   │   ├── dashboard/      # Main dashboard
│   │   │   │   ├── channels/       # Channel management
│   │   │   │   ├── skills/         # Skills library
│   │   │   │   ├── references/     # References
│   │   │   │   ├── media/          # Media library
│   │   │   │   ├── tts/            # Text-to-Speech
│   │   │   │   ├── transcriptions/ # Transcriptions
│   │   │   │   ├── text-tools/     # Text utilities
│   │   │   │   ├── ideas/          # Ideas Kanban
│   │   │   │   ├── niche/          # Niche finder
│   │   │   │   ├── viral/          # Viral videos
│   │   │   │   ├── settings/       # Settings
│   │   │   │   └── auth/           # Auth pages
│   │   │   ├── components/         # React components
│   │   │   ├── hooks/              # Custom hooks
│   │   │   ├── lib/                # Utilities, API clients
│   │   │   └── types/              # Type definitions
│   │   └── public/
│   └── extension/                  # Browser Extension
│       ├── wxt.config.ts
│       ├── src/
│       │   ├── content/            # Content scripts
│       │   │   ├── content.ts      # YouTube watch page
│       │   │   ├── studio-content.ts # YouTube Studio
│       │   │   ├── App.tsx         # Overlay UI
│       │   │   └── StudioApp.tsx   # Studio overlay
│       │   ├── background/         # Service worker
│       │   ├── popup/              # Extension popup
│       │   └── shared/             # Shared types
│       └── public/
│           ├── popup.html
│           └── content.css
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- Conta Google Cloud com YouTube API habilitada

### 1. Clone e instale
```bash
git clone <repo>
cd youtube-analytics-suite
npm install
```

### 2. Configure variáveis de ambiente
```bash
cp packages/app/.env.example packages/app/.env
# Edite .env com suas chaves
```

### 3. Setup do banco
```bash
cd packages/app
npm run db:push
npm run db:generate
```

### 4. Desenvolvimento
```bash
# Terminal 1 - App
npm run dev:app

# Terminal 2 - Extension
npm run dev:extension
```

### 5. Build para produção
```bash
npm run build
```

## 🔑 Configuração de APIs

### Google Cloud Console
1. Crie projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Ative: YouTube Data API v3, YouTube Analytics API
3. Configure OAuth 2.0 credentials
4. Adicione `http://localhost:3000/api/auth/callback/google` como redirect URI
5. Scopes necessários:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/youtube.force-ssl`
   - `https://www.googleapis.com/auth/yt-analytics.readonly`
   - `https://www.googleapis.com/auth/yt-analytics-monetary.readonly`

### Pixabay
- [API Key](https://pixabay.com/api/docs/)

### Pexels
- [API Key](https://www.pexels.com/api/documentation/)

### OpenAI (opcional)
- Para geração de títulos, roteiros, ideias

### ElevenLabs (opcional)
- TTS premium

### AssemblyAI (opcional)
- Transcrição de alta precisão

## 📱 Extension

### Desenvolvimento
```bash
cd packages/extension
npm run dev
```
Carrega no Chrome via `chrome://extensions` (modo desenvolvedor).

### Build
```bash
npm run build
# Gera pasta dist/ para Chrome Web Store
npm run zip
# Gera .zip para submissão
```

## 📊 Database Schema

Principais models:
- `User` - Usuários (NextAuth)
- `UserChannel` - Canais YouTube conectados
- `ChannelAnalytics` / `VideoAnalytics` - Métricas diárias
- `Skill` - Biblioteca de skills
- `Reference` - Referências salvas
- `MediaAsset` - Mídia do Pixabay/Pexels
- `Transcription` - Transcrições
- `TextTool` - Histórico de ferramentas
- `Idea` - Quadro Kanban
- `NicheChannel` / `ViralVideo` - Cache de niche finder

## 🔒 Segurança

- OAuth 2.0 com PKCE
- Tokens armazenados criptografados
- Rate limiting nas APIs
- Validação Zod em todas as entradas
- HTTPS obrigatório em produção

## 📈 Roadmap

- [ ] A/B testing de thumbnails/títulos no Studio
- [ ] IA para geração de roteiros completos
- [ ] Colaboração em equipe
- [ ] Exportação para Notion/Google Sheets
- [ ] App mobile (React Native)
- [ ] API pública para parceiros

## 📄 Licença

MIT License - veja LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'feat: nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra Pull Request

---

Feito com ❤️ para criadores de conteúdo brasileiros