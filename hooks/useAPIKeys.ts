import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface APIKeysState {
  groq: string;
  claude: string;
  openai: string;
  setGroqKey: (key: string) => void;
  setClaudeKey: (key: string) => void;
  setOpenAIKey: (key: string) => void;
}

export const useAPIKeys = create<APIKeysState>()(
  persist(
    (set) => ({
      groq: '',
      claude: '',
      openai: '',
      setGroqKey: (key: string) => set({ groq: key }),
      setClaudeKey: (key: string) => set({ claude: key }),
      setOpenAIKey: (key: string) => set({ openai: key })
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
