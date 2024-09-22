import { sendMessage } from '@/api/messages';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SendMessageInput } from '@/types';
import { fetchCurrentUser } from '@/api/users';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessage('');
    },
    onError: error => {
      console.error('Failed to send message:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      const newMessage: SendMessageInput = {
        text: message,
        user: user,
      };
      mutation.mutate(newMessage);
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
