'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { encryptApiKey, testUpAPIKey } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const styles = {
  upCoral: '#ff705c',
  upYellow: '#ffee52',
  upTeal: '#489b98',
  upDarkTeal: '#305555'
};

export type CreateSessionResponse = {
  sessionId: string;
  publicKey: string;
}

export default function AccountPage() {
  const apiKeyRef = useRef<HTMLInputElement>(null);
  //const [encryptedApiKey, setEncryptedApiKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize session when component mounts
    const initSession = async () => {
      const response = await fetch('http://localhost:3010/auth/init-session', {
        method: 'POST'
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
        const verifySession = await fetch('http://localhost:3010/auth/verify-session', {
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
    <div style={{ backgroundColor: styles.upTeal }} className="min-h-screen p-4">
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl">
        <CardHeader style={{ backgroundColor: `${styles.upYellow}20` }}>
          <CardTitle className="flex justify-between items-center">
            <span style={{ color: styles.upTeal }} className="text-2xl font-bold">
              Connect Your Up Account
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium"
                style={{ color: styles.upDarkTeal }}
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
              <p className="text-sm text-gray-500">
                You can find your API key in the Up app under Profile → API Access
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: styles.upTeal,
                color: 'white'
              }}
            >
              {isSubmitting ? 'Connecting...' : 'Connect Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
