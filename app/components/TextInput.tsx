"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface TextInputProps {
  useAI: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  title: string;
}

export function TextInput(props: TextInputProps) {
  const isDisabled = props.isGenerating || 
    (!props.useAI ? !props.content.trim() : !props.prompt.trim()) || 
    !props.title.trim();

  if (props.useAI) {
    return (
      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-4 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground"
          placeholder="Describe what you want in your presentation..."
          value={props.prompt}
          onChange={(e) => props.setPrompt(e.target.value)}
        />
        <button
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={props.onGenerate}
          disabled={isDisabled}
        >
          {props.isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            "Generate Presentation"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-4 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono bg-background text-foreground"
        placeholder="Enter your presentation content in HTML format..."
        value={props.content}
        onChange={(e) => props.setContent(e.target.value)}
      />
      <div className="text-sm text-muted-foreground">
        <p>HTML formatting supported:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use {"<h1>"} and {"</h1>"} for main headers</li>
          <li>Use {"<h2>"} and {"</h2>"} for subheaders</li>
          <li>Use {"<ul>"} and {"</ul>"} with {"<li>"} tags for bullet points</li>
          <li>Use {"<ol>"} and {"</ol>"} with {"<li>"} tags for numbered lists</li>
          <li>Use {"<strong>"} and {"</strong>"} for bold, {"<em>"} and {"</em>"} for italic</li>
        </ul>
      </div>
      <button
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={props.onGenerate}
        disabled={isDisabled}
      >
        {props.isGenerating ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          "Generate Presentation"
        )}
      </button>
    </div>
  );
}
