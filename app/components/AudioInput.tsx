"use client";

import { AlertCircle, Loader2, Mic } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface AudioInputProps {
  content: string;
  isGenerating: boolean;
  onGenerate: () => void;
  title: string;
  handleFileUpload: (file: File) => Promise<void>;
}

export function AudioInput({ content, isGenerating, onGenerate, title, handleFileUpload }: AudioInputProps) {
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isUploading, 
    fileName, 
    uploadProgress, 
    status,
    error 
  } = useFileUpload({
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['audio/mpeg', 'audio/wav', 'audio/m4a'],
    onUpload: handleFileUpload
  });

  const getUploadStatusText = () => {
    if (error) return error;
    if (status === 'uploading') return `Uploading: ${uploadProgress}%`;
    if (status === 'transcribing') return 'Transcribing audio...';
    if (fileName) return `File selected: ${fileName}`;
    return "Drag and drop an audio file here, or click to select";
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          error 
            ? "border-red-500 bg-red-50/10" 
            : isDragActive 
              ? "border-primary bg-primary/10"
              : "border-input"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          {isUploading ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
              <div className="w-full max-w-xs mx-auto">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </>
          ) : error ? (
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          ) : (
            <Mic className="mx-auto h-12 w-12 text-muted-foreground" />
          )}
          <div className={`text-foreground ${error ? 'text-red-500' : ''}`}>
            {getUploadStatusText()}
          </div>
          <div className="text-sm text-muted-foreground">
            Supports MP3, WAV, M4A (max 10MB)
          </div>
        </div>
      </div>
      {content && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Transcription:</h3>
          <div className="p-4 bg-muted rounded-lg font-mono text-foreground">{content}</div>
        </div>
      )}
      <button
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onGenerate}
        disabled={isGenerating || !content || !title.trim()}
      >
        {isGenerating ? (
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
