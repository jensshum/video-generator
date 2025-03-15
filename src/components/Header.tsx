import React from 'react';
import { Download, Star, Instagram } from 'lucide-react';

export function Header() {
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
      </div>
    </header>
  );
}