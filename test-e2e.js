/**
 * KAVACH — End-to-End Production Simulation Test
 * Simulates a 5-turn GUVI automated test to verify:
 * 1. Groq/Gemini cascade works (NOT just human pool)
 * 2. Language mirroring works (Hindi in → Hindi out)
 * 3. Response variety (no repetition)
 */

require('dotenv').config();

// Direct import to test the full chain
const { detectAndMirror } = require('./src/language/mirror-engine');
const { classifyScam } = require('./src/detection/classifier');
const { selectPersona } = require('./src/persona/profiles');
const { buildIdentityLockPrompt } = require('./src/agent/identity-lock-prompt');
const { getResponseTiered } = require('./src/agent/three-tier-chain');
const { validateAndCleanReply } = require('./src/validation/guard');

async function simulateGuviTest() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 KAVACH E2E Production Simulation');
  console.log('═══════════════════════════════════════════════════\n');

  // GUVI-style scam messages (mix of Hindi and English)
  const scamMessages = [
    "Aapka SBI account band ho jayega agar aapne verify nahi kiya toh",
    "Haan sir, aapko abhi turant OTP share karna padega nahi toh account freeze ho jayega",
    "Jaldi kijiye, 30 minute ke andar verify karna zaroori hai aapke liye",
    "देखिए, यह बहुत urgent है, आपका account block हो जाएगा अगर आपने OTP नहीं दिया",
    "Last chance hai aapka, ab agar nahi kiya toh police case file hoga aapke khilaf"
  ];

  const session = {
    sessionId: 'test-e2e-' + Date.now(),
    turnCount: 0,
    scamType: 'bank_fraud',
    stage: 'GREETING',
    emotionHist: [],
    replyHistory: [],
    intel: { extract: () => ({}), toJSON: () => ({}) },
    stalling: { getNextTactic: () => null },
  };

  const results = [];
  const conversationHistory = [];

  for (let i = 0; i < scamMessages.length; i++) {
    const msg = scamMessages[i];
    console.log(`\n─── Turn ${i + 1} ──────────────────────────────────`);
    console.log(`📨 Scammer: "${msg}"`);

    // Step 1: Language detection
    const langData = detectAndMirror(msg);
    console.log(`🔤 Language: ${langData.language}`);

    // Step 2: Scam classification
    const scamData = classifyScam(msg, conversationHistory);

    // Step 3: Stage progression
    if (i === 0) session.stage = 'GREETING';
    else if (i <= 2) session.stage = 'RAPPORT';
    else if (i <= 4) session.stage = 'EXTRACTION';

    // Step 4: Persona
    if (i === 0) {
      session.persona = selectPersona(scamData.type, langData.language);
    }

    // Step 5: Build identity lock prompt
    const systemPrompt = buildIdentityLockPrompt(
      session.persona, langData, scamData,
      session.stage, i >= 3 ? 'HIGH' : 'MEDIUM',
      null, session.replyHistory
    );

    // Step 6: Format messages
    const messages = [
      ...conversationHistory.map(m => ({
        role: m.sender === 'scammer' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: msg }
    ];

    // Step 7: Get response via cascade
    const response = await getResponseTiered(systemPrompt, messages, session, langData);

    // Step 8: Guard
    const reply = validateAndCleanReply(response.reply, session.persona, langData);

    // Step 9: Check language of reply
    const replyLang = detectAndMirror(reply);

    console.log(`💬 KAVACH: "${reply}"`);
    console.log(`📊 Provider: ${response.provider} | Tier: ${response.tier} | ${response.ms}ms`);
    console.log(`🔤 Reply Language: ${replyLang.language}`);

    results.push({
      turn: i + 1,
      inputLang: langData.language,
      replyLang: replyLang.language,
      provider: response.provider,
      tier: response.tier,
      reply: reply.slice(0, 80),
    });

    // Update session
    session.turnCount++;
    session.replyHistory.push(reply);
    conversationHistory.push({ sender: 'scammer', text: msg });
    conversationHistory.push({ sender: 'honeypot', text: reply });

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  // Summary
  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('📊 RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════\n');

  const llmCount = results.filter(r => ['groq', 'gemini', 'claude'].includes(r.provider)).length;
  const poolCount = results.filter(r => r.provider.includes('human') || r.provider.includes('fallback')).length;
  const langMatch = results.filter(r => r.inputLang === r.replyLang || 
    (r.inputLang === 'hinglish' && r.replyLang === 'hinglish') ||
    (r.inputLang === 'hindi_devanagari' && r.replyLang === 'hindi_devanagari')).length;
  const uniqueReplies = new Set(results.map(r => r.reply)).size;

  console.log(`LLM responses: ${llmCount}/5 (Groq/Gemini/Claude)`);
  console.log(`Human pool:    ${poolCount}/5`);
  console.log(`Language match: ${langMatch}/5`);
  console.log(`Unique replies: ${uniqueReplies}/5`);
  console.log('');

  results.forEach(r => {
    const langOk = r.inputLang === r.replyLang ? '✅' : '⚠️';
    const provOk = ['groq', 'gemini', 'claude'].includes(r.provider) ? '✅' : '📦';
    console.log(`Turn ${r.turn}: ${provOk} ${r.provider.padEnd(12)} | ${langOk} ${r.inputLang}→${r.replyLang} | "${r.reply}"`);
  });

  // Pass/Fail
  console.log('\n═══════════════════════════════════════════════════');
  if (llmCount >= 3) {
    console.log('✅ LLM CASCADE: WORKING (at least 3/5 LLM responses)');
  } else {
    console.log('❌ LLM CASCADE: FAILING (only ' + llmCount + '/5 LLM responses)');
  }
  if (langMatch >= 4) {
    console.log('✅ LANGUAGE MIRROR: WORKING (' + langMatch + '/5 matched)');
  } else {
    console.log('❌ LANGUAGE MIRROR: FAILING (only ' + langMatch + '/5 matched)');
  }
  if (uniqueReplies >= 4) {
    console.log('✅ VARIETY: GOOD (' + uniqueReplies + '/5 unique)');
  } else {
    console.log('❌ VARIETY: BAD (only ' + uniqueReplies + '/5 unique)');
  }
  console.log('═══════════════════════════════════════════════════');
}

simulateGuviTest().catch(console.error);
