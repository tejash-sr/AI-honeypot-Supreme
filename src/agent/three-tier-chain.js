/**
 * KAVACH — 3-Tier Response Chain (SUPREMACY LAYER 3)
 * Tier 1: Gemini Flash (full LLM, increased timeout for quality)
 * Tier 2: Pre-computed smart fallbacks with ROTATION (never repeat)
 * Tier 3: Base language fallback (always works)
 *
 * THE ENDPOINT NEVER DIES. ONE 500 error = permanent score deduction.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

// Track used fallbacks per session to prevent repetition
const usedFallbacks = new Map();

// ──────────────────────────────────────────────────
// TIER 2: Pre-computed smart fallbacks with MULTIPLE OPTIONS
// Key format: scamType:stage:language → Array of options
// ──────────────────────────────────────────────────
const SMART_FALLBACKS = {
  // Bank fraud - ENGLISH (multiple options for variety)
  'bank_fraud:GREETING:english': [
    "Oh my goodness, which bank did you say? I have accounts in so many places, I get confused sometimes...",
    "Wait wait, my account will be blocked? But I just checked yesterday and everything was fine, no?",
    "Hello? Sorry, who is this calling? You're saying my bank account has a problem? Which bank exactly?",
    "Oh dear, this sounds serious! But can you tell me which branch you're calling from? I want to note it down...",
  ],
  'bank_fraud:RAPPORT:english': [
    "Hmm okay, but my son always tells me to verify first... can you give me your employee ID number please?",
    "Yes yes, I understand it's urgent, but what is your name and badge number? I need to write it down...",
    "Before I do anything, can you tell me your supervisor's name? My nephew works in a bank, he said always ask...",
    "I want to help but you're going so fast... can you spell your name for me? And which department are you from?",
  ],
  'bank_fraud:FINANCIAL:english': [
    "Oh, you need my account details? Wait, let me find my passbook... it's somewhere in the drawer, one minute...",
    "Account number? Yes yes, I have it written somewhere... hold on, my eyes are not so good, the writing is small...",
    "The account number... let me think... it starts with 1 or 2? Wait, I'll get my reading glasses first...",
    "I keep all my bank papers in a file... just give me a moment to find it, don't hang up please...",
  ],
  'bank_fraud:EXTRACTION:english': [
    "OTP? Yes something came on my phone just now... the numbers are so tiny, wait I need my spectacles...",
    "Oh the OTP message? I got it but there are so many numbers... which one do you need exactly?",
    "Yes yes, I see some numbers on my phone screen... but it's showing two messages, which one is the OTP?",
    "The code came but my phone screen is cracked a little... let me read slowly... 4... no wait, is that a 9?",
  ],
  'bank_fraud:CLOSING:english': [
    "Oh no, my phone battery is very low... can you give me your direct number? I'll call back in 5 minutes after charging...",
    "Wait, someone is at my door... can you hold on or give me a number to call you back?",
    "My landline is ringing also... this must be important if two phones are calling! Give me your callback number...",
  ],

  // Bank fraud - HINGLISH
  'bank_fraud:GREETING:hinglish': [
    "Arrey bhai, kaun bol raha hai? Mera account block hoga matlab? Lekin maine kuch kiya hi nahi...",
    "Hello? Sorry, kaunsi bank se bol rahe ho? Mera account mein koi problem hai kya? Abhi toh sab theek tha...",
    "Yeh kya bol rahe ho aap? Mera account band? Lekin pichle hafte hi maine balance check kiya tha, sab okay tha...",
    "Arrey arrey, ruko ruko! Pehle batao aap kaun ho? Kaunsi bank? Main confuse ho gayi completely...",
  ],
  'bank_fraud:RAPPORT:hinglish': [
    "Accha accha, samajh gayi... lekin mera beta kehta hai pehle verify karo. Aapka employee ID kya hai?",
    "Haan ji theek hai, but aapka naam aur department batao na pehle? Main likh leti hoon...",
    "Ji haan, urgent hai samajh rahi hoon... lekin aap konse branch se bol rahe ho? Mujhe noting karna hai...",
    "Ek minute sahab, mera bhai bank mein kaam karta hai, usne bola hamesha ID verify karo... aapka ID number?",
  ],
  'bank_fraud:FINANCIAL:hinglish': [
    "Account number chahiye? Ruko, passbook doosre room mein hai... ek second, main lekar aati hoon...",
    "Haan haan, passbook mein likha hai... mera chashma kahaan hai? Bina chashme ke nahi dikh raha clearly...",
    "Account details... wait karo na, sab papers almirah mein rakhe hain... phone hold pe rakhti hoon, mat kaatna...",
    "Passbook toh hai mere paas... lekin itne numbers hain, kaun sa number account number hai batao?",
  ],
  'bank_fraud:EXTRACTION:hinglish': [
    "OTP aa gaya phone pe... ruko, dekh rahi hoon... screen pe bahut chhote numbers hain, chashma dhundti hoon...",
    "Haan haan, message aaya hai... 4 se start ho raha hai lagta hai... nahi wait, yeh 9 hai ya 4?",
    "OTP? Ek second... do message aaye hain, kaun sa wala chahiye aapko? Confused ho gayi main...",
    "Aa gaya code... lekin mera phone purana hai, screen thoda tuta hai... slowly padhti hoon, ek minute...",
  ],

  // Bank fraud - HINDI DEVANAGARI  
  'bank_fraud:GREETING:hindi_devanagari': [
    "अरे बाबा, कौन बोल रहा है? मेरा खाता बंद होगा? लेकिन मैंने तो कुछ किया ही नहीं...",
    "हैलो? सॉरी, कौनसी बैंक से बोल रहे हो? मेरे अकाउंट में कोई प्रॉब्लम है क्या?",
    "ये क्या बोल रहे हो आप? मेरा खाता बंद? लेकिन पिछले हफ्ते ही तो बैलेंस चेक किया था...",
    "अरे अरे, रुको रुको! पहले बताओ आप कौन हो? कौनसी बैंक? मैं confuse हो गई...",
  ],
  'bank_fraud:RAPPORT:hindi_devanagari': [
    "अच्छा अच्छा, समझ गई... लेकिन मेरा बेटा कहता है पहले verify करो। आपका employee ID क्या है?",
    "हाँ जी ठीक है, but आपका नाम और department बताओ ना पहले?",
    "जी हाँ, urgent है समझ रही हूँ... लेकिन आप कौनसे branch से बोल रहे हो?",
  ],
  'bank_fraud:EXTRACTION:hindi_devanagari': [
    "OTP आ गया फोन पे... रुको, देख रही हूँ... screen पे बहुत छोटे numbers हैं...",
    "हाँ हाँ, message आया है... 4 से start हो रहा है लगता है... नहीं wait, ये 9 है या 4?",
    "आ गया code... लेकिन मेरा phone पुराना है, थोड़ा धीरे धीरे पढ़ती हूँ...",
  ],

  // Bank fraud - TAMIL
  'bank_fraud:GREETING:tamil': [
    "ஐயோ, யாரு பேசுறீங்க? என் account block ஆகும்னு சொல்றீங்க? நான் என்ன பண்ணேன்?",
    "என்ன சொல்றீங்க? என் bank account-ல problem-ஆ? போன week-ல check பண்ணேன், okay-ஆ இருந்துச்சே...",
    "Hello? Sorry, எந்த bank-ல இருந்து call பண்றீங்க? என் account-ல என்ன issue?",
  ],
  'bank_fraud:RAPPORT:tamil': [
    "சரி சரி, puriyuthu... ஆனா en son சொன்னாரு verify பண்ணணும்னு. உங்க employee ID என்ன?",
    "OK OK, urgent-னு puriyuthu... ஆனா உங்க name-um department-um சொல்லுங்க முதல்ல?",
  ],
  'bank_fraud:EXTRACTION:tamil': [
    "OTP வந்துருக்கு phone-ல... wait பண்ணுங்க, பாக்கறேன்... screen-ல numbers ரொம்ப சின்னதா இருக்கு...",
    "ஆமா ஆமா, message வந்துருக்கு... 4-ல start ஆகுது... illana wait, ithu 9-ஆ 4-ஆ?",
  ],

  // Bank fraud - TELUGU
  'bank_fraud:GREETING:telugu': [
    "అయ్యో, ఎవరు మాట్లాడుతున్నారు? నా account block అవుతుందా? నేను ఏమి చేశాను?",
    "Hello? Sorry, ఏ bank నుండి call చేస్తున్నారు? నా account లో ఏమి problem?",
    "ఏమిటి చెప్తున్నారు? నా bank account block? కానీ last week check చేశాను, okay గా ఉంది...",
  ],
  'bank_fraud:RAPPORT:telugu': [
    "సరే సరే, అర్థమైంది... కానీ మా అబ్బాయి చెప్పాడు verify చేయమని. మీ employee ID ఏమిటి?",
  ],
  'bank_fraud:EXTRACTION:telugu': [
    "OTP వచ్చింది phone లో... wait, చూస్తున్నాను... screen లో numbers చాలా చిన్నగా ఉన్నాయి...",
  ],

  // Bank fraud - BENGALI
  'bank_fraud:GREETING:bengali': [
    "আরে বাবা, কে বলছেন? আমার অ্যাকাউন্ট ব্লক হবে? কিন্তু আমি তো কিছু করিনি...",
    "হ্যালো? সরি, কোন ব্যাংক থেকে বলছেন? আমার অ্যাকাউন্টে কি সমস্যা?",
  ],
  'bank_fraud:RAPPORT:bengali': [
    "আচ্ছা আচ্ছা, বুঝলাম... কিন্তু আমার ছেলে বলে আগে verify করতে। আপনার employee ID কি?",
  ],
  'bank_fraud:EXTRACTION:bengali': [
    "OTP এসেছে ফোনে... wait করুন, দেখছি... screen-এ numbers খুব ছোট...",
  ],

  // KYC fraud
  'kyc_fraud:GREETING:english': [
    "KYC update? But I did that last year only... which bank is this from? My son usually handles these things...",
    "Oh, KYC verification? Wait, I thought we do that at the branch? How does it work on phone?",
  ],
  'kyc_fraud:GREETING:hinglish': [
    "KYC? Mera beta karta tha yeh sab... kaunsi bank se bol rahe ho? Last year toh ho gaya tha...",
    "KYC update karna hai? Lekin branch mein hota hai na yeh? Phone pe kaise karein?",
  ],
  'kyc_fraud:RAPPORT:hinglish': [
    "Accha, par KYC toh branch mein hota hai na? Online kaise karein? Mujhe samjhao thoda...",
  ],

  // OTP fraud
  'otp_fraud:GREETING:english': [
    "OTP? What OTP? I didn't request any OTP... are you sure you have the right number?",
    "Which OTP are you talking about? I didn't do any transaction just now...",
  ],
  'otp_fraud:GREETING:hinglish': [
    "OTP? Arrey kaunsa OTP? Mujhe koi message nahi aaya abhi tak... sure hai aap?",
    "Kaunsa OTP bhai? Maine toh koi transaction nahi kiya abhi...",
  ],
  'otp_fraud:EXTRACTION:english': [
    "Wait, actually a message did come... let me check... there are so many numbers, which one do you need?",
    "Oh yes, I see something on my phone now... but which number exactly? There are like 6 digits...",
  ],
  'otp_fraud:EXTRACTION:hinglish': [
    "OTP? Haan ek message aaya hai... 4 se shuru ho raha hai lagta hai... ruko ek second, clearly dekh loon...",
    "Achha haan, phone pe kuch numbers dikhe... kaunsa wala OTP hai? Bahut saare aaye hain messages...",
  ],

  // UPI fraud
  'upi_fraud:GREETING:english': [
    "Cashback on UPI? Really? I didn't know about this scheme... how much cashback will I get?",
    "Free money on Paytm? Which offer is this? I use GPay mostly, will it work there too?",
  ],
  'upi_fraud:GREETING:hinglish': [
    "Cashback? Sach mein? Kaunsa offer hai yeh? Kitna milega cashback?",
    "UPI pe free money? Kya baat kar rahe ho? Mujhe toh koi notification nahi aaya...",
  ],
  'upi_fraud:FINANCIAL:english': [
    "My UPI ID? Let me think... I have it on Paytm and PhonePe both... which one do you need?",
    "UPI ID? It's something like my phone number I think... wait, let me check in the app...",
  ],
  'upi_fraud:FINANCIAL:hinglish': [
    "UPI ID? Mera wala hai but mujhe exact yaad nahi... Paytm wala hai ya GPay wala chahiye?",
    "Mera UPI toh phone number hi hai na? Ya kuch aur bhi hota hai? Confused hoon...",
  ],

  // Lottery scam
  'lottery_scam:GREETING:english': [
    "I won a lottery? But I never entered any contest! Which lucky draw is this from?",
    "Oh my god, I won something? How much did I win? But when did I enter this contest?",
    "Wait wait, you're saying I won money? Which company's lottery is this? I don't remember entering...",
  ],
  'lottery_scam:GREETING:hinglish': [
    "Arrey, main jeet gayi? Sach mein? Kaunsa lucky draw tha yeh? Maine toh enter hi nahi kiya tha!",
    "Lottery? Mujhe? Kitna jeeta hai? Par maine toh koi contest nahi khela...",
  ],
  'lottery_scam:RAPPORT:english': [
    "Such a big amount? Really? But I need to tell my family first... can you send me the official letter?",
    "That's a lot of money! But how do I know this is real? Can you email me the details?",
  ],
  'lottery_scam:RAPPORT:hinglish': [
    "Sach mein itna paisa? Lekin mujhe toh koi SMS nahi aaya pehle... official letter bhejoge kya?",
  ],

  // Job scam
  'job_scam:GREETING:english': [
    "A job offer? Really? Which company is this? I applied to so many places, I forgot...",
    "Oh, someone wants to hire me? What's the position? And how did you get my resume?",
    "Work from home job? What kind of work? And what is the salary? My nephew was also looking...",
  ],
  'job_scam:GREETING:hinglish': [
    "Job offer hai? Kaun si company se bol rahe ho? Mera resume kahaan se mila aapko?",
    "WFH job? Kya kaam karna padega? Salary kya hai? Mere bhatije ko bhi batana hai...",
  ],
  'job_scam:RAPPORT:english': [
    "What's the salary package? Is it full time or part time? Do I need to come to office?",
    "Sounds interesting... but what skills do you need? I only know basic computer work...",
  ],
  'job_scam:RAPPORT:hinglish': [
    "Package kya hai bhai? WFH hai ya office jaana padega? Training milegi?",
  ],

  // Phishing
  'phishing:GREETING:english': [
    "Click a link? My phone is showing some warning... which website is this exactly?",
    "A link? Wait, my son told me to be careful with links... what is this website for?",
  ],
  'phishing:GREETING:hinglish': [
    "Link click karna hai? Ruko, mera internet slow hai... kaunsi website hai batao?",
    "Link? Mera beta bolta hai links pe click mat karo... yeh kya hai exactly?",
  ],

  // Investment fraud
  'investment_fraud:GREETING:english': [
    "Investment with guaranteed returns? That sounds too good to be true... which company is this?",
    "500% returns? Wow... but is it safe? My husband lost money in shares once, he'll be angry...",
  ],
  'investment_fraud:GREETING:hinglish': [
    "Invest karo aur 500% return? Bhai, yeh real hai kya? Company ka naam bata pehle...",
    "Guaranteed returns? Aisa possible hai kya? Mere husband ko batana padega but woh mana karenge shayad...",
  ],

  // Aggressive scammer responses
  'aggressive:ANY:english': [
    "Please don't shout at me sir... I'm just an old woman trying to understand. Can you explain slowly?",
    "Why are you getting angry? I just want to make sure before I do anything... please have some patience...",
    "Sir, I'm confused only... no need to raise your voice. My hearing is also not so good...",
  ],
  'aggressive:ANY:hinglish': [
    "Aise kyun bol rahe ho bhai... main samajhne ki koshish kar rahi hoon na, dhire bologe toh samjhungi...",
    "Arrey gussa kyun ho rahe ho? Main toh bas verify karna chahti hoon... sabr rakho thoda...",
    "Itna chilla kyun rahe ho? Meri sunaai bhi kam deti hai, please dhire bolo...",
  ],
  'aggressive:ANY:hindi_devanagari': [
    "ऐसे क्यों बोल रहे हैं... मैं समझने की कोशिश कर रही हूँ ना, धीरे बोलोगे तो समझूंगी...",
    "अरे गुस्सा क्यों हो रहे हो? मैं तो बस verify करना चाहती हूँ...",
  ],
  'aggressive:ANY:tamil': [
    "ஐயோ, ஏன் அப்படி சொல்றீங்க... நான் புரிஞ்சுக்க try பண்றேன், மெதுவா சொல்லுங்க...",
    "கோபப்படாதீங்க sir... நான் confuse ஆயிட்டேன், patience-ஆ explain பண்ணுங்க...",
  ],
  'aggressive:ANY:telugu': [
    "అయ్యో, అలా ఎందుకు మాట్లాడుతున్నారు... నేను అర్థం చేసుకోవడానికి try చేస్తున్నాను...",
    "కోపం ఎందుకు sir... నేను just verify చేయాలనుకుంటున్నాను...",
  ],
  'aggressive:ANY:bengali': [
    "এত রাগ করছেন কেন... আমি বোঝার চেষ্টা করছি তো, ধীরে বলুন...",
    "ও বাবা, চেঁচামেচি করবেন না... আমি তো just বুঝতে চাইছি...",
  ],
};

// ──────────────────────────────────────────────────
// TIER 3: Base fallbacks (multiple options for variety)
// ──────────────────────────────────────────────────
const BASE_FALLBACKS = {
  hindi_devanagari: [
    "रुकिए जी, मैं समझ नहीं पाई... एक बार फिर बताएंगे कृपया?",
    "अरे, थोड़ा धीरे बोलिए ना... मेरी समझ में नहीं आया...",
    "जी? आपने क्या कहा? मेरी सुनाई कम देती है, फिर से बोलिए...",
  ],
  hinglish: [
    "Ruko ruko, main samajh nahi paayi... aap phir se bologe please?",
    "Arrey, thoda slowly bolo na... meri samajh mein nahi aaya...",
    "Kya? Maine suna nahi properly... ek baar aur batao na?",
    "Sorry sorry, phone ki awaz kam hai... kya bola aapne?",
  ],
  tamil: [
    "ஐயோ, புரியவில்லை... மெதுவா மீண்டும் சொல்லுங்க?",
    "என்ன சொன்னீங்க? சரியா கேக்கல... once more please?",
    "Wait wait, puriyala... innum oru thadava sollunga?",
  ],
  telugu: [
    "అయ్యో, అర్థం కాలేదు... మెల్లగా మళ్ళీ చెప్పండి?",
    "ఏమిటి? సరిగ్గా వినలేదు... ఇంకోసారి చెప్పగలరా?",
  ],
  kannada: [
    "ಅಯ್ಯೋ, ಅರ್ಥವಾಗಲಿಲ್ಲ... ನಿಧಾನವಾಗಿ ಮತ್ತೆ ಹೇಳಿ?",
  ],
  bengali: [
    "আরে, বুঝলাম না... ধীরে আবার বলবেন please?",
    "কি বললেন? ঠিকমতো শুনতে পেলাম না... আবার বলুন?",
  ],
  gujarati: [
    "અરે, સમજ ન પડ્યું... ફરીથી કહો please?",
  ],
  punjabi: [
    "ਅਰੇ, ਸਮਝ ਨਹੀਂ ਆਇਆ... ਫਿਰ ਦੱਸੋ please?",
  ],
  malayalam: [
    "അയ്യോ, മനസ്സിലായില്ല... വീണ്ടും പറയൂ?",
  ],
  odia: [
    "ଅରେ, ବୁଝିଲା ନାହିଁ... ପୁଣି କୁହନ୍ତୁ?",
  ],
  marathi: [
    "अरे, समजलं नाही... परत सांगाल का please?",
  ],
  english: [
    "Oh sorry, I didn't catch that... can you say it again slowly?",
    "Wait what? My hearing is not so good... please repeat?",
    "Hmm? The line is not clear... can you say that one more time?",
    "Sorry sorry, I was distracted... what did you say just now?",
  ],
};

/**
 * Get an unused fallback from array, with rotation to prevent repetition
 */
function getRotatedFallback(options, sessionId) {
  if (!options || options.length === 0) return null;
  if (typeof options === 'string') return options; // Old format compatibility
  
  // Get or create used set for this session
  if (!usedFallbacks.has(sessionId)) {
    usedFallbacks.set(sessionId, new Set());
  }
  const used = usedFallbacks.get(sessionId);
  
  // Find unused options
  const available = options.filter((_, i) => !used.has(i));
  
  // If all used, reset and use all again
  if (available.length === 0) {
    used.clear();
    const idx = Math.floor(Math.random() * options.length);
    used.add(idx);
    return options[idx];
  }
  
  // Pick random from available
  const randomAvailable = available[Math.floor(Math.random() * available.length)];
  const idx = options.indexOf(randomAvailable);
  used.add(idx);
  return randomAvailable;
}

/**
 * Get response using 3-tier chain. Gemini races against timeout.
 * If Gemini is slow → smart fallback. If no match → base fallback.
 * THE ENDPOINT NEVER DIES.
 *
 * @param {string} systemPrompt - Identity-locked system prompt
 * @param {Array} messages - Message history
 * @param {Object} session - Current session object
 * @param {Object} languageData - Mirror engine result
 * @returns {Object} { reply, tier, ms }
 */
async function getResponseTiered(systemPrompt, messages, session, languageData) {
  const startMs = Date.now();
  const sessionId = session.sessionId || 'default';

  // Start Gemini call immediately (async — don't await yet)
  const geminiCall = (async () => {
    try {
      // Convert messages to Gemini chat history format
      const history = [];
      let lastUserMsg = '';
      
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        if (msg.role === 'user') {
          history.push({ role: 'user', parts: [{ text: msg.content }] });
        } else if (msg.role === 'assistant') {
          history.push({ role: 'model', parts: [{ text: msg.content }] });
        }
      }
      
      // Last message is always user (current scammer message)
      lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
      
      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 150,   // Increased for better quality
          temperature: 0.9,      // Higher for more natural variation
        },
      });
      
      const fullPrompt = systemPrompt + '\n\nScammer says: "' + lastUserMsg + '"\n\nRespond as your persona (1-2 sentences, conversational):';
      const result = await chat.sendMessage(fullPrompt);
      const text = result.response.text().trim();
      
      // Validate response is not empty or too short
      if (!text || text.length < 10) {
        return { ok: false, error: 'Response too short' };
      }
      
      return { ok: true, text };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  })();

  // Race Gemini against 8 second timeout (increased for quality)
  const timeout = new Promise(resolve =>
    setTimeout(() => resolve({ ok: false, timedOut: true }), 8000)
  );

  const result = await Promise.race([geminiCall, timeout]);

  // TIER 1: Gemini won the race with valid response
  if (result.ok && result.text && result.text.length >= 10) {
    return { reply: result.text, tier: 1, ms: Date.now() - startMs };
  }

  // TIER 2: Smart fallback with rotation (never repeat)
  const scamType = session.scamType || 'bank_fraud';
  const stage = session.stage || 'GREETING';
  let lang = languageData?.language || 'english';
  
  // Map 'hinglish' or undefined to appropriate fallback
  if (!lang || lang === 'unknown') lang = 'english';

  // Check if scammer was aggressive (shouting, threats)
  const wasAggressive = session.emotionHist && 
    (session.emotionHist.includes('HIGH') || session.emotionHist.includes('aggressive'));
  
  // Try keys in order of specificity
  const keysToTry = wasAggressive 
    ? [`aggressive:ANY:${lang}`, `aggressive:ANY:english`, `aggressive:ANY:hinglish`]
    : [
        `${scamType}:${stage}:${lang}`,
        `${scamType}:GREETING:${lang}`,
        `${scamType}:${stage}:english`,
        `${scamType}:GREETING:english`,
        `bank_fraud:${stage}:${lang}`,
        `bank_fraud:GREETING:${lang}`,
        `bank_fraud:GREETING:english`,
      ];

  for (const key of keysToTry) {
    const options = SMART_FALLBACKS[key];
    if (options) {
      const fallback = getRotatedFallback(options, sessionId);
      if (fallback) {
        return { reply: fallback, tier: 2, ms: Date.now() - startMs };
      }
    }
  }

  // TIER 3: Base language fallback with rotation
  const baseOptions = BASE_FALLBACKS[lang] || BASE_FALLBACKS.english || BASE_FALLBACKS.hinglish;
  const baseFallback = getRotatedFallback(baseOptions, sessionId + '_base');
  
  return {
    reply: baseFallback || "Sorry, I didn't understand... can you repeat please?",
    tier: 3,
    ms: Date.now() - startMs,
  };
}

// Clean up old session fallback tracking (memory management)
setInterval(() => {
  if (usedFallbacks.size > 1000) {
    usedFallbacks.clear();
  }
}, 60000);

module.exports = { getResponseTiered, SMART_FALLBACKS, BASE_FALLBACKS };
