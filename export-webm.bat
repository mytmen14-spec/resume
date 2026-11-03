@echo off
REM Скрипт для экспорта видео в WebM без установки
REM Использование: export-webm.bat

echo.
echo 🎬 Экспорт видео в WebM...
echo.

REM Собираем проект
echo 📦 Сборка проекта...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки!
    pause
    exit /b 1
)

echo ✅ Сборка завершена
echo.

REM Создаем папку webm-export если её нет
if not exist "webm-export" mkdir webm-export

REM Копируем файлы из dist в webm-export
echo 📋 Копирование файлов в webm-export/...
xcopy /E /I /Y dist\* webm-export\ >nul

echo ✅ Файлы скопированы
echo.
echo 🎉 Готово!
echo.
echo 📁 Теперь откройте папку webm-export\ и запустите:
echo    start webm-export\index.html
echo.
echo 🎬 Нажмите кнопку 'Записать видео' и получите WebM файл!
echo.
pause
