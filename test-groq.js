/**
 * Quick Groq API Test
 * Verify that Groq integration works with the provided API key
 */

require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function testGroqAPI() {
  console.log('🔥 Testing Groq API Integration...\n');
  
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in .env');
    process.exit(1);
  }
  
  console.log('✅ API Key found:', GROQ_API_KEY.substring(0, 20) + '...');
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a confused elderly Indian woman receiving a scam call. Respond in 1 sentence, Hinglish style.'
          },
          {
            role: 'user',
            content: 'Hello madam, this is SBI calling. Your account will be blocked in 24 hours.'
          }
        ],
        max_tokens: 100,
        temperature: 0.9,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Groq API Error:', response.status, error);
      process.exit(1);
    }
    
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    
    console.log('\n🤖 Groq Response:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(reply);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Groq API is working perfectly!');
    console.log('\n📊 Stats:');
    console.log(`   Model: ${data.model}`);
    console.log(`   Tokens: ${data.usage?.total_tokens || 'N/A'}`);
    console.log(`   Latency: ~200ms (typical)`);
    
  } catch (err) {
    console.error('❌ Test Failed:', err.message);
    process.exit(1);
  }
}

testGroqAPI();
