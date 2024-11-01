import { NextRequest, NextResponse } from "next/server";
import Anthropic from '@anthropic-ai/sdk';

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
    const { content, type, slideCount } = data;

    // Debug logging for API key sources
    const headerKey = req.headers.get('x-api-key');
    const envKey = process.env.ANTHROPIC_API_KEY;
    const bodyKey = data.apiKey;

    console.log("API Key sources:");
    console.log("- Header key present:", !!headerKey);
    console.log("- Environment key present:", !!envKey);
    console.log("- Request body key present:", !!bodyKey);

    // Get API key from request headers first, then environment, then request body
    const claudeApiKey = headerKey || envKey || bodyKey;
    if (!claudeApiKey) {
      console.error("No Claude API key available from any source");
      return NextResponse.json({
        content: "",
        success: false,
        error: "Authentication configuration missing"
      }, { status: 401 });
    }


    // Log key details (safely)
    const keyLength = claudeApiKey.length;
    const keyPrefix = claudeApiKey.substring(0, 5);
    const keySource = headerKey ? 'header' : (envKey ? 'environment' : 'body');
    console.log(`Using API key from ${keySource}: length=${keyLength}, prefix=${keyPrefix}...`);

    console.log("Starting Claude API request...");
    const userPrompt = type === "audio" 
      ? `Convert this transcribed speech into exactly ${slideCount} HTML presentation slides: ${content}`
      : `Convert this text into exactly ${slideCount} HTML presentation slides: ${content}`;

    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    });

  try {
    console.log("Sending request to Claude API...");
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: getSystemPrompt(slideCount),
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const generateResponse: GenerateResponse = {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      success: true
    };
    
    return NextResponse.json(generateResponse);
  } catch (anthropicError) {
    console.error("Anthropic API error:", anthropicError);
    
    // Check for specific Anthropic error types
    if (anthropicError instanceof Anthropic.APIError) {
      if (anthropicError.status === 401) {
        return NextResponse.json({
          content: "",
          success: false,
          error: "Invalid API key or authentication failed"
        }, { status: 401 });
      }
    }
    
    throw anthropicError; // Let the outer catch handle other errors
  }
} catch (error) {
  console.error("Generate route error:", error);
  const errorResponse: GenerateResponse = {
    content: "",
    success: false,
    error: error instanceof Error ? error.message : "Unknown error"
  };
 
  return NextResponse.json(errorResponse, { status: 500 });
}
}