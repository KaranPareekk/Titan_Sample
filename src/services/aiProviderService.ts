/**
 * TITAN OS Multi-Provider AI Architecture
 * Provides direct client-side routing to Google Gemini, OpenAI, Anthropic Claude, Groq, and Custom endpoints.
 * Includes per-provider API key storage, model selection, and graceful error fallbacks.
 */

export type AiProvider = 'gemini' | 'openai' | 'claude' | 'groq' | 'custom';

export interface ProviderMeta {
  id: AiProvider;
  name: string;
  badge: string;
  badgeColor: string;
  defaultModel: string;
  availableModels: string[];
  docUrl: string;
  placeholder: string;
}

export const AI_PROVIDERS: Record<AiProvider, ProviderMeta> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'GEMINI 2.5',
    badgeColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40',
    defaultModel: 'gemini-2.5-flash',
    availableModels: ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    docUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIzaSy...',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    badge: 'GPT-4O',
    badgeColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
    defaultModel: 'gpt-4o-mini',
    availableModels: ['gpt-4o-mini', 'gpt-4o', 'o3-mini'],
    docUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-proj-...',
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    badge: 'CLAUDE 3.5',
    badgeColor: 'text-amber-300 border-amber-500/40 bg-amber-950/40',
    defaultModel: 'claude-3-5-sonnet-20241022',
    availableModels: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    docUrl: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-api03-...',
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    badge: 'LLAMA 3.3',
    badgeColor: 'text-orange-300 border-orange-500/40 bg-orange-950/40',
    defaultModel: 'llama-3.3-70b-versatile',
    availableModels: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
    docUrl: 'https://console.groq.com/keys',
    placeholder: 'gsk_...',
  },
  custom: {
    id: 'custom',
    name: 'Custom / OpenRouter',
    badge: 'CUSTOM API',
    badgeColor: 'text-purple-300 border-purple-500/40 bg-purple-950/40',
    defaultModel: 'deepseek/deepseek-chat',
    availableModels: ['deepseek/deepseek-chat', 'mistralai/mistral-large-2407', 'custom'],
    docUrl: 'https://openrouter.ai/keys',
    placeholder: 'sk-or-v1-... or custom endpoint token',
  },
};

const STORAGE_ACTIVE_PROVIDER = 'titan_active_ai_provider';
const STORAGE_KEY_PREFIX = 'titan_api_key_';
const STORAGE_MODEL_PREFIX = 'titan_ai_model_';
const STORAGE_CUSTOM_URL = 'titan_custom_ai_endpoint';

export const AiProviderService = {
  /**
   * Get current active provider
   */
  getActiveProvider(): AiProvider {
    try {
      const stored = localStorage.getItem(STORAGE_ACTIVE_PROVIDER) as AiProvider;
      if (stored && AI_PROVIDERS[stored]) {
        return stored;
      }
    } catch {
      // fallback
    }
    return 'gemini';
  },

  /**
   * Set active provider
   */
  setActiveProvider(provider: AiProvider): void {
    try {
      localStorage.setItem(STORAGE_ACTIVE_PROVIDER, provider);
    } catch {
      // ignore
    }
  },

  /**
   * Retrieve API key for a specific provider
   */
  getApiKey(provider: AiProvider): string {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${provider}`);
      if (stored && stored.trim()) {
        return stored.trim();
      }

      // Legacy fallback for Gemini
      if (provider === 'gemini') {
        const legacy = localStorage.getItem('titan_gemini_api_key');
        if (legacy && legacy.trim()) return legacy.trim();
        const envVal =
          (import.meta as any).env?.VITE_GEMINI_API_KEY ||
          (import.meta as any).env?.GEMINI_API_KEY ||
          '';
        if (envVal) return envVal.trim();
      }

      if (provider === 'openai') {
        const envVal = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
        if (envVal) return envVal.trim();
      }

      if (provider === 'groq') {
        const envVal = (import.meta as any).env?.VITE_GROQ_API_KEY || '';
        if (envVal) return envVal.trim();
      }
    } catch {
      // ignore
    }
    return '';
  },

  /**
   * Save API key for a specific provider
   */
  setApiKey(provider: AiProvider, key: string): void {
    try {
      const trimmed = key.trim();
      if (!trimmed) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${provider}`);
        if (provider === 'gemini') localStorage.removeItem('titan_gemini_api_key');
      } else {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${provider}`, trimmed);
        if (provider === 'gemini') localStorage.setItem('titan_gemini_api_key', trimmed);
      }
    } catch {
      // ignore
    }
  },

  /**
   * Get selected model for provider
   */
  getModel(provider: AiProvider): string {
    try {
      const stored = localStorage.getItem(`${STORAGE_MODEL_PREFIX}${provider}`);
      if (stored) return stored.trim();
    } catch {
      // ignore
    }
    return AI_PROVIDERS[provider]?.defaultModel || '';
  },

  /**
   * Save model choice for provider
   */
  setModel(provider: AiProvider, model: string): void {
    try {
      localStorage.setItem(`${STORAGE_MODEL_PREFIX}${provider}`, model.trim());
    } catch {
      // ignore
    }
  },

  /**
   * Custom endpoint URL for OpenRouter/Ollama/DeepSeek
   */
  getCustomEndpoint(): string {
    try {
      return (
        localStorage.getItem(STORAGE_CUSTOM_URL) ||
        'https://openrouter.ai/api/v1/chat/completions'
      );
    } catch {
      return 'https://openrouter.ai/api/v1/chat/completions';
    }
  },

  setCustomEndpoint(url: string): void {
    try {
      localStorage.setItem(STORAGE_CUSTOM_URL, url.trim());
    } catch {
      // ignore
    }
  },

  /**
   * Unified Call Method
   */
  async callAi(
    query: string,
    contextPrompt?: string
  ): Promise<{ text: string; provider: AiProvider; model: string }> {
    const provider = this.getActiveProvider();
    const apiKey = this.getApiKey(provider);
    const model = this.getModel(provider);

    if (!apiKey) {
      throw new Error(`No API key configured for ${AI_PROVIDERS[provider].name}.`);
    }

    const fullPrompt = contextPrompt
      ? `${contextPrompt}\n\nUser Query: ${query}`
      : query;

    switch (provider) {
      case 'gemini': {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(
            errBody.error?.message || `Gemini API returned status ${resp.status}`
          );
        }

        const data = await resp.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'No text returned from Gemini API.';
        return { text, provider, model };
      }

      case 'openai': {
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content:
                  'You are TITAN AI Engineering Copilot, an expert systems architect and algorithmic mentor. Provide concise, high-precision code and systems explanations.',
              },
              { role: 'user', content: fullPrompt },
            ],
            temperature: 0.3,
            max_tokens: 2048,
          }),
        });

        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(
            errBody.error?.message || `OpenAI API returned status ${resp.status}`
          );
        }

        const data = await resp.json();
        const text =
          data?.choices?.[0]?.message?.content || 'No response from OpenAI.';
        return { text, provider, model };
      }

      case 'claude': {
        const endpoint = 'https://api.anthropic.com/v1/messages';
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model,
            max_tokens: 2048,
            messages: [{ role: 'user', content: fullPrompt }],
          }),
        });

        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(
            errBody.error?.message || `Claude API returned status ${resp.status}`
          );
        }

        const data = await resp.json();
        const text = data?.content?.[0]?.text || 'No response from Claude.';
        return { text, provider, model };
      }

      case 'groq': {
        const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content:
                  'You are TITAN AI Engineering Copilot, an expert systems architect and algorithmic mentor. Provide concise, high-precision code and systems explanations.',
              },
              { role: 'user', content: fullPrompt },
            ],
            temperature: 0.3,
            max_tokens: 2048,
          }),
        });

        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(
            errBody.error?.message || `Groq API returned status ${resp.status}`
          );
        }

        const data = await resp.json();
        const text =
          data?.choices?.[0]?.message?.content || 'No response from Groq.';
        return { text, provider, model };
      }

      case 'custom': {
        const endpoint = this.getCustomEndpoint();
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || 'deepseek/deepseek-chat',
            messages: [
              {
                role: 'system',
                content:
                  'You are TITAN AI Engineering Copilot, an expert systems architect and algorithmic mentor.',
              },
              { role: 'user', content: fullPrompt },
            ],
            temperature: 0.3,
            max_tokens: 2048,
          }),
        });

        if (!resp.ok) {
          const errBody = await resp.json().catch(() => ({}));
          throw new Error(
            errBody.error?.message || `Custom API returned status ${resp.status}`
          );
        }

        const data = await resp.json();
        const text =
          data?.choices?.[0]?.message?.content ||
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'No response from endpoint.';
        return { text, provider, model };
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  },
};
