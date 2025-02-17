import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//import { encrypt } from "./encrypt";
import crypto from 'crypto';

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

export const encryptApiKey = async (apiKey: string, publicKey: string, sessionId: string) => {
  console.log('🔐 Encrypting API key...');
  
  // Create a Buffer from the API key
  const buffer = Buffer.from(apiKey);
  
  // Encrypt using the public key
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );
  
  // Convert to base64
  const encryptedBase64 = encrypted.toString('base64');
  
  console.log('📡 Sending encrypted key to backend...');
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/recieve-key`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      sessionId,
      encryptedApiKey: encryptedBase64,
    }),
  });

  // Add this to debug cookie handling
  const setCookie = response.headers.get('set-cookie');
  console.log('🍪 Set-Cookie header:', setCookie);
  console.log('🍪 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    console.log('✨ Backend response received: failed');
    return { success: false };
  }

  const data = await response.json();
  console.log('✨ Backend response received:', response.ok ? 'success' : 'failed');
  
  return {
    success: response.ok && data.success,
    encryptedApiKey: encryptedBase64,
  };
}