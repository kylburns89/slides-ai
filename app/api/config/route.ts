import { NextRequest, NextResponse } from "next/server";

interface RuntimeConfig {
  CLAUDE_API_KEY?: string;
  GROQ_API_KEY?: string;
  OPENAI_API_KEY?: string;
}

interface ConfigRequestBody {
  groq?: string;
  claude?: string;
  openai?: string;
}

// Create a global store without modifying globalThis
const store: { config: RuntimeConfig } = {
  config: {
    CLAUDE_API_KEY: undefined,
    GROQ_API_KEY: undefined,
    OPENAI_API_KEY: undefined
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ConfigRequestBody;
    const { groq, claude, openai } = body;

    // Update runtime config
    store.config = {
      CLAUDE_API_KEY: claude || store.config.CLAUDE_API_KEY,
      GROQ_API_KEY: groq || store.config.GROQ_API_KEY,
      OPENAI_API_KEY: openai || store.config.OPENAI_API_KEY,
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
