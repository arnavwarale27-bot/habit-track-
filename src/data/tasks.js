// Seed data for demo purposes — generates realistic past history
export function generateHistory(days = 30) {
  const history = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const upscHours = Math.random() > 0.3 ? Math.floor(Math.random() * 6) + 1 : 0;
    const earnings = Math.random() > 0.4 ? Math.floor(Math.random() * 3000) + 500 : 0;
    const stars = Math.random() > 0.4 ? Math.floor(Math.random() * 5) + 1 : 0;
    const whatif = Math.random() > 0.35;
    const nojunk = Math.random() > 0.3;
    const techDone = stars > 0;
    const upscDone = upscHours > 0;
    const earningDone = earnings > 0;

    let points = 0;
    if (whatif) points += 10;
    if (upscDone) points += Math.min(5 + upscHours, 10);
    if (earningDone) points += 10;
    if (techDone) points += Math.min(5 + stars, 10);
    if (nojunk) points += 10;

    history.push({
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: d.toISOString().split('T')[0],
      points: Math.min(points, 50),
      upscHours,
      earnings,
      stars,
      tasksCompleted: [whatif, upscDone, earningDone, techDone, nojunk].filter(Boolean).length,
    });
  }

  return history;
}

export const INITIAL_TASKS = [
  {
    id: 'whatif',
    emoji: '🎬',
    title: 'What If Content',
    description: 'Create & post your daily content',
    type: 'boolean',
    basePoints: 10,
    maxPoints: 10,
    color: '#6366f1',
    bgColor: '#eef2ff',
    completed: false,
    streak: 0,
    pointsEarned: 0,
  },
  {
    id: 'upsc',
    emoji: '📚',
    title: 'UPSC Study',
    description: 'Dedicated preparation hours',
    type: 'hours',
    basePoints: 5,
    maxPoints: 10,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    completed: false,
    streak: 0,
    pointsEarned: 0,
    inputValue: '',
  },
  {
    id: 'earning',
    emoji: '💰',
    title: 'Hustle Earning',
    description: 'Log today\'s earnings (adds to goal)',
    type: 'earning',
    basePoints: 10,
    maxPoints: 10,
    color: '#22c55e',
    bgColor: '#f0fdf4',
    completed: false,
    streak: 0,
    pointsEarned: 0,
    inputValue: '',
  },
  {
    id: 'tech',
    emoji: '⚡',
    title: 'Tech Skills',
    description: 'Coding, building & learning',
    type: 'stars',
    basePoints: 5,
    maxPoints: 10,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    completed: false,
    streak: 0,
    pointsEarned: 0,
    stars: 0,
  },
  {
    id: 'nojunk',
    emoji: '🥗',
    title: 'No Junk Food',
    description: 'Keep the body clean & energized',
    type: 'boolean',
    basePoints: 10,
    maxPoints: 10,
    color: '#ef4444',
    bgColor: '#fff1f2',
    completed: false,
    streak: 0,
    pointsEarned: 0,
  },
];

export const QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Believe it. Build it.", author: "Unknown" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "One day or day one. You decide.", author: "Unknown" },
];
