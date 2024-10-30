"use client";

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Settings } from 'lucide-react';
import { Fragment } from 'react';
import { useAPIKeys, useCheckEnvironmentKeys } from '../../hooks/useAPIKeys';

export function APISettings() {
  const [isOpen, setIsOpen] = useState(false);
  const apiKeys = useAPIKeys();
  const [keys, setKeys] = useState({
    groq: apiKeys.groq,
    claude: apiKeys.claude,
    openai: apiKeys.openai
  });

  // Use the hook to check for environment variables
  useCheckEnvironmentKeys();

  const handleSave = () => {
    if (keys.groq) apiKeys.setGroqKey(keys.groq);
    if (keys.claude) apiKeys.setClaudeKey(keys.claude);
    if (keys.openai) apiKeys.setOpenAIKey(keys.openai);
    setIsOpen(false);
  };

  const renderInput = (
    name: 'groq' | 'claude' | 'openai',
    label: string
  ) => {
    const hasEnvKey = apiKeys.hasEnvironmentKeys[name];
    
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
        {hasEnvKey ? (
          <div className="w-full p-2 rounded-md border border-input bg-background/50 text-foreground/70">
            Using environment variable
          </div>
        ) : (
          <input
            type="password"
            value={keys[name]}
            onChange={(e) => setKeys({ ...keys, [name]: e.target.value })}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground"
            placeholder={`Enter ${label}`}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-16 p-2 rounded-lg bg-card hover:bg-accent transition-colors border border-border"
        aria-label="API Settings"
      >
        <Settings className="w-5 h-5 text-foreground" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
                  <Dialog.Title className="text-xl font-semibold mb-4 text-foreground">
                    API Settings
                  </Dialog.Title>

                  {(!apiKeys.hasEnvironmentKeys.groq && 
                    !apiKeys.hasEnvironmentKeys.claude && 
                    !apiKeys.hasEnvironmentKeys.openai) && (
                    <div className="mb-4 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                      No environment variables detected. Please enter your API keys below.
                    </div>
                  )}

                  <div className="space-y-4">
                    {renderInput('groq', 'Groq API Key')}
                    {renderInput('claude', 'Claude API Key')}
                    {renderInput('openai', 'OpenAI API Key')}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
