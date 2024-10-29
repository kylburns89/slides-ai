import { NextRequest, NextResponse } from "next/server";

declare global {
  var runtimeConfig: {
    CLAUDE_API_KEY?: string;
    GROQ_API_KEY?: string;
    OPENAI_API_KEY?: string;
  };
}

// Initialize global runtime config if it doesn't exist
globalThis.runtimeConfig = globalThis.runtimeConfig || {};

export async function POST(req: NextRequest) {
  try {
    const { groq, claude, openai } = await req.json();

    // Update runtime config
    globalThis.runtimeConfig = {
      CLAUDE_API_KEY: claude || globalThis.runtimeConfig.CLAUDE_API_KEY,
      GROQ_API_KEY: groq || globalThis.runtimeConfig.GROQ_API_KEY,
      OPENAI_API_KEY: openai || globalThis.runtimeConfig.OPENAI_API_KEY,
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Config update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
