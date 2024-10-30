import { NextRequest, NextResponse } from "next/server";
import { generateRevealHTML } from "../../templates/reveal";

interface GenerateResponse {
  content: string;
  success: boolean;
  error?: string;
}

interface PresentationRequest {
  content: string;
  template?: string;
  title?: string;
  transition?: string;
  useAI?: boolean;
  type?: string;
  slideCount?: number;
  apiKey?: string;
}

interface PresentationResponse {
  id: string;
  html: string;
  content: string;
  theme: string;
  title: string;
  transition: string;
  success: boolean;
  error?: string;
  slides?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const data: PresentationRequest = await req.json();
    const { 
      content, 
      template = 'white', 
      title = "AI Generated Presentation",
      transition = 'slide',
      useAI = false,
      type = 'text',
      slideCount = 10,
      apiKey
    } = data;

    let finalContent = content;

    // Generate content using Claude if useAI is true
    if (useAI) {
      console.log("Starting content generation process...");
      
      // Construct absolute URL for generate endpoint
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || req.url;
      const generateUrl = new URL("/api/generate", baseUrl).toString();
      
      console.log("Sending request to generate endpoint...");
      const generateResponse = await fetch(generateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type,
          slideCount,
          apiKey
        }),
      });

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("Generate endpoint error:", {
          status: generateResponse.status,
          statusText: generateResponse.statusText,
          body: errorText
        });
        throw new Error(`Failed to generate content: ${generateResponse.status} ${generateResponse.statusText}`);
      }

      console.log("Parsing generate endpoint response...");
      const generateData: GenerateResponse = await generateResponse.json();
      if (!generateData.success || !generateData.content) {
        console.error("Invalid generate endpoint response:", generateData);
        throw new Error(generateData.error || "Failed to generate content");
      }

      finalContent = generateData.content;
      console.log("Content generation successful");
    }

    // Split content into slides
    console.log("Processing slides...");
    const slides = finalContent
      .split(/\n\n+/)
      .filter(section => section.trim().length > 0);

    // Generate reveal.js HTML
    console.log("Generating reveal.js HTML...");
    const html = generateRevealHTML({
      title,
      slides,
      theme: template.toLowerCase(),
      transition,
    });

    const presentationId = Date.now().toString();

    const result: PresentationResponse = {
      id: presentationId,
      html,
      content: finalContent,
      theme: template.toLowerCase(),
      title,
      transition,
      success: true,
      slides,
    };

    console.log("Presentation generation completed successfully");
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Detailed presentation generation error:", {
      name: err?.name || 'Unknown error',
      message: err?.message || 'No error message available',
      stack: err?.stack || 'No stack trace available'
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error 
          ? `Presentation generation failed: ${err.message}` 
          : "Failed to generate presentation"
      },
      { status: 500 }
    );
  }
}
