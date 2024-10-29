"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Presentation, InputMode } from "@/types";
import { TitleInput } from "@/app/components/TitleInput";
import { SettingsBar } from "@/app/components/SettingsBar";
import { InputModeToggle } from "@/app/components/InputModeToggle";
import { TextInput } from "@/app/components/TextInput";
import AudioInput from "@/app/components/AudioInput";
import { ThemeSelection } from "@/app/components/ThemeSelection";
import { PresentationHistory } from "@/app/components/PresentationHistory";

export default function Home() {
  const [title, setTitle] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [transition, setTransition] = useState("slide");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("black");
  const [presentations, setPresentations] = useState<Presentation[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to process audio');
      }

      setContent(data.transcription);
      toast.success('Audio transcribed successfully!');
    } catch (error) {
      console.error('Audio processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process audio');
    }
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a presentation title");
      return;
    }

    // Get content based on input mode and AI setting
    const presentationContent = inputMode === "text" 
      ? (useAI ? prompt : content)
      : content;

    if (!presentationContent?.trim()) {
      toast.error("Please enter some content for your presentation");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: presentationContent,
          template: selectedTemplate,
          title: title,
          transition: transition,
          useAI: inputMode === "audio" ? true : useAI,
          type: inputMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate presentation');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate presentation');
      }

      setPresentations(prev => [{
        id: data.id,
        title: data.title,
        content: data.content,
        theme: data.theme,
        timestamp: new Date().toISOString(),
        html: data.html,
        slides: data.slides || [],
        createdAt: new Date(),
      }, ...prev]);

      toast.success('Presentation generated successfully!');

      setTitle("");
      setPrompt("");
      setContent("");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (presentation: Presentation) => {
    setTitle(presentation.title);
    setContent(presentation.content);
    setSelectedTemplate(presentation.theme);
    setUseAI(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (presentation: Presentation) => {
    const blob = new Blob([presentation.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownload = (presentation: Presentation) => {
    const blob = new Blob([presentation.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    setPresentations(prev => prev.filter(p => p.id !== id));
    toast.success('Presentation deleted');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">PresAI</h1>
        </div>

        <InputModeToggle inputMode={inputMode} setInputMode={setInputMode} />

        <TitleInput title={title} setTitle={setTitle} />
        <SettingsBar 
          useAI={useAI} 
          setUseAI={setUseAI}
          transition={transition}
          setTransition={setTransition}
        />

        <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
          {inputMode === "text" ? (
            <TextInput
              useAI={useAI}
              prompt={prompt}
              setPrompt={setPrompt}
              content={content}
              setContent={setContent}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              title={title}
            />
          ) : (
            <AudioInput
              content={content}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              title={title}
              handleFileUpload={handleFileUpload}
            />
          )}
        </div>

        <ThemeSelection
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />

        <PresentationHistory
          presentations={presentations}
          onEdit={handleEdit}
          onView={handleView}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
