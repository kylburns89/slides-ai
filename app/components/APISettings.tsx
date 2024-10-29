"use client";

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Settings } from 'lucide-react';
import { Fragment } from 'react';
import { useAPIKeys } from '@/hooks/useAPIKeys';

export function APISettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { groq, claude, openai, setGroqKey, setClaudeKey, setOpenAIKey } = useAPIKeys();
  const [keys, setKeys] = useState({
    groq,
    claude,
    openai
  });

  const handleSave = () => {
    // Update global state
    if (keys.groq) setGroqKey(keys.groq);
    if (keys.claude) setClaudeKey(keys.claude);
    if (keys.openai) setOpenAIKey(keys.openai);

    setIsOpen(false);
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

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Groq API Key
                      </label>
                      <input
                        type="password"
                        value={keys.groq}
                        onChange={(e) => setKeys({ ...keys, groq: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                        placeholder="Enter Groq API key"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Claude API Key
                      </label>
                      <input
                        type="password"
                        value={keys.claude}
                        onChange={(e) => setKeys({ ...keys, claude: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                        placeholder="Enter Claude API key"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        OpenAI API Key
                      </label>
                      <input
                        type="password"
                        value={keys.openai}
                        onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                        className="w-full p-2 rounded-md border border-input bg-background text-foreground"
                        placeholder="Enter OpenAI API key"
                      />
                    </div>
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
