(() => {
  function injectStudioWidget() {
    const existing = document.getElementById('ytap-studio-widget');
    if (existing) return;

    const widget = document.createElement('div');
    widget.id = 'ytap-studio-widget';
    widget.style.cssText = `
      position: fixed;
      bottom: 20px;
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

    const videoId = getVideoIdFromUrl();
    const title = getVideoTitle();

    widget.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:18px">📊</span>
        <span style="font-weight:600;font-size:13px">YTAnalytics Pro</span>
      </div>
      <p style="font-size:11px;color:#bbb;margin:0 0 2px">Video no Studio</p>
      <p style="font-size:11px;color:#fff;margin:0 0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title || '--'}</p>
      <div style="display:flex;gap:8px">
        <button id="ytap-studio-analyze" style="flex:1;padding:8px;border:none;border-radius:8px;background:#f97316;color:#fff;font-size:12px;font-weight:600;cursor:pointer">Ver analytics</button>
        <button id="ytap-studio-close" style="width:32px;border:none;border-radius:8px;background:#333;color:#fff;font-size:12px;cursor:pointer">x</button>
      </div>
    `;

    document.body.appendChild(widget);

    widget.querySelector('#ytap-studio-close')?.addEventListener('click', () => {
      widget.remove();
    });

    widget.querySelector('#ytap-studio-analyze')?.addEventListener('click', () => {
      if (videoId) {
        chrome.tabs.create({ url: `http://localhost:3000/video/${videoId}` });
      } else {
        chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
      }
    });
  }

  function getVideoIdFromUrl(): string | null {
    const match = window.location.pathname.match(/\/video\/([^/?]+)/);
    return match ? match[1] : null;
  }

  function getVideoTitle(): string {
    const input = document.querySelector('input[aria-label="Título"]') as HTMLInputElement;
    return input?.value || '';
  }

  function maybeInject() {
    const isVideoPage = window.location.pathname.includes('/video/');
    const isUploadPage = window.location.pathname.includes('/upload');
    if (isVideoPage || isUploadPage) {
      injectStudioWidget();
    }
  }

  function observeNavigation() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        document.getElementById('ytap-studio-widget')?.remove();
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
    if (message.type === 'GET_STUDIO_DATA') {
      sendResponse({
        videoId: getVideoIdFromUrl(),
        title: getVideoTitle(),
      });
    }
    return true;
  });
})();