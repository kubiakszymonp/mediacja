import OpenAI from 'openai';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class LLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  public async sendMessage(messages: Message[]): Promise<LLMResponse> {
    try {
      // Logujemy wszystkie wiadomości przychodzące
      console.group("📥 Otrzymane wiadomości:");
      messages.forEach((msg, index) => {
        console.log(`[${msg.role.toUpperCase()}] ${index + 1}:`, msg.content);
      });
      console.groupEnd();

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0,
      });

      const result: LLMResponse = {
        content: response.choices[0].message.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };

      // Logujemy odpowiedź
      console.group("📤 Wygenerowana odpowiedź:");
      console.log("Treść:", result.content);
      console.log("Użycie tokenów:", result.usage);
      console.groupEnd();

      return result;
    } catch (error) {
      console.error('❌ Błąd podczas komunikacji z modelem językowym:', error);
      throw error;
    }
  }
}

export const llmService = new LLMService(); 