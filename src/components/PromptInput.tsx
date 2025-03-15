import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import videoService from '../services/videoService';

interface PromptInputProps {
  selectedImageUrl: string;
  onVideoGenerated: (videoUrl: string) => void;
  onGenerationStart: () => void;
  onProgressUpdate: (progress: { current: number; total: number }) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  selectedImageUrl, 
  onVideoGenerated,
  onGenerationStart,
  onProgressUpdate
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      onGenerationStart();
      const result = await videoService(
        selectedImageUrl, 
        prompt,
        onProgressUpdate
      );
      
      if (result && result.video && result.video.url) {
        onVideoGenerated(result.video.url);
      }
    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="flex-1 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};