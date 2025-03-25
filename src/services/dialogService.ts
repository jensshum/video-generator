import axios from 'axios';

interface GPTGenerationResponse {
  response: string;
  success: boolean;
  error?: string;
}

/**
 * Service for generating GPT responses using ChatGPT
 */
const GPTService = async (prompt: string): Promise<GPTGenerationResponse> => {
  try {
    // Replace with your actual API endpoint for ChatGPT
    const response = await axios.post('/api/gpt', { prompt });
    
    return {
      response: response.data.response,
      success: true
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      response: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export default GPTService; 