export type ModelProvider = 
  | 'Groq'
  | 'Anthropic'
  | 'OpenRouter'
  | 'Google'
  | 'Cohere'
  | 'Deepseek'
  | 'HuggingFace'
  | 'Hyperbolic'
  | 'Mistral'
  | 'Ollama'
  | 'OpenAI'
  | 'Perplexity';

export interface ModelConfig {
  provider: ModelProvider;
  requiresApiKey: boolean;
  apiKey?: string;
}