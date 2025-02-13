import { NextResponse } from 'next/server';

const BLAND_API_KEY = process.env.BLAND_API_KEY;
const initialPrompt = "You are a friendly personal assistant that helps users understand their bank accounts and transactions."

export async function POST() {
  if (!BLAND_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const options = {
      method: 'POST',
      headers: {
        authorization: BLAND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: "+61451667601",
        // pathway_id: "default",
        task: initialPrompt,
        voice: "lucy",
        first_sentence: "Hello! i'm here to help you understand your Up account. Ask me anything you want to know about transactions, accounts, or anything else you need.",
        wait_for_greeting: true,
        webhook: "https://webhook.site/4f9b3360-9a04-4373-b9f1-4999d2696813"
      })
    };

    const response = await fetch('https://api.bland.ai/v1/calls', options);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initiate call' }, { status: 500 });
  }
} 