import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Habit from '@/models/Habit';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { calculateStreak } from '@/lib/streakCalculator'; 

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

    const currentUser = await User.findById(currentUserId).select('following');
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (currentUser.following.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    
    const followingIds = currentUser.following.map(id => new mongoose.Types.ObjectId(id));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const friendsData = await User.aggregate([
      
      { $match: { _id: { $in: followingIds } } },
   
      {
        $lookup: {
          from: 'habits',
          localField: '_id',
          foreignField: 'userId',
          as: 'habits'
        }
      },
      
      { $unwind: '$habits' },
      
      {
        $lookup: {
          from: 'habitcompletions',
          localField: 'habits._id',
          foreignField: 'habitId',
          as: 'habits.completions'
        }
      },

      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          habits: { $push: '$habits' }
        }
      },

      {
        $project: {
          _id: 0, 
          userId: '$_id',
          username: '$username',
          habits: 1 
        }
      }
    ]);
    const finalFeed = friendsData.map(friend => {
      const processedHabits = friend.habits.map(habit => {
        const isCompletedToday = habit.completions.some(comp => getStartOfDay(new Date(comp.date)).getTime() === today.getTime());
        const currentStreak = calculateStreak(habit.completions, habit.frequency);
        
        return {
          habitId: habit._id,
          name: habit.name,
          currentStreak: currentStreak,
          isCompletedToday: isCompletedToday,
        };
      });

      return {
        ...friend,
        habits: processedHabits,
      };
    });

    return NextResponse.json(finalFeed, { status: 200 });

  } catch (error) {
    console.error("FRIEND_FEED_API_ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch friends feed' }, { status: 500 });
  }
}

const getStartOfDay = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};