import dbConnect from '@/lib/dbConnect';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

function getUserIdFromToken() {
  const tokenCookie = cookies().get('token');
  if (!tokenCookie) return null;
  try {
    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habitId } = params;
    const body = await request.json();

    await dbConnect();

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: habitId, userId: userId }, // Ensure user owns the habit
      body,
      { new: true, runValidators: true } // Return the updated doc and run schema validators
    );

    if (!updatedHabit) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(updatedHabit, { status: 200 });

  } catch (error) {
    console.error("UPDATE_HABIT_ERROR:", error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habitId } = params;
    await dbConnect();

    const habitToDelete = await Habit.findOne({ _id: habitId, userId: userId });
    if (!habitToDelete) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }
    await HabitCompletion.deleteMany({ habitId: habitId });

    await Habit.findByIdAndDelete(habitId);

    return NextResponse.json({ message: 'Habit deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error("DELETE_HABIT_ERROR:", error);
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}