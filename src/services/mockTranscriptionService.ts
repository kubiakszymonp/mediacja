import { downloadAudioBlob } from "./downloadAudioBlob";

export interface TranscriptionResult {
  text: string;
  timestamp: Date;
}

export class MockTranscriptionService {
  public async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    return downloadAudioBlob(audioBlob);
  }
}

export const mockTranscriptionService = new MockTranscriptionService();
