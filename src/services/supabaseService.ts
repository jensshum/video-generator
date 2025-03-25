import { createClient } from '@supabase/supabase-js';

class SupabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Save video information to Supabase
   */
  async save({
    userEmail,
    videoTitle,
    videoUrl,
    fileSizeBytes,
    durationSeconds,
    thumbnailUrl,
    description,
    isPublic
  }: {
    userEmail: string,
    videoTitle: string,
    videoUrl: string,
    fileSizeBytes: number | null,
    durationSeconds: number | null,
    thumbnailUrl: string | null,
    description: string,
    isPublic: boolean
  }) {
    try {
      const { data, error } = await this.supabase
        .from('user_videos')
        .insert({
          user_id: userEmail,
          video_title: videoTitle,
          video_url: videoUrl,
          file_size_bytes: fileSizeBytes,
          duration_seconds: durationSeconds,
          thumbnail_url: thumbnailUrl,
          description: description,
          is_public: isPublic
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error saving video to database:", error);
        throw error;
      }
      
      console.log("Video saved to database:", data);
      return data;
    } catch (error) {
      console.error("Failed to save video:", error);
      throw error;
    }
  }

  /**
   * Get videos from Supabase
   */
  async get(userEmail: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_videos')
        .select('*')
        .eq('user_id', userEmail);
      
      if (error) {
        console.error("Error retrieving videos:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Failed to get videos:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const supabaseServiceInstance = new SupabaseService();
export default supabaseServiceInstance;