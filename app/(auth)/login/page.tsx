'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleModeToggle = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-16">
      {/* 1. LARGER HEADING & MORE SPACE */}
      <div className="text-center">
        <h1 className="text-7xl font-bold text-foreground">
          Welcome to Habit Track
        </h1>
        <p className="text-muted mt-3">
          Sign in or create an account to start building better habits.
        </p>
      </div>

      {/* 2. THE GUMROAD CARD WITH SOLID SHADOW */}
      <div className="card w-full max-w-sm p-8 space-y-11 shadow-solid">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input-base text-lg"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="input-base text-lg"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={handleModeToggle} className="font-semibold text-primary hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}