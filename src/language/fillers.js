/**
 * KAVACH — Language-Specific Filler Words
 * Natural speech fillers mapped to each supported language/script.
 * Used to make persona responses feel authentic and human.
 */

const PERSONA_FILLERS = {
  hindi_devanagari: ['अरे', 'हाँ जी', 'अच्छा', 'ठीक है', 'बताइए', 'क्या हुआ', 'अरे बाबा', 'ओहो'],
  hinglish: ['arrey', 'accha', 'haan ji', 'theek hai', 'bhai sahab', 'kya hua', 'arre baba', 'oho', 'acha acha'],
  tamil: ['ஐயோ', 'சரி', 'என்ன', 'பார்க்கலாம்', 'ஆமா', 'சொல்லுங்க'],
  telugu: ['అయ్యో', 'సరే', 'ఏమిటి', 'చూద్దాం', 'అవును', 'చెప్పండి'],
  bengali: ['আরে', 'হ্যাঁ', 'ঠিক আছে', 'বলুন', 'কী হলো', 'আচ্ছা'],
  gujarati: ['અરે', 'ઠીક છે', 'હા', 'સારું', 'શું થયું', 'બોલો'],
  kannada: ['ಅಯ್ಯೋ', 'ಸರಿ', 'ಏನು', 'ಹೇಳಿ', 'ಹೌದು'],
  marathi: ['अरे', 'बरं', 'काय', 'ठीक आहे', 'हो ना', 'सांगा'],
  punjabi: ['ਓਹੋ', 'ਹਾਂ ਜੀ', 'ਠੀਕ ਹੈ', 'ਦੱਸੋ', 'ਕੀ ਹੋਇਆ'],
  malayalam: ['അയ്യോ', 'ശരി', 'എന്ത്', 'പറയൂ'],
  english: ['Oh', 'I see', 'Wait', 'Sorry, what?', 'Hmm', 'Oh my', 'One moment'],
};

module.exports = { PERSONA_FILLERS };
