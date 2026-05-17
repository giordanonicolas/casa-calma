@echo off
setlocal enabledelayedexpansion
title Casa Calma - Migracion Supabase

cd /d "C:\Users\PerGio\Documents\CasaCalma\WEBCC"
echo.
echo ========================================
echo  Casa Calma - Migracion Supabase
echo  Directorio: %CD%
echo ========================================
echo.

:: ── Detectar CLI de Supabase ────────────────────────────
echo [1/4] Verificando Supabase CLI...
supabase --version 2>nul
if errorlevel 1 (
    echo   supabase no encontrado en PATH, buscando alternativas...
    where /q npx 2>nul
    if errorlevel 1 (
        echo   ERROR: ni supabase ni npx encontrados.
        echo   Instala Supabase CLI desde https://supabase.com/docs/guides/cli
        pause
        exit /b 1
    )
    set SUPA=npx supabase
    echo   Usando: npx supabase
) else (
    set SUPA=supabase
    echo   Usando: supabase
)

:: ── Inicializar proyecto si hace falta ──────────────────
echo.
echo [2/4] Inicializando proyecto Supabase (si no existe config.toml)...
if not exist "supabase\config.toml" (
    %SUPA% init --with-intellij-settings false --with-vscode-settings false
    if errorlevel 1 (
        echo   WARNING: supabase init tuvo un problema, continuando...
    )
) else (
    echo   config.toml ya existe, saltando init.
)

:: ── Linkear proyecto ────────────────────────────────────
echo.
echo [3/4] Linkeando con el proyecto remoto...
%SUPA% link --project-ref zcmvjouuunxyejhzxsbc
if errorlevel 1 (
    echo.
    echo   ERROR al linkear. Puede ser que ya este linkeado o necesite login.
    echo   Intentando push de todas formas...
)

:: ── Aplicar migracion ───────────────────────────────────
echo.
echo [4/4] Aplicando migracion SQL...
echo   Archivo: supabase\migrations\20260516220000_admin_and_stock.sql
%SUPA% db push
if errorlevel 1 (
    echo.
    echo ========================================
    echo  ERROR: La migracion fallo.
    echo  Revisa los mensajes de arriba.
    echo ========================================
) else (
    echo.
    echo ========================================
    echo  MIGRACION APLICADA EXITOSAMENTE
    echo ========================================
)

echo.
pause
