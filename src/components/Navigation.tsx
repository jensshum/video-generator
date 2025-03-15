import React from 'react';
import { cn } from '../lib/utils';
import { Film, Image, Layers, Magnet as Magic, Video } from 'lucide-react';

const tabs = [
  { name: 'All', icon: Layers },
  { name: 'Images', icon: Image },
  { name: 'Videos', icon: Video },
  { name: 'Effects', icon: Magic },
  { name: 'Scenes', icon: Film },
];

export function Navigation() {
  const [activeTab, setActiveTab] = React.useState('All');

  return (
    <div className="flex flex-col space-y-4 p-6">
      {/* <div className="flex space-x-4">
        <button className="px-4 py-2 text-white bg-gray-800 rounded-lg">Templates</button>
        <button className="px-4 py-2 text-gray-400 hover:text-white">My library</button>
      </div> */}
      <nav className="flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg",
                activeTab === tab.name
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}