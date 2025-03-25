import { fal } from "@fal-ai/client";

async function videoService(
  imageUrl: string, 
  prompt: string, 
  onProgressUpdate?: (progress: { current: number, total: number }) => void
) {
  try {
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY || import.meta.env.NEXT_PUBLIC_FAL_KEY
    });
    
    let result;
    try {
      if (!imageUrl) {
        result = await fal.subscribe("fal-ai/wan-t2v", {
          input: {
            prompt: prompt
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              update.logs.map((log) => log.message).forEach((message) => {
                console.log(message);
                
                // Parse progress information from log messages
                const progressMatch = message.match(/(\d+)\/(\d+)/);
                if (progressMatch && onProgressUpdate) {
                  const current = parseInt(progressMatch[1], 10);
                  const total = parseInt(progressMatch[2], 10);
                  onProgressUpdate({ current, total });
                }
              });
            }
          },
        });
      }
      else {
        result = await fal.subscribe("fal-ai/wan-i2v", {
          input: {
            prompt: prompt,
            image_url: imageUrl
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              update.logs.map((log) => log.message).forEach(console.log);
            }
          },
        });
      }
    } catch (subscribeError: unknown) {
      console.error("Error during video generation:", subscribeError);
      if (subscribeError instanceof Error) {
        throw new Error(`Failed to generate video: ${subscribeError.message}`);
      }
      throw new Error("Failed to generate video: Unknown error");
    }
    
    if (!result || !result.data || !result.data.video || !result.data.video.url) {
      throw new Error("Invalid response from video service");
    }
    
    console.log(result.data.video.url);
    console.log(result.requestId);
    
    return result.data;
  } catch (error) {
    console.error("Video service error:", error);
    throw error;
  }
}

export default videoService;