import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ImageGrid } from './components/ImageGrid';
import { PromptInput } from './components/PromptInput';
import { VideoPlayer } from './components/VideoPlayer';
import { LoginPage } from './components/LoginPage';
import { Library } from './components/Library';
import { supabase } from './lib/auth';
import type { User } from '@supabase/supabase-js';


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{ current: number; total: number } | null>(null);
  

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleVideoGeneration = (url: string) => {
    setVideoUrl(url);
    setIsGeneratingVideo(false);
    setVideoProgress(null);
  };

  const handleGenerationStart = () => {
    setIsGeneratingVideo(true);
    setVideoUrl(null);
  };

  const handleProgressUpdate = (progress: { current: number; total: number }) => {
    setVideoProgress(progress);
  };

  const handleReset = () => {
    setVideoUrl(null);
    setSelectedImageUrl('');
    setVideoProgress(null);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col space-y-4 p-6">
      <div className="flex space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg ${
              showTemplates 
                ? 'text-white bg-gray-800' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setShowTemplates(true)}
          >Templates</button>
          <button 
            className={`px-4 py-2 rounded-lg ${
              !showTemplates 
                ? 'text-white bg-gray-800' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setShowTemplates(false)}
          >My library</button>
        </div>
      </div>
      <Navigation />
      <main className="pb-24">
        {showTemplates ? (
          <ImageGrid 
            setSelectedImageUrl={setSelectedImageUrl} 
            selectedImageUrl={selectedImageUrl} 
          />
        ) : (
          <Library />
        )}
      </main>
      {videoUrl ? (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <VideoPlayer 
            videoUrl={videoUrl} 
            isLoading={false} 
            progress={null} 
          />
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors mx-auto block"
          >
            Create New Video
          </button>
        </div>
      ) : (
        <PromptInput 
          selectedImageUrl={selectedImageUrl}
          onVideoGenerated={handleVideoGeneration}
          onGenerationStart={handleGenerationStart}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
      {isGeneratingVideo && !videoUrl && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <VideoPlayer 
            videoUrl={null} 
            isLoading={true} 
            progress={videoProgress} 
          />
        </div>
      )}
    </div>
  );
}

export default App;