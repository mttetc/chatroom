import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMessages, subscribeToMessages } from '../api/messages';
import { Message } from '../types';

const ChatMessages: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery<Message[]>({ queryKey: ['messages'], queryFn: fetchMessages });

  useEffect(() => {
    const unsubscribe = subscribeToMessages(newMessage => {
      queryClient.setQueryData<Message[]>(['messages'], oldMessages =>
        oldMessages ? [...oldMessages, newMessage] : [newMessage]
      );
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) return <div>Loading messages...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
    <div className="flex-1 overflow-y-auto mb-4">
      {messages?.map(message => (
        <div key={message.id} className="mb-2">
          <span className="font-bold">{message.user}: </span>
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
