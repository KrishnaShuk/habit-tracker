import mongoose from 'mongoose';

const HabitCompletionSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.HabitCompletion || mongoose.model('HabitCompletion', HabitCompletionSchema);