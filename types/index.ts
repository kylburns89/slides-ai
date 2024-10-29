export interface Presentation {
  id: string;
  title: string;
  theme: string;
  content: string;
  timestamp: string;
  html: string;
  slides: string[];
  createdAt: Date;
}

export type InputMode = "text" | "audio";

export type APIProvider = 'openai' | 'groq';

export interface Theme {
  id: string;
  name: string;
  preview: string;
}

export interface Transition {
  id: string;
  name: string;
}

export interface AudioTranscriptionConfig {
  provider: APIProvider;
  model?: string;
  language?: string;
  prompt?: string;
  temperature?: number;
}
