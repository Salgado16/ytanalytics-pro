import { createShadowRootUi } from '@wxt-dev/react';
import App from './App';

const ui = createShadowRootUi({
  name: 'youtube-analytics-ui',
  appendTo: 'body',
  position: 'fixed',
  top: '80px',
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
  
  const isWatchPage = window.location.pathname === '/watch';
  const isShortsPage = window.location.pathname.startsWith('/shorts/');
  
  if (isWatchPage || isShortsPage) {
    ui.mount((container) => {
      const root = document.createElement('div');
      container.appendChild(root);
      return root;
    }, {
      props: {
        videoId: getVideoId(),
      },
    });
    mounted = true;
  }
}

function getVideoId(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
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
  if (message.type === 'GET_VIDEO_DATA') {
    sendResponse({
      videoId: getVideoId(),
      title: document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim(),
      channelName: document.querySelector('#channel-name a')?.textContent?.trim(),
      viewCount: document.querySelector('#info-strings yt-formatted-string')?.textContent?.trim(),
    });
  }
  return true;
});