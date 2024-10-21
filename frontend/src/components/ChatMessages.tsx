import React, { useState, useEffect } from 'react';
import { Message } from '@/types';
import { getUserColor } from '@/utils/colorUtils';
import { fetchMessages, subscribeToMessages } from '@/api/messages';

const ChatMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = () => {
      console.log('Fetching messages');
      fetchMessages(initialMessages => {
        console.log('Received initial messages:', initialMessages);
        setMessages(initialMessages);
        setIsLoading(false);
      });
    };

    loadMessages();

    const unsubscribe = subscribeToMessages(newMessage => {
      console.log('Received new message:', newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex-1 overflow-y-auto mb-4">
      {messages.map(message => (
        <div key={message.id} className="mb-2">
          {message.user ? (
            <>
              <span className={`font-bold ${getUserColor(message.user.id)}`}>
                {message.user.name}:{' '}
              </span>
              <span>{message.text}</span>
            </>
          ) : (
            <span className="italic text-gray-500">{message.text}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
