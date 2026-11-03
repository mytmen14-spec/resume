#!/bin/bash

# Скрипт для экспорта видео в WebM без установки
# Использование: ./export-webm.sh

echo "🎬 Экспорт видео в WebM..."
echo ""

# Собираем проект
echo "📦 Сборка проекта..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки!"
    exit 1
fi

echo "✅ Сборка завершена"
echo ""

# Создаем папку webm-export если её нет
mkdir -p webm-export

# Копируем файлы из dist в webm-export
echo "📋 Копирование файлов в webm-export/..."
cp -r dist/* webm-export/

# Копируем README
cp webm-export/README.md webm-export/README.md 2>/dev/null || true

echo "✅ Файлы скопированы"
echo ""
echo "🎉 Готово!"
echo ""
echo "📁 Теперь откройте папку webm-export/ и запустите:"
echo "   open webm-export/index.html"
echo ""
echo "📹 Или сразу в Chrome:"
echo "   google-chrome webm-export/index.html"
echo ""
echo "🎬 Нажмите кнопку 'Записать видео' и получите WebM файл!"
