import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { authHeaders, getAuthToken } from '@/lib/auth';

export function AccountExplorerCard() {
  const router = useRouter();

  const handleClick = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push('/account');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify-session`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        console.error('Session verification failed:', response.status);
        router.push('/account');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Session verification error:', error);
      router.push('/account');
    }
  };

  return (
    <div onClick={handleClick}>
      <Card className="h-64 transition-transform hover:scale-105 cursor-pointer rounded-3xl bg-[#305555] border-2 border-black">
        <CardContent className="h-full flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl">
          <h2 className="text-2xl font-semibold text-[#ff705c]">Account Explorer</h2>
          <p className="text-center text-[#ffee52]">
            Connect with your Up Bank API to explore your finances
          </p>
        </CardContent>
      </Card>
    </div>
  );
}