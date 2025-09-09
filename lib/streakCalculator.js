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
  const day = dt.getDay(); 
  const diff = dt.getDate() - day;
  return getStartOfDay(new Date(dt.setDate(diff)));
};


/**
 * Calculates the current streak for a habit based on its completion dates and frequency.
 * @param {Array<{date: string}>} completions 
 * @param {'daily' | 'weekly'} frequency 
 * @returns {number} 
 */
export const calculateStreak = (completions, frequency) => {
  if (completions.length === 0) {
    return 0;
  }

 
  const completionTimestamps = new Set(
    completions.map(comp => getStartOfDay(new Date(comp.date)).getTime())
  );

  let currentStreak = 0;
  const today = new Date();

  if (frequency === 'daily') {
    let currentDate = getStartOfDay(today);
    
    if (!completionTimestamps.has(currentDate.getTime())) {
      currentDate.setDate(currentDate.getDate() - 1); 
    }
    
    while (completionTimestamps.has(currentDate.getTime())) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1); 
    }
  }

  if (frequency === 'weekly') {
    let currentWeekStart = getStartOfWeek(today);

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

    if (!hasCompletionInWeek(currentWeekStart)) {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7); 
    }

    while (hasCompletionInWeek(currentWeekStart)) {
      currentStreak++;
      currentWeekStart.setDate(currentWeekStart.getDate() - 7); 
    }
  }

  return currentStreak;
};