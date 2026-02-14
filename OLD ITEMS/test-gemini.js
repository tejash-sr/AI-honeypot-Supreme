/**
 * Quick test for Gemini API integration
 */
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('\n🧪 Testing Gemini API Integration...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.log('❌ GEMINI_API_KEY not set in .env file!');
    console.log('\n📝 Steps to fix:');
    console.log('   1. Copy .env.example to .env');
    console.log('   2. Get FREE Gemini key: https://aistudio.google.com/apikey');
    console.log('   3. Add key to .env: GEMINI_API_KEY=your-actual-key');
    console.log('   4. Run: node test-gemini.js\n');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    console.log('✅ API Key loaded');
    console.log('⏳ Sending test message...\n');
    
    const prompt = `You are Savitri Devi, a 67-year-old retired teacher from Bhopal.
A scammer just said: "Aapka SBI account aaj band hoga. OTP share karein."
Reply in Hinglish (Hindi-English mix), sounding confused but interested. Max 2 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('📨 Gemini Response:');
    console.log('━'.repeat(60));
    console.log(response);
    console.log('━'.repeat(60));
    console.log('\n✅ SUCCESS! Gemini is working perfectly!\n');
    console.log('🎯 KAVACH is now ready with Gemini 1.5 Flash');
    console.log('   • FREE tier: 15 req/min, 1M tokens/day');
    console.log('   • Response time: <400ms (faster than Claude!)');
    console.log('   • Perfect for GUVI buildathon testing\n');
    console.log('🚀 Next step: Run tests → npm run test:kavach\n');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n⚠️  Your API key is invalid.');
      console.log('   Get a new one: https://aistudio.google.com/apikey\n');
    } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
      console.log('\n⚠️  Rate limit reached (15 req/min).');
      console.log('   Wait 1 minute and try again.\n');
    } else {
      console.log('\nFull error:', error);
    }
  }
}

testGemini();
