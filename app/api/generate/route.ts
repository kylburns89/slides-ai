import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface GenerateRequest {
  content: string;
  type: "text" | "audio";
}

interface GenerateResponse {
  content: string;
  success: boolean;
  error?: string;
}

const SYSTEM_PROMPT = `You are an expert at creating clear, engaging presentation content using HTML. Your task is to take the provided input and structure it into a well-organized HTML presentation for reveal.js. Each slide should be a complete HTML section with proper semantic markup.

Format guidelines:
- Use h1 or h2 for slide titles
- Use semantic HTML elements (ul/li for lists, p for paragraphs, etc.)
- Keep content concise and impactful
- Use proper HTML structure for each slide
- Separate slides with two newlines for parsing

Example slide format:
<h1>Slide Title</h1>
<ul>
  <li>Key point 1</li>
  <li>Key point 2</li>
</ul>

<h1>Next Slide</h1>
<p>Content goes here</p>`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error("Claude API key not configured");
    }

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const data: GenerateRequest = await req.json();
    const { content, type } = data;

    const userPrompt = type === "audio" 
      ? "Convert this transcribed speech into HTML presentation content: " + content
      : "Convert this text into HTML presentation content: " + content;

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const generatedContent = message.content[0]?.type === 'text' 
      ? message.content[0].text 
      : null;

    if (!generatedContent) {
      throw new Error("Invalid response from Claude API");
    }

    const result: GenerateResponse = {
      content: generatedContent,
      success: true,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate presentation content" },
      { status: 500 }
    );
  }
}