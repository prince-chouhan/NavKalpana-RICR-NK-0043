import OpenAI from 'openai';
import { gatherCompleteUserContext, formatUserContextForAI } from './userContextService.js';

// Lazy initialization - only create client when needed
let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
};

// Check if AI is available
const isAIAvailable = () => {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
};

// Generate AI-powered workout plan with COMPLETE user context
export const generateAIWorkoutPlan = async (user_id, weekNumber) => {
  // Gather ALL user data
  const userContext = await gatherCompleteUserContext(user_id);
  if (!userContext) {
    throw new Error('User profile not found');
  }

  const contextPrompt = formatUserContextForAI(userContext);
  
  const prompt = `${contextPrompt}

=== TASK ===
You are an expert fitness coach with complete knowledge of this user's history. Generate a personalized weekly workout plan for Week ${weekNumber}.

ANALYZE THE USER'S DATA:
1. Look at their progress trend - are they improving or plateauing?
2. Check their adherence rates - do they need easier or harder workouts?
3. Review their fatigue levels - do they need more recovery?
4. Consider their goal and current progress toward it
5. Account for their experience level and available days

Generate a workout plan with the following JSON structure:
{
  "week_summary": "Personalized overview referencing their specific data and progress",
  "weekly_schedule": [
    {
      "day": 1,
      "day_name": "Monday",
      "type": "Push/Pull/Legs/Full Body/Rest",
      "rest_day": false,
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "8-10",
          "rest_seconds": 90,
          "guidance": "Specific form tips and why this helps THEIR goal",
          "intensity_level": "Light/Moderate/High"
        }
      ]
    }
  ],
  "progression_notes": "How to progress based on THEIR actual performance",
  "recovery_tips": "Personalized recovery advice based on THEIR energy levels",
  "motivation_message": "Encouraging message referencing THEIR specific achievements"
}

IMPORTANT:
- Reference their actual statistics in your recommendations
- Adapt based on their adherence patterns
- Progress them appropriately based on their experience
- If they're struggling, make it easier; if excelling, challenge them more
- Be specific about WHY each exercise helps THEIR specific goal`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client not available');
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert fitness coach who creates personalized workout plans. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI workout plan');
  }
};

// Generate AI-powered diet plan with COMPLETE user context
export const generateAIDietPlan = async (user_id, weekNumber) => {
  // Gather ALL user data
  const userContext = await gatherCompleteUserContext(user_id);
  if (!userContext) {
    throw new Error('User profile not found');
  }

  const contextPrompt = formatUserContextForAI(userContext);
  
  const prompt = `${contextPrompt}

=== TASK ===
You are an expert nutritionist with complete knowledge of this user's history. Generate a personalized daily meal plan for Week ${weekNumber}.

ANALYZE THE USER'S DATA:
1. Look at their weight progress - is their calorie target working?
2. Check their diet adherence - do they need simpler meals?
3. Review their energy levels - do they need more carbs or different timing?
4. Consider their dietary preferences and allergies
5. Account for their goal and progress toward it

Generate a meal plan with the following JSON structure:
{
  "week_summary": "Personalized nutrition overview referencing their specific progress",
  "daily_meals": [
    {
      "meal_number": 1,
      "meal_name": "Breakfast",
      "time_suggestion": "7:00 AM",
      "description": "Detailed meal with specific portions for THEIR calorie target",
      "estimated_calories": 500,
      "macros": {
        "protein_g": 30,
        "carbs_g": 50,
        "fat_g": 15
      },
      "ingredients": ["specific ingredient with amount"],
      "preparation_tips": "Easy prep instructions",
      "why_this_meal": "Explain how this helps THEIR specific goal"
    }
  ],
  "hydration_goal": "Specific water intake for their weight",
  "supplement_suggestions": "Based on THEIR diet and goals",
  "meal_prep_tips": "Practical tips for THEIR lifestyle",
  "adjustment_notes": "How to adjust based on THEIR progress"
}

IMPORTANT:
- Total calories should match their target: ${userContext.profile.daily_calorie_target} kcal
- Reference their actual weight progress in recommendations
- If not losing/gaining as expected, suggest calorie adjustments
- Make meals practical and aligned with their preferences
- Explain WHY each meal helps THEIR specific situation`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client not available');
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert nutritionist who creates personalized meal plans. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI diet plan');
  }
};

// Generate AI-powered coaching response with COMPLETE user context
export const generateAICoachingResponse = async (user_id, question) => {
  // Gather ALL user data
  const userContext = await gatherCompleteUserContext(user_id);
  if (!userContext) {
    return {
      response: 'Please complete your profile setup first to get personalized advice.',
      confidence: 'Low'
    };
  }

  const contextPrompt = formatUserContextForAI(userContext);
  
  const prompt = `${contextPrompt}

=== USER QUESTION ===
"${question}"

=== TASK ===
You are this user's personal AI fitness coach. You have complete knowledge of their entire fitness journey. Answer their question with highly personalized advice.

ANALYZE THEIR COMPLETE DATA:
1. Review their progress history - what patterns do you see?
2. Check their adherence rates - are they consistent?
3. Look at their weight trend - is it matching their goal?
4. Consider their energy levels and fatigue
5. Review their workout and diet history
6. Account for their experience level and limitations

Provide a response in the following JSON structure:
{
  "response": "Your detailed answer (3-4 paragraphs). MUST reference their specific data like: 'Looking at your last 4 weeks where you averaged X% adherence...' or 'I see you've lost X kg over Y weeks...' Make it personal and data-driven!",
  "steps": ["Specific action step 1 based on THEIR data", "Action step 2", "Action step 3"],
  "tip": "One practical tip specifically for THEIR situation",
  "data_insights": "Key insights from their data that led to this advice",
  "disclaimer": "Any important disclaimer if needed (optional)",
  "confidence": "High/Medium/Low"
}

CRITICAL REQUIREMENTS:
- You MUST reference their actual statistics and progress in your response
- Be specific: mention their adherence rates, weight changes, streak counts
- If they're doing well, celebrate their specific achievements
- If struggling, identify the exact problem from their data
- Make them feel like you truly know their journey
- Be encouraging but honest based on their actual performance`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client not available');
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert AI fitness coach who provides personalized, data-driven advice. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI coaching response');
  }
};
