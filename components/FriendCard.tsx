import React from 'react';
import FriendHabitItem from './FriendHabitItem';
import { avatars } from './avatars';

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

interface FriendCardProps {
  friend: FriendData;
  color: string;
  avatarIndex: number;
}

const FriendCard = ({ friend, color, avatarIndex }: FriendCardProps) => {
  const selectedAvatar = avatars[avatarIndex % avatars.length];

  return (
    <div className={`p-6 rounded-lg border-2 border-foreground shadow-solid ${color}`}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-foreground p-1 text-black">
          {selectedAvatar}
        </div>
        <h3 className="text-2xl font-bold text-foreground">{friend.username}</h3>
      </div>
      
      {/* Habits List */}
      <div>
        {friend.habits.length > 0 ? (
          friend.habits.map((habit) => (
            <FriendHabitItem key={habit.habitId} habit={habit} />
          ))
        ) : (
          <p className="text-center text-foreground opacity-70 py-4">
            No habits to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendCard;