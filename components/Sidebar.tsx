'use client';

import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    // Call the logout API endpoint
    const res = await fetch('/api/auth/logout', { method: 'POST' });

    if (res.ok) {
      // If logout is successful, redirect to the login page
      router.push('/login');
    } else {
      // Handle potential errors
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <aside className="w-64 bg-background border-r-2 border-foreground p-6 flex flex-col">
      <h1 className="text-2xl font-bold">Habit Track</h1>

      <nav className="mt-10">
        <ul>
          <li>
            <a href="/dashboard" className="block py-2 font-semibold text-primary">
              My Habits
            </a>
          </li>
          {/* We can add more links here later, like Friends' Feed */}
        </ul>
      </nav>

      {/* Spacer to push logout to the bottom */}
      <div className="flex-grow"></div>

      <div>
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 font-semibold text-muted hover:text-foreground"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}