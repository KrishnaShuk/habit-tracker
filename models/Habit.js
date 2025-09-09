import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the habit.'],
    trim: true,
  },
  frequency: { // <-- THIS IS THE FIELD TO CHECK
    type: String,
    enum: ['daily', 'weekly'],
    required: true,
  },
  category: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HabitCompletion',
  }],
}, { timestamps: true });

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema);