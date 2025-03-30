import { LLMResponse } from './llmService';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class MockLLMService {
  public async sendMessage(messages: Message[]): Promise<LLMResponse> {
    try {
      // Logujemy wszystkie wiadomości przychodzące
      console.group('📥 Otrzymane wiadomości:');
      messages.forEach((msg, index) => {
        console.log(`[${msg.role.toUpperCase()}] ${index + 1}:`, msg.content);
      });
      console.groupEnd();

      // Symulujemy opóźnienie sieciowe
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generujemy przykładową odpowiedź
      const mockResponse: LLMResponse = {
        content: JSON.stringify([
          "To jest przykładowy punkt podsumowania 1",
          "To jest przykładowy punkt podsumowania 2",
          "To jest przykładowy punkt podsumowania 3"
        ]),
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150
        }
      };

      // Logujemy odpowiedź
      console.group('📤 Wygenerowana odpowiedź:');
      console.log('Treść:', mockResponse.content);
      console.log('Użycie tokenów:', mockResponse.usage);
      console.groupEnd();

      return mockResponse;
    } catch (error) {
      console.error('❌ Błąd w mock LLM:', error);
      throw error;
    }
  }
}

export const mockLLMService = new MockLLMService(); 