import { NextRequest, NextResponse } from "next/server";
import { generateRevealHTML } from "../../templates/reveal";

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
    console.log("Starting presentation generation...");
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
      console.log("AI generation requested, preparing to call generate endpoint...");
      try {
        // Get the base URL from the request
        const protocol = process.env.VERCEL_URL ? 'https' : 'http';
        const host = process.env.VERCEL_URL || req.headers.get('host');
        if (!host) {
          throw new Error('Unable to determine host');
        }
        
        const generateUrl = `${protocol}://${host}/api/generate`;
        console.log("Generate endpoint URL:", generateUrl);

        // Debug logging for API key
        if (apiKey) {
          console.log("API Key details:");
          console.log(`- Length: ${apiKey.length}`);
          console.log(`- Prefix: ${apiKey.substring(0, 5)}...`);
          console.log(`- Format valid: ${apiKey.startsWith('sk-')}`);
        } else {
          console.log("No API key provided in request");
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };

        // Only add API key to headers if it exists and has valid format
        if (apiKey && apiKey.startsWith('sk-')) {
          headers["x-api-key"] = apiKey.trim();
        }

        const generateResponse = await fetch(generateUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            content,
            type,
            slideCount
          }),
        });

        // Log response details
        console.log("Generate endpoint response status:", generateResponse.status);
        console.log("Generate endpoint response headers:", Object.fromEntries(generateResponse.headers.entries()));

        // Check for non-JSON responses first
        const contentType = generateResponse.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const responseText = await generateResponse.text();
          console.error('Non-JSON response received:', responseText);
          throw new Error(`Invalid response format from generate endpoint - expected JSON. Status: ${generateResponse.status}`);
        }

        const generateData = await generateResponse.json();

        if (!generateResponse.ok || !generateData.success) {
          console.error("Generate endpoint error:", generateData);
          throw new Error(generateData.error || `Generate endpoint error: ${generateResponse.status} ${generateResponse.statusText}`);
        }

        if (!generateData.content) {
          console.error("Invalid generate endpoint response:", generateData);
          throw new Error("No content received from generate endpoint");
        }

        finalContent = generateData.content;
        console.log("Content generation successful");
      } catch (generateError: unknown) {
        console.error("Content generation error:", generateError);
        throw new Error(
          `Failed to generate content: ${generateError instanceof Error ? generateError.message : 'Unknown error'}`
        );
      }
    }

    // Split content into slides
    console.log("Processing slides...");
    const slides = finalContent
      .split(/\n\n+/)
      .filter(section => section.trim().length > 0);

    if (slides.length === 0) {
      throw new Error("No valid slides found in content");
    }

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
