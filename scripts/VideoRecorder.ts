/**
 * Скрипт для записи видео в формате WebM
 * Использует MediaRecorder API браузера
 */

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(element: HTMLElement): Promise<void> {
    try {
      // Захватываем поток с элемента
      this.stream = await this.captureStream(element);
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000 // 5 Mbps для хорошего качества
      });

      this.chunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.downloadVideo();
        this.cleanup();
      };

      this.mediaRecorder.start(100); // Собираем данные каждые 100мс
      console.log('🎬 Запись началась...');
    } catch (err) {
      console.error('Ошибка при запуске записи:', err);
      throw err;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      console.log('⏹ Запись остановлена');
    }
  }

  private async captureStream(element: HTMLElement): Promise<MediaStream> {
    // Используем captureStream для захвата canvas/video элемента
    // Для обычных div элементов используем html2canvas или аналог
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры canvas
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;

    // Создаем поток из canvas
    const stream = canvas.captureStream(30); // 30 FPS

    // Функция для рендеринга элемента на canvas
    const renderFrame = async () => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        // Используем html2canvas для рендеринга
        try {
          const html2canvas = (await import('html2canvas')).default;
          const renderedCanvas = await html2canvas(element, {
            scale: 2, // Увеличиваем для лучшего качества
            useCORS: true,
            logging: false
          });
          ctx?.drawImage(renderedCanvas, 0, 0, canvas.width, canvas.height);
        } catch (err) {
          console.error('Ошибка рендеринга:', err);
        }
        requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
    return stream;
  }

  private downloadVideo(): void {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'resume-motion-graphics.webm';
    document.body.appendChild(a);
    a.click();
    
    // Очищаем
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    console.log('✅ Видео сохранено: resume-motion-graphics.webm');
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}

// Экспортируем singleton
export const videoRecorder = new VideoRecorder();
