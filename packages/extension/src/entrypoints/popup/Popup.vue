<template>
  <div class="w-80 p-4 bg-white dark:bg-gray-900 min-h-[400px]">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
          <Youtube class="w-5 h-5 text-white" />
        </div>
        <span class="font-semibold text-gray-900 dark:text-white">YTAnalytics Pro</span>
      </div>
      <div class="flex items-center gap-1">
        <span v-if="authenticated" class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <span class="w-2 h-2 rounded-full bg-green-500" />
          Conectado
        </span>
        <span v-else class="flex items-center gap-1 text-xs text-gray-500">
          <span class="w-2 h-2 rounded-full bg-gray-400" />
          Desconectado
        </span>
      </div>
    </div>

    <div v-if="!authenticated" class="space-y-3 text-center py-8">
      <BarChart2 class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
      <h3 class="font-medium text-gray-900 dark:text-white">Conecte sua conta do YouTube</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Acesse analytics, viral score, niche finder e mais
      </p>
      <button @click="handleLogin" class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">
        <LogIn class="w-4 h-4" />
        Conectar com Google
      </button>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-medium text-gray-900 dark:text-white">Seus Canais</h3>
        <button @click="loadChannels" :disabled="loading" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <RefreshCw :class="loading ? 'w-4 h-4 animate-spin' : 'w-4 h-4'" />
        </button>
      </div>

      <div v-if="channels.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
        <p>Nenhum canal conectado</p>
        <button @click="handleLogin" class="mt-2 text-sm text-orange-500 hover:underline">
          Adicionar canal
        </button>
      </div>

      <div v-else class="space-y-3 max-h-64 overflow-y-auto">
        <div v-for="channel in channels" :key="channel.id" class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <img :src="channel.thumbnail" :alt="channel.title" class="w-12 h-12 rounded-lg object-cover" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">{{ channel.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ channel.subscribers }} inscritos · {{ channel.views }} views
            </p>
          </div>
          <button @click="openVideoAnalysis(channel.id)" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronRight class="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="openDashboard" class="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <BarChart2 class="w-5 h-5 text-orange-500" />
          <span class="text-xs font-medium">Dashboard</span>
        </button>
        <button @click="() => chrome.tabs.create({ url: 'http://localhost:3000/niche' })" class="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Target class="w-5 h-5 text-green-500" />
          <span class="text-xs font-medium">Niche Finder</span>
        </button>
        <button @click="() => chrome.tabs.create({ url: 'http://localhost:3000/viral' })" class="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <TrendingUp class="w-5 h-5 text-red-500" />
          <span class="text-xs font-medium">Vídeos Virais</span>
        </button>
        <button @click="handleLogout" class="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600">
          <LogOut class="w-5 h-5" />
          <span class="text-xs font-medium">Sair</span>
        </button>
      </div>

      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors">
          <ExternalLink class="w-3 h-3" />
          Abrir App Completo
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { chrome } from 'wxt/browser';
import { 
  Youtube, BarChart2, TrendingUp, Target, Settings, 
  ExternalLink, RefreshCw, LogIn, LogOut, ChevronRight 
} from 'lucide-vue-next';

const channels = ref([]);
const loading = ref(true);
const authenticated = ref(false);

interface ChannelData {
  id: string;
  title: string;
  subscribers: string;
  views: string;
  thumbnail: string;
}

const checkAuth = async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'CHECK_AUTH' });
    authenticated.value = response.authenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
  }
};

const loadChannels = async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CHANNELS' });
    if (response.channels) {
      channels.value = response.channels;
    }
  } catch (error) {
    console.error('Failed to load channels:', error);
  } finally {
    loading.value = false;
  }
};

const handleLogin = () => {
  chrome.runtime.sendMessage({ type: 'OAUTH_LOGIN' });
  window.close();
};

const handleLogout = () => {
  chrome.runtime.sendMessage({ type: 'OAUTH_LOGOUT' });
  authenticated.value = false;
  channels.value = [];
};

const openDashboard = () => {
  chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  window.close();
};

const openVideoAnalysis = (videoId: string) => {
  chrome.tabs.create({ url: `http://localhost:3000/video/${videoId}` });
  window.close();
};

onMounted(() => {
  checkAuth();
  loadChannels();
});
</script>