/**
 * KAVACH — Language Intelligence System
 * Detects script + language of incoming scammer messages.
 * Supports: Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Punjabi, Marathi, English, Hinglish
 */

const LANGUAGE_SIGNATURES = {
  hindi_devanagari: /[\u0900-\u097F]/,
  tamil: /[\u0B80-\u0BFF]/,
  telugu: /[\u0C00-\u0C7F]/,
  kannada: /[\u0C80-\u0CFF]/,
  bengali: /[\u0980-\u09FF]/,
  gujarati: /[\u0A80-\u0AFF]/,
  punjabi: /[\u0A00-\u0A7F]/,
  malayalam: /[\u0D00-\u0D7F]/,
  odia: /[\u0B00-\u0B7F]/,
};

// Hinglish detection markers (Hindi words written in Latin script)
const HINGLISH_MARKERS = [
  'aapka', 'aapke', 'karein', 'karo', 'abhi', 'jaldi', 'turant',
  'kya', 'hai', 'hain', 'kaise', 'mein', 'hum', 'yeh', 'woh',
  'bolo', 'batao', 'paise', 'paisa', 'bhejo', 'dedo', 'nahi',
  'haan', 'sahab', 'beta', 'bhai', 'didi', 'rupaye', 'lakh',
  'crore', 'accha', 'theek', 'sahi', 'galat', 'khata', 'samjho',
  'suniye', 'dekhiye', 'foran', 'kyun', 'kab', 'kahan', 'kaun',
  'kitna', 'bata', 'bol', 'sun', 'dekh', 'ruk', 'chal', 'mat',
  'toh', 'lekin', 'aur', 'bhi', 'sirf', 'bas', 'kal', 'aaj',
  'subah', 'shaam', 'raat', 'din', 'arrey', 'arre', 'otp',
  'bank', 'account', 'kyc', 'ji', 'sahib', 'madam', 'babu',
];

// Marathi detection (shares Devanagari with Hindi — differentiate by vocabulary)
const MARATHI_MARKERS = [
  'aahe', 'nahi', 'kasa', 'kashi', 'mala', 'tumhi', 'aamhi',
  'dya', 'ghe', 'chala', 'basa', 'sangaa', 'kara', 'hota',
  'zala', 'kela', 'dila', 'gela', 'aala', 'karun',
];

/**
 * Detect the language and script of a text message.
 * @param {string} text - The incoming message text
 * @returns {Object} Language detection result
 */
function detectLanguage(text) {
  const result = {
    primaryScript: 'english',
    languages: [],
    isMixed: false,
    responseGuidance: '',
    confidence: 0,
  };

  if (!text || text.trim().length === 0) {
    result.responseGuidance = 'Respond in Indian English with occasional Hindi filler words.';
    return result;
  }

  const cleanText = text.trim();

  // --- Script detection (fast, regex-based) ---
  const scriptMatches = {};
  let totalIndicChars = 0;

  for (const [script, regex] of Object.entries(LANGUAGE_SIGNATURES)) {
    const matches = cleanText.match(new RegExp(regex.source, 'g'));
    if (matches && matches.length > 0) {
      scriptMatches[script] = matches.length;
      totalIndicChars += matches.length;
    }
  }

  // Find dominant Indic script
  let dominantScript = null;
  let maxChars = 0;
  for (const [script, count] of Object.entries(scriptMatches)) {
    if (count > maxChars) {
      maxChars = count;
      dominantScript = script;
    }
  }

  // --- Classify ---
  if (dominantScript === 'tamil') {
    result.primaryScript = 'tamil';
    result.languages.push('Tamil');
    result.confidence = 0.95;
  } else if (dominantScript === 'telugu') {
    result.primaryScript = 'telugu';
    result.languages.push('Telugu');
    result.confidence = 0.95;
  } else if (dominantScript === 'bengali') {
    result.primaryScript = 'bengali';
    result.languages.push('Bengali');
    result.confidence = 0.95;
  } else if (dominantScript === 'gujarati') {
    result.primaryScript = 'gujarati';
    result.languages.push('Gujarati');
    result.confidence = 0.95;
  } else if (dominantScript === 'kannada') {
    result.primaryScript = 'kannada';
    result.languages.push('Kannada');
    result.confidence = 0.95;
  } else if (dominantScript === 'punjabi') {
    result.primaryScript = 'punjabi';
    result.languages.push('Punjabi');
    result.confidence = 0.90;
  } else if (dominantScript === 'malayalam') {
    result.primaryScript = 'malayalam';
    result.languages.push('Malayalam');
    result.confidence = 0.95;
  } else if (dominantScript === 'odia') {
    result.primaryScript = 'odia';
    result.languages.push('Odia');
    result.confidence = 0.90;
  } else if (dominantScript === 'hindi_devanagari') {
    // Differentiate Hindi vs Marathi (both use Devanagari)
    const lowerText = cleanText.toLowerCase();
    const marathiHits = MARATHI_MARKERS.filter(m => lowerText.includes(m)).length;
    if (marathiHits >= 2) {
      result.primaryScript = 'marathi';
      result.languages.push('Marathi');
      result.confidence = 0.80;
    } else {
      result.primaryScript = 'hindi_devanagari';
      result.languages.push('Hindi');
      result.confidence = 0.90;
    }
  }

  // --- Check for mixing (Hinglish / code-switching) ---
  const hasLatin = /[a-zA-Z]{3,}/.test(cleanText);
  const hasIndic = totalIndicChars > 0;

  if (hasLatin && hasIndic) {
    result.isMixed = true;
    if (!result.languages.includes('English')) {
      result.languages.push('English');
    }
  }

  // --- Hinglish detection (Latin-only text with Hindi vocabulary) ---
  if (!hasIndic && hasLatin) {
    const words = cleanText.toLowerCase().split(/\s+/);
    const hinglishHits = words.filter(w => HINGLISH_MARKERS.includes(w.replace(/[^a-z]/g, ''))).length;
    const hinglishRatio = hinglishHits / Math.max(words.length, 1);

    if (hinglishRatio > 0.25 || hinglishHits >= 3) {
      result.primaryScript = 'hinglish';
      result.languages = ['Hindi', 'English'];
      result.isMixed = true;
      result.confidence = 0.85;
    } else if (hinglishHits >= 1) {
      result.primaryScript = 'hinglish';
      result.languages = ['Hindi', 'English'];
      result.isMixed = true;
      result.confidence = 0.65;
    } else {
      result.primaryScript = 'english';
      result.languages = ['English'];
      result.confidence = 0.80;
    }
  }

  // --- Build response guidance for LLM ---
  if (result.isMixed) {
    result.responseGuidance = `Respond in mixed ${result.languages.join('+')} (Hinglish style). Mirror the ratio of scripts used by the scammer. Use natural code-switching.`;
  } else if (result.primaryScript === 'english') {
    result.responseGuidance = 'Respond in Indian English with occasional Hindi filler words like "arrey", "accha", "haan ji".';
  } else {
    result.responseGuidance = `Respond ONLY in ${result.languages[0]} using appropriate script (${result.primaryScript}). Do NOT switch to English unless the scammer does.`;
  }

  return result;
}

module.exports = { detectLanguage, LANGUAGE_SIGNATURES, HINGLISH_MARKERS };
