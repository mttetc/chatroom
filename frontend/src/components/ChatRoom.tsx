import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import UserList from './UserList';

const ChatRoom: React.FC = () => {
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