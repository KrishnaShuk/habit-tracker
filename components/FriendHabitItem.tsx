import React from 'react';

interface HabitStatus {
  name: string;
  currentStreak: number;
  isCompletedToday: boolean;
}

interface FriendHabitItemProps {
  habit: HabitStatus;
}

const FriendHabitItem = ({ habit }: FriendHabitItemProps) => {
  return (
    <div className="flex justify-between items-center text-sm py-2 border-b border-black border-opacity-10 last:border-b-0">
      <div>
        <p className="font-semibold">{habit.name}</p>
        <p className="opacity-70">🔥 {habit.currentStreak} Day Streak</p>
      </div>
      {habit.isCompletedToday ? (
        <div className="flex items-center space-x-2 text-green-600">
          <span className="font-bold">Done</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      ) : (
        <span className="font-semibold opacity-50">Pending</span>
      )}
    </div>
  );
};

export default FriendHabitItem;