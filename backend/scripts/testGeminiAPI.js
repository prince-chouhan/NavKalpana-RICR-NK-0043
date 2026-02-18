import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
const envPath = join(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const testGeminiAPI = async () => {
  console.log('🧪 Testing Gemini API Connection\n');
  
  // Check environment variable
  console.log('1️⃣ Checking environment variable:');
  console.log('   GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('   GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
  console.log('   GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY?.substring(0, 15) + '...');
  console.log('   GEMINI_API_KEY value:', process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('\n❌ GEMINI_API_KEY is not configured in .env file');
    console.log('   Please add: GEMINI_API_KEY=your_actual_api_key');
    process.exit(1);
  }
  
  console.log('\n2️⃣ Initializing Gemini client...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('   ✅ Client initialized successfully');
    
    console.log('\n3️⃣ Testing API with simple prompt...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Say "Hello, FitAI!" in a friendly way.');
    const response = result.response;
    const text = response.text();
    
    console.log('   ✅ API Response received:');
    console.log('   ' + '─'.repeat(60));
    console.log('   ' + text);
    console.log('   ' + '─'.repeat(60));
    
    console.log('\n4️⃣ Testing with JSON response...');
    const jsonPrompt = `Generate a simple JSON object with this structure:
{
  "message": "Hello from Gemini!",
  "status": "working",
  "timestamp": "current time"
}

Return ONLY valid JSON, no markdown.`;
    
    const jsonResult = await model.generateContent(jsonPrompt);
    const jsonText = jsonResult.response.text();
    
    // Clean up markdown if present
    let cleanJson = jsonText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```\n?/g, '');
    }
    
    const parsed = JSON.parse(cleanJson);
    console.log('   ✅ JSON Response parsed successfully:');
    console.log('   ', JSON.stringify(parsed, null, 2));
    
    console.log('\n🎉 SUCCESS! Gemini API is working correctly!');
    console.log('\n✅ Your chatbot, workout, and diet generation will use AI');
    console.log('✅ Responses will be personalized based on user data');
    console.log('✅ All systems ready!\n');
    
  } catch (error) {
    console.log('\n❌ ERROR: Failed to connect to Gemini API');
    console.log('   Error message:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid')) {
      console.log('\n💡 Your API key appears to be invalid.');
      console.log('   1. Go to: https://aistudio.google.com/app/apikey');
      console.log('   2. Create a new API key');
      console.log('   3. Update backend/.env with: GEMINI_API_KEY=your_new_key');
      console.log('   4. Restart the backend server');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('\n💡 API quota exceeded.');
      console.log('   You may have hit the free tier limit.');
      console.log('   Wait a bit or check your quota at: https://aistudio.google.com/');
    } else {
      console.log('\n💡 Unexpected error. Check:');
      console.log('   1. Internet connection');
      console.log('   2. API key is correct');
      console.log('   3. Gemini API service status');
    }
    
    process.exit(1);
  }
};

testGeminiAPI();
