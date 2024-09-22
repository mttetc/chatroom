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
  // Use the user's ID to consistently get the same color for each user
  const index =
    userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};
