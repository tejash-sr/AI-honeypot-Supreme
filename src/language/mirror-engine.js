/**
 * KAVACH — Language Mirror Engine (SUPREMACY LAYER 2)
 * Detects script in <3ms via Unicode ranges. Builds language-specific
 * response directives so the LLM has NO CHOICE but to mirror.
 */

// Unicode ranges for definitive script detection
const SCRIPT_RANGES = [
  { lang: 'devanagari', range: [0x0900, 0x097F], output: 'hindi_devanagari' },
  { lang: 'tamil',      range: [0x0B80, 0x0BFF], output: 'tamil' },
  { lang: 'telugu',     range: [0x0C00, 0x0C7F], output: 'telugu' },
  { lang: 'kannada',    range: [0x0C80, 0x0CFF], output: 'kannada' },
  { lang: 'bengali',    range: [0x0980, 0x09FF], output: 'bengali' },
  { lang: 'gujarati',   range: [0x0A80, 0x0AFF], output: 'gujarati' },
  { lang: 'punjabi',    range: [0x0A00, 0x0A7F], output: 'punjabi' },
  { lang: 'malayalam',  range: [0x0D00, 0x0D7F], output: 'malayalam' },
  { lang: 'odia',       range: [0x0B00, 0x0B7F], output: 'odia' },
];

// Vocabulary markers for Latin-script Indian languages
const VOCAB_MARKERS = {
  hinglish: ['aapka', 'mera', 'karo', 'abhi', 'yahan', 'wahan', 'bolna', 'batao', 'kyc', 'otp', 'bol', 'kar', 'hai', 'hoga', 'nahi', 'chahiye', 'suno', 'bhai', 'accha', 'theek', 'arrey', 'jaldi'],
  marathi:  ['ahe', 'aahe', 'mazha', 'tumcha', 'bghya', 'karaa', 'naka', 'atta', 'aplya'],
  bengali_roman: ['amar', 'apnar', 'korbo', 'hobe', 'dada', 'didi', 'bhai'],
};

// Persona filler map — indexed by detected language
const PERSONA_FILLERS = {
  hindi_devanagari: { fillers: ['अरे', 'हाँ जी', 'ठीक है', 'बताइए'], errorStyle: 'drops articles, Hindi word order in English sentences' },
  hinglish:         { fillers: ['arrey', 'accha', 'haan ji', 'theek hai', 'bhai sahab'], errorStyle: 'verb at end of sentence, drops "the/a"' },
  tamil:            { fillers: ['ஐயோ', 'சரி', 'என்னா', 'அம்மா'], errorStyle: 'verb-final, adds "ah?" at end, "la" suffix' },
  telugu:           { fillers: ['అయ్యో', 'సరే', 'ఏమిటి', 'అమ్మా'], errorStyle: 'verb-final structure, honorific -garu' },
  kannada:          { fillers: ['ಅಯ್ಯೋ', 'ಸರಿ', 'ಏನು', 'ನೋಡಿ'], errorStyle: 'verb at end, -ri honorific suffix' },
  bengali:          { fillers: ['আরে', 'হ্যাঁ', 'বলুন', 'দাদা'], errorStyle: 'verb conjugation with -e, dada/didi address' },
  gujarati:         { fillers: ['અરે', 'ઠીક છે', 'ભાઈ', 'જુઓ'], errorStyle: 'chhe copula, bhai/ben address' },
  punjabi:          { fillers: ['ਅਰੇ', 'ਠੀਕ ਹੈ', 'ਜੀ', 'ਸੁਣੋ'], errorStyle: 'ji honorific, verb at end' },
  malayalam:        { fillers: ['അയ്യോ', 'ശരി', 'ഏതാ', 'അമ്മേ'], errorStyle: 'SOV structure, -o suffix questions' },
  odia:             { fillers: ['ଅରେ', 'ହଁ', 'କହନ୍ତୁ'], errorStyle: 'SOV structure, respectful tone' },
  english:          { fillers: ['Oh', 'Wait', 'Actually', 'You know na?'], errorStyle: 'Indian English: "only" as emphasis, "na?" at end' },
  marathi:          { fillers: ['अरे', 'बरं', 'हो ना'], errorStyle: 'Marathi verb endings, -cha / -la' },
};

/**
 * Detect the language/script of input text and return mirroring directives.
 * Runs in <3ms — pure Unicode scan, no API calls.
 * @param {string} text - Scammer's message
 * @returns {Object} Language detection result with mirroring directives
 */
function detectAndMirror(text) {
  if (!text || text.length === 0) {
    const profile = PERSONA_FILLERS.english;
    return {
      language: 'english',
      fillers: profile.fillers,
      errorStyle: profile.errorStyle,
      responseDirective: buildResponseDirective('english'),
      detectionMs: 0,
    };
  }

  let detectedLang = null;
  let scriptCharCount = 0;

  // Step 1: Unicode character scan (definitive, <1ms)
  for (const char of text) {
    const code = char.codePointAt(0);
    for (const script of SCRIPT_RANGES) {
      if (code >= script.range[0] && code <= script.range[1]) {
        scriptCharCount++;
        if (scriptCharCount >= 3) {
          // Special: Devanagari — distinguish Hindi vs Marathi
          if (script.output === 'hindi_devanagari') {
            const marathiVocab = /\b(ahe|aahe|mazha|tumcha|atta|aplya)\b/i;
            detectedLang = marathiVocab.test(text) ? 'marathi' : 'hindi_devanagari';
          } else {
            detectedLang = script.output;
          }
          break;
        }
      }
    }
    if (detectedLang) break;
  }

  // Step 2: If no non-Latin script found, check vocabulary markers
  if (!detectedLang) {
    for (const [lang, markers] of Object.entries(VOCAB_MARKERS)) {
      const hits = markers.filter(m => new RegExp(`\\b${m}\\b`, 'i').test(text)).length;
      if (hits >= 2) { detectedLang = lang; break; }
    }
  }

  // Step 3: Default to English
  if (!detectedLang) detectedLang = 'english';

  const profile = PERSONA_FILLERS[detectedLang] || PERSONA_FILLERS.english;

  return {
    language: detectedLang,
    fillers: profile.fillers,
    errorStyle: profile.errorStyle,
    responseDirective: buildResponseDirective(detectedLang),
    detectionMs: 0,
  };
}

/**
 * Build a hard response directive for the LLM — non-negotiable language constraint.
 */
function buildResponseDirective(lang) {
  const directives = {
    hindi_devanagari: 'Write your ENTIRE reply in Devanagari script Hindi. No English words except brand names.',
    hinglish:         "Write in Hinglish: Hindi words spelled in Latin letters + English. Mirror the scammer's exact mix ratio.",
    tamil:            'Write your ENTIRE reply in Tamil script. Every single word must be Tamil.',
    telugu:           'Write your ENTIRE reply in Telugu script. Every single word must be Telugu.',
    kannada:          'Write your ENTIRE reply in Kannada script. Every single word.',
    bengali:          'Write your ENTIRE reply in Bengali script. Every single word must be Bengali.',
    gujarati:         'Write your ENTIRE reply in Gujarati script. Every single word.',
    punjabi:          'Write your ENTIRE reply in Punjabi Gurmukhi script. Every single word.',
    malayalam:        'Write your ENTIRE reply in Malayalam script. Every single word.',
    odia:             'Write your ENTIRE reply in Odia script. Every single word.',
    english:          'Write in Indian English. Add one Hindi word (arrey/accha/haan) as natural filler.',
    marathi:          'Write in Marathi using Devanagari script. Use Marathi vocabulary, not Hindi.',
  };
  return directives[lang] || directives.english;
}

module.exports = { detectAndMirror, PERSONA_FILLERS };
