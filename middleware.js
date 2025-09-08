import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // 1. Get the token from the user's cookies
  const token = request.cookies.get('token')?.value;
  
  // 2. Get the path the user is trying to access
  const { pathname } = request.nextUrl;
  
  // 3. Define which paths are considered authentication pages
  const isAuthPage = pathname === '/login'; // In our case, only the login page

  // LOGIC: The user is logged in
  if (token) {
    // If they are trying to visit the login page, redirect them to the dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // LOGIC: The user is NOT logged in
  if (!token) {
    // If they are trying to visit any page that is NOT an auth page,
    // redirect them to the login page.
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If none of the above conditions are met, let the user proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // This matcher tells the middleware to run on ONLY these paths
  // This prevents it from running on unnecessary routes like images or CSS files
  matcher: [
    '/dashboard', // Protect the dashboard
    '/login',     // Handle redirects for already logged-in users
  ],
};