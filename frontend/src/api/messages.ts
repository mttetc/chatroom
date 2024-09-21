import { Message } from '../types';
import socket from '@/api/socket';

export const fetchMessages = async (): Promise<Message[]> => {
  return new Promise(resolve => {
    socket.emit('getMessages', (messages: Message[]) => {
      resolve(messages);
    });
  });
};

export const sendMessage = async (
  message: Omit<Message, 'id'>
): Promise<void> => {
  socket.emit('message', message);
};

export const subscribeToMessages = (callback: (message: Message) => void) => {
  socket.on('message', callback);
  return () => {
    socket.off('message', callback);
  };
};