import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
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
  const { userId: userIdToFollow } = params;

  try {
    const currentUserId = getUserIdFromToken();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (currentUserId === userIdToFollow) {
      return NextResponse.json({ error: "You cannot follow yourself." }, { status: 400 });
    }

    await dbConnect();

    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: userIdToFollow } });
    await User.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: currentUserId } });

    return NextResponse.json({ message: 'Successfully followed user.' }, { status: 200 });

  } catch (error) {
    console.error("FOLLOW_USER_ERROR:", error);
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
  }
}

// --- DELETE (Unfollow a user) ---
export async function DELETE(request, { params }) {
  const { userId: userIdToUnfollow } = params;

  try {
    const currentUserId = getUserIdFromToken();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    await User.findByIdAndUpdate(currentUserId, { $pull: { following: userIdToUnfollow } });
    await User.findByIdAndUpdate(userIdToUnfollow, { $pull: { followers: currentUserId } });

    return NextResponse.json({ message: 'Successfully unfollowed user.' }, { status: 200 });

  } catch (error) {
    console.error("UNFOLLOW_USER_ERROR:", error);
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 });
  }
}