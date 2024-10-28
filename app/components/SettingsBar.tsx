"use client";

import { Switch } from "@headlessui/react";
import { TRANSITIONS } from "../constants";

interface SettingsBarProps {
  useAI: boolean;
  setUseAI: (value: boolean) => void;
  transition: string;
  setTransition: (value: string) => void;
}

export function SettingsBar({ useAI, setUseAI, transition, setTransition }: SettingsBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-lg border border-border">
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
  );
}
