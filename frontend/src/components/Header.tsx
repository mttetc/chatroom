import React from 'react';
import { UserCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/api/users';

const Header: React.FC = () => {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800">Chat Room</h1>
      <div className="flex items-center">
        {user && <span className="mr-2 text-gray-700">{user.name}</span>}
        <UserCircle className="w-8 h-8 text-gray-500" />
      </div>
    </header>
  );
};

export default Header;
