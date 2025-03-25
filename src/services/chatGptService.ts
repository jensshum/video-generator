import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ChatGptResponse {
  content: string;
  success: boolean;
  error?: string;
}

interface ChatGptOptions {
  systemPrompt?: string;
}

const chatGptService = async (
  prompt: string, 
  options: ChatGptOptions = {}
): Promise<ChatGptResponse> => {
  try {
    const response = await axios.post(`${API_URL}/chatGptRoute`, { 
      prompt,
      systemPrompt: options.systemPrompt
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting ChatGPT response:', error);
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export default chatGptService; 

