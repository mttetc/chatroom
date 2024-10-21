import React, { useState, useEffect } from 'react';
import { fetchUsers, subscribeToUserUpdates } from '@/api/users';
import { User } from '@/types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const initialUsers = await fetchUsers();
        setUsers(initialUsers);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setIsLoading(false);
      }
    };

    loadUsers();

    const unsubscribe = subscribeToUserUpdates(updatedUsers => {
      setUsers(updatedUsers);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-64 bg-white p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">
        Online Users ({users.length})
      </h2>
      <ul>
        {users.map(user => (
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
