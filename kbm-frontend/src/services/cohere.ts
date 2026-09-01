import axios from 'axios';

const COHERE_API_URL = 'https://api.cohere.com/v2/chat';

const getCohereApiKey = (): string => {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Cohere API key is missing. Add VITE_COHERE_API_KEY to .env.local.'
    );
  }

  return apiKey;
};

export interface CohereMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CohereResponse {
  message?: {
    role?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  };
}

export const CohereService = {
  sendMessage: async (
    messages: CohereMessage[]
  ): Promise<string> => {
    const response = await axios.post<CohereResponse>(
      COHERE_API_URL,
      {
        model: 'command-a-plus-05-2026',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${getCohereApiKey()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data.message?.content
      ?.find((item) => item.type === 'text')
      ?.text;

    if (!text) {
      throw new Error('Cohere returned an empty response.');
    }

    return text;
  },
};