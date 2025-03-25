import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import videoService from '../services/videoService';
import SupabaseService from '../services/SupabaseService';
import { useUser } from '../contexts/UserContext';
import dialogService from '../services/dialogService';

interface PromptInputProps {
  selectedImageUrl: string;
  onVideoGenerated: (videoUrl: string) => void;
  onGenerationStart: () => void;
  onProgressUpdate: (progress: { current: number; total: number }) => void;
  onDialogGenerated?: (script: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  selectedImageUrl, 
  onVideoGenerated,
  onGenerationStart,
  onProgressUpdate,
  onDialogGenerated
}) => {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [isGeneratingDialog, setIsGeneratingDialog] = useState(false);

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
          if (user && user.email) {
            SupabaseService.save({
              userEmail: user.email, 
              videoTitle: "Default", 
              videoUrl: result.video.url, 
              fileSizeBytes: 0, 
              durationSeconds: 0, 
              thumbnailUrl: selectedImageUrl,
              description: "Default", 
              isPublic: false
            });
          }
          else {
            alert("You are not logged")
          }
        }
    
    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  const handleGenerateDialog = async () => {
    if (!prompt.trim()) return;
    
    setIsGeneratingDialog(true);
    try {
      const result = await dialogService(prompt);
      if (result.success && onDialogGenerated) {
        onDialogGenerated(result.script);
      } else if (!result.success) {
        alert(`Failed to generate dialog: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating dialog:', error);
    } finally {
      setIsGeneratingDialog(false);
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
            type="button"
            onClick={handleGenerateDialog}
            disabled={isGeneratingDialog}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGeneratingDialog ? 'Generating...' : 'Generate Dialog'}
          </button>
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