import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long'}, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}