@echo off
setlocal
title Casa Calma - Build y Push

cd /d "C:\Users\PerGio\Documents\CasaCalma\WEBCC"
echo.
echo ========================================
echo  Casa Calma - Build + Git Push
echo  Directorio: %CD%
echo ========================================
echo.

:: ── npm build ────────────────────────────────────────
echo [1/3] Ejecutando npm run build...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: npm run build fallo. No se hara push.
    pause
    exit /b 1
)
echo   Build exitoso.

:: ── git add ──────────────────────────────────────────
echo.
echo [2/3] git add y commit...
git add -A
git commit -m "feat: stock, admin panel, place_order RPC, update_order_status con devolucion de stock"
if errorlevel 1 (
    echo   Nada nuevo para commitear o error en git.
)

:: ── git push ─────────────────────────────────────────
echo.
echo [3/3] git push...
git push origin main
if errorlevel 1 (
    echo   ERROR en git push.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  LISTO - Build y push completados
echo  Vercel actualizara en ~2 minutos
echo ========================================
echo.
pause
