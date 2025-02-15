import { Card, CardContent } from '@/components/ui/card';
import Link from "next/link";

export function UpDashboardCard() {
  return (
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
  );
}