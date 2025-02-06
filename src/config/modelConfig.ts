import { ModelProvider } from '@/types/models';

export const modelProviders: ModelProvider[] = [
  'Groq',
  'Anthropic',
  'OpenRouter',
  'Google',
  'Cohere',
  'Deepseek',
  'HuggingFace',
  'Hyperbolic',
  'Mistral',
  'Ollama',
  'OpenAI',
  'Perplexity'
];

export const getProviderColor = (provider: ModelProvider): string => {
  const colors: Record<ModelProvider, string> = {
    Groq: 'purple',
    Anthropic: 'blue',
    OpenRouter: 'green',
    Google: 'yellow',
    Cohere: 'red',
    Deepseek: 'pink',
    HuggingFace: 'orange',
    Hyperbolic: 'indigo',
    Mistral: 'cyan',
    Ollama: 'emerald',
    OpenAI: 'teal',
    Perplexity: 'violet'
  };
  return colors[provider];
};