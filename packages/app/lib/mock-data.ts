export interface ChannelData {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  totalViews: string;
  videosCount: number;
  status: 'Ativo' | 'Sincronizando' | 'Pendente';
  niche: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export const MOCK_CHANNELS: ChannelData[] = [
  {
    id: '1',
    name: 'Tech & Futuro Brasil',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    subscribers: '142.500',
    totalViews: '12.8M',
    videosCount: 248,
    status: 'Ativo',
    niche: 'Tecnologia & IA',
  },
  {
    id: '2',
    name: 'Cortes de PodCast Pro',
    avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150',
    subscribers: '89.200',
    totalViews: '8.4M',
    videosCount: 512,
    status: 'Ativo',
    niche: 'Entretenimento',
  },
];

export const MOCK_METRICS: MetricCard[] = [
  { title: 'Visualizações Totais (28 dias)', value: '1.458.200', change: '+18,4%', isPositive: true },
  { title: 'Novos Inscritos', value: '+12.450', change: '+8,2%', isPositive: true },
  { title: 'Tempo de Exibição (Horas)', value: '84.200h', change: '+14,1%', isPositive: true },
  { title: 'Receita Estimada (RPM)', value: 'R$ 8.940,00', change: '+22,5%', isPositive: true },
];

export const MOCK_VIDEOS = [
  { id: 'v1', title: 'Como Usar Inteligência Artificial para Criar Conteúdo 10x Mais Rápido', views: '145K', likes: '12.4K', ctr: '11.8%', duration: '14:20', published: 'Há 2 dias' },
  { id: 'v2', title: 'O Fim das Ferramentas Tradicionais? Análise Completa 2026', views: '98K', likes: '8.1K', ctr: '9.4%', duration: '18:45', published: 'Há 5 dias' },
  { id: 'v3', title: '5 Nichos do YouTube Que Mais Pagam RPM Este Ano', views: '210K', likes: '19.8K', ctr: '14.2%', duration: '11:10', published: 'Há 1 semana' },
];

export const MOCK_IDEAS = [
  { id: 'i1', title: '10 Ferramentas Secretas de IA Que Ninguém Te Conta no YouTube', score: 98, category: 'Alta Procura', hook: 'Comece mostrando o resultado final impressionante em 5 segundos.' },
  { id: 'i2', title: 'Como Ganhar Dinheiro com Canais Sem Mostrar o Rosto em 2026', score: 94, category: 'Tendência', hook: 'Revele a estatística de crescimento de canais faceless no primeiro minuto.' },
  { id: 'i3', title: 'O Algoritmo do YouTube Mudou: Faça Isso Agora Para Não Flopar', score: 91, category: 'Urgente', hook: 'Mostre o gráfico de queda de canais que não se atualizaram.' },
];
