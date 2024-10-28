import { NextRequest, NextResponse } from "next/server";
import speech from "@google-cloud/speech";
import { protos } from "@google-cloud/speech";

type SpeechRecognitionResult = protos.google.cloud.speech.v1.ISpeechRecognitionResult;
const AudioEncoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;

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

    // Convert the file to a buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize Speech-to-Text client
    const client = new speech.SpeechClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });

    // Determine audio encoding based on file type
    let encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
    let sampleRateHertz: number | undefined;

    if (audioFile.type === 'audio/wav') {
      encoding = AudioEncoding.LINEAR16;
      sampleRateHertz = 16000;
    } else if (audioFile.type === 'audio/mpeg') {
      encoding = AudioEncoding.MP3;
      // MP3 doesn't require explicit sample rate
      sampleRateHertz = undefined;
    } else if (audioFile.type === 'audio/m4a') {
      // For M4A files, we'll use ENCODING_UNSPECIFIED and let Google detect it
      encoding = AudioEncoding.ENCODING_UNSPECIFIED;
      sampleRateHertz = undefined;
    } else {
      console.error("Unsupported audio format:", audioFile.type);
      return NextResponse.json(
        { success: false, error: `Unsupported audio format: ${audioFile.type}` },
        { status: 400 }
      );
    }

    // Configure the recognition
    const audio = {
      content: buffer.toString("base64"),
    };
    const config = {
      encoding,
      sampleRateHertz,
      languageCode: "en-US",
      model: 'default', // Using the default model for better compatibility
      audioChannelCount: 1, // Assuming mono audio
    };
    const request = {
      audio: audio,
      config: config,
    };

    console.log('Sending request to Google Speech-to-Text with config:', {
      encoding,
      sampleRateHertz,
      fileType: audioFile.type,
      fileSize: buffer.length,
      model: config.model,
      audioChannelCount: config.audioChannelCount
    });

    // Perform the transcription
    const [response] = await client.recognize(request);
    
    if (!response.results || response.results.length === 0) {
      console.error("No transcription results returned from Google Speech-to-Text");
      return NextResponse.json(
        { success: false, error: "No speech detected in the audio file" },
        { status: 400 }
      );
    }

    const transcription = response.results
      .map((result: SpeechRecognitionResult) => 
        result.alternatives?.[0]?.transcript || ""
      )
      .join("\n");

    if (!transcription) {
      console.error("Empty transcription result");
      return NextResponse.json(
        { success: false, error: "Failed to transcribe audio" },
        { status: 400 }
      );
    }

    console.log("Successfully transcribed audio:", {
      transcriptionLength: transcription.length,
      resultCount: response.results.length
    });

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
      console.error("Failed to generate presentation content:", await generateResponse.text());
      throw new Error("Failed to generate presentation content");
    }

    const { content: generatedContent } = await generateResponse.json();

    return NextResponse.json({
      transcription: generatedContent,
      success: true,
    });
  } catch (error) {
    console.error("Audio processing error:", error);
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : "Failed to process audio";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
