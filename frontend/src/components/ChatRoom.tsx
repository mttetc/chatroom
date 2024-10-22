import { initializeSocket, socket } from '@/api/socket';
import React, { useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import UserList from './UserList';

const ChatRoom: React.FC = () => {
  useEffect(() => {
    if (!socket.connected) {
      console.log('Initializing socket from ChatRoom...');
      initializeSocket();
    }

    return () => {
      if (socket.connected) {
        console.log('Disconnecting socket from ChatRoom...');
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 p-6">
        <ChatMessages />
        <ChatInput />
      </div>
      <UserList />
    </div>
  );
};

export default ChatRoom;
