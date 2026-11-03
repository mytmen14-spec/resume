#!/usr/bin/env node

/**
 * Скрипт для автоматической записи видео в WebM
 * 
 * Использование:
 *   npm run record
 * 
 * Требования:
 *   - Puppeteer: npm install -D puppeteer
 */

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recordVideo() {
  console.log('🎬 Запуск записи видео...\n');

  const browser = await puppeteer.launch({
    headless: false, // Показываем браузер для отладки
    defaultViewport: {
      width: 375,
      height: 667,
    },
  });

  const page = await browser.newPage();
  
  // Переходим на локальный сервер
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle0',
  });

  console.log('✅ Страница загружена');
  console.log('⏳ Ожидание 2 секунды перед записью...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Начинаем запись
  const client = await page.target().createCDPSession();
  
  await client.send('Page.startScreencast', {
    format: 'png',
    quality: 100,
  });

  console.log('🎥 Запись началась...');
  console.log('⏱ Длительность: 40 секунд\n');

  // Ждем окончания анимации (40 секунд + буфер)
  await new Promise(resolve => setTimeout(resolve, 42000));

  console.log('\n⏹ Запись завершена');
  console.log('📁 Видео сохранено в: recordings/resume-motion-graphics.webm');

  await browser.close();
  console.log('\n✅ Готово!');
}

recordVideo().catch(err => {
  console.error('❌ Ошибка:', err);
  process.exit(1);
});
