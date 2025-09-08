import dbConnect from '@/lib/dbConnect';
import Habit from '@/models/Habit';
import { NextResponse } from 'next/server';

// This is a placeholder for getting the authenticated user's ID
// In a real app, this would come from a decoded JWT or session
async function getUserIdFromRequest(request) {
    // For now, we'll read it from a header for testing purposes
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        throw new Error("User not authenticated");
    }
    return userId;
}

export async function POST(request) {
  await dbConnect();

  try {
    const userId = await getUserIdFromRequest(request);
    const { name, frequency, category } = await request.json();

    if (!name || !frequency) {
      return NextResponse.json({ error: 'Name and frequency are required' }, { status: 400 });
    }

    const existingHabit = await Habit.findOne({ name, userId });
    if (existingHabit) {
      return NextResponse.json({ error: 'A habit with this name already exists.' }, { status: 409 });
    }

    const habit = await Habit.create({ name, frequency, category, userId });
    return NextResponse.json(habit, { status: 201 });

  } catch (error) {
    if (error.message === "User not authenticated") {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}

export async function GET(request) {
    await dbConnect();

    try {
        const userId = await getUserIdFromRequest(request);
        const habits = await Habit.find({ userId }).populate('completions');
        return NextResponse.json(habits, { status: 200 });
    } catch (error) {
        if (error.message === "User not authenticated") {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
    }
}