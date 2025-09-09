'use client';

import { useRouter, usePathname } from 'next/navigation';

const Icon = ({ path }: { path: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/login');
    } else {
      alert('Logout failed. Please try again.');
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'My Habits', iconPath: "M4 6h16M4 12h16M4 18h16" },
    { href: '/dashboard/feed', label: "Friends' Feed", iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.39-2.142 3.002 3.002 0 013.39 2.142m0 0A3.002 3.002 0 0012 14v4.414M12 14A3 3 0 1112 8a3 3 0 010 6z" }
  ];

  return (
    <aside className="w-72 bg-background border-r-2 border-foreground p-6 flex flex-col">
  
      <h1 className="text-3xl font-bold text-foreground">
        Habit Track
      </h1>

      <nav className="mt-12">
        <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
          Menu
        </p>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a 
                href={link.href} 
                className={`flex items-center space-x-3 p-3 rounded-md font-bold text-lg transition-colors
                  ${pathname === link.href 
                    ? 'bg-foreground text-background' 
                    : 'text-foreground hover:bg-gray-100'
                  }`}
              >
                <Icon path={link.iconPath} />
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-grow"></div>
      <div className="border-t-2 border-foreground pt-4">

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-md font-bold text-lg text-muted hover:bg-red-500 hover:text-white transition-colors"
        >
          <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}