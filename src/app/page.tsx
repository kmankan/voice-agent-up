'use client';

import { UpDashboardCard } from './components/main/UpDashboardCard';
import { AccountExplorerCard } from './components/main/AccountExplorerCard';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-[#ff705c]">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-extrabold text-[#ffee52] text-center font-circular">
          Up Bank Assistant
        </h1>
        <div className="flex flex-col gap-8 max-w-xl mx-auto">
          <UpDashboardCard />
          <AccountExplorerCard />
        </div>
      </div>
    </main>
  );
}





