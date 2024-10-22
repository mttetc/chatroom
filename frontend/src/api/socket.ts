import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const socket: Socket = io(BACKEND_URL, { autoConnect: false });

export const initializeSocket = (): void => {
  const { token, user } = useAuthStore.getState();

  if (socket.connected) {
    socket.disconnect();
  }

  socket.auth = { token, user };

  socket.on('connect', () => {
    console.log('Socket connected with auth:', socket.auth);
  });

  socket.on('connect_error', error => {
    console.error('Socket connection error:', error);
  });

  socket.connect();
};

export const disconnectSocket = (): void => {
  if (socket.connected) {
    socket.disconnect();
  }
};
