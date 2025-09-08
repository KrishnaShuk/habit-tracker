import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';

// Configure the font (this part is the same)
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '600'], // Regular and Semi-bold
});

// We import the Metadata type from Next.js to type our metadata object.
export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your habits, build your future.',
};

// This is the main change for TypeScript:
// We define the type for our component's props.
// The 'children' prop is a standard React pattern, and its type is React.ReactNode.
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/* 
        The font's class name is applied to the body.
        The layout structure remains identical.
      */}
      <body className={lexend.className}>
        {children}
      </body>
    </html>
  );
}