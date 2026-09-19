import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'YTAnalytics Pro',
    description: 'Analytics, Growth & Tools para criadores do YouTube',
    version: '1.0.0',
    permissions: [
      'activeTab',
      'storage',
      'scripting',
      'identity',
    ],
    host_permissions: [
      '*://*.youtube.com/*',
      '*://*.googleapis.com/*',
    ],
    oauth2: {
      client_id: '__CLIENT_ID__',
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
      ],
    },
    action: {
      default_popup: 'entrypoints/popup/index.html',
      default_title: 'YTAnalytics Pro',
    },
    background: {
      service_worker: 'entrypoints/background.ts',
      type: 'module',
    },
    content_scripts: [
      {
        matches: ['*://*.youtube.com/*'],
        js: ['entrypoints/content.ts'],
        run_at: 'document_idle',
      },
      {
        matches: ['*://studio.youtube.com/*'],
        js: ['entrypoints/studio-content.ts'],
        run_at: 'document_idle',
      },
    ],
    web_accessible_resources: [
      {
        resources: ['icons/*', 'injected/*'],
        matches: ['*://*.youtube.com/*', '*://studio.youtube.com/*'],
      },
    ],
  },
  modules: ['@wxt-dev/react'],
  srcDir: 'src',
  outDir: 'dist',
  runner: {
    disabled: true,
  },
});