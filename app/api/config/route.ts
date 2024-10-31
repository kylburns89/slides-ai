import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasClaudeKey: !!process.env.ANTHROPIC_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: Request) {
  const { key } = await req.json();
  
  // If checking for Claude key
  if (key === 'claude') {
    return NextResponse.json({
      hasKey: !!process.env.ANTHROPIC_API_KEY,
      key: process.env.ANTHROPIC_API_KEY || null
    });
  }
  
  // If checking for OpenAI key
  if (key === 'openai') {
    return NextResponse.json({
      hasKey: !!process.env.OPENAI_API_KEY,
      key: process.env.OPENAI_API_KEY || null
    });
  }
  
  // If checking for Groq key
  if (key === 'groq') {
    return NextResponse.json({
      hasKey: !!process.env.GROQ_API_KEY,
      key: process.env.GROQ_API_KEY || null
    });
  }

  return NextResponse.json({ hasKey: false, key: null });
}
