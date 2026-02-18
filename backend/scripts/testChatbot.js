import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import User from '../models/User.js';
import { generateAICoachingResponse } from '../services/geminiService.js';
import { gatherCompleteUserContext, formatUserContextForAI } from '../services/userContextService.js';

const testChatbot = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the first user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Please register a user first.');
      process.exit(1);
    }

    console.log(`🤖 Testing AI Chatbot for user: ${user.email}\n`);

    // First, show what data the AI receives
    console.log('📊 Gathering user context...');
    const context = await gatherCompleteUserContext(user._id);
    
    if (!context) {
      console.log('❌ No profile found. Please complete profile setup first.');
      process.exit(1);
    }

    console.log('\n=== USER DATA THAT AI RECEIVES ===');
    console.log(`Profile: ${context.profile.age}yo ${context.profile.gender}, ${context.profile.current_weight_kg}kg, Goal: ${context.profile.goal}`);
    console.log(`Statistics:`);
    console.log(`  - Total Weeks Tracked: ${context.statistics.total_weeks_tracked}`);
    console.log(`  - Avg Workout Adherence: ${context.statistics.average_workout_adherence}%`);
    console.log(`  - Avg Diet Adherence: ${context.statistics.average_diet_adherence}%`);
    console.log(`  - Total Weight Change: ${context.statistics.total_weight_change_kg} kg`);
    console.log(`  - Consistency Rating: ${context.statistics.consistency_rating}`);
    console.log(`  - Progress Trend: ${context.statistics.progress_trend}`);
    console.log(`  - Current Streak: ${context.statistics.current_streak} weeks`);

    // Test questions
    const testQuestions = [
      "Why am I not losing weight?",
      "Should I increase my protein intake?",
      "How am I doing with my fitness journey?"
    ];

    console.log('\n=== TESTING AI RESPONSES ===\n');

    for (const question of testQuestions) {
      console.log(`\n📝 Question: "${question}"`);
      console.log('⏳ Generating AI response...\n');

      try {
        const response = await generateAICoachingResponse(user._id, question);
        
        console.log('🤖 AI Response:');
        console.log('─'.repeat(80));
        console.log(response.response);
        console.log('─'.repeat(80));
        
        if (response.steps && response.steps.length > 0) {
          console.log('\n📋 Action Steps:');
          response.steps.forEach((step, i) => {
            console.log(`  ${i + 1}. ${step}`);
          });
        }
        
        if (response.tip) {
          console.log(`\n💡 Tip: ${response.tip}`);
        }
        
        if (response.data_insights) {
          console.log(`\n📊 Data Insights: ${response.data_insights}`);
        }
        
        console.log(`\n🎯 Confidence: ${response.confidence}`);
        
        // Check if response references user data
        const hasUserData = 
          response.response.includes('%') || 
          response.response.includes('kg') ||
          response.response.includes('week') ||
          response.response.includes('adherence') ||
          response.data_insights;
        
        if (hasUserData) {
          console.log('✅ Response includes user-specific data!');
        } else {
          console.log('⚠️  Response seems generic - may not be using user data');
        }
        
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
      
      console.log('\n' + '='.repeat(80));
    }

    console.log('\n✅ Chatbot test complete!');
    console.log('\n💡 The AI receives ALL user data and should reference:');
    console.log('   - Specific adherence percentages');
    console.log('   - Weight changes over time');
    console.log('   - Streak counts');
    console.log('   - Progress trends');
    console.log('   - Energy levels');
    console.log('   - And more!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

testChatbot();
