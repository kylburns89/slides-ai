import { Theme, Transition } from "@/types";

export const TRANSITIONS: Transition[] = [
  { id: "slide", name: "Slide" },
  { id: "fade", name: "Fade" },
  { id: "convex", name: "Convex" },
  { id: "concave", name: "Concave" },
  { id: "zoom", name: "Zoom" },
];

export const THEMES: Theme[] = [
  { id: "black", name: "black", preview: "/themes/black.png" },
  { id: "white", name: "white", preview: "/themes/white.png" },
  { id: "league", name: "league", preview: "/themes/league.png" },
  { id: "beige", name: "beige", preview: "/themes/beige.png" },
  { id: "sky", name: "sky", preview: "/themes/sky.png" },
  { id: "night", name: "night", preview: "/themes/night.png" },
  { id: "serif", name: "serif", preview: "/themes/serif.png" },
  { id: "simple", name: "simple", preview: "/themes/simple.png" },
  { id: "solarized", name: "solarized", preview: "/themes/solarized.png" },
  { id: "blood", name: "blood", preview: "/themes/blood.png" },
  { id: "moon", name: "moon", preview: "/themes/moon.png" },
  { id: "dracula", name: "dracula", preview: "/themes/dracula.png" },
];
