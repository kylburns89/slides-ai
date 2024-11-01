import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasClaudeKey: !!process.env.ANTHROPIC_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    
    // If checking for Claude key
    if (key === 'claude') {
      return NextResponse.json({
        hasKey: !!process.env.ANTHROPIC_API_KEY,
        key: process.env.ANTHROPIC_API_KEY || null
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // If checking for OpenAI key
    if (key === 'openai') {
      return NextResponse.json({
        hasKey: !!process.env.OPENAI_API_KEY,
        key: process.env.OPENAI_API_KEY || null
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // If checking for Groq key
    if (key === 'groq') {
      return NextResponse.json({
        hasKey: !!process.env.GROQ_API_KEY,
        key: process.env.GROQ_API_KEY || null
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return NextResponse.json({ 
      hasKey: false, 
      key: null,
      error: 'Invalid key type specified'
    }, {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Config route error:', error);
    return NextResponse.json({
      hasKey: false,
      key: null,
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
