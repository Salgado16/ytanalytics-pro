(() => {
  function injectFloatingWidget(videoId: string) {
    const existing = document.getElementById('ytap-floating-widget');
    if (existing) return;

    const widget = document.createElement('div');
    widget.id = 'ytap-floating-widget';
    widget.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a1a;
      color: #fff;
      border-radius: 12px;
      padding: 12px 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      max-width: 240px;
      user-select: none;
    `;

    widget.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:18px">🔥</span>
        <span style="font-weight:600;font-size:13px">YTAnalytics Pro</span>
      </div>
      <p style="font-size:11px;color:#bbb;margin:0 0 10px">Analise este vídeo com todas as ferramentas</p>
      <div style="display:flex;gap:8px">
        <button id="ytap-analyze" style="flex:1;padding:8px;border:none;border-radius:8px;background:#f97316;color:#fff;font-size:12px;font-weight:600;cursor:pointer">Analisar video</button>
        <button id="ytap-close" style="width:32px;border:none;border-radius:8px;background:#333;color:#fff;font-size:12px;cursor:pointer">x</button>
      </div>
    `;

    document.body.appendChild(widget);

    widget.querySelector('#ytap-close')?.addEventListener('click', () => {
      widget.remove();
    });

    widget.querySelector('#ytap-analyze')?.addEventListener('click', () => {
      chrome.tabs.create({ url: `http://localhost:3000/video/${videoId}` });
    });
  }

  function getVideoId(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
  }

  function maybeInject() {
    const isWatchPage = window.location.pathname === '/watch';
    const isShortsPage = window.location.pathname.startsWith('/shorts/');
    const videoId = getVideoId();
    if ((isWatchPage || isShortsPage) && videoId) {
      injectFloatingWidget(videoId);
    }
  }

  function observeNavigation() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        document.getElementById('ytap-floating-widget')?.remove();
        setTimeout(maybeInject, 300);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      maybeInject();
      observeNavigation();
    });
  } else {
    maybeInject();
    observeNavigation();
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
})();