'use client';

import { useState } from 'react';
import { categoryDetailsMap } from '@/lib/habit-suggestions';

export interface Habit {
  _id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  category: string;
  completions: { date: string }[];
  currentStreak: number; 
}

interface HabitItemProps {
  habit: Habit;
  onHabitCompleted: () => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

// Helper function to check if a habit was completed today
const isCompletedToday = (completions: { date: string }[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return completions.some(comp => {
    const compDate = new Date(comp.date);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === today.getTime();
  });
};

export default function HabitItem({ habit, onHabitCompleted, onEdit, onDelete }: HabitItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const completed = isCompletedToday(habit.completions);
  
  const category = categoryDetailsMap[habit.category] || { icon: '🎯', color: '#A1A1A1' };

  const handleToggleCompletion = async () => {
    const method = completed ? 'DELETE' : 'POST';
    const action = completed ? 'un-complete' : 'complete';

    try {
      const res = await fetch(`/api/habits/${habit._id}/complete`, {
        method: method,
      });

      if (res.ok) {
        onHabitCompleted(); // Refresh the data on success
      } else {
        const data = await res.json();
        // Don't show an alert for a 409, as it's an expected race condition
        if (res.status !== 409) {
          throw new Error(data.error || `Failed to ${action} habit`);
        }
      }
    } catch (error) {
      console.error(error);
      alert(`An error occurred. Could not ${action} the habit.`);
    }
  };

  return (
    <div 
      className="card p-4 flex justify-between items-center relative border-l-4 transition-all"
      style={{ borderLeftColor: completed ? '#FF90E8' : category.color }}
    >
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <p className="font-semibold text-lg">{habit.name}</p>
          <p className="text-muted text-sm mt-1">
            🔥 {habit.currentStreak} {habit.frequency === 'daily' ? 'Day' : 'Week'} Streak
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleToggleCompletion}
          className={`w-14 h-14 rounded-full border-2 border-foreground flex items-center justify-center transition-all duration-200 cursor-pointer
            ${completed ? 'bg-primary border-primary' : 'hover:border-primary'}
          `}
          aria-label={`Toggle completion for ${habit.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-7 w-7 transition-colors duration-200 ${completed ? 'text-white' : 'text-foreground'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Habit options">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
        </button>

        {menuOpen && (
          <div className="absolute top-14 right-4 bg-background border-2 border-foreground shadow-solid z-10 w-36 rounded-md">
            <button onClick={() => { onEdit(habit); setMenuOpen(false); }} className="w-full text-left px-4 py-2 font-semibold hover:bg-gray-100 rounded-t-md">
              Edit
            </button>
            <button onClick={() => { onDelete(habit._id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 font-semibold text-red-600 hover:bg-gray-100 rounded-b-md">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}