import socket from '@/api/socket';
import { User } from '@/types';

export const fetchCurrentUser = async (): Promise<User> => {
  return new Promise(resolve => {
    socket.emit('getCurrentUser', (user: User) => {
      resolve(user);
    });
  });
};

export const fetchUsers = async (): Promise<User[]> => {
  return new Promise(resolve => {
    socket.emit('getUsers', (users: User[]) => {
      resolve(users);
    });
  });
};

export const subscribeToUserUpdates = (callback: (users: User[]) => void) => {
  socket.on('userUpdate', callback);
  return () => {
    socket.off('userUpdate', callback);
  };
};
