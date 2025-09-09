'use client';

import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  const handleLogout = async () => {
    // ... (logout logic remains the same)
  };

  return (
    <aside className="w-64 bg-background border-r-2 border-foreground p-6 flex flex-col">
      <h1 className="text-2xl font-bold">Habit Track</h1>

      <nav className="mt-10">
        <ul className="space-y-2">
          {/* My Habits Link */}
          <li>
            <a 
              href="/dashboard" 
              className={`block py-2 font-semibold ${pathname === '/dashboard' ? 'text-primary' : 'hover:text-primary'}`}
            >
              My Habits
            </a>
          </li>
          
          {/* --- NEW FRIENDS' FEED LINK --- */}
          <li>
            <a 
              href="/dashboard/feed" 
              className={`block py-2 font-semibold ${pathname === '/dashboard/feed' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Friends' Feed
            </a>
          </li>
        </ul>
      </nav>

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