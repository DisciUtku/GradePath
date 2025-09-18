@echo off
setlocal ENABLEEXTENSIONS

REM Proje klasörüne geç
pushd "%~dp0"

REM Python kontrolü
python -V >nul 2>&1
if errorlevel 1 (
  echo Python bulunamadi. Lutfen Python 3 kurulu ve PATH'te oldugundan emin olun.
  pause
  exit /b 1
)

set "PORT=5173"
echo Yerel sunucu baslatiliyor: http://127.0.0.1:%PORT%

REM Tarayiciyi ac (varsayilan)
start "" http://127.0.0.1:%PORT%

REM Sunucuyu calistir
python -m http.server %PORT%

popd
endlocal

