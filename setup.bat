@echo off
title YTAnalytics Pro - Quick Start
echo ============================================
echo  YTAnalytics Pro - Quick Start
echo ============================================
echo.

echo [1/5] Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado. Instale em nodejs.org
    pause
    exit /b 1
)

echo.
echo [2/5] Configurando registry npm (mais rapido)...
npm config set registry https://registry.npmmirror.com

echo.
echo [3/5] Instalando dependencias...
echo Isso pode levar 2-5 minutos...
npm install --legacy-peer-deps --no-audit --no-fund

echo.
echo [4/5] Setup do banco de dados...
cd packages\app
npm run db:generate
npm run db:push
cd ..\..

echo.
echo [5/5] Build da extension...
cd packages\extension
npm run build
cd ..\..

echo.
echo ============================================
echo  SETUP CONCLUIDO!
echo ============================================
echo.
echo IMPORTANTE: Edite packages\app\.env com suas chaves:
echo   - DATABASE_URL
echo   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET  
echo   - YOUTUBE_API_KEY
echo   - PIXABAY_API_KEY / PEXELS_API_KEY
echo   - NEXTAUTH_SECRET
echo.
echo Para rodar:
echo   npm run dev
echo.
echo Extension no Chrome:
echo   chrome://extensions -> Modo desenvolvedor
echo   Carregar sem compactacao -> packages\extension\dist
echo.
pause