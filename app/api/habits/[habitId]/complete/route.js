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

export async function POST(request, { params }) {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { habitId } = params;
    await dbConnect();
    const habit = await Habit.findOne({ _id: habitId, userId: userId });
    if (!habit) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingCompletion = await HabitCompletion.findOne({
      habitId: habitId,
      date: { $gte: today }
    });
    if (existingCompletion) {
      return NextResponse.json({ error: 'Habit already completed today' }, { status: 409 });
    }
    const completion = await HabitCompletion.create({
      habitId: habitId,
      date: new Date(),
      userId: userId,
      habitName: habit.name
    });
    await Habit.findByIdAndUpdate(habitId, { $push: { completions: completion._id } });
    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error("COMPLETE_HABIT_ERROR:", error);
    return NextResponse.json({ error: 'Failed to complete habit' }, { status: 500 });
  }
}

// --- DELETE (Mark habit as incomplete) ---
export async function DELETE(request, { params }) {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { habitId } = params;
    await dbConnect();
    const habit = await Habit.findOne({ _id: habitId, userId: userId });
    if (!habit) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const completionToDelete = await HabitCompletion.findOne({
      habitId: habitId,
      date: { $gte: today, $lt: tomorrow }
    });
    if (!completionToDelete) {
      return NextResponse.json({ error: 'Habit was not completed today' }, { status: 404 });
    }
    await HabitCompletion.findByIdAndDelete(completionToDelete._id);
    await Habit.findByIdAndUpdate(habitId, { $pull: { completions: completionToDelete._id } });
    return NextResponse.json({ message: 'Habit marked as incomplete' }, { status: 200 });
  } catch (error) {
    console.error("UNCOMPLETE_HABIT_ERROR:", error);
    return NextResponse.json({ error: 'Failed to un-complete habit' }, { status: 500 });
  }
}