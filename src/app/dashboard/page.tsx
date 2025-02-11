'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      console.log('📊 Fetching UP summary...');
      try {
        const response = await fetch('http://localhost:3010/up/get-summary', {
          method: 'GET',
          credentials: 'include' // Important: sends the session cookie
        });

        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }

        const data = await response.json();
        console.log('✅ Summary received');
        setSummary(data);
      } catch (err) {
        console.error('❌ Error fetching summary:', err);
        setError('Failed to load summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {/* We'll add the summary display later */}
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}