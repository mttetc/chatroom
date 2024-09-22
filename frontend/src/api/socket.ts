import io from 'socket.io-client';
import { User } from '@/types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const setupSocketListeners = (queryClient: any) => {
  socket.on('setUsername', (user: User) => {
    queryClient.setQueryData(['currentUser'], user);
  });

  socket.on('disconnect', () => {
    queryClient.setQueryData(['currentUser'], null);
  });
};

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;
