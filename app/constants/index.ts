import { Theme, Transition } from "@/types";

export const TRANSITIONS: Transition[] = [
  { id: "slide", name: "Slide" },
  { id: "fade", name: "Fade" },
  { id: "convex", name: "Convex" },
  { id: "concave", name: "Concave" },
  { id: "zoom", name: "Zoom" },
];

export const THEMES: Theme[] = [
  { id: "black", name: "Black", preview: "/themes/black.png" },
  { id: "white", name: "White", preview: "/themes/white.png" },
  { id: "league", name: "League", preview: "/themes/league.png" },
  { id: "beige", name: "Beige", preview: "/themes/beige.png" },
  { id: "sky", name: "Sky", preview: "/themes/sky.png" },
  { id: "night", name: "Night", preview: "/themes/night.png" },
  { id: "serif", name: "Serif", preview: "/themes/serif.png" },
  { id: "simple", name: "Simple", preview: "/themes/simple.png" },
  { id: "solarized", name: "Solarized", preview: "/themes/solarized.png" },
  { id: "moon", name: "Moon", preview: "/themes/moon.png" },
  { id: "dracula", name: "Dracula", preview: "/themes/dracula.png" },
  { id: "blood", name: "Blood", preview: "/themes/blood.png" },
];

export const API_PROVIDERS = {
  OPENAI: 'openai',
  GROQ: 'groq'
} as const;

export const WHISPER_MODELS = {
  GROQ: {
    'whisper-large-v3': {
      name: 'Whisper Large V3',
      description: 'Best accuracy for multilingual transcription and translation',
      multilingual: true,
      translation: true
    },
    'whisper-large-v3-turbo': {
      name: 'Whisper Large V3 Turbo',
      description: 'Fast multilingual transcription with good accuracy',
      multilingual: true,
      translation: false
    },
    'distil-whisper-large-v3-en': {
      name: 'Distil-Whisper English',
      description: 'Fastest English-only transcription',
      multilingual: false,
      translation: false
    }
  },
  OPENAI: {
    'whisper-1': {
      name: 'Whisper-1',
      description: 'Standard OpenAI Whisper model',
      multilingual: true,
      translation: true
    }
  }
} as const;
