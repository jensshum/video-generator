import { Download, Instagram, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export function Header() {
  const { user, signOut } = useUser();
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <Instagram className="w-8 h-8 text-white" />
        <span className="text-2xl font-bold text-white">InstaReel.</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700">
          <Download className="w-5 h-5" />
        </button>
        <button className="px-4 py-2 text-black bg-white rounded-lg hover:bg-gray-100">
          Upgrade
        </button>
        
        {user && (
          <div className="flex items-center ml-4">
            <div className="flex items-center px-3 py-2 bg-gray-800 rounded-l-lg">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-200 truncate max-w-[150px]">
                {user.email}
              </span>
            </div>
            <button 
              onClick={signOut}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-r-lg text-white text-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}