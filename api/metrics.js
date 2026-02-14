/**
 * KAVACH — Metrics Endpoint
 * GET /api/metrics
 * 
 * Returns system metrics: active sessions, intel extracted, performance stats.
 */

const { getAllSessions } = require('../src/state/session-store');
const { listCases } = require('../src/evidence/shield');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth
  const apiKey = req.headers['x-api-key'];
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }

  const sessions = getAllSessions();
  const cases = listCases();

  // Aggregate metrics
  const totalTurns = sessions.reduce((sum, s) => sum + (s.turnCount || 0), 0);
  const totalIntel = sessions.reduce((sum, s) => {
    const intel = s.extractedIntel || {};
    return sum + Object.values(intel).reduce((iSum, arr) => iSum + (Array.isArray(arr) ? arr.length : 0), 0);
  }, 0);

  // Scam type distribution
  const scamTypes = {};
  for (const s of sessions) {
    const type = s.scamType || 'unknown';
    scamTypes[type] = (scamTypes[type] || 0) + 1;
  }

  // Language distribution
  const languages = {};
  for (const s of sessions) {
    if (s.persona && s.persona.languages) {
      for (const lang of s.persona.languages) {
        languages[lang] = (languages[lang] || 0) + 1;
      }
    }
  }

  return res.status(200).json({
    status: 'success',
    metrics: {
      activeSessions: sessions.length,
      activeCases: cases.length,
      totalConversationTurns: totalTurns,
      totalIntelItems: totalIntel,
      averageTurnsPerSession: sessions.length > 0 ? (totalTurns / sessions.length).toFixed(1) : 0,
      scamTypeDistribution: scamTypes,
      languageDistribution: languages,
      systemUptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'N/A',
      memoryUsage: process.memoryUsage ? {
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      } : 'N/A',
    },
    timestamp: new Date().toISOString(),
  });
};
