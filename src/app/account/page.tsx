'use client';

import { useState, useEffect } from 'react';
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

export default function AccountPage() {
  const [apiKey, setApiKey] = useState('');
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
      const { publicKey, sessionId } = await response.json();
      setPublicKey(publicKey);
      setSessionId(sessionId);
    };

    initSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await encryptApiKey(apiKey, publicKey!, sessionId!);
    if (response.ok) {
      router.push('/dashboard');
    } else {
      throw new Error('Failed to store credentials');
    }

    setIsSubmitting(false);
    const isValid = await testUpAPIKey(apiKey);
    if (isValid) {
      router.push('/dashboard');
    } else {
      console.log('API key is invalid');
      alert('Invalid API key, please try again.');
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
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="up:yeah:..."
                required
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
