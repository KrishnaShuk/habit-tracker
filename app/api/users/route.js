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

export async function GET(request) {
  try {
    const currentUserId = getUserIdFromToken();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const currentUser = await User.findById(currentUserId).select('following');
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('search');

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: currentUserId }
    }).select('username _id');
    const followingIds = new Set(currentUser.following.map(id => id.toString()));

    const results = users.map(user => {
      return {
        _id: user._id,
        username: user.username,
        isFollowing: followingIds.has(user._id.toString())
      };
    });

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("USER_SEARCH_ERROR:", error);
    return NextResponse.json({ error: 'Failed to search for users' }, { status: 500 });
  }
}