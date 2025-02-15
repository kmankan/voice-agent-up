import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export function AccountExplorerCard() {
  const router = useRouter();

  const handleClick = async () => {
    // Check for existing session
    const hasValidSession = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify-session`, {
      credentials: 'include',
    }).then(res => res.ok).catch(() => false);

    // Redirect to dashboard if session exists, otherwise go to account page
    router.push(hasValidSession ? '/dashboard' : '/account');
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