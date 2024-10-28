export interface Presentation {
  id: string;
  title: string;
  content: string;
  theme: string;
  timestamp: string;
  html: string;
}

export type InputMode = "text" | "audio";

export interface Theme {
  id: string;
  name: string;
  preview: string;
}

export interface Transition {
  id: string;
  name: string;
}
