import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
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

export async function GET(request) {
  try {
    const currentUserId = getUserIdFromToken();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(currentUserId).select('following');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.following.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const feedCompletions = await HabitCompletion.find({
      userId: { $in: user.following }
    })
    .sort({ date: -1 })
    .limit(50)
    .populate('userId', 'username');

    return NextResponse.json(feedCompletions, { status: 200 });

  } catch (error) {
    console.error("FEED_API_ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch activity feed' }, { status: 500 });
  }
}