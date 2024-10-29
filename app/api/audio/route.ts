import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      console.error("No audio file in request");
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log("Received audio file:", {
      type: audioFile.type,
      size: audioFile.size,
      name: audioFile.name
    });

    try {
      // Convert File to Blob for OpenAI API
      const bytes = await audioFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const blob = new Blob([buffer], { type: audioFile.type });

      // Create a file object that OpenAI's API expects
      const file = new File([blob], audioFile.name, { type: audioFile.type });

      // Transcribe the audio
      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "text",
      });

      console.log("Successfully transcribed audio:", transcription);

      // Generate content using Claude
      const generateResponse = await fetch(new URL("/api/generate", req.url).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: transcription,
          type: "audio",
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate presentation content");
      }

      const { content: generatedContent } = await generateResponse.json();

      // Return success response with the generated content
      return NextResponse.json({
        success: true,
        transcription: generatedContent
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
