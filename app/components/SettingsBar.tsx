"use client";

import { Switch } from "@headlessui/react";
import { TRANSITIONS } from "../constants";

interface SettingsBarProps {
  useAI: boolean;
  setUseAI: (value: boolean) => void;
  transition: string;
  setTransition: (value: string) => void;
  slideCount: number;
  setSlideCount: (value: number) => void;
}

export function SettingsBar({ 
  useAI, 
  setUseAI, 
  transition, 
  setTransition,
  slideCount,
  setSlideCount
}: SettingsBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 bg-card p-4 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            checked={useAI}
            onChange={setUseAI}
            className={`${
              useAI ? 'bg-primary' : 'bg-muted'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                useAI ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className="text-foreground font-medium">AI Generation</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-foreground font-medium">Transition:</label>
          <select
            value={transition}
            onChange={(e) => setTransition(e.target.value)}
            className="border border-input rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {TRANSITIONS.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Number of Slides</label>
          <span className="text-sm text-muted-foreground">{slideCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max="25"
          value={slideCount}
          onChange={(e) => setSlideCount(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>25</span>
        </div>
      </div>
    </div>
  );
}
