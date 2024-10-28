import { NextRequest, NextResponse } from "next/server";
import { generateRevealHTML } from "@/app/templates/reveal";

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
}

export async function POST(req: NextRequest) {
  try {
    const data: PresentationRequest = await req.json();
    const { 
      content, 
      template = 'white', 
      title = "AI Generated Presentation",
      transition = 'slide',
      useAI = false 
    } = data;

    let finalContent = content;

    // Generate content using Claude if useAI is true
    if (useAI) {
      const generateResponse = await fetch(new URL("/api/generate", req.url).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type: "text",
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate content");
      }

      const generateData: GenerateResponse = await generateResponse.json();
      if (!generateData.success || !generateData.content) {
        throw new Error(generateData.error || "Failed to generate content");
      }

      finalContent = generateData.content;
    }

    // Split content into slides
    const slides = finalContent
      .split(/\n\n+/)
      .filter(section => section.trim().length > 0);

    // Generate reveal.js HTML
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
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Presentation generation error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate presentation" },
      { status: 500 }
    );
  }
}
