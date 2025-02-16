'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { encryptApiKey } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export type CreateSessionResponse = {
  sessionId: string;
  publicKey: string;
}

export default function ConnectAPI() {
  const apiKeyRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize session when component mounts
    const initSession = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/init-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data: CreateSessionResponse = await response.json();
      if (data.publicKey && data.sessionId) {
        console.log('🔑 Session initialized:', data);
        setPublicKey(data.publicKey);
        setSessionId(data.sessionId);
      } else {
        console.error('❌ Session initialization failed');
      }
    };

    initSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('🚀 Starting API key submission...');

    try {
      const apiKeyValue = apiKeyRef.current?.value.trim() || '';
      // Encrypt and validate
      const response = await encryptApiKey(apiKeyValue, publicKey!, sessionId!);
      //setEncryptedApiKey(response.encryptedApiKey);

      if (response.success) {
        console.log('🔍 Verifying session...');
        const verifySession = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify-session`, {
          credentials: 'include' // Important: includes cookies in the request
        });

        if (verifySession.ok) {
          console.log('✅ Session verified, redirecting to dashboard...');
          router.push('/dashboard');
        } else {
          console.log('❌ Session verification failed');
          throw new Error('Session verification failed');
        }
      } else {
        console.log('❌ Failed to store credentials');
        throw new Error('Failed to store credentials');
      }
    } catch (error) {
      console.error('❌ Error processing API key:', error);
      alert('An error occurred. Please try again.');
    } finally {
      // Clear the input for security
      if (apiKeyRef.current) {
        apiKeyRef.current.value = '';
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-circular">
      <Card className="w-full max-w-2xl mx-auto bg-[#ff705c] rounded-lg">
        <CardHeader className="bg-[#ff705c] border-b-2 border-white rounded-lg">
          <CardTitle className="flex justify-between items-center">
            <span className="text-2xl font-bold text-[#ffee52]">
              Connect Your Up Account
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-black"
              >
                Up Bank API Key
              </label>
              <input
                ref={apiKeyRef}
                id="apiKey"
                type="password"
                className="w-full p-2 border rounded-lg"
                placeholder="up:yeah:..."
                required
                aria-label="Up Bank API Key"
                autoComplete="off"
                spellCheck="false"
              />
              <p className="text-sm">
                You can find your API key in the Up app under Profile → API Access
              </p>
            </div>

            <Button
              variant="secondary"
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 rounded-full bg-[#ffee52] hover:bg-[#ffee52] text-black hover:text-black"
            >
              {isSubmitting ? 'Connecting...' : 'Connect Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
