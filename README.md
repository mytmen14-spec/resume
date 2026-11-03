# 🎬 Резюме за 40 секунд — Motion Graphics

Анимированное видео в формате 9:16 (вертикальное) о правилах создания эффективного резюме.

## ⚡ Быстрый старт — Запись видео в WebM

### Mac/Linux:

```bash
chmod +x export-webm.sh
./export-webm.sh
open webm-export/index.html
```

### Windows:

```cmd
export-webm.bat
start webm-export\index.html
```

Затем нажмите кнопку **"🎬 Записать видео"** в браузере Chrome.

**Подробная инструкция:** [webm-export/README.md](webm-export/README.md)

---

## 🚀 Разработка

### Установка

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Откройте: http://localhost:5173

### Сборка для продакшена

```bash
npm run build
```

---

## 📁 Структура проекта

```
├── src/
│   ├── App.tsx              # Основной компонент с анимациями
│   ├── main.tsx             # Точка входа
│   └── index.css            # Стили и анимации
├── scripts/
│   └── VideoRecorder.ts     # Утилита для записи видео в WebM
├── webm-export/
│   └── README.md            # Инструкция по экспорту видео
├── dist/                    # Собранные файлы (после npm run build)
├── export-webm.sh           # Скрипт экспорта (Mac/Linux)
├── export-webm.bat          # Скрипт экспорта (Windows)
├── SAVE-WEBM.md             # Краткая инструкция
├── index.html
├── package.json
├── vite.config.js
└── tsconfig.json
```

---

## 🎥 Экспорт видео в WebM

### Способ 1: Автоматический (рекомендуется)

```bash
# Mac/Linux
./export-webm.sh

# Windows
export-webm.bat
```

Скрипт создаст папку `webm-export/` с готовыми файлами. Откройте `webm-export/index.html` в Chrome и нажмите кнопку записи.

### Способ 2: Вручную

```bash
npm run build
# Откройте dist/index.html в Chrome
# Нажмите "🎬 Записать видео"
```

---

## 🎨 Технические детали

- **Формат видео:** 9:16 (вертикальное)
- **Длительность:** 40 секунд
- **Стиль:** Flat 2D vector animation
- **Цвета:**
  - Красный: `#E11D48`
  - Зелёный: `#16A34A`
- **Шрифт:** Inter (sans-serif)
- **Формат экспорта:** WebM (VP9, 5 Mbps, 30 FPS)

---

## 📋 Сценарий видео

| Время | Сцена |
|-------|-------|
| 0–5s | Вступление с заголовком |
| 3–6s | Три правила (карточки) |
| 6–16s | Правило 1: Одна должность |
| 16–26s | Правило 2: Цифры вместо обязанностей |
| 26–36s | Правило 3: Контакты сверху |
| 36–40s | Финал: "ОТКЛИК БУДЕТ" |

---

## 🛠 Технологии

- React 18
- TypeScript
- Vite
- Tailwind CSS
- html2canvas (для записи видео)
- MediaRecorder API (WebM экспорт)

---

## 📝 Лицензия

MIT
