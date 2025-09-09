/**
 * Helper to get the start of a given date (sets time to 00:00:00).
 * @param {Date} date - The input date.
 * @returns {Date} - The date at the beginning of the day.
 */
const getStartOfDay = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Helper to get the start of the week for a given date (assumes Sunday is the first day).
 * @param {Date} date - The input date.
 * @returns {Date} - The date of the Sunday of that week.
 */
const getStartOfWeek = (date) => {
  const dt = new Date(date);
  const day = dt.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const diff = dt.getDate() - day;
  return getStartOfDay(new Date(dt.setDate(diff)));
};


/**
 * Calculates the current streak for a habit based on its completion dates and frequency.
 * @param {Array<{date: string}>} completions - An array of completion objects.
 * @param {'daily' | 'weekly'} frequency - The frequency of the habit.
 * @returns {number} - The length of the current streak.
 */
export const calculateStreak = (completions, frequency) => {
  if (completions.length === 0) {
    return 0;
  }

  // Create a set of unique completion dates (start of day timestamp) for fast lookups
  const completionTimestamps = new Set(
    completions.map(comp => getStartOfDay(new Date(comp.date)).getTime())
  );

  let currentStreak = 0;
  const today = new Date();

  // --- DAILY STREAK LOGIC ---
  if (frequency === 'daily') {
    let currentDate = getStartOfDay(today);
    
    // Streak can only be current if completed today or yesterday
    if (!completionTimestamps.has(currentDate.getTime())) {
      currentDate.setDate(currentDate.getDate() - 1); // Check from yesterday
    }
    
    while (completionTimestamps.has(currentDate.getTime())) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1); // Go back one day
    }
  }

  // --- WEEKLY STREAK LOGIC ---
  if (frequency === 'weekly') {
    let currentWeekStart = getStartOfWeek(today);

    // Function to check if there is any completion within a given week
    const hasCompletionInWeek = (weekStart) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      for (const ts of completionTimestamps) {
        if (ts >= weekStart.getTime() && ts < weekEnd.getTime()) {
          return true;
        }
      }
      return false;
    };
    
    // Streak can only be current if completed this week or last week
    if (!hasCompletionInWeek(currentWeekStart)) {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Check from last week
    }

    while (hasCompletionInWeek(currentWeekStart)) {
      currentStreak++;
      currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Go back one week
    }
  }

  return currentStreak;
};