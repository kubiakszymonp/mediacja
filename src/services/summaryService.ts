// import { mockLLMService, Message } from "./mockLLMService";
import { llmService, Message } from "./llmService";

export interface ConversationPayload {
  currentParticipant: string;
  currentTranscript: string;
  allTranscripts: {
    participant: string;
    transcripts: string[];
  }[];
  allSummaries: {
    participant: string;
    summary: string;
  }[];
}

export interface ParticipantSummaryPayload {
  participantName: string;
  currentSummary: string;
  lastTenMessages: {
    participant: string;
    text: string;
    timestamp: Date;
  }[];
}

export interface SummaryResult {
  text: string;
  timestamp: Date;
}

export class SummaryService {
  private readonly systemPrompt = `Jesteś ekspertem w tworzeniu zwięzłych i precyzyjnych podsumowań.
Twoim zadaniem jest przeanalizowanie kontekstu konwersacji i stworzenie spójnego podsumowania.
Podsumowanie powinno być napisane w formie płynnego tekstu, który zawiera najważniejsze informacje z konwersacji.
Unikaj punktowania i list - skup się na stworzeniu logicznie powiązanego tekstu.
Wyciągaj wnioski ale nie dodawaj zbędnych informacji. Tylko podsumowanie tego co zostało powiedziane. Nie dodawaj żadnych rozwiązań sytuacji.
Odpowiedz zwykłym tekstem, bez formatowania JSON. Napisz podsumowanie w kontekście AKTUALNEGO UCZESTNIKA. nie dodawaj za dużo informacji o innych uczestnikach. Przyjmij perspektywę uczestnika. 
Jeżeli w trakcie rozmowy  zostały podjęte jakieś decyzje albo zmiany zdania zapisz to też w podsumowaniu. Ma to być podsumowanie w kontekście aktualnego uczestnika.`;

  public async generateSummary(
    payload: ParticipantSummaryPayload
  ): Promise<SummaryResult> {
    try {
      // Formatujemy payload w czytelny tekst
      const formattedPayload = this.formatPayload(payload);

      const messages: Message[] = [
        {
          role: "system",
          content: this.systemPrompt,
        },
        {
          role: "user",
          content: `${formattedPayload}`,
        },
      ];

      const response = await llmService.sendMessage(messages);

      return {
        text: response.content.trim(),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Błąd podczas generowania podsumowania:", error);
      throw error;
    }
  }

  private formatPayload(payload: ParticipantSummaryPayload): string {
    let formatted = `Aktualny uczestnik: ${payload.participantName}\n\n`;

    formatted += "Ostatnie wiadomości (od najstarszej do najnowszej):\n";
    payload.lastTenMessages.forEach((message, index) => {
      const timestamp = new Date(message.timestamp).toLocaleTimeString();
      formatted += `${index + 1}. [${timestamp}] ${message.participant}: ${
        message.text
      }\n`;
    });

    formatted += "\nAktualne podsumowanie jako punkt odniesienia:\n";
    formatted += payload.currentSummary;

    return formatted;
  }
}

export const summaryService = new SummaryService();
