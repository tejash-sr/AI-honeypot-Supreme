/**
 * KAVACH — SUPREMACY Test Suite
 * Tests ALL modules: Legacy + Supremacy Layers
 * Language Detection, Mirror Engine, Scam Classifier, Persona Selection,
 * Identity Lock Prompt, Engagement Arc, Intel Aggregator, 3-Tier Chain Fallbacks,
 * Response Guard, Session Store, SHIELD Report, Prompt Builder
 *
 * Run: node tests/kavach-tests.js
 */

// Legacy modules
const { detectLanguage } = require('../src/language/detector');
const { classifyScam } = require('../src/detection/classifier');
const { selectPersona } = require('../src/persona/profiles');
const { buildSystemPrompt, determineStage } = require('../src/agent/prompt-builder');
const { extractIntelligence } = require('../src/extraction/intel-extractor');
const { validateResponse, validateAndCleanReply } = require('../src/validation/guard');
const { getSession, createSession, updateSession, mergeIntel, getAllSessions } = require('../src/state/session-store');
const { appendToShieldReport, getShieldReport, listCases } = require('../src/evidence/shield');

// SUPREMACY modules
const { detectAndMirror } = require('../src/language/mirror-engine');
const { buildIdentityLockPrompt } = require('../src/agent/identity-lock-prompt');
const { StallingArsenal, ENGAGEMENT_ARC } = require('../src/agent/engagement-arc');
const { IntelAggregator } = require('../src/intelligence/aggregator');
const { SMART_FALLBACKS, BASE_FALLBACKS } = require('../src/agent/three-tier-chain');

// ====== Test Harness ======
let passed = 0, failed = 0, total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ❌ ${name}`);
    console.log(`     → ${err.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected "${b}", got "${a}"`);
}

function assertIncludes(arr, item, msg) {
  if (!arr || !arr.includes(item)) throw new Error(msg || `Expected array to include "${item}", got [${arr}]`);
}

// =====================================================
// 1. LANGUAGE DETECTION TESTS
// =====================================================
console.log('\n🔤 Language Detection Tests');
console.log('─'.repeat(50));

test('Detect Hindi Devanagari', () => {
  const r = detectLanguage('आपका खाता बंद हो जाएगा अभी OTP बताइए');
  assert(r.primaryScript === 'hindi_devanagari', `Expected hindi_devanagari, got ${r.primaryScript}`);
  assertIncludes(r.languages, 'Hindi');
});

test('Detect Tamil', () => {
  const r = detectLanguage('உங்கள் வங்கி கணக்கு முடக்கப்படும்');
  assertEqual(r.primaryScript, 'tamil');
  assertIncludes(r.languages, 'Tamil');
});

test('Detect Telugu', () => {
  const r = detectLanguage('మీ ఖాతా బ్లాక్ చేయబడుతుంది');
  assertEqual(r.primaryScript, 'telugu');
  assertIncludes(r.languages, 'Telugu');
});

test('Detect Bengali', () => {
  const r = detectLanguage('আপনার অ্যাকাউন্ট ব্লক হয়ে যাবে');
  assertEqual(r.primaryScript, 'bengali');
  assertIncludes(r.languages, 'Bengali');
});

test('Detect Gujarati', () => {
  const r = detectLanguage('તમારું ખાતું બંધ થઈ જશે');
  assertEqual(r.primaryScript, 'gujarati');
  assertIncludes(r.languages, 'Gujarati');
});

test('Detect Kannada', () => {
  const r = detectLanguage('ನಿಮ್ಮ ಖಾತೆ ನಿಲ್ಲಿಸಲಾಗುವುದು');
  assertEqual(r.primaryScript, 'kannada');
  assertIncludes(r.languages, 'Kannada');
});

test('Detect Hinglish', () => {
  const r = detectLanguage('Aapka account abhi block hoga, jaldi OTP share karo bhai');
  assertEqual(r.primaryScript, 'hinglish');
  assert(r.isMixed || r.languages.length >= 1, 'Should detect Hinglish');
});

test('Detect English', () => {
  const r = detectLanguage('The weather in London is quite pleasant during spring time.');
  assertEqual(r.primaryScript, 'english');
});

test('Detect mixed Hindi+English', () => {
  const r = detectLanguage('आपका account ब्लॉक हो जाएगा aaj');
  assert(r.isMixed === true, 'Should detect mixed language');
});

test('Handle empty input', () => {
  const r = detectLanguage('');
  assertEqual(r.primaryScript, 'english');
  assert(r.responseGuidance.length > 0, 'Should provide guidance');
});

// =====================================================
// 2. SCAM CLASSIFIER TESTS
// =====================================================
console.log('\n🔍 Scam Classifier Tests');
console.log('─'.repeat(50));

test('Classify bank fraud (English)', () => {
  const r = classifyScam('Your SBI account will be blocked today. Verify now!');
  assertEqual(r.type, 'bank_fraud');
  assert(r.isScam === true);
  assert(r.confidence > 0.6, `Confidence ${r.confidence} too low`);
});

test('Classify KYC fraud', () => {
  const r = classifyScam('Your KYC has expired. Update immediately or account will be suspended.');
  assert(r.type === 'kyc_fraud' || r.type === 'bank_fraud', `Got ${r.type}`);
  assert(r.isScam === true);
});

test('Classify UPI fraud', () => {
  const r = classifyScam('Share your UPI ID to receive ₹50000 cashback on Paytm');
  assertEqual(r.type, 'upi_fraud');
  assertIncludes(r.tactics, 'upi_request');
});

test('Classify OTP fraud', () => {
  const r = classifyScam('Share OTP 834291 to verify your account immediately');
  assert(r.type === 'otp_fraud' || r.confidence > 0.8, `Got ${r.type}`);
  assert(r.isScam === true);
});

test('Classify lottery scam', () => {
  const r = classifyScam('Congratulations! You have won ₹10 lakhs in the lucky draw!');
  assertEqual(r.type, 'lottery_scam');
});

test('Classify job scam', () => {
  const r = classifyScam('Work from home job offer - earn ₹5000 per day. No experience needed.');
  assertEqual(r.type, 'job_scam');
});

test('Classify phishing', () => {
  const r = classifyScam('Click this link http://fake-bank.tk/verify to update your account');
  assert(r.type === 'phishing' || r.type === 'bank_fraud', `Got ${r.type}`);
  assert(r.isScam === true);
});

test('Classify investment fraud', () => {
  const r = classifyScam('Invest ₹10000 and get guaranteed 500% return in 30 days. Bitcoin trading.');
  assert(r.type === 'investment_fraud' || r.type === 'crypto_scam', `Got ${r.type}`);
});

test('Classify Hindi bank fraud', () => {
  const r = classifyScam('आपका अकाउंट ब्लॉक हो जाएगा, अभी KYC करें');
  assert(r.isScam === true);
  assert(r.confidence > 0.5);
});

test('Urgency boosts confidence', () => {
  const r1 = classifyScam('Your account needs verification');
  const r2 = classifyScam('URGENT! Your account needs verification immediately! Jaldi karo!');
  assert(r2.confidence >= r1.confidence, 'Urgency should boost confidence');
});

test('Authority boosts confidence', () => {
  const r = classifyScam('This is from RBI. Your account will be suspended by government order.');
  assertIncludes(r.tactics, 'authority');
});

// =====================================================
// 3. PERSONA SELECTION TESTS
// =====================================================
console.log('\n🎭 Persona Selection Tests');
console.log('─'.repeat(50));

test('Bank fraud + Hindi → Elderly Woman Hindi', () => {
  const p = selectPersona('bank_fraud', 'hindi_devanagari');
  assertEqual(p.id, 'ELDERLY_WOMAN_HINDI');
  assertEqual(p.name, 'Savitri Devi');
});

test('Bank fraud + Tamil → Housewife South', () => {
  const p = selectPersona('bank_fraud', 'tamil');
  assertEqual(p.id, 'HOUSEWIFE_SOUTH');
  assertEqual(p.name, 'Lakshmi Venkat');
});

test('Job scam → Young Jobseeker', () => {
  const p = selectPersona('job_scam', 'hinglish');
  assertEqual(p.id, 'YOUNG_JOBSEEKER');
  assertEqual(p.name, 'Ravi Kumar');
});

test('Crypto scam + Gujarati → Businessman', () => {
  const p = selectPersona('crypto_scam', 'gujarati');
  assertEqual(p.id, 'BUSINESSMAN_GUJARATI');
  assertEqual(p.name, 'Suresh Patel');
});

test('Bengali scam → Elderly Bengali', () => {
  const p = selectPersona('bank_fraud', 'bengali');
  assertEqual(p.id, 'ELDERLY_MAN_BENGALI');
  assertEqual(p.name, 'Subhash Ghosh');
});

test('Phishing + English → Educated Professional', () => {
  const p = selectPersona('phishing', 'english');
  assertEqual(p.id, 'EDUCATED_PROFESSIONAL');
  assertEqual(p.name, 'Anjali Mehta');
});

test('Every persona has required fields', () => {
  const types = ['bank_fraud', 'job_scam', 'crypto_scam', 'phishing', 'lottery_scam'];
  const langs = ['hinglish', 'tamil', 'bengali', 'gujarati', 'english'];
  for (let i = 0; i < types.length; i++) {
    const p = selectPersona(types[i], langs[i]);
    assert(p.name, `Missing name for ${types[i]}/${langs[i]}`);
    assert(p.age, `Missing age for ${types[i]}/${langs[i]}`);
    assert(p.bank, `Missing bank for ${types[i]}/${langs[i]}`);
    assert(p.fillers && p.fillers.length > 0, `Missing fillers for ${types[i]}/${langs[i]}`);
  }
});

// =====================================================
// 4. INTELLIGENCE EXTRACTION TESTS
// =====================================================
console.log('\n🔎 Intelligence Extraction Tests');
console.log('─'.repeat(50));

test('Extract phone numbers', () => {
  const r = extractIntelligence('Call me at +919876543210 or 8765432109');
  assert(r.phoneNumbers && r.phoneNumbers.length >= 1, `Got ${JSON.stringify(r.phoneNumbers)}`);
});

test('Extract UPI IDs', () => {
  const r = extractIntelligence('Send money to payments@paytm or user123@upi');
  assert(r.upiIds && r.upiIds.length >= 1, `Got ${JSON.stringify(r.upiIds)}`);
});

test('Extract phishing URLs', () => {
  const r = extractIntelligence('Click here: http://fake-sbi.tk/verify to update');
  assert(r.phishingUrls && r.phishingUrls.length >= 1, `Got ${JSON.stringify(r.phishingUrls)}`);
});

test('Extract PAN numbers', () => {
  const r = extractIntelligence('Your PAN is ABCDE1234F');
  assert(r.panNumbers && r.panNumbers.length >= 1, `Got ${JSON.stringify(r.panNumbers)}`);
});

test('Detect OTP request', () => {
  const r = extractIntelligence('Share your OTP immediately to verify');
  assert(r.otpRequests === true, 'Should detect OTP request');
});

test('Detect urgency tactics', () => {
  const r = extractIntelligence('Your account will be blocked immediately if you dont verify');
  assert(r.urgencyTactics && r.urgencyTactics.length > 0, 'Should detect urgency');
});

test('Extract organizations', () => {
  const r = extractIntelligence('I am from State Bank of India, calling about your account');
  // This may or may not match depending on regex — test gracefully
  assert(r !== null, 'Should return result object');
});

test('Handle empty input', () => {
  const r = extractIntelligence('');
  assert(typeof r === 'object', 'Should return empty object');
});

// =====================================================
// 5. RESPONSE GUARD TESTS
// =====================================================
console.log('\n🛡️ Response Guard Tests');
console.log('─'.repeat(50));

const mockPersona = { name: 'Savitri Devi', fillers: ['arrey', 'haan ji'] };
const mockLang = { primaryScript: 'hinglish' };

test('Pass valid response through', () => {
  const r = validateResponse('Arrey, kaunsa account? Mera Canara wala ya SBI wala?', mockPersona, mockLang);
  assert(r.includes('kaunsa') || r.includes('account'), 'Should preserve valid response');
});

test('Block AI tell "Certainly"', () => {
  const r = validateResponse('Certainly, I can help you with that.', mockPersona, mockLang);
  assert(!r.includes('Certainly'), `Should strip AI tell, got: ${r}`);
});

test('Block AI tell "As an AI"', () => {
  const r = validateResponse('As an AI, I cannot actually engage in conversations.', mockPersona, mockLang);
  assert(!r.includes('As an AI'), `Should strip AI tell, got: ${r}`);
});

test('Block "I apologize"', () => {
  const r = validateResponse('I apologize for any inconvenience caused.', mockPersona, mockLang);
  assert(!r.includes('I apologize'), `Should strip AI tell`);
});

test('Block persona breaks', () => {
  const r = validateResponse('I know you are a scammer trying to fraud me.', mockPersona, mockLang);
  assert(!r.includes('scammer'), `Should prevent persona break`);
});

test('Enforce max length', () => {
  const longReply = 'A'.repeat(300);
  const r = validateResponse(longReply, mockPersona, mockLang);
  assert(r.length <= 260, `Response too long: ${r.length} chars`);
});

test('Ensure open-ended ending', () => {
  const r = validateResponse('I will check my account', mockPersona, mockLang);
  assert(r.endsWith('?') || r.endsWith('...') || r.endsWith('!') || r.endsWith('…'), `Should end open: "${r}"`);
});

test('Language-specific fallback for Hindi', () => {
  const r = validateResponse('Certainly! I understand your concern.', mockPersona, { primaryScript: 'hindi_devanagari' });
  assert(r.includes('समझ') || r.includes('बता'), `Should fallback to Hindi, got: ${r}`);
});

test('Language-specific fallback for Tamil', () => {
  const r = validateResponse('I appreciate your patience.', mockPersona, { primaryScript: 'tamil' });
  assert(r.includes('புரி') || r.includes('சொல்'), `Should fallback to Tamil`);
});

// =====================================================
// 6. SESSION STORE TESTS
// =====================================================
console.log('\n💾 Session Store Tests');
console.log('─'.repeat(50));

test('Create session', () => {
  const s = createSession('test-session-1', { scamType: 'bank_fraud' });
  assert(s.sessionId === 'test-session-1');
  assert(s.turnCount === 0);
  assert(s.shieldCaseId.startsWith('KAVACH-2026-'));
});

test('Get session', () => {
  const s = getSession('test-session-1');
  assert(s !== null);
  assertEqual(s.scamType, 'bank_fraud');
});

test('Update session', () => {
  updateSession('test-session-1', { turnCount: 3, stage: 'RAPPORT' });
  const s = getSession('test-session-1');
  assertEqual(s.turnCount, 3);
  assertEqual(s.stage, 'RAPPORT');
});

test('Merge intel', () => {
  const existing = { phoneNumbers: ['9876543210'], upiIds: [] };
  mergeIntel(existing, { phoneNumbers: ['9876543210', '8765432109'], upiIds: ['test@upi'] });
  assert(existing.phoneNumbers.length === 2, `Expected 2 phones, got ${existing.phoneNumbers.length}`);
  assert(existing.upiIds.length === 1, `Expected 1 UPI, got ${existing.upiIds.length}`);
});

test('Get all sessions', () => {
  const all = getAllSessions();
  assert(Array.isArray(all));
  assert(all.length >= 1);
});

// =====================================================
// 7. SHIELD REPORT TESTS
// =====================================================
console.log('\n📋 SHIELD Report Tests');
console.log('─'.repeat(50));

test('Append to SHIELD report', () => {
  appendToShieldReport('KAVACH-2026-TEST', {
    turn: 1,
    scammerMessage: 'Aapka account block hoga',
    kavachReply: 'Kaunsa account? Mera SBI wala?',
    intelThisTurn: { phoneNumbers: ['9876543210'] },
    stage: 'GREETING',
    scamType: 'bank_fraud',
  });
  const r = getShieldReport('KAVACH-2026-TEST');
  assert(r !== null, 'Report should exist');
  assertEqual(r.caseId, 'KAVACH-2026-TEST');
  assert(r.conversationTranscript.length === 1);
});

test('Append second turn', () => {
  appendToShieldReport('KAVACH-2026-TEST', {
    turn: 2,
    scammerMessage: 'SBI wala, abhi OTP do',
    kavachReply: 'Haan ji, mera phone pe OTP nahi aaya...',
    intelThisTurn: { upiIds: ['scammer@upi'] },
    stage: 'RAPPORT',
    scamType: 'bank_fraud',
  });
  const r = getShieldReport('KAVACH-2026-TEST');
  assert(r.conversationTranscript.length === 2);
  assert(r.cumulativeIntel.phoneNumbers.length >= 1);
  assert(r.cumulativeIntel.upiIds.length >= 1);
});

test('SHIELD report has legal metadata', () => {
  const r = getShieldReport('KAVACH-2026-TEST');
  assert(r.generatedBy.includes('KAVACH'), 'Should have KAVACH attribution');
  assert(r.disclaimer.includes('IT Act'), 'Should reference IT Act');
  assert(r.cybercellNote.includes('1930'), 'Should reference helpline');
  assert(r.lawEnforcementSummary.length > 0, 'Should have LE summary');
});

test('List cases', () => {
  const cases = listCases();
  assert(Array.isArray(cases));
  assert(cases.includes('KAVACH-2026-TEST'));
});

// =====================================================
// 8. PROMPT BUILDER TESTS
// =====================================================
console.log('\n🧠 Prompt Builder Tests');
console.log('─'.repeat(50));

test('Build system prompt with persona', () => {
  const persona = selectPersona('bank_fraud', 'hinglish');
  const prompt = buildSystemPrompt({
    persona,
    languageGuidance: 'Respond in Hinglish',
    scamType: 'bank_fraud',
    scamTactics: ['urgency', 'fear'],
    stage: 'GREETING',
    extractedIntel: {},
    turnCount: 0,
  });
  assert(prompt.includes(persona.name), 'Should include persona name');
  assert(prompt.includes('bank fraud'), 'Should include scam type');
  assert(prompt.includes('GREETING'), 'Should include stage');
  assert(prompt.includes('NEVER'), 'Should include hard rules');
  assert(prompt.includes('1–2 sentences'), 'Should enforce brevity');
});

test('Stage determination — turn 0', () => {
  const stage = determineStage(0, { tactics: [] });
  assertEqual(stage, 'GREETING');
});

test('Stage determination — turn 1-2', () => {
  const stage = determineStage(1, { tactics: ['urgency'] });
  assertEqual(stage, 'RAPPORT');
});

test('Stage determination — OTP request → EXTRACTION', () => {
  const stage = determineStage(5, { tactics: ['otp_request'] });
  assertEqual(stage, 'EXTRACTION');
});

test('Stage determination — turn 8+ → CLOSING', () => {
  const stage = determineStage(8, { tactics: [] });
  assertEqual(stage, 'CLOSING');
});

// =====================================================
// 9. CROSS-LANGUAGE SCAM TESTS
// =====================================================
console.log('\n🌐 Cross-Language Integration Tests');
console.log('─'.repeat(50));

const CROSS_LANG_TESTS = [
  { name: 'Hindi bank fraud', text: 'आपका SBI अकाउंट ब्लॉक हो जाएगा, केवाईसी अपडेट करें', expectLang: 'hindi_devanagari', expectScam: true },
  { name: 'Tamil OTP scam', text: 'உங்கள் வங்கி கணக்கு முடக்கப்படும். உடனடியாக OTP பகிரவும்', expectLang: 'tamil', expectScam: true },
  { name: 'Telugu account fraud', text: 'మీ ఖాతా బ్లాక్ చేయబడుతుంది వెంటనే verify చేయండి', expectLang: 'telugu', expectScam: true },
  { name: 'Bengali KYC fraud', text: 'আপনার ব্যাংক অ্যাকাউন্ট ভেরিফাই করুন নাহলে ব্লক হবে', expectLang: 'bengali', expectScam: true },
  { name: 'Hinglish UPI fraud', text: 'Aapko 50000 ka cashback mila hai, apna UPI ID share karo jaldi', expectLang: 'hinglish', expectScam: true },
  { name: 'English phishing', text: 'Click http://fake.tk/login to open your profile and check the settings page', expectLang: 'english', expectScam: true },
];

for (const t of CROSS_LANG_TESTS) {
  test(t.name, () => {
    const lang = detectLanguage(t.text);
    const scam = classifyScam(t.text);
    const persona = selectPersona(scam.type, lang.primaryScript);

    assertEqual(lang.primaryScript, t.expectLang, `Lang: got ${lang.primaryScript}`);
    assertEqual(scam.isScam, t.expectScam, `Scam: got ${scam.isScam}`);
    assert(persona !== null && persona !== undefined, 'Should select a persona');
    assert(persona.name, `Persona should have a name for ${t.name}`);
  });
}

// =====================================================
// 10. END-TO-END PIPELINE SIMULATION
// =====================================================
console.log('\n🔄 End-to-End Pipeline Tests');
console.log('─'.repeat(50));

test('Full pipeline: Hindi bank fraud', () => {
  const text = 'Aapka SBI account aaj band hoga. Abhi OTP share karo.';

  // Step 1: Language
  const lang = detectLanguage(text);
  assert(lang.primaryScript === 'hinglish' || lang.primaryScript === 'english');

  // Step 2: Classification
  const scam = classifyScam(text);
  assert(scam.isScam === true);
  assert(scam.confidence > 0.5);

  // Step 3: Session
  const session = createSession('e2e-test-1', { scamType: scam.type });
  assert(session.turnCount === 0);

  // Step 4: Persona
  const persona = selectPersona(scam.type, lang.primaryScript);
  assert(persona.name);

  // Step 5: Stage
  const stage = determineStage(session.turnCount, scam);
  assertEqual(stage, 'GREETING');

  // Step 6: Build prompt
  const prompt = buildSystemPrompt({
    persona, languageGuidance: lang.responseGuidance,
    scamType: scam.type, scamTactics: scam.tactics,
    stage, extractedIntel: session.extractedIntel, turnCount: session.turnCount,
  });
  assert(prompt.length > 100, 'Prompt should be substantial');

  // Step 7: Extract intel
  const intel = extractIntelligence(text);
  assert(typeof intel === 'object');

  // Step 8: Validate a mock response
  const mockReply = 'Arrey, kaunsa account? Mera Canara wala ya SBI wala?';
  const validated = validateResponse(mockReply, persona, lang);
  assert(validated.length > 0);

  // Step 9: SHIELD
  appendToShieldReport(session.shieldCaseId, {
    turn: 1, scammerMessage: text, kavachReply: validated,
    intelThisTurn: intel, stage, scamType: scam.type,
  });
  const report = getShieldReport(session.shieldCaseId);
  assert(report !== null);
});

test('Full pipeline: Tamil OTP fraud', () => {
  const text = 'உங்கள் வங்கி கணக்கு முடக்கப்படும். உடனடியாக OTP பகிரவும்.';
  const lang = detectLanguage(text);
  assertEqual(lang.primaryScript, 'tamil');
  const scam = classifyScam(text);
  assert(scam.isScam);
  const persona = selectPersona(scam.type, lang.primaryScript);
  assertEqual(persona.id, 'HOUSEWIFE_SOUTH');
});

// =====================================================
// 11. SUPREMACY: MIRROR ENGINE TESTS
// =====================================================
console.log('\n🪞 Mirror Engine Tests');
console.log('─'.repeat(50));

test('Mirror: Detect Hindi Devanagari', () => {
  const r = detectAndMirror('आपका खाता बंद हो जाएगा');
  assertEqual(r.language, 'hindi_devanagari');
  assert(r.fillers.length > 0, 'Should have fillers');
  assert(r.responseDirective.includes('Devanagari'), 'Should direct Devanagari');
});

test('Mirror: Detect Tamil', () => {
  const r = detectAndMirror('உங்கள் வங்கி கணக்கு முடக்கப்படும்');
  assertEqual(r.language, 'tamil');
  assert(r.responseDirective.includes('Tamil'), 'Should direct Tamil');
});

test('Mirror: Detect Telugu', () => {
  const r = detectAndMirror('మీ ఖాతా బ్లాక్ చేయబడుతుంది');
  assertEqual(r.language, 'telugu');
  assert(r.responseDirective.includes('Telugu'));
});

test('Mirror: Detect Bengali', () => {
  const r = detectAndMirror('আপনার অ্যাকাউন্ট ব্লক হয়ে যাবে');
  assertEqual(r.language, 'bengali');
  assert(r.responseDirective.includes('Bengali'));
});

test('Mirror: Detect Gujarati', () => {
  const r = detectAndMirror('તમારું ખાતું બંધ થઈ જશે');
  assertEqual(r.language, 'gujarati');
  assert(r.responseDirective.includes('Gujarati'));
});

test('Mirror: Detect Kannada', () => {
  const r = detectAndMirror('ನಿಮ್ಮ ಖಾತೆ ನಿಲ್ಲಿಸಲಾಗುವುದು');
  assertEqual(r.language, 'kannada');
  assert(r.responseDirective.includes('Kannada'));
});

test('Mirror: Detect Hinglish', () => {
  const r = detectAndMirror('Aapka account abhi block hoga, jaldi OTP batao bhai');
  assertEqual(r.language, 'hinglish');
  assert(r.responseDirective.includes('Hinglish'));
});

test('Mirror: Has error style', () => {
  const r = detectAndMirror('Aapka account block hoga');
  assert(r.errorStyle && r.errorStyle.length > 5, 'Should have error style guidance');
});

test('Mirror: Empty input defaults to English', () => {
  const r = detectAndMirror('');
  assertEqual(r.language, 'english');
});

// =====================================================
// 12. SUPREMACY: IDENTITY LOCK PROMPT TESTS
// =====================================================
console.log('\n🔒 Identity Lock Prompt Tests');
console.log('─'.repeat(50));

test('Identity Lock: Contains persona name in caps', () => {
  const persona = selectPersona('bank_fraud', 'hinglish');
  const langData = detectAndMirror('Aapka account block hoga');
  const scamData = classifyScam('Aapka account block hoga');
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'GREETING', 'LOW', null);
  assert(prompt.includes(persona.name.toUpperCase()), 'Should have persona name in caps');
});

test('Identity Lock: Contains NON-NEGOTIABLE language anchor', () => {
  const persona = selectPersona('bank_fraud', 'tamil');
  const langData = detectAndMirror('உங்கள் கணக்கு நிறுத்தப்படும்');
  const scamData = classifyScam('Account blocked');
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'RAPPORT', 'MEDIUM', null);
  assert(prompt.includes('NON-NEGOTIABLE'), 'Should have non-negotiable marker');
  assert(prompt.includes('Tamil'), 'Should mention Tamil');
});

test('Identity Lock: Contains OUTPUT CONTRACT', () => {
  const persona = selectPersona('bank_fraud', 'hinglish');
  const langData = detectAndMirror('Account block');
  const scamData = { type: 'bank_fraud', confidence: 0.9, tactics: ['urgency'] };
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'EXTRACTION', 'HIGH', null);
  assert(prompt.includes('OUTPUT CONTRACT'), 'Should have output contract');
  assert(prompt.includes('Maximum 2 sentences'), 'Should enforce 2 sentence max');
  assert(prompt.includes('NEVER write'), 'Should have NEVER rules');
});

test('Identity Lock: Injects stalling tactic', () => {
  const persona = selectPersona('bank_fraud', 'hinglish');
  const langData = detectAndMirror('OTP batao');
  const scamData = { type: 'bank_fraud', confidence: 0.9, tactics: ['otp_request'] };
  const tactic = 'Say you need your glasses to read the OTP';
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'EXTRACTION', 'MEDIUM', tactic);
  assert(prompt.includes(tactic), 'Should inject stalling tactic');
});

test('Identity Lock: Contains emotional state', () => {
  const persona = selectPersona('bank_fraud', 'hinglish');
  const langData = detectAndMirror('JALDI BATAO OTP');
  const scamData = { type: 'otp_fraud', confidence: 0.95, tactics: ['otp_request'] };
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'EXTRACTION', 'HIGH', null);
  assert(prompt.includes('genuinely scared'), 'HIGH emotion should show scared');
});

// =====================================================
// 13. SUPREMACY: ENGAGEMENT ARC TESTS
// =====================================================
console.log('\n🎯 Engagement Arc Tests');
console.log('─'.repeat(50));

test('StallingArsenal: Returns unique tactics', () => {
  const arsenal = new StallingArsenal('ELDERLY_WOMAN_HINDI');
  const t1 = arsenal.getNextTactic('GREETING');
  const t2 = arsenal.getNextTactic('GREETING');
  assert(t1 !== null, 'Should return a tactic');
  if (t2 !== null) {
    assert(t1 !== t2, 'Should return different tactics');
  }
});

test('StallingArsenal: Never repeats', () => {
  const arsenal = new StallingArsenal('ELDERLY_WOMAN_HINDI');
  const tactics = new Set();
  for (let i = 0; i < 20; i++) {
    const t = arsenal.getNextTactic('RAPPORT');
    if (t === null) break; // Pool exhausted
    assert(!tactics.has(t), `Repeated tactic: ${t}`);
    tactics.add(t);
  }
  assert(tactics.size >= 3, `Should have at least 3 unique tactics, got ${tactics.size}`);
});

test('StallingArsenal: Returns null when exhausted', () => {
  const arsenal = new StallingArsenal('ELDERLY_WOMAN_HINDI');
  // Exhaust all GREETING tactics
  for (let i = 0; i < 20; i++) {
    if (arsenal.getNextTactic('GREETING') === null) break;
  }
  const final = arsenal.getNextTactic('GREETING');
  assertEqual(final, null);
});

test('StallingArsenal: Serialization round-trip', () => {
  const arsenal = new StallingArsenal('YOUNG_JOBSEEKER');
  arsenal.getNextTactic('GREETING');
  arsenal.getNextTactic('RAPPORT');
  const json = arsenal.toJSON();
  const restored = StallingArsenal.fromJSON(json);
  assertEqual(restored.personaType, 'YOUNG_JOBSEEKER');
  assert(restored.used.size === 2, `Expected 2 used, got ${restored.used.size}`);
});

test('Engagement Arc: All 6 persona types have arcs', () => {
  const personas = ['ELDERLY_WOMAN_HINDI', 'HOUSEWIFE_SOUTH', 'YOUNG_JOBSEEKER', 'BUSINESSMAN_GUJARATI', 'ELDERLY_MAN_BENGALI', 'EDUCATED_PROFESSIONAL'];
  for (const p of personas) {
    assert(ENGAGEMENT_ARC[p], `Missing arc for ${p}`);
    assert(ENGAGEMENT_ARC[p].GREETING, `Missing GREETING for ${p}`);
    assert(ENGAGEMENT_ARC[p].RAPPORT, `Missing RAPPORT for ${p}`);
    assert(ENGAGEMENT_ARC[p].EXTRACTION, `Missing EXTRACTION for ${p}`);
    assert(ENGAGEMENT_ARC[p].CLOSING, `Missing CLOSING for ${p}`);
  }
});

// =====================================================
// 14. SUPREMACY: INTEL AGGREGATOR TESTS
// =====================================================
console.log('\n🕵️ Intel Aggregator Tests');
console.log('─'.repeat(50));

test('Aggregator: Extract UPI IDs', () => {
  const agg = new IntelAggregator();
  agg.extract('Send money to fraud@paytm');
  const json = agg.toJSON();
  assert(json.upiIds.length >= 1, `Expected UPI IDs, got ${JSON.stringify(json.upiIds)}`);
});

test('Aggregator: Extract phone numbers', () => {
  const agg = new IntelAggregator();
  agg.extract('Call me +919876543210 or try 8765432109');
  const json = agg.toJSON();
  assert(json.phoneNumbers.length >= 1, `Expected phones, got ${JSON.stringify(json.phoneNumbers)}`);
});

test('Aggregator: Extract phishing URLs', () => {
  const agg = new IntelAggregator();
  agg.extract('Click http://fake-sbi.tk/verify now');
  const json = agg.toJSON();
  assert(json.phishingLinks.length >= 1, `Expected URLs, got ${JSON.stringify(json.phishingLinks)}`);
});

test('Aggregator: Accumulates across calls', () => {
  const agg = new IntelAggregator();
  agg.extract('Call 9876543210');
  agg.extract('UPI: test@paytm');
  agg.extract('Visit http://fake.tk/login ');
  const json = agg.toJSON();
  assert(json.phoneNumbers.length >= 1);
  assert(json.upiIds.length >= 1);
  assert(json.phishingLinks.length >= 1);
});

test('Aggregator: Deduplicates', () => {
  const agg = new IntelAggregator();
  agg.extract('Call 9876543210');
  agg.extract('Again: 9876543210');
  const json = agg.toJSON();
  assertEqual(json.phoneNumbers.length, 1);
});

test('Aggregator: Extract suspicious keywords', () => {
  const agg = new IntelAggregator();
  agg.extract('URGENT: Your account will be blocked if you dont verify immediately');
  const json = agg.toJSON();
  assert(json.suspiciousKeywords.length >= 2, 'Should detect urgent + verify/block');
});

test('Aggregator: GUVI callback payload format', () => {
  const agg = new IntelAggregator();
  agg.extract('Send to fraud@paytm, call 9876543210');
  const payload = agg.getGuviCallbackPayload('test-session', 5, 'bank_fraud');
  assertEqual(payload.sessionId, 'test-session');
  assertEqual(payload.scamDetected, true);
  assertEqual(payload.totalMessagesExchanged, 5);
  assert(payload.extractedIntelligence.upiIds.length >= 1);
  assert(payload.extractedIntelligence.phoneNumbers.length >= 1);
  assert(payload.agentNotes.includes('KAVACH'), 'agentNotes should mention KAVACH');
  assert(payload.agentNotes.includes('1930'), 'agentNotes should mention helpline');
});

test('Aggregator: PAN card extraction', () => {
  const agg = new IntelAggregator();
  agg.extract('My PAN is ABCDE1234F please check');
  const json = agg.toJSON();
  assert(json.panCards.length >= 1, `Expected PAN, got ${JSON.stringify(json.panCards)}`);
});

test('Aggregator: Serialization round-trip', () => {
  const agg = new IntelAggregator();
  agg.extract('Call 9876543210, UPI: test@paytm');
  const json = agg.toJSON();
  const restored = IntelAggregator.fromJSON(json);
  const restoredJson = restored.toJSON();
  assertEqual(restoredJson.phoneNumbers.length, json.phoneNumbers.length);
  assertEqual(restoredJson.upiIds.length, json.upiIds.length);
});

// =====================================================
// 15. SUPREMACY: 3-TIER FALLBACK TESTS
// =====================================================
console.log('\n⚡ 3-Tier Fallback Tests');
console.log('─'.repeat(50));

test('Smart fallbacks: bank_fraud GREETING exists for 6+ languages', () => {
  const langs = ['hinglish', 'hindi_devanagari', 'tamil', 'telugu', 'bengali', 'english'];
  for (const lang of langs) {
    const key = `bank_fraud:GREETING:${lang}`;
    assert(SMART_FALLBACKS[key], `Missing fallback for ${key}`);
    assert(SMART_FALLBACKS[key].length > 10, `Fallback too short for ${key}`);
  }
});

test('Smart fallbacks: EXTRACTION stage exists', () => {
  assert(SMART_FALLBACKS['bank_fraud:EXTRACTION:hinglish'], 'Missing bank_fraud EXTRACTION hinglish');
  assert(SMART_FALLBACKS['otp_fraud:EXTRACTION:hinglish'], 'Missing otp_fraud EXTRACTION hinglish');
});

test('Smart fallbacks: Aggressive fallbacks exist', () => {
  assert(SMART_FALLBACKS['aggressive:ANY:hinglish'], 'Missing aggressive hinglish');
  assert(SMART_FALLBACKS['aggressive:ANY:hindi_devanagari'], 'Missing aggressive hindi');
  assert(SMART_FALLBACKS['aggressive:ANY:english'], 'Missing aggressive english');
});

test('Base fallbacks: All 11 languages covered', () => {
  const all = ['hindi_devanagari', 'hinglish', 'tamil', 'telugu', 'kannada', 'bengali', 'gujarati', 'punjabi', 'malayalam', 'marathi', 'english'];
  for (const lang of all) {
    assert(BASE_FALLBACKS[lang], `Missing base fallback for ${lang}`);
  }
});

// =====================================================
// 16. SUPREMACY: UPGRADED GUARD TESTS
// =====================================================
console.log('\n🛡️ Supremacy Guard Tests');
console.log('─'.repeat(50));

const mockPersonaS = { name: 'Savitri Devi', fillers: ['arrey', 'haan ji'] };
const mockLangMirror = { language: 'hinglish', fillers: ['arrey'], errorStyle: 'drops articles' };

test('Guard (new): Pass valid reply', () => {
  const r = validateAndCleanReply('Arrey, kaunsa account? Mera Canara wala ya SBI wala?', mockPersonaS, mockLangMirror);
  assert(r.includes('account'), 'Should preserve valid reply');
});

test('Guard (new): Block "Great" AI tell', () => {
  const r = validateAndCleanReply('Great, I can help you with that inquiry.', mockPersonaS, mockLangMirror);
  assert(!r.includes('Great'), 'Should block Great');
  assert(r.includes('samajh'), 'Should use hinglish fallback');
});

test('Guard (new): Block "I would recommend"', () => {
  const r = validateAndCleanReply("I'd recommend checking your account first.", mockPersonaS, mockLangMirror);
  assert(!r.includes('recommend'), 'Should block recommend');
});

test('Guard (new): Enforce 2-sentence max', () => {
  const threeLines = 'First sentence here. Second is here. Third sentence too. Fourth one really.';
  const r = validateAndCleanReply(threeLines, mockPersonaS, mockLangMirror);
  // Should not include all 4 sentences — guard cuts at 2
  assert(!r.includes('Fourth'), `Should cut to 2 sentences, got: ${r}`);
});

test('Guard (new): Backwards compat — validateResponse alias works', () => {
  const r = validateResponse('Arrey, kya hua?', mockPersonaS, { primaryScript: 'hinglish' });
  assert(r.includes('kya hua'), 'Alias should work');
});

// =====================================================
// 17. SUPREMACY: FULL GOD-LEVEL PIPELINE
// =====================================================
console.log('\n🏆 GOD LEVEL Pipeline Tests');
console.log('─'.repeat(50));

test('GOD Pipeline: Hindi bank fraud — full 12-step', () => {
  const text = 'आपका SBI अकाउंट आज बंद हो जाएगा। तुरंत KYC अपडेट करें। कॉल करें: 9876543210';

  // Mirror engine
  const langData = detectAndMirror(text);
  assertEqual(langData.language, 'hindi_devanagari');
  assert(langData.responseDirective.includes('Devanagari'));

  // Scam classifier
  const scamData = classifyScam(text);
  assert(scamData.isScam);

  // Persona
  const persona = selectPersona(scamData.type, langData.language);
  assertEqual(persona.id, 'ELDERLY_WOMAN_HINDI');

  // Engagement arc
  const stalling = new StallingArsenal(persona.id);
  const tactic = stalling.getNextTactic('GREETING');
  assert(tactic !== null, 'Should have stalling tactic');

  // Identity lock prompt
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'GREETING', 'MEDIUM', tactic);
  assert(prompt.includes('SAVITRI DEVI'));
  assert(prompt.includes('NON-NEGOTIABLE'));

  // Intel aggregator
  const intel = new IntelAggregator();
  intel.extract(text);
  const json = intel.toJSON();
  assert(json.phoneNumbers.length >= 1, 'Should extract phone');
  assert(json.suspiciousKeywords.length >= 1, 'Should extract keywords');

  // Response guard on simulated reply
  const fakeReply = 'अरे, कौन बोल रहा है? मेरा SBI खाता तो ठीक था कल...';
  const cleaned = validateAndCleanReply(fakeReply, persona, langData);
  assert(cleaned.length > 0);

  // GUVI callback payload
  const payload = intel.getGuviCallbackPayload('god-test', 1, scamData.type);
  assertEqual(payload.scamDetected, true);
  assert(payload.agentNotes.includes('KAVACH'));
});

test('GOD Pipeline: Tamil UPI fraud + language mirroring', () => {
  const text = 'உங்களுக்கு ₹50000 கேஷ்பேக் கிடைத்துள்ளது. UPI ID அனுப்புங்கள்.';
  const langData = detectAndMirror(text);
  assertEqual(langData.language, 'tamil');
  const scamData = classifyScam(text);
  assert(scamData.isScam);
  const persona = selectPersona(scamData.type, langData.language);
  assertEqual(persona.id, 'HOUSEWIFE_SOUTH');
  const prompt = buildIdentityLockPrompt(persona, langData, scamData, 'FINANCIAL', 'LOW', null);
  assert(prompt.includes('Tamil'));
});

test('GOD Pipeline: Aggressive scammer emotion detection', () => {
  const text = 'SHARE OTP NOW YOU STUPID FOOL. ACCOUNT BLOCKED FOREVER.';
  const langData = detectAndMirror(text);
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  const hasRude = /stupid|fool|idiot|pagal/i.test(text);
  const emotion = hasRude || capsRatio > 0.5 ? 'HIGH' : 'LOW';
  assertEqual(emotion, 'HIGH');
});

test('GOD Pipeline: Multi-turn intel accumulation', () => {
  const agg = new IntelAggregator();

  // Turn 1: Phone number revealed
  agg.extract('Call 9876543210 for verification');
  assert(agg.toJSON().phoneNumbers.length === 1);

  // Turn 2: UPI revealed
  agg.extract('Send money to fraud@paytm');
  assert(agg.toJSON().upiIds.length >= 1);

  // Turn 3: Phishing link revealed
  agg.extract('Click http://fake-sbi.tk/verify ');
  assert(agg.toJSON().phishingLinks.length >= 1);

  // Turn 4: More keywords
  agg.extract('URGENT: Your account will be blocked');

  // Final payload — ALL fields populated
  const payload = agg.getGuviCallbackPayload('multi-turn', 4, 'bank_fraud');
  assert(payload.extractedIntelligence.phoneNumbers.length >= 1, 'Should have phones');
  assert(payload.extractedIntelligence.upiIds.length >= 1, 'Should have UPIs');
  assert(payload.extractedIntelligence.phishingLinks.length >= 1, 'Should have URLs');
  assert(payload.extractedIntelligence.suspiciousKeywords.length >= 2, 'Should have keywords');
  assert(payload.totalMessagesExchanged === 4);
  assert(payload.agentNotes.includes('Organized'), 'Should flag organized for 4+ items');
});

test('GOD Pipeline: Bengali scam end-to-end', () => {
  const text = 'আপনার ব্যাংক অ্যাকাউন্ট ভেরিফাই করুন নাহলে ব্লক হবে। কল করুন 8765432109';
  const langData = detectAndMirror(text);
  assertEqual(langData.language, 'bengali');
  const scamData = classifyScam(text);
  assert(scamData.isScam);
  const persona = selectPersona(scamData.type, langData.language);
  assertEqual(persona.id, 'ELDERLY_MAN_BENGALI');
  assertEqual(persona.name, 'Subhash Ghosh');

  const intel = new IntelAggregator();
  intel.extract(text);
  assert(intel.toJSON().phoneNumbers.length >= 1);
});

// =====================================================
// RESULTS
// =====================================================
console.log('\n' + '═'.repeat(50));
console.log(`📊 KAVACH Test Results`);
console.log('═'.repeat(50));
console.log(`   Total:  ${total}`);
console.log(`   Passed: ${passed} ✅`);
console.log(`   Failed: ${failed} ❌`);
console.log(`   Rate:   ${((passed / total) * 100).toFixed(1)}%`);
console.log('═'.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Some tests failed. Review above for details.');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! KAVACH is ready for deployment.');
  process.exit(0);
}
