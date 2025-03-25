const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST endpoint for general ChatGPT responses
router.post('/chat', async (req, res) => {
  try {
    const { prompt, systemPrompt = "You are a helpful assistant." } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        content: '', 
        error: 'Prompt is required' 
      });
    }

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.data.choices[0]?.message?.content || '';

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return res.status(500).json({
      success: false,
      content: '',
      error: error.message || 'Failed to generate response',
    });
  }
});

module.exports = router; 