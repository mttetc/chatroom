import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socket from '@/api/socket';

const SocketManager: React.FC = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSetUsername = (username: string) => {
      queryClient.setQueryData(['currentUser'], {
        id: socket.id,
        name: username,
      });
    };

    const handleDisconnect = () => {
      queryClient.setQueryData(['currentUser'], null);
    };

    socket.on('setUsername', handleSetUsername);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('setUsername', handleSetUsername);
      socket.off('disconnect', handleDisconnect);
    };
  }, [queryClient]);

  return null;
};

export default SocketManager;
