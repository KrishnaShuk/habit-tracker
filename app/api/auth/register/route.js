import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    // Now expecting 'username' in the request body
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    // You can add more specific validation here if you like

    // Check if email OR username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ error: 'This username is already taken' }, { status: 409 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username, // Save the new username
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    // Handle potential validation errors from the schema
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}