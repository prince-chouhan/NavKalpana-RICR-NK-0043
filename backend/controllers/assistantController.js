import * as assistantService from '../services/assistantService.js';

export const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const response = await assistantService.generateAssistantResponse(req.user_id, question);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
