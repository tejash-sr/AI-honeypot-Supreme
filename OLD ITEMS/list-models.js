/**
 * List available Gemini models for this API key
 */
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.log('❌ GEMINI_API_KEY not set!');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('\n🔍 Checking available Gemini models...\n');
    
    // Try a simple REST API call to list models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('✅ Available models:');
      console.log('━'.repeat(60));
      data.models.forEach(model => {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`  📌 ${model.name.replace('models/', '')}`);
          console.log(`     Description: ${model.description || 'N/A'}`);
          console.log(`     Methods: ${(model.supportedGenerationMethods || []).join(', ')}`);
          console.log('');
        }
      });
    } else if (data.error) {
      console.log('❌ Error:', data.error.message);
      console.log('\nPossible issues:');
      console.log('  1. API key might not be activated yet');
      console.log('  2. Need to enable Generative Language API in Google Cloud Console');
      console.log('  3. API key restrictions (check console.anthropic.com settings)');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

listModels();
