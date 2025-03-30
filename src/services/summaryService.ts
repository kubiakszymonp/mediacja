import { mockLLMService, Message } from './mockLLMService';

export interface SummaryResult {
  points: string[];
  timestamp: Date;
}

export class SummaryService {
  private readonly systemPrompt = `Jesteś ekspertem w tworzeniu zwięzłych i precyzyjnych podsumowań.
Twoim zadaniem jest przeanalizowanie transkrypcji i wyciągnięcie z niej najważniejszych punktów.
Każdy punkt powinien być krótki, konkretny i zawierać kluczowe informacje.
Odpowiedz w formacie JSON z tablicą punktów.`;

  public async generateSummary(transcription: string): Promise<SummaryResult> {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: `Przeanalizuj poniższą transkrypcję i wygeneruj listę najważniejszych punktów:\n\n${transcription}`,
        },
      ];

      const response = await mockLLMService.sendMessage(messages);
      
      // Próbujemy sparsować odpowiedź jako JSON
      let points: string[];
      try {
        points = JSON.parse(response.content);
      } catch (error) {
        // Jeśli nie udało się sparsować JSON, dzielimy tekst na linie
        points = response.content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.startsWith('[') && !line.startsWith(']'));
      }

      return {
        points,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Błąd podczas generowania podsumowania:', error);
      throw error;
    }
  }
}

export const summaryService = new SummaryService(); 