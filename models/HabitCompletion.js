import mongoose from 'mongoose';

const HabitCompletionSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  // --- THESE FIELDS MUST BE ADDED ---
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  habitName: {
    type: String,
    required: true,
  },
  // ------------------------------------
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.HabitCompletion || mongoose.model('HabitCompletion', HabitCompletionSchema);