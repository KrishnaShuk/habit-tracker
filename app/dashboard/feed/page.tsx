'use client';

import { useState, useEffect, useCallback } from 'react';
import FriendCard from '@/components/FriendCard'; 
interface UserSearchResult {
  _id: string;
  username: string;
  isFollowing: boolean;
}
interface FriendData {
  userId: string;
  username: string;
  habits: {
    habitId: string;
    name: string;
    currentStreak: number;
    isCompletedToday: boolean;
  }[];
}

export default function FeedPage() {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  
  const [feedData, setFeedData] = useState<FriendData[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/users?search=${searchQuery}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) setSearchResults(data);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

 
  const handleToggleFollow = async (userId: string, currentlyFollowing: boolean) => {
    const method = currentlyFollowing ? 'DELETE' : 'POST';
    const action = currentlyFollowing ? 'unfollow' : 'follow';

    setSearchResults(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: !currentlyFollowing } : u));
    
    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      fetchFeed(); 
    } catch (err) {
      alert(`Failed to ${action} user. Reverting.`);
      setSearchResults(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: currentlyFollowing } : u));
    }
  };
  
  const fetchFeed = useCallback(async () => {
    setIsFeedLoading(true);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (Array.isArray(data)) setFeedData(data);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setIsFeedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Friends' Feed</h1>

 
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Find Friends</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username..."
          className="input-base text-lg w-full max-w-md"
        />
        <div className="mt-4 space-y-2">
          {isSearching && <p className="text-muted">Searching...</p>}
          {!isSearching && searchResults.map(user => (
            <div key={user._id} className="flex justify-between items-center card p-3 max-w-md">
              <p className="font-semibold">{user.username}</p>
              <button 
                onClick={() => handleToggleFollow(user._id, user.isFollowing)}
                className={`py-1 px-4 text-sm font-semibold border-2 border-foreground transition-colors
                  ${user.isFollowing ? 'bg-background text-foreground hover:bg-gray-100' : 'btn-primary'}
                `}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <hr className="border-foreground my-8" />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Friends' Progress Today</h2>
        {isFeedLoading ? (
          <p className="text-muted">Loading friends' progress...</p>
        ) : feedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedData.map((friend, index) => (
              <FriendCard 
                key={friend.userId} 
                friend={friend}
                color={cardColors[index % cardColors.length]}
                avatarIndex={index % 3}
              />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-muted">Activity from friends you follow will appear here. Find and follow some friends to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const cardColors = [
  'bg-green-200',
  'bg-orange-200',
  'bg-blue-200',
  'bg-yellow-200',
  'bg-purple-200',
];