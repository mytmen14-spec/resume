# Инструкция по скачиванию и использованию

## 📥 Как скачать проект

### Вариант 1: Через Git (рекомендуется)

```bash
# Клонируйте репозиторий
git clone <URL_РЕПОЗИТОРИЯ>

# Перейдите в папку проекта
cd resume-motion-graphics

# Установите зависимости
npm install
```

### Вариант 2: Скачать ZIP

1. Нажмите кнопку "Code" → "Download ZIP" на GitHub
2. Распакуйте архив
3. Откройте терминал в папке проекта
4. Выполните:

```bash
npm install
```

## 🚀 Запуск проекта

### Режим разработки

```bash
npm run dev
```

Откройте браузер: http://localhost:5173

### Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## 🎥 Запись видео в WebM

### Способ 1: Через интерфейс (простой)

1. Запустите проект: `npm run dev`
2. Откройте http://localhost:5173
3. Нажмите кнопку **"🎬 Записать видео"** в правом верхнем углу
4. Дождитесь окончания 40-секундной анимации
5. Файл `resume-motion-graphics.webm` автоматически скачается

### Способ 2: Через консоль браузера

1. Откройте DevTools (F12)
2. Перейдите во вкладку Console
3. Выполните:

```javascript
import('./scripts/VideoRecorder.ts').then(module => {
  const recorder = module.videoRecorder;
  const element = document.querySelector('[ref]');
  recorder.startRecording(element);
});
```

4. Дождитесь окончания анимации (40 секунд)
5. Видео автоматически скачается

## 📁 Структура проекта

```
resume-motion-graphics/
├── src/
│   ├── App.tsx              # Основной компонент с анимациями
│   ├── main.tsx             # Точка входа
│   └── index.css            # Стили и анимации
├── scripts/
│   └── VideoRecorder.ts     # Утилита для записи видео
├── download/
│   └── README.md            # Эта инструкция
├── dist/                    # Собранные файлы (после npm run build)
├── index.html               # HTML шаблон
├── package.json             # Зависимости и скрипты
├── vite.config.js           # Конфигурация Vite
├── tsconfig.json            # Конфигурация TypeScript
├── .gitignore               # Игнорируемые файлы
└── README.md                # Основная документация
```

## 🔧 Требования

- Node.js 16+ 
- npm 8+
- Современный браузер (Chrome, Firefox, Edge)

## 🎨 Особенности

- **Формат видео**: WebM (VP9 codec)
- **Разрешение**: 375×667px (9:16)
- **Длительность**: 40 секунд
- **Качество**: 5 Mbps
- **FPS**: 30

## 🐛 Решение проблем

### Ошибка: "MediaRecorder is not defined"

Убедитесь, что используете современный браузер. MediaRecorder API поддерживается в:
- Chrome 49+
- Firefox 29+
- Edge 79+
- Safari 14.1+

### Видео не записывается

1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что разрешили доступ к медиа
3. Попробуйте другой браузер

### Низкое качество видео

Увеличьте `videoBitsPerSecond` в `scripts/VideoRecorder.ts`:

```typescript
videoBitsPerSecond: 8000000 // 8 Mbps
```

## 📝 Лицензия

MIT
