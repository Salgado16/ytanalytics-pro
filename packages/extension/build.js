const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const outDir = path.join(__dirname, 'dist');
  
  // Clean dist
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  // Copy manifest (inject real OAuth client id from env if provided)
  const oauthClientId = process.env.GOOGLE_CLIENT_ID || '';
  let manifestText = fs.readFileSync(
    path.join(__dirname, 'manifest.json'),
    'utf8'
  );
  if (oauthClientId) {
    manifestText = manifestText.replace(
      'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      oauthClientId
    );
  }
  fs.writeFileSync(path.join(outDir, 'manifest.json'), manifestText);

  // Copy popup HTML
  fs.copyFileSync(
    path.join(__dirname, 'public', 'popup.html'),
    path.join(outDir, 'popup.html')
  );

  // Copy content CSS
  fs.copyFileSync(
    path.join(__dirname, 'public', 'content.css'),
    path.join(outDir, 'content.css')
  );

  // Build background
  await esbuild.build({
    entryPoints: ['src/entrypoints/background.ts'],
    bundle: true,
    outfile: path.join(outDir, 'background.js'),
    platform: 'node',
    format: 'esm',
    target: 'chrome100',
    external: ['chrome'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // Build popup
  await esbuild.build({
    entryPoints: ['src/entrypoints/popup/main.ts'],
    bundle: true,
    outfile: path.join(outDir, 'popup.js'),
    platform: 'browser',
    format: 'iife',
    target: 'chrome100',
    globalName: 'PopupApp',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // Build content script
  await esbuild.build({
    entryPoints: ['src/entrypoints/content.ts'],
    bundle: true,
    outfile: path.join(outDir, 'content.js'),
    platform: 'browser',
    format: 'iife',
    target: 'chrome100',
    globalName: 'ContentScript',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // Build studio content
  await esbuild.build({
    entryPoints: ['src/entrypoints/studio-content.ts'],
    bundle: true,
    outfile: path.join(outDir, 'studio-content.js'),
    platform: 'browser',
    format: 'iife',
    target: 'chrome100',
    globalName: 'StudioContentScript',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // Copy content CSS
  fs.copyFileSync(
    path.join(__dirname, 'public', 'content.css'),
    path.join(outDir, 'content.css')
  );

  console.log('✅ Extension built successfully in dist/');
}

build().catch(() => process.exit(1));