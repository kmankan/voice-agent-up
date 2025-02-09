import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const styles = {
  upCoral: '#ff705c',
  upYellow: '#ffee52',
  upTeal: '#489b98',
  upDarkTeal: '#305555'
};

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-[#ff705c]">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center font-primary">
          Up Bank Voice Assistant
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/chat">
            <Card className="h-64 transition-transform hover:scale-105 cursor-pointer">
              <CardContent className="h-full flex flex-col items-center justify-center p-6 space-y-4"
                style={{ backgroundColor: `${styles.upYellow}20`, borderColor: styles.upYellow }}>
                <h2 className="text-2xl font-semibold text-[#ff705c]">Learn About Up</h2>
                <p className="text-center text-[#305555]">
                  Chat with our AI assistant to learn everything about Up Bank's products and services
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account">
            <Card className="h-64 transition-transform hover:scale-105 cursor-pointer">
              <CardContent className="h-full flex flex-col items-center justify-center p-6 space-y-4"
                style={{ backgroundColor: `${styles.upTeal}20`, borderColor: styles.upTeal }}>
                <h2 className="text-2xl font-semibold text-[#489b98]">Account Explorer</h2>
                <p className="text-center text-[#305555]">
                  Connect your Up Bank account to explore your finances with voice commands
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
