const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

console.log('🚀 YTAnalytics Pro - Setup Automático\n');

function run(cmd, cwd = rootDir) {
  console.log(`$ ${cmd}`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit', shell: true });
    return true;
  } catch (e) {
    console.error(`❌ Falhou: ${cmd}`);
    return false;
  }
}

function fileExists(p) {
  return fs.existsSync(path.join(rootDir, p));
}

// 1. Verifica Node
const nodeVersion = process.version;
console.log(`📦 Node: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1).split('.')[0]) < 20) {
  console.error('❌ Node 20+ necessário');
  process.exit(1);
}

// 2. Verifica PostgreSQL
console.log('\n🐘 Verificando PostgreSQL...');
try {
  execSync('pg_isready', { stdio: 'ignore' });
  console.log('✅ PostgreSQL rodando');
} catch {
  console.log('⚠️  PostgreSQL não detectado localmente');
  console.log('   Opções:');
  console.log('   1. Docker: docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ytanalytics_pro -p 5432:5432 postgres:15');
  console.log('   2. Instale localmente ou use Railway/Supabase/Neon');
}

// 3. .env
console.log('\n🔧 Configurando .env...');
const envExample = path.join(rootDir, 'packages/app/.env.example');
const envFile = path.join(rootDir, 'packages/app/.env');

if (!fileExists('packages/app/.env')) {
  if (fileExists('packages/app/.env.example')) {
    fs.copyFileSync(envExample, envFile);
    console.log('✅ .env criado a partir do .env.example');
    console.log('   ⚠️  EDITE packages/app/.env com suas chaves antes de continuar!');
  }
} else {
  console.log('✅ .env já existe');
}

// 4. Instala dependências
console.log('\n📦 Instalando dependências (pode demorar 2-5 min)...');
const registry = 'https://registry.npmmirror.com';
run(`npm config set registry ${registry}`);

const installCmd = 'npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline';
if (!run(installCmd)) {
  console.log('\n⚠️  Tentando com yarn...');
  run('npm install -g yarn');
  run('yarn install');
}

// 5. Prisma
console.log('\n🗄️  Setup Prisma...');
run('npm run db:generate', path.join(rootDir, 'packages/app'));
run('npm run db:push', path.join(rootDir, 'packages/app'));

// 6. Build extension
console.log('\n🔧 Build da extension...');
run('npm run build', path.join(rootDir, 'packages/extension'));

console.log('\n' + '='.repeat(50));
console.log('✅ SETUP CONCLUÍDO!');
console.log('='.repeat(50));
console.log('\n📝 PRÓXIMOS PASSOS OBRIGATÓRIOS:');
console.log('1. Edite packages/app/.env com suas chaves:');
console.log('   - DATABASE_URL (PostgreSQL)');
console.log('   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET');
console.log('   - YOUTUBE_API_KEY');
console.log('   - PIXABAY_API_KEY / PEXELS_API_KEY');
console.log('   - NEXTAUTH_SECRET (gere: openssl rand -base64 32)');
console.log('\n2. Google Cloud Console:');
console.log('   - Ative YouTube Data API v3 + YouTube Analytics API');
console.log('   - OAuth 2.0 → Redirect: http://localhost:3000/api/auth/callback/google');
console.log('\n3. Rode o projeto:');
console.log('   npm run dev        # App (3000) + Extension');
console.log('   # ou separadamente:');
console.log('   npm run dev:app');
console.log('   npm run dev:extension');
console.log('\n4. Extension no Chrome:');
console.log('   chrome://extensions → Modo desenvolvedor');
console.log('   Carregar sem compactação → packages/extension/dist');
console.log('\n📖 Documentação completa: README.md');