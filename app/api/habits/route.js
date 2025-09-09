import dbConnect from '@/lib/dbConnect';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion'; 
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { calculateStreak } from '@/lib/streakCalculator'; 

function getUserIdFromToken() {
  const tokenCookie = cookies().get('token');
  if (!tokenCookie) {
    return null;
  }
  try {
    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
export async function GET(request) {

  cookies().get('token'); 

  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const habitsFromDB = await Habit.find({ userId })
      .populate({
        path: 'completions',
        options: { sort: { date: -1 } } 
      })
      .sort({ createdAt: 'desc' });
    const habitsWithStreaks = habitsFromDB.map(habit => {
      const habitObject = habit.toObject(); 
      const currentStreak = calculateStreak(habitObject.completions, habitObject.frequency);
      
      return {
        ...habitObject,
        currentStreak: currentStreak, 
      };
    });
      
    return NextResponse.json(habitsWithStreaks, { status: 200 });

  } catch (error) {
    console.error("GET_HABITS_ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request) {
  cookies().get('token');

  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
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
    console.error("CREATE_HABIT_ERROR:", error);
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
  }
}