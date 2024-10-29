import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  content: string;
  type: "text" | "audio";
  slideCount: number;
  apiKey: string;
}

interface GenerateResponse {
  content: string;
  success: boolean;
  error?: string;
}

const getSystemPrompt = (slideCount: number) => `You are an expert at creating clear, engaging presentation content using HTML. Your task is to take the provided input and structure it into a well-organized HTML presentation for reveal.js. Each slide should be a complete HTML section with proper semantic markup.

Important: Create exactly ${slideCount} slides, no more and no less.

Format guidelines:
- Use h1 or h2 for slide titles
- Use semantic HTML elements (ul/li for lists, p for paragraphs, etc.)
- Keep content concise and impactful
- Use proper HTML structure for each slide
- Separate slides with two newlines for parsing
- Ensure exactly ${slideCount} slides are created
- Don't include any details about the number of slides you created in your response

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
    const data: GenerateRequest = await req.json();
    const { content, type, slideCount = 10, apiKey } = data;

    if (!apiKey) {
      throw new Error("API key not provided");
    }

    const userPrompt = type === "audio" 
      ? `Convert this transcribed speech into exactly ${slideCount} HTML presentation slides: ${content}`
      : `Convert this text into exactly ${slideCount} HTML presentation slides: ${content}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 4096,
        system: getSystemPrompt(slideCount),
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const message = await response.json();
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
