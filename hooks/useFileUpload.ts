"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UseFileUploadProps {
  maxSize: number;
  acceptedTypes: string[];
  onUpload: (file: File) => Promise<void>;
}

export function useFileUpload({ maxSize, acceptedTypes, onUpload }: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'transcribing'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setStatus('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setStatus('transcribing');
      
      if (data.success) {
        await onUpload(file);
      } else {
        throw new Error(data.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process audio');
      throw error;
    } finally {
      setIsUploading(false);
      setStatus('idle');
      setUploadProgress(0);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 10MB.');
      } else if (error?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an MP3, WAV, or M4A file.');
      } else {
        setError('Failed to upload file. Please try again.');
      }
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    isUploading,
    fileName,
    uploadProgress,
    status,
    error
  };
}
