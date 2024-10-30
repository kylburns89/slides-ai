import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface APIKeysState {
  groq: string;
  claude: string;
  openai: string;
  setGroqKey: (key: string) => void;
  setClaudeKey: (key: string) => void;
  setOpenAIKey: (key: string) => void;
  getGroqKey: () => string;
  getClaudeKey: () => string;
  getOpenAIKey: () => string;
}

export const useAPIKeys = create<APIKeysState>()(
  persist(
    (set, get) => ({
      groq: '',
      claude: '',
      openai: '',
      setGroqKey: (key: string) => set({ groq: key }),
      setClaudeKey: (key: string) => set({ claude: key }),
      setOpenAIKey: (key: string) => set({ openai: key }),
      getGroqKey: () => process.env.NEXT_PUBLIC_GROQ_API_KEY || get().groq,
      getClaudeKey: () => process.env.NEXT_PUBLIC_CLAUDE_API_KEY || get().claude,
      getOpenAIKey: () => process.env.NEXT_PUBLIC_OPENAI_API_KEY || get().openai,
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
