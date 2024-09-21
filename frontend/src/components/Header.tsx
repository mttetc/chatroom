import React from 'react';
import { UserCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800">Chat Room</h1>
      <div className="flex items-center">
        <span className="mr-2 text-gray-700">Anonymous User</span>
        <UserCircle className="w-8 h-8 text-gray-500" />
      </div>
    </header>
  );
};

export default Header;
