import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { encrypt } from "./encrypt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function testUpAPIKey(apiKey: string) {
  try {
    const response = await fetch('https://api.up.com.au/api/v1/util/ping', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.log('Invalid API key:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('API key is valid:', data);
    return true;
  } catch (error) {
    console.error('API connection error:', error);
    return false;
  }
}

export async function encryptApiKey(apiKey: string, publicKey: string, sessionId: string) {
  // Encrypt API key with public key
  const encryptedApiKey = await encrypt(apiKey, publicKey!);
  // Send encrypted key to backend
  const response = await fetch('http://localhost:3010/auth/up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      sessionId,
      encryptedApiKey
    })
  });
  return response;
}