import React from 'react';

interface VideoPlayerProps {
  videoUrl: string | null;
  isLoading: boolean;
  progress?: { current: number; total: number } | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  isLoading, 
  progress 
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center mb-2">Generating your video...</div>
          {progress ? (
            <>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-blue-500 h-4 transition-all duration-300 ease-in-out"
                  style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">
                {progress.current}/{progress.total} ({Math.round((progress.current / progress.total) * 100)}%)
              </div>
            </>
          ) : (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg">
      <video 
        className="w-full rounded-lg"
        controls
        autoPlay
        loop
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
      <div className="mt-4 flex justify-between">
        <a 
          href={videoUrl} 
          download="generated-video.mp4"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Download Video
        </a>
        <button 
          onClick={() => navigator.clipboard.writeText(videoUrl)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
}; 