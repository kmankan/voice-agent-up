// app/api/ask/route.ts
import { NextResponse } from 'next/server';
import { generateAnswer } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const answer = await generateAnswer(question);
    console.log('question:', question);
    console.log('answer:', answer);
    
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer' },
      { status: 500 }
    );
  }
}