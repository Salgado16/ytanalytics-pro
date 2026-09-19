const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
];

const CLIENT_ID = '__CLIENT_ID__';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'http://localhost:3000/welcome' });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'CHECK_AUTH':
      checkAuth().then(sendResponse);
      return true;

    case 'OAUTH_LOGIN':
      startOAuthFlow().then(sendResponse);
      return true;

    case 'OAUTH_LOGOUT':
      logout().then(sendResponse);
      return true;

    case 'GET_CHANNELS':
      getChannels().then(sendResponse);
      return true;

    case 'GET_VIDEO_DATA':
      getVideoData(message.videoId).then(sendResponse);
      return true;

    case 'GET_STUDIO_DATA':
      getStudioData().then(sendResponse);
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

async function checkAuth(): Promise<{ authenticated: boolean }> {
  const token = await chrome.identity.getAuthToken({ interactive: false });
  return { authenticated: !!token };
}

async function startOAuthFlow(): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken(
      {
        interactive: true,
        scopes: OAUTH_SCOPES,
      },
      (token) => {
        if (chrome.runtime.lastError || !token) {
          console.error('OAuth failed:', chrome.runtime.lastError);
          resolve({ success: false });
        } else {
          fetchAndStoreChannels(token);
          resolve({ success: true });
        }
      }
    );
  });
}

async function logout(): Promise<{ success: boolean }> {
  const token = await chrome.identity.getAuthToken({ interactive: false });
  if (token) {
    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    await chrome.identity.removeCachedAuthToken({ token });
  }
  await chrome.storage.local.remove(['channels', 'access_token']);
  return { success: true };
}

async function getChannels(): Promise<{ channels: ChannelData[] }> {
  const stored = await chrome.storage.local.get('channels');
  return { channels: stored.channels || [] };
}

async function fetchAndStoreChannels(token: string) {
  try {
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    
    if (data.items) {
      const channels = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        subscribers: formatNumber(item.statistics.subscriberCount),
        views: formatNumber(item.statistics.viewCount),
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      }));
      
      await chrome.storage.local.set({ channels, access_token: token });
    }
  } catch (error) {
    console.error('Failed to fetch channels:', error);
  }
}

async function getVideoData(videoId: string) {
  const stored = await chrome.storage.local.get('access_token');
  if (!stored.access_token) return { error: 'Not authenticated' };

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}`,
      { headers: { Authorization: `Bearer ${stored.access_token}` } }
    );
    const data = await response.json();
    return data.items?.[0] || { error: 'Video not found' };
  } catch (error) {
    return { error: 'Failed to fetch video data' };
  }
}

async function getStudioData() {
  return { error: 'Not implemented' };
}

function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

interface ChannelData {
  id: string;
  title: string;
  subscribers: string;
  views: string;
  thumbnail: string;
}