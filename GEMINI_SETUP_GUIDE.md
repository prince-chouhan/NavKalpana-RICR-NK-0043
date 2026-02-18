# Google Gemini AI Setup Guide

## Why Gemini?
- ✅ **FREE** - Generous free tier with 15 requests per minute
- ✅ **Powerful** - Gemini 1.5 Flash is fast and capable
- ✅ **No Credit Card Required** - Get started immediately
- ✅ **Great for Development** - Perfect for testing and small apps

## Step 1: Get Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey

2. **Sign in with Google Account**
   - Use any Google account (Gmail, etc.)

3. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Click "Create API key in new project" (or select existing project)
   - Copy the API key (starts with `AIza...`)

## Step 2: Add API Key to Your App

Open `backend/.env` and update:

```env
GEMINI_API_KEY=AIzaSyC-your-actual-api-key-here
```

## Step 3: Restart Backend

```bash
cd backend
npm run dev
```

You should see:
```
FitAI Backend running on port 5001
MongoDB connected
```

## Step 4: Test It!

1. **Generate Workout Plan**
   - Go to `/workouts`
   - Click "Generate New Plan"
   - You should see: "Generating Gemini AI-powered workout plan..."

2. **Generate Diet Plan**
   - Go to `/diet`
   - Click "Generate New Plan"
   - You should see: "Generating Gemini AI-powered diet plan..."

3. **Ask AI Coach**
   - Go to `/assistant`
   - Ask any question
   - You should see: "Generating Gemini AI coaching response..."

## Gemini Free Tier Limits

- **15 requests per minute** (RPM)
- **1 million tokens per minute** (TPM)
- **1,500 requests per day** (RPD)

This is MORE than enough for:
- 100+ users per day
- Unlimited testing
- Development and production use

## Gemini Models Available

We're using **gemini-1.5-flash** which is:
- Fast (< 2 seconds response)
- Smart (great for fitness advice)
- Free (generous limits)
- Reliable (99.9% uptime)

## Cost Comparison

| Provider | Free Tier | Cost After Free |
|----------|-----------|-----------------|
| **Gemini** | 15 RPM, 1500 RPD | $0.075 per 1M tokens |
| OpenAI | $5 credit (expires) | $0.15 per 1M tokens |
| Anthropic | No free tier | $3 per 1M tokens |

## Troubleshooting

### "API key not valid"
- Make sure you copied the full key
- Check for extra spaces
- Restart backend after updating .env

### "Quota exceeded"
- You hit the 15 requests/minute limit
- Wait 1 minute and try again
- For production, upgrade to paid tier

### "Failed to generate"
- Check backend console for detailed error
- Verify API key is correct
- Make sure you have internet connection

## Features Working with Gemini

✅ AI-powered workout plans based on user data
✅ AI-powered diet plans with meal details
✅ AI coaching responses with data insights
✅ Personalized progression advice
✅ Recovery tips based on fatigue
✅ Motivation messages
✅ Meal prep tips and ingredient lists

## Next Steps

1. Get your Gemini API key from https://aistudio.google.com/app/apikey
2. Add it to `backend/.env`
3. Restart backend
4. Test all AI features
5. Enjoy free, powerful AI! 🚀

## Support

If you need help:
- Gemini Documentation: https://ai.google.dev/docs
- API Key Management: https://aistudio.google.com/app/apikey
- Pricing: https://ai.google.dev/pricing

Your FitAI app is now powered by Google Gemini! 🎉
