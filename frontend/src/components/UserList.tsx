import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, subscribeToUserUpdates } from '../api/users';
import { User } from '../types';

const UserList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useQuery<User[]>({queryKey: ['users'], queryFn: fetchUsers});

  useEffect(() => {
    const unsubscribe = subscribeToUserUpdates((updatedUsers) => {
      queryClient.setQueryData(['users'], updatedUsers);
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="w-64 bg-white p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Online Users</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id} className="mb-2 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;