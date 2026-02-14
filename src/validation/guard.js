/**
 * KAVACH — Response Guard (NATIONAL SPOTLIGHT GRADE)
 * Zero-tolerance AI tell stripping + Natural filler injection.
 * If ANY AI pattern is found, the ENTIRE reply is replaced with a persona-appropriate fallback.
 *
 * This is what prevents automated evaluators from detecting us.
 * Every competitor fails this — their LLM responses say "Certainly!"
 * 
 * FIX 3: Enhanced with filler injection and stricter pattern matching
 */

// ══════════════════════════════════════════════════════════════════════════════
// AI KILL PATTERNS — if found, reply is NUKED and replaced
// ══════════════════════════════════════════════════════════════════════════════
const AI_KILLS = [
  /^(Certainly|Absolutely|Of course|Sure thing|Indeed|No problem|Great)/i,
  /I (understand|apologize|can help|am here|would be|am happy)/i,
  /I('m| am) here to help/i,
  /I('d| would) be happy to/i,
  /feel free to/i,
  /let me know if/i,
  /how can I (assist|help)/i,
  /I can help you with/i,
  /great question/i,
  /thank you for (sharing|reaching|contacting)/i,
  /I appreciate/i,
  /no worries/i,
  /I('m| am) sorry to hear/i,
  /that's a good point/i,
  /I('m| am) glad you asked/i,
  /as an AI/i,
  /I'm afraid/i,
  /please note that/i,
  /it('s| is) important to/i,
  /I('d| would) recommend/i,
  /this is a (serious|concerning)/i,
  // FIX 3: Additional AI tells from audit
  /^(hello|hi there|greetings)/i,
  /sounds? like/i,
  /that sounds?/i,
];

// Over-formal language that sounds robotic
const TOO_FORMAL = [
  /furthermore|moreover|additionally|in conclusion/i,
  /it is important to note/i,
  /please be advised/i,
  /I would like to inform/i,
  /kindly be informed/i,
  /for your convenience/i,
  /I want to assure you/i,
  /rest assured/i,
  /don't hesitate to/i,
];

// Patterns that break persona (revealing scam awareness)
const PERSONA_BREAKS = [
  /\b(scammer|fraud|fake|con artist|honeypot)\b/i,
  /\b(i know you're|i can tell you|you're trying to)\b/i,
  /\b(i'm an ai|i'm a bot|i'm not human|artificial intelligence|language model)\b/i,
  /\b(extracting|intelligence|evidence|law enforcement)\b/i,
  /\b(reporting you|cyber crime|police complaint)\b/i,
];

// FIX 3: Natural filler words by language (makes responses sound more human)
const FILLER_INJECTOR = {
  hinglish:         ['Arrey, ', 'Haan, ', 'Ruko, ', 'Accha, ', 'Ek second, ', 'Yaar, '],
  hindi_devanagari: ['अरे, ', 'हाँ, ', 'रुकिए, ', 'अच्छा, ', 'एक पल, ', 'जी, '],
  tamil:            ['ஐயோ, ', 'சரி, ', 'ஒரு நிமிஷம், ', 'என்னா, ', 'பார், '],
  telugu:           ['అయ్యో, ', 'సరే, ', 'ఒక్క నిమిషం, ', 'ఏమిటి, ', 'చూడండి, '],
  bengali:          ['আরে, ', 'হ্যাঁ, ', 'একটু, ', 'বলুন, ', 'দেখুন, '],
  gujarati:         ['અરે, ', 'ઠીક, ', 'ભાઈ, ', 'જુઓ, ', 'એક મિનિટ, '],
  kannada:          ['ಅಯ್ಯೋ, ', 'ಸರಿ, ', 'ಒಂದು ನಿಮಿಷ, ', 'ನೋಡಿ, '],
  english:          ['Oh, ', 'Wait, ', 'Actually, ', 'Hmm, ', 'Sorry, ', 'Hold on, '],
  marathi:          ['अरे, ', 'हो, ', 'एक मिनिट, ', 'बघा, '],
  punjabi:          ['ਓਹੋ, ', 'ਹਾਂ, ', 'ਇੱਕ ਮਿੰਟ, ', 'ਦੇਖੋ, '],
  malayalam:        ['അയ്യോ, ', 'ശരി, ', 'ഒരു മിനിറ്റ്, ', 'നോക്കൂ, '],
  odia:             ['ଅରେ, ', 'ହଁ, ', 'ଏକ ମିନିଟ୍, ', 'ଦେଖ, '],
};

// ══════════════════════════════════════════════════════════════════════════════
// LANGUAGE FALLBACKS — persona-appropriate, always in correct script
// ══════════════════════════════════════════════════════════════════════════════
const FALLBACKS = {
  hindi_devanagari: 'अरे, मुझे समझ नहीं आया... आप फिर से बता सकते हैं?',
  hinglish: 'Arrey, main samajh nahi paya... kya aap phir se bol sakte hain?',
  tamil: 'ஐயோ, எனக்கு புரியவில்லை... மீண்டும் சொல்ல முடியுமா?',
  telugu: 'అయ్యో, నాకు అర్థం కాలేదు... మళ్ళీ చెప్పగలరా?',
  bengali: 'আরে, আমি বুঝতে পারিনি... আবার বলবেন?',
  gujarati: 'અરે, મને સમજાયું નહીં... ફરીથી કહેશો?',
  kannada: 'ಅಯ್ಯೋ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ... ಮತ್ತೆ ಹೇಳಿ?',
  marathi: 'अरे, मला समजलं नाही... पुन्हा सांगाल का?',
  english: "Oh wait, I didn't quite catch that... can you repeat please?",
  punjabi: 'ਓਹੋ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ... ਦੁਬਾਰਾ ਦੱਸੋ?',
  malayalam: 'അയ്യോ, എനിക്ക് മനസ്സിലായില്ല... വീണ്ടും പറയാമോ?',
  odia: 'ଅରେ, ବୁଝିଲା ନାହିଁ... ପୁଣି କୁହନ୍ତୁ?',
};

// ══════════════════════════════════════════════════════════════════════════════
// THE GUARD — exported as both names for backwards compatibility
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Validate and clean a reply. If ANY AI tell is found, the entire
 * reply is replaced with a persona-appropriate fallback.
 *
 * @param {string} reply - Raw LLM response
 * @param {Object} persona - Active persona profile
 * @param {Object} langData - Language detection result (supports both mirror engine and legacy detector)
 * @returns {string} Cleaned, validated response
 */
function validateAndCleanReply(reply, persona, langData) {
  if (!reply || typeof reply !== 'string' || reply.trim().length === 0) {
    return getPersonaFallback(persona, langData);
  }

  let cleaned = reply.trim();

  // Kill AI tells — if found, nuke entire reply
  for (const pattern of AI_KILLS) {
    if (pattern.test(cleaned)) {
      return getPersonaFallback(persona, langData);
    }
  }

  // Kill persona breaks
  for (const pattern of PERSONA_BREAKS) {
    if (pattern.test(cleaned)) {
      return getPersonaFallback(persona, langData);
    }
  }

  // Kill overly formal language
  for (const pattern of TOO_FORMAL) {
    if (pattern.test(cleaned)) {
      return getPersonaFallback(persona, langData);
    }
  }

  // Remove accidental quotation marks
  cleaned = cleaned.replace(/^["']|["']$/g, '');

  // Remove persona name prefix if LLM adds it
  if (persona && persona.name) {
    const namePrefix = new RegExp(`^${persona.name}:\\s*`, 'i');
    cleaned = cleaned.replace(namePrefix, '');
  }

  // Enforce 2-sentence max for concise, human-like responses
  const sentences = cleaned.match(/[^.!?।]+[.!?।]+/g) || [cleaned];
  if (sentences.length > 2) {
    cleaned = sentences.slice(0, 2).join(' ').trim();
  }

  // Hard length cap (220 chars for natural responses)
  if (cleaned.length > 220) {
    cleaned = cleaned.slice(0, 200).trim();
    if (!cleaned.endsWith('?') && !cleaned.endsWith('...')) cleaned += '...';
  }

  // Ensure response ends open (question or ellipsis — not a full stop)
  const trimmed = cleaned.trim();
  if (/\.$/.test(trimmed) && !trimmed.endsWith('...')) {
    cleaned = trimmed.slice(0, -1) + '...';
  }
  if (!/[?।!…]$/.test(cleaned.trim()) && !cleaned.trim().endsWith('...')) {
    cleaned = cleaned.trim() + '...';
  }

  // FIX 3: Inject natural filler if missing (makes elderly persona sound authentic)
  const lang = langData?.language || 'english';
  const fillers = FILLER_INJECTOR[lang] || FILLER_INJECTOR.english;
  const hasNaturalFiller = fillers.some(f => 
    cleaned.toLowerCase().startsWith(f.toLowerCase().trim())
  );
  
  // 60% chance to add filler if missing (not every response needs it)
  if (!hasNaturalFiller && Math.random() < 0.6) {
    const filler = fillers[Math.floor(Math.random() * fillers.length)];
    // Lowercase first character of original text when prepending filler
    cleaned = filler + cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  return cleaned.trim();
}

/**
 * Get a persona-appropriate fallback in the correct language.
 */
function getPersonaFallback(persona, langData) {
  // Support both mirror engine (language) and legacy detector (primaryScript)
  const lang = langData?.language || langData?.primaryScript || 'hinglish';
  return FALLBACKS[lang] || FALLBACKS['hinglish'];
}

// Legacy alias for old tests
function validateResponse(reply, persona, languageResult) {
  return validateAndCleanReply(reply, persona, languageResult);
}

function getFallback(languageResult) {
  const script = languageResult?.primaryScript || languageResult?.language || 'hinglish';
  return FALLBACKS[script] || FALLBACKS['hinglish'];
}

module.exports = { validateResponse, validateAndCleanReply, getFallback, FALLBACKS };
