import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect } from 'react';

interface APIKeysState {
  groq: string;
  claude: string;
  openai: string;
  hasEnvironmentKeys: {
    groq: boolean;
    claude: boolean;
    openai: boolean;
  };
  setGroqKey: (key: string) => void;
  setClaudeKey: (key: string) => void;
  setOpenAIKey: (key: string) => void;
  getGroqKey: () => Promise<string>;
  getClaudeKey: () => Promise<string>;
  getOpenAIKey: () => Promise<string>;
  setEnvironmentKeys: (keys: { groq: boolean; claude: boolean; openai: boolean }) => void;
}

export const useAPIKeys = create<APIKeysState>()(
  persist(
    (set, get) => ({
      groq: '',
      claude: '',
      openai: '',
      hasEnvironmentKeys: {
        groq: false,
        claude: false,
        openai: false,
      },
      setGroqKey: (key: string) => set({ groq: key }),
      setClaudeKey: (key: string) => set({ claude: key }),
      setOpenAIKey: (key: string) => set({ openai: key }),
      getGroqKey: async () => {
        if (get().hasEnvironmentKeys.groq) {
          const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'groq' })
          });
          const data = await response.json();
          return data.key || get().groq;
        }
        return get().groq;
      },
      getClaudeKey: async () => {
        if (get().hasEnvironmentKeys.claude) {
          const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'claude' })
          });
          const data = await response.json();
          return data.key || get().claude;
        }
        return get().claude;
      },
      getOpenAIKey: async () => {
        if (get().hasEnvironmentKeys.openai) {
          const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'openai' })
          });
          const data = await response.json();
          return data.key || get().openai;
        }
        return get().openai;
      },
      setEnvironmentKeys: (keys) => set({ hasEnvironmentKeys: keys }),
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

// Hook to check for environment variables on mount
export const useCheckEnvironmentKeys = () => {
  const setEnvironmentKeys = useAPIKeys(state => state.setEnvironmentKeys);

  useEffect(() => {
    const checkKeys = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setEnvironmentKeys({
          groq: data.hasGroqKey,
          claude: data.hasClaudeKey,
          openai: data.hasOpenAIKey,
        });
      } catch (error) {
        console.error('Failed to check environment keys:', error);
      }
    };

    checkKeys();
  }, [setEnvironmentKeys]);
};
