import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/api/messages';
import { useUserStore } from '@/store/userStore';
import { Message } from '@/types';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const user = useUserStore(state => state.user);

  const mutation = useMutation({
    mutationFn: (newMessage: Omit<Message, 'id'>) => sendMessage(newMessage),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      mutation.mutate({ text: message, user: user.name });
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
