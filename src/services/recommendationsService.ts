import { llmService, Message } from "./llmService";

export interface RecommendationsPayload {
  targetParticipant: string;
  allSummaries: {
    participant: string;
    summary: string;
  }[];
}

export interface RecommendationResult {
  text: string;
  timestamp: Date;
}

export class RecommendationsService {
  private readonly systemPrompt = `Jesteś ekspertem w analizie sytuacji konfliktowych i mediacji.
Twoim zadaniem jest przeanalizowanie podsumowań wszystkich uczestników i stworzenie konkretnych rekomendacji dla wskazanego uczestnika.
Rekomendacje powinny być bardzo zwięzłe, praktyczne, konkretne i ukierunkowane na rozwiązanie konfliktu. Nie dodawaj zbędnych informacji. Rekomendacje nie powinny być długie i ogranicz ich liczbę do najistitniejszych i czekaj na dalszy rozwój sytuacji.
Odpowiedz uzywając ciągłego tekstu HTML. Bez dodatkowych znaczników na początku i końcu - po prostu HTML między elementami div <div>treść</div>`;

  public async generateRecommendations(
    payload: RecommendationsPayload
  ): Promise<RecommendationResult> {
    try {
      console.log(`[RecommendationsService] Rozpoczynam generowanie rekomendacji dla uczestnika: ${payload.targetParticipant}`);
      console.log(`[RecommendationsService] Liczba podsumowań do analizy: ${payload.allSummaries.length}`);

      const formattedPayload = this.formatPayload(payload);
      console.log(`[RecommendationsService] Sformatowane podsumowania: ${formattedPayload.length} znaków`);

      const messages: Message[] = [
        {
          role: "system",
          content: this.systemPrompt,
        },
        {
          role: "user",
          content: `Przeanalizuj poniższe podsumowania wszystkich uczestników i stwórz bardzo zwięzłą rekomendację rekomendacje do rozwiązania konfliktu dla uczestnika ${payload.targetParticipant}.
          Rekomendacje powinny być praktyczne i ukierunkowane na rozwiązanie konfliktu.
          Odpowiedz bezposrednio zwracając się do uczestnika ${payload.targetParticipant}. Nie dodawaj dodatkowych informacji.
          Jeżeli w podsumowaniu jest informacja o jakichś podjętych akcjach albo ustaleniach weź je pod uwagę w rekomendacji.
          Traktuj podsumowanie jako trwające w czasie rozważania sytuacji. Jeżeli w trakcie rozmowy zostały podjęte jakieś decyzje, to traktuj je jako aktualne i nie wracaj do stanu sprzed podjęcia decyzji.
          Te podsumowania są zapisywane w czasie rzeczywistym, więc nie zwracaj się do stanu sprzed podjęcia decyzji.
          \n\n${formattedPayload}`,
        },
      ];

      console.log(`[RecommendationsService] Wysyłanie zapytania do LLM...`);
      const response = await llmService.sendMessage(messages);
      console.log(`[RecommendationsService] Otrzymano odpowiedź z LLM, długość: ${response.content.length} znaków`);

      const result = {
        text: response.content.trim(),
        timestamp: new Date(),
      };

      console.log(`[RecommendationsService] Pomyślnie wygenerowano rekomendacje dla ${payload.targetParticipant}`);
      return result;
    } catch (error) {
      console.error("[RecommendationsService] Błąd podczas generowania rekomendacji:", error);
      throw error;
    }
  }

  private formatPayload(payload: RecommendationsPayload): string {
    console.log(`[RecommendationsService] Formatowanie podsumowań dla ${payload.targetParticipant}`);
    let formatted = "Podsumowania wszystkich uczestników:\n\n";
    
    payload.allSummaries.forEach(({ participant, summary }) => {
      console.log(`[RecommendationsService] Dodawanie podsumowania dla ${participant}`);
      formatted += `\n${participant}:\n`;
      formatted += `${summary}\n`;
    });

    console.log(`[RecommendationsService] Zakończono formatowanie podsumowań`);
    return formatted;
  }
}

export const recommendationsService = new RecommendationsService(); 