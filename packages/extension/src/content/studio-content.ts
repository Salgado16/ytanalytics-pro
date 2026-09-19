import { createShadowRootUi } from '@wxt-dev/react';
import StudioApp from './StudioApp';

const ui = createShadowRootUi({
  name: 'youtube-analytics-studio-ui',
  appendTo: 'body',
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 2147483647,
  onMount: (container) => {
    const root = document.createElement('div');
    container.appendChild(root);
    return root;
  },
});

let mounted = false;

function mountUI() {
  if (mounted) return;
  
  const isVideoPage = window.location.pathname.includes('/video/');
  const isUploadPage = window.location.pathname.includes('/upload');
  
  if (isVideoPage || isUploadPage) {
    ui.mount((container) => {
      const root = document.createElement('div');
      container.appendChild(root);
      return root;
    });
    mounted = true;
  }
}

function observeNavigation() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      mounted = false;
      setTimeout(mountUI, 100);
    }
  }).observe(document, { subtree: true, childList: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mountUI();
    observeNavigation();
  });
} else {
  mountUI();
  observeNavigation();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STUDIO_DATA') {
    sendResponse({
      videoId: getVideoIdFromUrl(),
      title: getVideoTitle(),
      description: getVideoDescription(),
      tags: getVideoTags(),
      thumbnail: getVideoThumbnail(),
    });
  }
  return true;
});

function getVideoIdFromUrl(): string | null {
  const match = window.location.pathname.match(/\/video\/([^/?]+)/);
  return match ? match[1] : null;
}

function getVideoTitle(): string {
  const input = document.querySelector('input[aria-label="Título"]') as HTMLInputElement;
  return input?.value || '';
}

function getVideoDescription(): string {
  const textarea = document.querySelector('textarea[aria-label="Descrição"]') as HTMLTextAreaElement;
  return textarea?.value || '';
}

function getVideoTags(): string {
  const input = document.querySelector('input[aria-label="Tags"]') as HTMLInputElement;
  return input?.value || '';
}

function getVideoThumbnail(): string {
  const img = document.querySelector('img[alt="Miniatura do vídeo"]') as HTMLImageElement;
  return img?.src || '';
}