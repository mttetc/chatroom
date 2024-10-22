const colors = [
  'text-red-500',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-purple-500',
  'text-pink-500',
  'text-indigo-500',
  'text-teal-500',
  'text-orange-500',
  'text-cyan-500',
];

export const getRandomColor = (): string => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getUserColor = (userId: string | undefined): string => {
  if (!userId) {
    return colors[0];
  }

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  // Ensure positive index
  const positiveHash = Math.abs(hash);

  // Use modulo to get index within array bounds
  const index = positiveHash % colors.length;

  console.log('User ID:', userId, 'Color Index:', index);
  return colors[index];
};
