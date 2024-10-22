import { socket } from './socket';
import { User } from '@/types';

export const fetchCurrentUser = async (): Promise<User> => {
  return new Promise(resolve => {
    socket.emit('getCurrentUser', (user: User) => {
      resolve(user);
    });
  });
};

export const fetchUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    socket.emit('getUsers', (users: User[]) => {
      if (users) {
        resolve(users);
      } else {
        reject(new Error('Failed to fetch users'));
      }
    });
  });
};

export const subscribeToUserUpdates = (callback: (users: User[]) => void) => {
  socket.on('userUpdate', callback);
  return () => {
    socket.off('userUpdate', callback);
  };
};
