# AI Integration Guide for FitAI

## Overview
Your FitAI app now uses OpenAI's GPT-4o-mini model to generate personalized:
- **Workout Plans** - Based on user profile, goals, experience level, and previous progress
- **Diet Plans** - Customized meals with macros, considering dietary preferences and allergies
- **Coaching Responses** - Intelligent answers to user questions using their actual data

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

### 2. Configure Your Backend

Open `backend/.env` and replace the placeholder:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Start Your Backend

```bash
cd backend
npm run dev
```

You should see:
```
FitAI Backend running on port 5001
MongoDB connected
```

### 4. How It Works

#### Workout Generation
When a user generates a workout plan:
- System fetches user profile (age, weight, goal, experience level)
- Gets previous week's progress (if available)
- Sends data to OpenAI with structured prompt
- AI generates personalized weekly workout schedule
- Falls back to template-based generation if AI fails

#### Diet Generation
When a user generates a diet plan:
- System fetches user profile and calculates macros
- Gets previous week's adherence and weight change
- Sends data to OpenAI with nutrition requirements
- AI generates personalized daily meal plan
- Falls back to template-based generation if AI fails

#### AI Coach
When a user asks a question:
- System fetches user profile and last 4 weeks of progress
- Sends question with user context to OpenAI
- AI provides personalized, data-driven advice
- Falls back to rule-based responses if AI fails

### 5. Testing the AI Features

#### Test Workout Generation
1. Register a new user
2. Complete profile setup
3. Go to Workouts page
4. Click "Generate New Workout Plan"
5. You'll see AI-generated exercises with personalized guidance

#### Test Diet Generation
1. Go to Diet page
2. Click "Generate New Diet Plan"
3. You'll see AI-generated meals with specific portions and macros

#### Test AI Coach
1. Go to Assistant page
2. Ask: "Why am I not losing weight?"
3. The AI will analyze your actual progress data and provide specific advice

### 6. Cost Considerations

OpenAI pricing (as of 2024):
- GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- Average cost per generation: ~$0.001-0.003
- Monthly cost for 100 users: ~$10-30

### 7. Alternative AI Models

You can easily switch to other models by modifying `backend/services/aiService.js`:

#### Google Gemini
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

#### Anthropic Claude
```javascript
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

#### Local Models (Ollama)
```javascript
// Use Ollama for free local AI
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({ model: 'llama2', prompt: prompt })
});
```

### 8. Fallback System

The app has a smart fallback system:
- If OpenAI API key is not configured → Uses template-based generation
- If OpenAI API fails → Falls back to template-based generation
- Users always get a response, even without AI

### 9. Monitoring AI Usage

Check your OpenAI dashboard for:
- API usage statistics
- Cost tracking
- Rate limits
- Error logs

### 10. Best Practices

1. **Set Usage Limits** - Configure spending limits in OpenAI dashboard
2. **Cache Responses** - Consider caching similar requests
3. **Rate Limiting** - Implement rate limiting for API calls
4. **Error Handling** - Always have fallback responses
5. **User Privacy** - Don't send sensitive personal data unnecessarily

## Troubleshooting

### "Failed to generate AI workout plan"
- Check if OPENAI_API_KEY is set correctly in .env
- Verify API key is valid on OpenAI platform
- Check if you have credits/billing set up
- Look at backend console for detailed error

### AI responses are generic
- Ensure user has completed profile setup
- Make sure user has logged progress data
- Check if profile data is being passed correctly

### High API costs
- Reduce max_tokens in aiService.js
- Implement caching for similar requests
- Use GPT-3.5-turbo instead of GPT-4 for lower costs

## Next Steps

1. Get your OpenAI API key
2. Update backend/.env
3. Restart backend server
4. Test all AI features
5. Monitor usage and costs
6. Adjust prompts for better results

Your AI-powered fitness app is ready! 🚀
