'use client';

import { useEffect, useState, useMemo } from 'react';
import HabitModal from '@/components/HabitModal';
import HabitItem, { Habit } from '@/components/HabitItem';

export default function DashboardPage() {
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);

  const { dailyHabits, weeklyHabits } = useMemo(() => {
    const daily: Habit[] = [];
    const weekly: Habit[] = [];
    allHabits.forEach(habit => {
      if (habit.frequency === 'daily') {
        daily.push(habit);
      } else if (habit.frequency === 'weekly') {
        weekly.push(habit);
      }
    });
    return { dailyHabits: daily, weeklyHabits: weekly };
  }, [allHabits]);

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits');
      if (!res.ok) throw new Error('Failed to fetch habits');
      const data = await res.json();
      setAllHabits(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchHabits();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedHabit(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setModalMode('edit');
    setSelectedHabit(habit);
    setIsModalOpen(true);
  };

  const handleDelete = async (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to delete habit');
        }
        fetchHabits();
      } catch (error) {
        console.error('Failed to delete habit', error);
        alert('Could not delete habit. Please try again.');
      }
    }
  };

  const renderHabitList = (habits: Habit[], title: string) => (
    <div className="card p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {habits.length > 0 ? (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitItem
              key={habit._id}
              habit={habit}
              onHabitCompleted={fetchHabits}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted">No {title.toLowerCase()} yet. Add one to get started!</p>
      )}
    </div>
  );

  return (
    <div>
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitUpserted={fetchHabits}
        mode={modalMode}
        initialData={selectedHabit}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Habits</h1>
        <button onClick={openCreateModal} className="btn-primary">
          + Add
        </button>
      </div>
      
      {isLoading ? (
        <p className="text-muted">Loading your goals...</p>
      ) : (
        <div className="space-y-8">
          {renderHabitList(dailyHabits, "Daily Goals")}
          {renderHabitList(weeklyHabits, "Weekly Goals")}
        </div>
      )}
    </div>
  );
}