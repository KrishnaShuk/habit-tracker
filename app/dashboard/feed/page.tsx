'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the shape/type for a user object returned from our search API
interface UserSearchResult {
  _id: string;
  username: string;
  isFollowing: boolean;
}

// Define the shape/type for a single item in our activity feed
interface FeedItem {
  _id: string;
  habitName: string;
  date: string;
  userId: {
    _id: string;
    username: string;
  };
}

// A simple utility function to format dates into "time ago" strings
const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);

  // --- Search Logic ---
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    // Debounce to prevent API calls on every keystroke
    const timer = setTimeout(() => {
      fetch(`/api/users?search=${searchQuery}`)
        .then(res => {
          if (!res.ok) {
            console.error('Search API responded with an error');
            return []; // Return empty array to prevent crash
          }
          return res.json();
        })
        .then(data => {
          // Robustness: ensure the data is an array before setting state
          if (Array.isArray(data)) {
            setSearchResults(data);
          } else {
            setSearchResults([]);
          }
        })
        .catch(err => {
          console.error("Failed to search users:", err);
          setSearchResults([]); // Set to empty array on fetch failure
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- Follow/Unfollow Logic ---
  const handleToggleFollow = async (userId: string, currentlyFollowing: boolean) => {
    const method = currentlyFollowing ? 'DELETE' : 'POST';
    const action = currentlyFollowing ? 'unfollow' : 'follow';
    
    // Optimistic UI Update for instant feedback
    setSearchResults(prevResults =>
      prevResults.map(user =>
        user._id === userId ? { ...user, isFollowing: !currentlyFollowing } : user
      )
    );
    
    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method });
      if (!res.ok) {
        throw new Error(`Failed to ${action}`);
      }
      // Refresh the feed in the background after a successful follow/unfollow
      fetchFeed();
    } catch (err) {
      alert(`Failed to ${action} user. Reverting UI.`);
      // Revert UI on error
      setSearchResults(prevResults =>
        prevResults.map(user =>
          user._id === userId ? { ...user, isFollowing: currentlyFollowing } : user
        )
      );
    }
  };
  
  // --- Feed Fetching Logic ---
  const fetchFeed = useCallback(async () => {
    setIsFeedLoading(true);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeedItems(data);
      }
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

      {/* Search Section */}
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

      {/* Activity Feed Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        {isFeedLoading ? (
          <p className="text-muted">Loading feed...</p>
        ) : feedItems.length > 0 ? (
          <div className="space-y-4">
            {feedItems.map(item => (
              <div key={item._id} className="card p-4">
                <p>
                  <span className="font-bold">{item.userId?.username || 'A user'}</span> completed "{item.habitName}"
                </p>
                <p className="text-sm text-muted mt-1">{timeAgo(new Date(item.date))}</p>
              </div>
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