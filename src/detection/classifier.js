/**
 * KAVACH — Scam Classifier (Fast Path)
 * Pattern + semantic dual-layer detection. No LLM required.
 * Returns: type, confidence, tactics[], isScam
 * Optimized for < 20ms execution.
 */

const SCAM_PATTERNS = {
  bank_fraud: {
    patterns: [
      /account.*block/i, /kyc.*expire/i, /verify.*bank/i,
      /sbi|hdfc|icici|canara|pnb|axis|kotak|bob|uco/i,
      /account.*suspend/i, /bank.*official/i, /bank.*manager/i,
      /account.*close/i, /account.*deactivat/i, /bank.*verify/i,
    ],
    hindi_patterns: [
      /खाता.*बंद/i, /केवाईसी/i, /बैंक.*वेरीफाई/i,
      /अकाउंट.*ब्लॉक/i, /खाता.*सस्पेंड/i,
    ],
    tamil_patterns: [/கணக்கு.*தடை/i, /வங்கி.*சரிபார்/i],
    telugu_patterns: [/ఖాతా.*బ్లాక్/i, /బ్యాంక్.*వెరిఫై/i],
    bengali_patterns: [/অ্যাকাউন্ট.*ব্লক/i, /ব্যাংক.*ভেরিফাই/i],
    tactics: ['authority', 'urgency', 'fear'],
    weight: 3,
  },
  kyc_fraud: {
    patterns: [
      /kyc.*update/i, /kyc.*pending/i, /kyc.*expire/i,
      /kyc.*required/i, /kyc.*mandatory/i, /complete.*kyc/i,
      /pan.*link/i, /aadhaar.*link/i, /pan.*verify/i,
    ],
    hindi_patterns: [/केवाईसी.*अपडेट/i, /केवाईसी.*जरूरी/i],
    tactics: ['authority', 'urgency', 'fear', 'verification'],
    weight: 3,
  },
  upi_fraud: {
    patterns: [
      /upi|paytm|gpay|phonepe/i, /share.*upi/i, /send.*money/i,
      /receive.*payment/i, /qr.*scan/i, /upi.*id/i,
      /payment.*link/i, /collect.*request/i,
    ],
    hindi_patterns: [/यूपीआई|पेटीएम/i, /पैसे.*भेजो/i, /यूपीआई.*आईडी/i],
    tactics: ['urgency', 'financial_request', 'upi_request'],
    weight: 3,
  },
  otp_fraud: {
    patterns: [
      /otp|one.time.password/i, /share.*otp/i, /verify.*otp/i,
      /tell.*otp/i, /send.*otp/i, /enter.*otp/i, /otp.*share/i,
    ],
    hindi_patterns: [/ओटीपी.*बताओ/i, /ओटीपी.*शेयर/i, /ओटीपी.*भेजो/i],
    tactics: ['otp_request', 'urgency', 'authority'],
    weight: 4,
  },
  lottery_scam: {
    patterns: [
      /won.*prize|winner.*prize|lottery.*won/i, /claim.*prize/i,
      /lucky.*draw/i, /selected.*winner.*prize/i,
      /lottery.*winner/i, /prize.*money/i,
    ],
    hindi_patterns: [/इनाम|लॉटरी|जीत.*इनाम/i, /बधाई.*जीत/i],
    tactics: ['greed', 'urgency', 'excitement'],
    weight: 2,
  },
  job_scam: {
    patterns: [
      /job.*offer|hiring|vacancy|salary/i, /work.*from.*home/i,
      /earn.*per.*day/i, /part.*time.*job/i, /easy.*money/i,
      /guaranteed.*income/i, /no.*experience/i,
      /selected.*job|selected.*position/i, /registration.*fee/i,
      /training.*fee/i, /joining.*fee/i, /wfh.*job/i,
      /salary.*month|salary.*day/i, /job.*selected/i,
    ],
    hindi_patterns: [/नौकरी|काम|कमाई/i, /सैलरी/i],
    tactics: ['greed', 'hope', 'urgency', 'financial_request'],
    weight: 3,
  },
  phishing: {
    patterns: [
      /click.*link|http|bit\.ly|tinyurl/i, /verify.*account.*link/i,
      /update.*link/i, /download.*app/i, /install.*app/i,
    ],
    tactics: ['phishing_url', 'urgency', 'authority'],
    weight: 3,
  },
  investment_fraud: {
    patterns: [
      /invest|return|profit|double.*money|crypto|bitcoin/i,
      /guaranteed.*return/i, /mutual.*fund/i, /forex/i,
      /trading.*platform/i, /high.*return/i,
    ],
    hindi_patterns: [/निवेश|मुनाफा|पैसा.*डबल/i],
    tactics: ['greed', 'financial_request', 'trust'],
    weight: 2,
  },
  crypto_scam: {
    patterns: [
      /crypto|bitcoin|ethereum|binance|coinbase/i,
      /wallet.*address/i, /mining/i, /nft/i, /token/i,
      /blockchain.*invest/i,
    ],
    tactics: ['greed', 'financial_request', 'tech_jargon'],
    weight: 2,
  },
};

// Urgency amplifiers
const URGENCY_PATTERNS = /urgent|immediately|now|abhi|turant|jaldi|अभी|तुरंत|जल्दी|today|within.*hour|last.*chance|final.*warning|time.*running/i;

// Authority amplifiers
const AUTHORITY_PATTERNS = /rbi|reserve.*bank|government|police|court|income.*tax|cyber.*cell|department|ministry|officer|official|inspector/i;

// Fear amplifiers
const FEAR_PATTERNS = /arrest|jail|legal.*action|fir|warrant|penalty|fine|suspend|block|freeze|deactivat|cancel/i;

/**
 * Classify a scam message using pattern matching.
 * @param {string} text - Current message text
 * @param {Array} history - Conversation history
 * @returns {Object} Classification result
 */
function classifyScam(text, history = []) {
  const fullContext = text + ' ' + (history || []).map(h => h.text || h.content || '').join(' ');
  let bestMatch = { type: 'generic_scam', confidence: 0.5, tactics: ['urgency'], isScam: true };
  let highestScore = 0;

  for (const [type, config] of Object.entries(SCAM_PATTERNS)) {
    let score = 0;
    const allPatterns = [
      ...(config.patterns || []),
      ...(config.hindi_patterns || []),
      ...(config.tamil_patterns || []),
      ...(config.telugu_patterns || []),
      ...(config.bengali_patterns || []),
    ];

    for (const pattern of allPatterns) {
      if (pattern.test(fullContext)) score += config.weight;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        type,
        confidence: Math.min(0.5 + score * 0.1, 0.99),
        tactics: [...config.tactics],
        isScam: score > 0,
      };
    }
  }

  // Cross-check amplifiers
  if (URGENCY_PATTERNS.test(text)) {
    bestMatch.confidence = Math.min(bestMatch.confidence + 0.1, 0.99);
    if (!bestMatch.tactics.includes('urgency')) bestMatch.tactics.push('urgency');
  }

  if (AUTHORITY_PATTERNS.test(text)) {
    bestMatch.confidence = Math.min(bestMatch.confidence + 0.08, 0.99);
    if (!bestMatch.tactics.includes('authority')) bestMatch.tactics.push('authority');
  }

  if (FEAR_PATTERNS.test(text)) {
    bestMatch.confidence = Math.min(bestMatch.confidence + 0.08, 0.99);
    if (!bestMatch.tactics.includes('fear')) bestMatch.tactics.push('fear');
  }

  // If we have OTP request in any context, it's always a scam
  if (/otp|one.time.password/i.test(text) && /share|tell|send|bata|bhej/i.test(text)) {
    bestMatch.confidence = Math.max(bestMatch.confidence, 0.95);
    bestMatch.isScam = true;
    if (bestMatch.type === 'generic_scam') bestMatch.type = 'otp_fraud';
  }

  // Minimum confidence floor for any detected patterns
  if (highestScore > 0) {
    bestMatch.confidence = Math.max(bestMatch.confidence, 0.6);
    bestMatch.isScam = true;
  }

  return bestMatch;
}

module.exports = { classifyScam, SCAM_PATTERNS };
