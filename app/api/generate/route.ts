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
    console.log("Starting generate route processing...");
    
    const data: GenerateRequest = await req.json();
    const { content, type, slideCount, apiKey } = data;

    // Use environment variable or fallback to provided key
    const claudeApiKey = process.env.CLAUDE_API_KEY || apiKey;

    if (!claudeApiKey) {
      console.error("No Claude API key available");
      throw new Error("Claude API key not configured");
    }

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : `http://${req.headers.get('host')}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const generateUrl = `${baseUrl}/api/generate`;

    console.log("Starting Claude API request...");
    const userPrompt = type === "audio" 
      ? `Convert this transcribed speech into exactly ${slideCount} HTML presentation slides: ${content}`
      : `Convert this text into exactly ${slideCount} HTML presentation slides: ${content}`;

    const requestBody = {
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: getSystemPrompt(slideCount),
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    };

    console.log("Sending request to Claude API...");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey,
        "anthropic-version": "2023-06-01",
        // Add this required header
        "x-api-version": "2023-06-01",
        // Change x-api-key to Authorization
        "Authorization": `Bearer ${claudeApiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API error:", errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Make sure we're returning a properly formatted JSON response
    return NextResponse.json({
      content: result.content[0].text,
      success: true // Add this field
    });

  } catch (error) {
    console.error("Generate route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate content", details: errorMessage },
      { status: 500 }
    );
  }
}
