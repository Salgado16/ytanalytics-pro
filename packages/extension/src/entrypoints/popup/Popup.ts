const popupRoot = document.createElement('div');
popupRoot.id = 'ytanalytics-popup';
popupRoot.style.cssText = `
  width: 320px;
  min-height: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fff;
  color: #111;
`;
document.body.prepend(popupRoot);

const state = {
  channels: [],
  loading: true,
  authenticated: false,
};

async function checkAuth() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'CHECK_AUTH' });
    state.authenticated = !!response.authenticated;
  } catch (e) {
    state.authenticated = false;
  }
}

async function loadChannels() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CHANNELS' });
    state.channels = response.channels || [];
  } catch (e) {
    state.channels = [];
  } finally {
    state.loading = false;
  }
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'src' || k === 'href') node.setAttribute(k, v);
    else node[k] = v;
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function iconButton(label, emoji, onClick) {
  return el('button', {
    class: 'ytap-btn',
    onclick: onClick,
  }, [
    el('span', { style: 'font-size: 18px' }, [emoji]),
    el('span', { style: 'font-size: 11px; font-weight: 500' }, [label]),
  ]);
}

function render() {
  popupRoot.innerHTML = '';

  const header = el('div', {
    style: 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e5e7eb',
  }, [
    el('div', { style: 'display:flex;align-items:center;gap:8px' }, [
      el('div', { style: 'width:32px;height:32px;border-radius:8px;background:#f97316;display:flex;align-items:center;justify-content:center;font-size:18px' }, ['📊']),
      el('span', { style: 'font-weight:600;font-size:14px' }, ['YTAnalytics Pro']),
    ]),
    el('span', {
      style: `font-size:11px;padding:3px 8px;border-radius:10px;${state.authenticated ? 'background:#dcfce7;color:#166534' : 'background:#f3f4f6;color:#6b7280'}`,
    }, [state.authenticated ? '● Conectado' : '● Desconectado']),
  ]);

  popupRoot.appendChild(el('style', {}, [`
    .ytap-btn { display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px;border:none;border-radius:8px;background:#f9fafb;cursor:pointer;transition:background .2s; }
    .ytap-btn:hover { background:#f3f4f6; }
    .ytap-link { display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:10px;border:none;border-radius:8px;background:#f97316;color:#fff;font-size:12px;font-weight:500;cursor:pointer;text-decoration:none; }
    .ytap-link:hover { background:#ea580c; }
    .ytap-channel { display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;background:#f9fafb;margin-bottom:8px; }
  `]));

  popupRoot.appendChild(header);

  if (!state.authenticated) {
    popupRoot.appendChild(el('div', { style: 'text-align:center;padding:48px 16px' }, [
      el('div', { style: 'font-size:48px;margin-bottom:12px' }, ['📊']),
      el('h3', { style: 'font-size:14px;font-weight:500;margin:0 0 4px' }, ['Conecte sua conta do YouTube']),
      el('p', { style: 'font-size:12px;color:#6b7280;margin:0 0 16px' }, ['Acesse analytics, viral score, niche finder e mais']),
      el('button', {
        class: 'ytap-link',
        onclick: () => {
          chrome.runtime.sendMessage({ type: 'OAUTH_LOGIN' });
          window.close();
        },
      }, ['🔑 Conectar com Google']),
    ]));
    return;
  }

  const content = el('div', { style: 'padding:16px' }, []);

  const titleRow = el('div', { style: 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px' }, [
    el('span', { style: 'font-weight:500;font-size:13px' }, ['Seus Canais']),
    el('button', {
      style: 'border:none;background:none;cursor:pointer;font-size:14px',
      onclick: () => { state.loading = true; render(); loadChannels().then(render); },
    }, ['🔄']),
  ]);
  content.appendChild(titleRow);

  if (state.channels.length === 0) {
    content.appendChild(el('div', { style: 'text-align:center;padding:24px 0;color:#6b7280;font-size:12px' }, [
      el('p', { style: 'margin:0 0 4px' }, ['Nenhum canal conectado']),
      el('button', {
        style: 'background:none;border:none;color:#f97316;cursor:pointer;font-size:12px',
        onclick: () => {
          chrome.runtime.sendMessage({ type: 'OAUTH_LOGIN' });
          window.close();
        },
      }, ['Adicionar canal']),
    ]));
  } else {
    state.channels.forEach((channel) => {
      content.appendChild(el('div', { class: 'ytap-channel' }, [
        el('img', { src: channel.thumbnail || '', style: 'width:48px;height:48px;border-radius:8px;object-fit:cover' }),
        el('div', { style: 'flex:1;min-width:0' }, [
          el('p', { style: 'font-weight:500;font-size:13px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, [channel.title || '']),
          el('p', { style: 'font-size:11px;color:#6b7280;margin:2px 0 0' }, [`${channel.subscribers || 0} inscritos · ${channel.views || 0} views`]),
        ]),
        el('button', {
          style: 'border:none;background:none;cursor:pointer;font-size:16px',
          onclick: () => {
            chrome.tabs.create({ url: `http://localhost:3000/video/${channel.id}` });
            window.close();
          },
        }, ['›']),
      ]));
    });
  }

  const grid = el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb' }, []);
  
  const openTab = (url) => () => {
    chrome.tabs.create({ url: `http://localhost:3000${url}` });
    window.close();
  };

  grid.appendChild(iconButton('Dashboard', '📊', openTab('/dashboard')));
  grid.appendChild(iconButton('Niche Finder', '🎯', openTab('/niche')));
  grid.appendChild(iconButton('Virais', '🔥', openTab('/viral')));

  grid.appendChild(el('button', {
    class: 'ytap-btn',
    style: 'color:#dc2626',
    onclick: () => {
      chrome.runtime.sendMessage({ type: 'OAUTH_LOGOUT' });
      state.authenticated = false;
      state.channels = [];
      render();
    },
  }, [
    el('span', { style: 'font-size:18px' }, ['🚪']),
    el('span', { style: 'font-size:11px;font-weight:500' }, ['Sair']),
  ]));

  content.appendChild(grid);

  content.appendChild(el('a', {
    href: 'http://localhost:3000',
    target: '_blank',
    class: 'ytap-link',
    style: 'margin-top:12px',
  }, ['🌐 Abrir App Completo']));

  popupRoot.appendChild(content);
}

(async () => {
  await checkAuth();
  await loadChannels();
  render();
})();