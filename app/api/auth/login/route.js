import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}