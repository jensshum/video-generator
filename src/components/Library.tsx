import { RefreshCw, Play, Pause, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import supabaseService from '../services/supabaseService';
import { useUser } from '../contexts/UserContext';

interface VideoItem {
  id: string;
  video_title: string;
  video_url: string;
  thumbnail_url: string | null;
  description: string;
  created_at: string;
}

export function Library() {
  const [userVideos, setUserVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const { user } = useUser();
  
  useEffect(() => {
    const fetchUserVideos = async () => {
      if (user?.email) {
        try {
          setIsLoading(true);
          const videos = await supabaseService.get(user.email);
          setUserVideos(videos || []);
        } catch (error) {
          console.error("Error fetching videos:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserVideos();
  }, [user]);
  
  const handleVideoSelect = (videoUrl: string) => {
    // If selecting a new video
    if (videoUrl !== selectedVideo) {
      // Pause the previously selected video if any
      if (selectedVideo && videoRefs.current[selectedVideo]) {
        videoRefs.current[selectedVideo]?.pause();
      }
      
      setSelectedVideo(videoUrl);
      
      // Try to play the newly selected video after a short delay
      setTimeout(() => {
        const videoElement = videoRefs.current[videoUrl];
        if (videoElement) {
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(err => {
                console.error("Error playing video:", err);
                setIsPlaying(false);
              });
          }
        }
      }, 100);
    } else {
      // Deselect the current video
      setSelectedVideo(null);
      setIsPlaying(false);
    }
  };
  
  const togglePlayPause = (e: React.MouseEvent, videoUrl: string) => {
    e.stopPropagation();
    const videoElement = videoRefs.current[videoUrl];
    
    if (!videoElement) return;
    
    if (videoElement.paused) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error playing video:", err));
      }
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };
  
  const handleDownload = (e: React.MouseEvent, videoUrl: string, title: string) => {
    e.stopPropagation();
    
    // Create an anchor element
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${title || 'video'}.mp4`;
    
    // Append to the body, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleRefresh = () => {
    if (user?.email) {
      setIsLoading(true);
      supabaseService.get(user.email)
        .then(videos => setUserVideos(videos || []))
        .catch(error => console.error("Error refreshing videos:", error))
        .finally(() => setIsLoading(false));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">
          <RefreshCw className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    );
  }
  
  if (userVideos.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl text-gray-300 mb-4">No videos yet</h2>
        <p className="text-gray-500">Generate your first video to see it here!</p>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">My Videos</h2>
        <button 
          onClick={handleRefresh} 
          className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userVideos.map((video) => (
          <div 
            key={video.id} 
            className={`relative group rounded-lg overflow-hidden ${
              selectedVideo === video.video_url 
                ? 'ring-4 ring-purple-500' 
                : 'ring-1 ring-gray-600 hover:ring-gray-400'
            }`}
            onClick={() => handleVideoSelect(video.video_url)}
          >
            {/* Video element with ref */}
            <video
              ref={el => videoRefs.current[video.video_url] = el}
              src={video.video_url}
              className="w-full h-64 object-cover"
              controls={selectedVideo === video.video_url}
              loop
              playsInline
              preload="metadata"
              poster={video.thumbnail_url || undefined}
            />
            
            {/* Play overlay */}
            {selectedVideo !== video.video_url && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <Play className="w-16 h-16 text-white opacity-80" />
              </div>
            )}
            
            {/* Controls overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between">
                  <button 
                    className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                    onClick={(e) => togglePlayPause(e, video.video_url)}
                  >
                    {selectedVideo === video.video_url && !videoRefs.current[video.video_url]?.paused ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button 
                    className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                    onClick={(e) => handleDownload(e, video.video_url, video.video_title)}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Video title and creation date */}
            <div className="p-3 bg-gray-800">
              <h3 className="text-white font-medium truncate">{video.video_title}</h3>
              <p className="text-gray-400 text-sm">
                {new Date(video.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}