import OpenAI from "openai";
import { containsBlacklistedWords } from "@/utils/removeTranscriptionFromBlacklist";

export interface TranscriptionResult {
  text: string;
  timestamp: Date;
}

export class TranscriptionService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  public async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // await downloadAudioBlob(audioBlob);
      // Konwertujemy Blob na File, który jest wymagany przez API OpenAI
      const file = new File([audioBlob], "audio.wav", { type: audioBlob.type });

      const response = await this.openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        language: "pl",
      });

      console.log(`Transkrypcja: ${response.text}`);

      const ignoreTranscription = containsBlacklistedWords(response.text);

      if (ignoreTranscription) {
        return {
          text: "",
          timestamp: new Date(),
        };
      }

      return {
        text: response.text,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Błąd podczas transkrypcji:", error);
      throw error;
    }
  }
}

export const transcriptionService = new TranscriptionService();

// export const transcriptionService = new MockTranscriptionService();
