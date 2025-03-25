import { RefreshCw, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const sampleImages = [
  "https://images.pexels.com/photos/29061663/pexels-photo-29061663/free-photo-of-professional-podcaster-in-studio-with-microphone.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/18939555/pexels-photo-18939555/free-photo-of-man-in-maroon-shirt-sitting-at-a-microphone.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/20142956/pexels-photo-20142956/free-photo-of-smiling-man-with-microphone.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/6953925/pexels-photo-6953925.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/6144023/pexels-photo-6144023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/28469401/pexels-photo-28469401/free-photo-of-female-podcaster-with-microphone-in-studio.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8391326/pexels-photo-8391326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/3912516/pexels-photo-3912516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
].map(url => `${url}?auto=format&fit=crop&w=1000&q=80`);

interface ImageGridProps {
  setSelectedImageUrl: (url: string) => void;
  selectedImageUrl: string;
}

export function ImageGrid({ setSelectedImageUrl, selectedImageUrl }: ImageGridProps) {
  
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {sampleImages.map((image, index) => (
        <div 
          key={index} 
          className={`relative group rounded-lg overflow-hidden ${
            selectedImageUrl === image 
              ? 'ring-4 ring-purple-500' 
              : 'ring-1 ring-gray-600 hover:ring-gray-400'
          }`}
        >
          <img
            src={image}
            alt={`Template ${index + 1}`}
            className="w-full h-64 object-cover"
          />
          
          {/* Selection overlay with correct z-index (above image, below text bar) */}
          {selectedImageUrl === image && (
            <div className="absolute inset-0 bg-purple-500 bg-opacity-30 flex items-center justify-center z-1">
              <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                Selected
              </div>
            </div>
          )}
          

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 ">
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
              <div className="flex justify-between">
                <button className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageSelect(image);
                }}>
                  Select
                </button>
                <button className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}