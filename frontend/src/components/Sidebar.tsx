import React from 'react';
import { Home, MessageSquare } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold text-lg">Chat App</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 rounded-md"
        >
          <Home className="w-6 h-6 mr-3" />
          Home
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 rounded-md"
        >
          <MessageSquare className="w-6 h-6 mr-3" />
          Chat Rooms
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
