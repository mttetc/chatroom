import { Message } from '@/types';
import { socket } from './socket';

export const fetchMessages = (): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    socket.emit('getMessages', (messages: Message[]) => {
      if (messages) {
        resolve(messages);
      } else {
        reject(new Error('Failed to fetch messages'));
      }
    });
  });
};

export const sendMessage = (message: string): void => {
  socket.emit('message', message);
};

export const subscribeToMessages = (callback: (message: Message[]) => void) => {
  socket.on('message', callback);
  return () => {
    socket.off('message', callback);
  };
};
