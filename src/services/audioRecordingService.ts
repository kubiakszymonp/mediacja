export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  public async startRecording(): Promise<void> {
    try {
      if (this.mediaRecorder?.state === 'recording') {
        throw new Error('Nagrywanie jest już aktywne');
      }

      // Resetujemy chunki audio
      this.audioChunks = [];

      // Pobieramy dostęp do mikrofonu
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Tworzymy nowy MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm', // Format kompatybilny z większością przeglądarek
      });

      // Obsługa danych audio
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Rozpoczynamy nagrywanie
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Błąd podczas rozpoczynania nagrywania:', error);
      throw error;
    }
  }

  public async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
        reject(new Error('Nagrywanie nie jest aktywne'));
        return;
      }

      // Obsługa zakończenia nagrywania
      this.mediaRecorder.onstop = () => {
        // Łączymy wszystkie chunki w jeden Blob
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Zatrzymujemy wszystkie ścieżki audio
        this.stream?.getTracks().forEach(track => track.stop());
        
        // Resetujemy stan
        this.stream = null;
        this.mediaRecorder = null;
        this.audioChunks = [];

        resolve(audioBlob);
      };

      // Zatrzymujemy nagrywanie
      this.mediaRecorder.stop();
    });
  }

  public isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  public async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audioinput');
    } catch (error) {
      console.error('Błąd podczas pobierania listy urządzeń audio:', error);
      throw error;
    }
  }
}

export const audioRecordingService = new AudioRecordingService(); 