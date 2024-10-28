"use client";

import { Type, Mic } from "lucide-react";
import { InputMode } from "@/types";

interface InputModeToggleProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
}

export function InputModeToggle({ inputMode, setInputMode }: InputModeToggleProps) {
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
          onClick={() => setInputMode("audio")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            inputMode === "audio"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <Mic size={20} />
          <span>Audio</span>
        </button>
      </div>
    </div>
  );
}
