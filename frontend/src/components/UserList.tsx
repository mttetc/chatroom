import { fetchUsers, subscribeToUserUpdates } from '@/api/users';
import { User } from '@/types';
import React, { useEffect, useState } from 'react';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('Fetching users...');
        const initialUsers = await fetchUsers();
        console.log('Fetched users:', initialUsers);
        setUsers(initialUsers);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        setIsLoading(false);
      }
    };

    loadUsers();

    const unsubscribe = subscribeToUserUpdates(updatedUsers => {
      console.log('Received updated users:', updatedUsers);
      setUsers(updatedUsers);
    });

    return () => {
      console.log('Cleaning up UserList component');
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
