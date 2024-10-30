import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { API_PROVIDERS } from "@/app/constants/index";
import type { AudioTranscriptionConfig } from "@/types/index";
import { Groq } from "groq-sdk";
import { writeFileSync, createReadStream, unlinkSync } from 'fs';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Initialize Groq client if API key is available
let groq: Groq | null = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const configStr = formData.get("config") as string | null;
    const config: AudioTranscriptionConfig | null = configStr ? JSON.parse(configStr) : null;

    if (!audioFile) {
      console.error("No audio file in request");
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Check for API key before proceeding
    if (!process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "No API key configured" },
        { status: 401 }
      );
    }

    console.log("Received audio file:", {
      type: audioFile.type,
      size: audioFile.size,
      name: audioFile.name
    });

    try {
      // Convert File to appropriate format
      const bytes = await audioFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      let transcription: string;

      if (config?.provider === API_PROVIDERS.GROQ && groq) {
        // Create temporary file for Groq API
        const tempFilePath = `/tmp/${audioFile.name}`;
        writeFileSync(tempFilePath, buffer);

        const result = await groq.audio.transcriptions.create({
          file: createReadStream(tempFilePath),
          model: config.model || 'whisper-large-v3-turbo',
          language: config.language,
          prompt: config.prompt,
          temperature: config.temperature,
          response_format: 'text'
        });

        // Clean up temp file
        unlinkSync(tempFilePath);
        transcription = result.text;
      } else {
        // Default to OpenAI
        const blob = new Blob([buffer], { type: audioFile.type });
        const file = new File([blob], audioFile.name, { type: audioFile.type });

        transcription = await openai.audio.transcriptions.create({
          file,
          model: "whisper-1",
          response_format: "text",
        });
      }

      console.log("Successfully transcribed audio:", transcription);

      // Return just the transcription
      return NextResponse.json({
        success: true,
        transcription
      });

    } catch (transcriptionError) {
      console.error("Transcription error:", transcriptionError);
      return NextResponse.json(
        { 
          success: false, 
          error: transcriptionError instanceof Error 
            ? transcriptionError.message 
            : "Failed to transcribe audio"
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Audio processing error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to process audio"
      },
      { status: 500 }
    );
  }
}
