import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';


const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '600'], 
});


export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your habits, build your future.',
};


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
    
      <body className={lexend.className}>
        {children}
      </body>
    </html>
  );
}