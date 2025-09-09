import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), 
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}