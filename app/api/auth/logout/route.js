import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Set the cookie with an immediate expiration date to delete it
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set to a past date
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}