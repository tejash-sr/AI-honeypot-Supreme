/**
 * KAVACH — Session Store
 * In-memory session management for the hackathon.
 * Tracks per-session state: persona, turn count, extracted intel, stage.
 */

const sessions = new Map();

/**
 * Get or initialize a session.
 * @param {string} sessionId
 * @returns {Object|null}
 */
function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Create a new session with defaults.
 * @param {string} sessionId
 * @param {Object} defaults
 * @returns {Object}
 */
function createSession(sessionId, defaults = {}) {
  const session = {
    sessionId,
    turnCount: 0,
    extractedIntel: {
      phoneNumbers: [],
      upiIds: [],
      phishingUrls: [],
      bankDetails: [],
      ifscCodes: [],
      panNumbers: [],
      aadhaarNumbers: [],
      cryptoAddresses: [],
      namesFound: [],
      organizationsClaimed: [],
    },
    scamType: defaults.scamType || 'generic_scam',
    stage: 'INITIAL',
    persona: defaults.persona || null,
    shieldCaseId: `KAVACH-2026-${(sessionId || '').slice(-4).toUpperCase() || 'XXXX'}`,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    ...defaults,
  };
  sessions.set(sessionId, session);
  return session;
}

/**
 * Update an existing session.
 * @param {string} sessionId
 * @param {Object} updates
 */
function updateSession(sessionId, updates) {
  const existing = sessions.get(sessionId);
  if (existing) {
    Object.assign(existing, updates, { lastActivity: new Date().toISOString() });
    sessions.set(sessionId, existing);
  }
}

/**
 * Merge new intelligence into existing session intel.
 * @param {Object} existingIntel
 * @param {Object} newIntel
 */
function mergeIntel(existingIntel, newIntel) {
  if (!newIntel || !existingIntel) return;

  for (const [key, values] of Object.entries(newIntel)) {
    if (Array.isArray(values) && Array.isArray(existingIntel[key])) {
      const existing = new Set(existingIntel[key]);
      for (const v of values) {
        existing.add(v);
      }
      existingIntel[key] = [...existing];
    }
  }
}

/**
 * Get all active sessions (for metrics).
 */
function getAllSessions() {
  return [...sessions.values()];
}

/**
 * Clean up old sessions (older than 1 hour).
 */
function cleanupSessions() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, session] of sessions) {
    if (new Date(session.lastActivity).getTime() < oneHourAgo) {
      sessions.delete(id);
    }
  }
}

// Auto-cleanup every 30 minutes
setInterval(cleanupSessions, 30 * 60 * 1000);

module.exports = { getSession, createSession, updateSession, mergeIntel, getAllSessions, cleanupSessions };
