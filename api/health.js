/**
 * KAVACH — Health Check Endpoint
 * GET /api/health
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    status: 'healthy',
    system: 'KAVACH AI Honeypot System v1.0',
    description: 'Agentic AI honeypot for scam detection, engagement, and intelligence extraction',
    timestamp: new Date().toISOString(),
    features: {
      languages: ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Kannada', 'Marathi', 'Punjabi', 'English', 'Hinglish'],
      scamTypes: ['bank_fraud', 'kyc_fraud', 'upi_fraud', 'otp_fraud', 'lottery_scam', 'job_scam', 'phishing', 'investment_fraud', 'crypto_scam'],
      personas: 6,
      llm: 'Gemini gemini-flash-latest',
      evidenceEngine: 'SHIELD Report (law enforcement ready)',
    },
    endpoints: {
      honeypot: 'POST /api/honeypot',
      shieldReport: 'GET /api/shield-report?caseId=KAVACH-2026-XXXX',
      health: 'GET /api/health',
      metrics: 'GET /api/metrics',
    },
    buildathon: {
      event: 'HCL GUVI India AI Impact Buildathon',
      venue: 'Bharat Mandapam, New Delhi',
      date: 'February 16, 2026',
    },
  });
};
