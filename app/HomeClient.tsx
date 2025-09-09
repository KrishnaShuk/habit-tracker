'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeClient() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted">Loading your workspace...</p>
    </div>
  );
}