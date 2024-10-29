"use client";

import { Type, Mic } from "lucide-react";
import { InputMode } from "../../types";
import { useEffect } from "react";

interface InputModeToggleProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  useAI: boolean;
}

export function InputModeToggle({ inputMode, setInputMode, useAI }: InputModeToggleProps) {
  useEffect(() => {
    // If AI is disabled and we're in audio mode, switch to text mode
    if (!useAI && inputMode === "audio") {
      setInputMode("text");
    }
  }, [useAI, inputMode, setInputMode]);

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg border border-border p-1 bg-card">
        <button
          onClick={() => setInputMode("text")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            inputMode === "text"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <Type size={20} />
          <span>Text</span>
        </button>
        <button
          onClick={() => useAI && setInputMode("audio")}
          disabled={!useAI}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            inputMode === "audio"
              ? "bg-primary text-primary-foreground"
              : useAI 
                ? "text-foreground hover:bg-muted"
                : "text-muted-foreground cursor-not-allowed opacity-50"
          }`}
        >
          <Mic size={20} />
          <span>Audio</span>
        </button>
      </div>
    </div>
  );
}
