import { Message, SendMessageInput } from '@/types';
import socket from '@/api/socket';

export const fetchMessages = (
  callback: (messages: Message[]) => void
): void => {
  socket.emit('getMessages', callback);
};

export const sendMessage = (message: SendMessageInput): void => {
  socket.emit('message', message);
};

export const subscribeToMessages = (callback: (message: Message) => void) => {
  socket.on('message', callback);
  return () => {
    socket.off('message', callback);
  };
};
