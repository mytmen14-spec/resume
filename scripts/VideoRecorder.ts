/**
 * Утилита для записи видео в формате WebM
 * Работает через html2canvas + MediaRecorder API
 */
import html2canvas from 'html2canvas';

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private animationId: number | null = null;
  private element: HTMLElement | null = null;
  private _isRecording = false;

  get isRecording(): boolean {
    return this._isRecording;
  }

  async startRecording(element: HTMLElement): Promise<void> {
    this.element = element;
    this.chunks = [];

    // Создаем canvas для захвата кадров
    this.canvas = document.createElement('canvas');
    const scale = 2; // 2x для лучшего качества
    this.canvas.width = element.offsetWidth * scale;
    this.canvas.height = element.offsetHeight * scale;

    const ctx = this.canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    // Создаем поток из canvas
    const stream = this.canvas.captureStream(30); // 30 FPS

    // Определяем поддерживаемый формат
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5000000, // 5 Mbps
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this._isRecording = false;
      this.downloadVideo();
      this.cleanup();
    };

    this.mediaRecorder.start(100);
    this._isRecording = true;

    // Запускаем цикл рендеринга кадров
    const captureFrame = async () => {
      if (!this._isRecording || !this.element || !this.canvas) return;

      try {
        const rendered = await html2canvas(this.element, {
          scale: 1,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: this.element.offsetWidth,
          height: this.element.offsetHeight,
        });
        ctx.drawImage(rendered, 0, 0, this.element.offsetWidth, this.element.offsetHeight);
      } catch (err) {
        console.error('Ошибка рендеринга кадра:', err);
      }

      this.animationId = requestAnimationFrame(captureFrame);
    };

    captureFrame();
    console.log('🎬 Запись началась...');
  }

  stopRecording(): void {
    this._isRecording = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      console.log('⏹ Запись остановлена');
    }
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

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    console.log('✅ Видео сохранено: resume-motion-graphics.webm');
  }

  private cleanup(): void {
    this.canvas = null;
    this.element = null;
    this.mediaRecorder = null;
  }
}

export const videoRecorder = new VideoRecorder();
