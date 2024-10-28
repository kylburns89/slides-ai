"use client";

import Image from "next/image";
import { THEMES } from "../constants";

interface ThemeSelectionProps {
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
}

export function ThemeSelection({ selectedTemplate, setSelectedTemplate }: ThemeSelectionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Presentation Theme</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedTemplate === theme.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary"
            }`}
            onClick={() => setSelectedTemplate(theme.id)}
          >
            <div className="aspect-video rounded mb-2 overflow-hidden">
              <Image
                src={theme.preview}
                alt={`${theme.name} theme preview`}
                width={320}
                height={180}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm font-medium capitalize text-foreground">{theme.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
