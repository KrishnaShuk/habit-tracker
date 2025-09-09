'use client';

import { useState, useEffect } from 'react';
import { habitCategories } from '@/lib/habit-suggestions'; 
import { Habit } from './HabitItem';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitUpserted: () => void;
  mode: 'create' | 'edit';
  initialData?: Habit;
}

export default function HabitModal({ isOpen, onClose, onHabitUpserted, mode, initialData }: HabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setHabitName(initialData.name);
        setFrequency(initialData.frequency);
        setCategory(initialData.category || '');
      } else {
        setHabitName('');
        setFrequency('daily');
        setCategory('');
      }
      setError('');
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!habitName) {
      setError('Please select or enter a habit name.');
      setIsLoading(false);
      return;
    }

    const endpoint = mode === 'create' ? '/api/habits' : `/api/habits/${initialData?._id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: habitName, frequency, category }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${mode} habit`);
      }
      
      onHabitUpserted();
      onClose();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSuggestionClick = (name: string, catName: string) => {
    setHabitName(name);
    setCategory(catName);
  };

  return (
    <div className="fixed inset-0 bg-foreground bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-2xl p-8 shadow-solid max-h-[90vh] flex flex-col">
        <h2 className="text-3xl font-semibold mb-2">{mode === 'create' ? 'New Habit' : 'Edit Habit'}</h2>
        <p className="text-muted mb-6">{mode === 'create' ? 'Choose a suggestion or create your own.' : 'Update your habit details.'}</p>
        
        <div className="flex-grow overflow-y-auto pr-2">
          {mode === 'create' && (
            <div className="space-y-6">
              {habitCategories.map((cat) => (
                <div key={cat.name}>
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cat.habits.map((habit) => (
                      <button
                        key={habit}
                        onClick={() => handleSuggestionClick(habit, cat.name)}
                        className="text-sm font-semibold py-1 px-3 rounded-md transition-transform hover:scale-105"
                        style={{ backgroundColor: cat.color, color: 'white' }}
                      >
                        {habit}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t-2 border-foreground">
          <div className="space-y-4">
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Or type a custom habit..."
              className="input-base text-xl w-full"
            />
            
            <div className="flex items-center space-x-4">
                <p className="font-semibold">Frequency:</p>
                <button 
                  type="button" 
                  onClick={() => setFrequency('daily')}
                  className={`py-1 px-4 font-semibold border-2 border-foreground ${frequency === 'daily' ? 'bg-foreground text-background' : ''}`}
                >
                  Daily
                </button>
                <button 
                  type="button" 
                  onClick={() => setFrequency('weekly')}
                  className={`py-1 px-4 font-semibold border-2 border-foreground ${frequency === 'weekly' ? 'bg-foreground text-background' : ''}`}
                >
                  Weekly
                </button>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="font-semibold text-muted">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Habit' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}