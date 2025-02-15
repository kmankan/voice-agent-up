import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const styles = {
  upCoral: '#ff705c',
  upYellow: '#ffee52',
  upTeal: '#489b98',
  upDarkTeal: '#305555',
  upPink: '#ff8bd1'
};

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-[#ff705c]">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="text-5xl font-extrabold text-[#ffee52] text-center font-circular">
          Up Bank Assistant
        </h1>

        <div className="flex flex-col gap-12 max-w-xl mx-auto">
          <Link href="/chat">
            <Card className="h-64 transition-transform hover:scale-105 cursor-pointer rounded-3xl bg-[#ffee52] border-2 border-black">
              <CardContent className="h-full flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl"
              >
                <h2 className="text-2xl font-semibold text-[#ff705c]">Learn About Up</h2>
                <p className="text-center text-[#305555]">
                  Chat with our AI assistant to learn everything about Up Bank&apos;s products and services
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account">
            <Card className="h-64 transition-transform hover:scale-105 cursor-pointer rounded-3xl bg-[#305555] border-2 border-black">
              <CardContent className="h-full flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl">
                <h2 className="text-2xl font-semibold text-[#ff705c]">Account Explorer</h2>
                <p className="text-center text-[#ffee52]">
                  Connect with your Up Bank API to explore your finances
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
