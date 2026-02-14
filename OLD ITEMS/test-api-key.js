/**
 * Quick API Key Test
 * Tests Anthropic API connection before deployment
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

async function testAnthropicKey() {
  console.log('🧪 Testing Anthropic API Key...\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ERROR: ANTHROPIC_API_KEY not found in .env file');
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
    console.error('❌ ERROR: Invalid API key format (should start with sk-ant-)');
    process.exit(1);
  }

  console.log('✅ API Key found:', process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...');
  console.log('✅ API Key format: Valid\n');

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('📡 Sending test request to Claude...');
    const startTime = Date.now();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 50,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: 'Reply in Hindi: Aapka naam kya hai?'
      }]
    });

    const duration = Date.now() - startTime;

    console.log('✅ API Request: SUCCESS\n');
    console.log('📊 Response Details:');
    console.log('   Model:', message.model);
    console.log('   Response Time:', duration + 'ms');
    console.log('   Tokens Used:', message.usage.input_tokens, 'in +', message.usage.output_tokens, 'out');
    console.log('   Reply:', message.content[0].text);
    console.log('\n🎉 Your Anthropic API key is working perfectly!');
    console.log('✅ Ready for deployment to Vercel!\n');

  } catch (error) {
    console.error('❌ API Request FAILED:', error.message);
    
    if (error.status === 401) {
      console.error('\n💡 This means your API key is invalid or expired.');
      console.error('   Go to console.anthropic.com and create a new key.');
    } else if (error.status === 429) {
      console.error('\n💡 Rate limit reached. Wait a moment and try again.');
    } else if (error.status === 400) {
      console.error('\n💡 Bad request. This might be a model version issue.');
    } else {
      console.error('\n💡 Check your internet connection and try again.');
    }
    
    process.exit(1);
  }
}

testAnthropicKey().catch(console.error);
