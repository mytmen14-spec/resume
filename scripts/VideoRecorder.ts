/**
 * Утилита для записи видео в формате WebM
 * Использует getDisplayMedia API (встроен в Chrome/Firefox/Edge)
 */

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private _isRecording = false;

  get isRecording(): boolean {
    return this._isRecording;
  }

  async startRecording(): Promise<void> {
    this.chunks = [];

    try {
      // Запрашиваем захват экрана/вкладки
      this.stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: {
          cursor: 'never',
          displaySurface: 'browser',
        } as any,
        audio: false,
      });

      // Определяем поддерживаемый формат
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(this.stream!, {
        mimeType,
        videoBitsPerSecond: 5000000,
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

      // Если пользователь остановил запись через браузер
      if (this.stream) {
        this.stream.getVideoTracks()[0].onended = () => {
          this.stopRecording();
        };
      }

      this.mediaRecorder.start(100);
      this._isRecording = true;
      console.log('🎬 Запись началась...');
    } catch (err) {
      console.error('Ошибка при запуске записи:', err);
      this.cleanup();
      throw err;
    }
  }

  stopRecording(): void {
    this._isRecording = false;

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      console.log('⏹ Запись остановлена');
    }
  }

  private downloadVideo(): void {
    if (this.chunks.length === 0) {
      console.warn('Нет данных для сохранения');
      return;
    }

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
    }, 1000);

    console.log('✅ Видео сохранено: resume-motion-graphics.webm');
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }
}

export const videoRecorder = new VideoRecorder();
