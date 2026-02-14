/**
 * KAVACH — SHIELD Report API Endpoint
 * GET /api/shield-report?caseId=KAVACH-2026-XXXX
 * 
 * Returns the full evidence dossier for a specific case.
 * Court-ready, law enforcement compatible.
 */

const { getShieldReport, listCases } = require('../src/evidence/shield');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth
  const apiKey = req.headers['x-api-key'];
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed. Use GET.' });
  }

  const { caseId } = req.query || {};

  // If no caseId, return list of active cases
  if (!caseId) {
    const cases = listCases();
    return res.status(200).json({
      status: 'success',
      activeCases: cases,
      totalCases: cases.length,
    });
  }

  const report = getShieldReport(caseId);

  if (!report) {
    return res.status(404).json({
      status: 'error',
      error: `Case not found: ${caseId}`,
      hint: 'Use GET /api/shield-report without parameters to list all active cases.',
    });
  }

  return res.status(200).json({
    status: 'success',
    report,
  });
};
