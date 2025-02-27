
import { ModelProvider } from '@/types/models';

// API endpoints for different providers
const API_ENDPOINTS: Record<ModelProvider, string> = {
  Google: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent',
  OpenAI: 'https://api.openai.com/v1/chat/completions',
  Anthropic: 'https://api.anthropic.com/v1/messages',
  Groq: 'https://api.groq.com/openai/v1/chat/completions',
  OpenRouter: 'https://openrouter.ai/api/v1/chat/completions',
  Cohere: 'https://api.cohere.ai/v1/generate',
  Deepseek: 'https://api.deepseek.com/v1/chat/completions',
  HuggingFace: 'https://api-inference.huggingface.co/models',
  Hyperbolic: 'https://api.hyperbolic.ai/v1/chat/completions',
  Mistral: 'https://api.mistral.ai/v1/chat/completions',
  Ollama: 'http://localhost:11434/api/chat',
  Perplexity: 'https://api.perplexity.ai/chat/completions'
};

// Map API request parameters for each provider
export const createApiRequest = async (
  provider: ModelProvider,
  messages: { role: 'user' | 'assistant'; content: string }[],
  apiKey: string
) => {
  if (!apiKey) {
    throw new Error(`API key for ${provider} is required.`);
  }

  // Default headers for fetch requests
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let body: any;
  let endpoint = API_ENDPOINTS[provider];

  switch (provider) {
    case 'Google':
      headers['x-goog-api-key'] = apiKey;
      
      // Format messages for Gemini
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      body = {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      };
      break;
      
    case 'OpenAI':
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      };
      break;
      
    // Additional providers would be configured here
    default:
      throw new Error(`Provider ${provider} is not implemented yet.`);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API error (${response.status}): ${errorData ? JSON.stringify(errorData) : response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the response text based on the provider
    let responseText = '';
    
    switch (provider) {
      case 'Google':
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
        break;
        
      case 'OpenAI':
        responseText = data.choices?.[0]?.message?.content || 'No response generated';
        break;
        
      // Handle other providers here
      default:
        responseText = 'Unsupported provider response';
    }
    
    return responseText;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
