@echo off
title YTAnalytics Pro - One Click Start
chcp 65001 >nul

echo ============================================
echo   YTAnalytics Pro - Inicializacao Unica
echo ============================================
echo.

REM Verifica Node.js
echo [1/7] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale em: https://nodejs.org (versao 20+)
    pause
    exit /b 1
)
echo OK: Node.js detectado

REM Verifica npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: npm nao encontrado!
    pause
    exit /b 1
)

REM Registry mais rapido
echo.
echo [2/7] Configurando registry npm...
npm config set registry https://registry.npmmirror.com

REM Instala dependencias raiz
echo.
echo [3/7] Instalando dependencias (pode levar 3-5 min)...
echo Aguarde...
npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline 2>&1 | findstr /v "warn deprecated"

REM Shared
echo.
echo [4/7] Instalando shared...
cd packages\shared
npm install --legacy-peer-deps --no-audit --no-fund 2>&1 | findstr /v "warn deprecated"
cd ..\..

REM App
echo.
echo [5/7] Instalando app + banco de dados...
cd packages\app
npm install --legacy-peer-deps --no-audit --no-fund 2>&1 | findstr /v "warn deprecated"

echo.
echo Configurando Prisma...
npm run db:generate
npm run db:push
cd ..\..

REM Extension
echo.
echo [6/7] Build da extension...
cd packages\extension
npm install --legacy-peer-deps --no-audit --no-fund 2>&1 | findstr /v "warn deprecated"
npm run build
cd ..\..

echo.
echo [7/7] Tudo pronto!
echo.
echo ============================================
echo  INICIANDO SERVIDOR APP...
echo ============================================
echo.
echo App:        http://localhost:3000
echo.
echo EXTENSION: o build ja foi gerado em:
echo   packages\extension\dist
echo.
echo Para carregar no Chrome:
echo   1. Abra chrome://extensions
echo   2. Ative o Modo desenvolvedor (canto sup. direito)
echo   3. Clique em "Carregar sem compactacao"
echo   4. Selecione a pasta: packages\extension\dist
echo.
echo Pressione Ctrl+C para parar o servidor
echo ============================================
echo.

REM Inicia o app
start "YTAnalytics App" cmd /k "cd /d packages\app && npm run dev"

echo Servidor iniciado em janela separada.
echo Feche esta janela quando quiser parar tudo.
pause