import { fetchMessages, subscribeToMessages } from '@/api/messages';
import { Message } from '@/types';
import { getUserColor } from '@/utils/colorUtils';
import React, { useEffect, useState } from 'react';

const ChatMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log('Fetching messages...');
        const initialMessages = await fetchMessages();
        console.log('Fetched messages:', initialMessages);
        setMessages(initialMessages);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
        setIsLoading(false);
      }
    };

    loadMessages();

    const unsubscribe = subscribeToMessages(messages => {
      setMessages(messages);
    });

    return () => {
      console.log('Unsubscribing from messages');
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
