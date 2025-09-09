interface CategoryDetail {
  icon: string;
  color: string;
}
interface CategoryDetailsMap {
  [key: string]: CategoryDetail;
}

export const habitCategories = [
  {
    name: 'Fitness',
    icon: '🏋️',
    color: '#F97316',
    habits: ['Exercise', 'Run', 'Lift Weights', 'Walk', 'Stretch', 'Yoga'],
  },
  {
    name: 'Health',
    icon: '🥗',
    color: '#16A34A',
    habits: ['Drink Water', 'Wake Up Early', 'Sleep Early', 'Cook', 'Eat Fruits', 'Eat Veggies'],
  },
  {
    name: 'Mind',
    icon: '🧠',
    color: '#2563EB',
    habits: ['Read', 'Study', 'Learn', 'Meditate', 'Practice Language', 'Journal'],
  },
  {
    name: 'Chores',
    icon: '🧹',
    color: '#6B7280',
    habits: ['Clean', 'Wash Dishes', 'Laundry', 'Vacuum', 'Make Bed', 'Pay Bills'],
  },
  {
    name: 'Reduce',
    icon: '🚭',
    color: '#DC2626',
    habits: ['Less Smoking', 'Less Drinking', 'Less Sweets', 'Less Coffee', 'Less Junk Food'],
  },
];

export const categoryDetailsMap: CategoryDetailsMap = habitCategories.reduce((acc, category) => {
  acc[category.name] = { icon: category.icon, color: category.color };
  return acc;
}, {} as CategoryDetailsMap); 