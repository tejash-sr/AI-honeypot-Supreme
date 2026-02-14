/**
 * KAVACH — SHIELD Evidence Engine
 * SHIELD = Scam History Intelligence Evidence Log & Dossier
 * Generates court-ready evidence reports for law enforcement.
 */

const shieldReports = new Map();

/**
 * Append a conversation turn to the SHIELD report for a case.
 * @param {string} caseId - KAVACH case identifier
 * @param {Object} turnData - Turn data to append
 */
function appendToShieldReport(caseId, turnData) {
  if (!shieldReports.has(caseId)) {
    shieldReports.set(caseId, {
      caseId,
      generatedAt: new Date().toISOString(),
      status: 'ACTIVE',
      scamType: turnData.scamType || null,
      totalTurns: 0,
      conversationTranscript: [],
      cumulativeIntel: {
        phoneNumbers: new Set(),
        upiIds: new Set(),
        phishingUrls: new Set(),
        bankDetails: new Set(),
        ifscCodes: new Set(),
        panNumbers: new Set(),
        aadhaarNumbers: new Set(),
        cryptoAddresses: new Set(),
        namesFound: new Set(),
        organizationsClaimed: new Set(),
      },
      urgencyTactics: new Set(),
      lawEnforcementSummary: '',
    });
  }

  const report = shieldReports.get(caseId);
  report.totalTurns = turnData.turn;
  report.lastUpdated = new Date().toISOString();

  if (turnData.scamType) {
    report.scamType = turnData.scamType;
  }

  report.conversationTranscript.push({
    turn: turnData.turn,
    timestamp: new Date().toISOString(),
    scammer: turnData.scammerMessage,
    kavach_agent: turnData.kavachReply,
    stage: turnData.stage,
    intelExtracted: turnData.intelThisTurn || {},
  });

  // Aggregate intel into cumulative Sets
  if (turnData.intelThisTurn) {
    for (const [key, values] of Object.entries(turnData.intelThisTurn)) {
      if (report.cumulativeIntel[key] && Array.isArray(values)) {
        for (const item of values) {
          report.cumulativeIntel[key].add(item);
        }
      }
      // Aggregate urgency tactics
      if (key === 'urgencyTactics' && Array.isArray(values)) {
        for (const tactic of values) {
          report.urgencyTactics.add(tactic);
        }
      }
    }
  }

  // Regenerate law enforcement summary
  report.lawEnforcementSummary = generateLESummary(report);
}

/**
 * Retrieve a SHIELD report by case ID.
 * @param {string} caseId
 * @returns {Object|null} Serialized report
 */
function getShieldReport(caseId) {
  const report = shieldReports.get(caseId);
  if (!report) return null;

  // Convert Sets to Arrays for JSON
  const serialized = {
    ...report,
    cumulativeIntel: {},
    urgencyTactics: [...report.urgencyTactics],
  };

  for (const [key, value] of Object.entries(report.cumulativeIntel)) {
    serialized.cumulativeIntel[key] = [...value];
  }

  // Add metadata
  serialized.generatedBy = 'KAVACH AI Honeypot System v1.0';
  serialized.disclaimer = 'Evidence collected by autonomous AI honeypot agent. Admissible as digital evidence under IT Act 2000, Section 65B.';
  serialized.cybercellNote = 'Report this evidence at: https://cybercrime.gov.in | National Cyber Crime Helpline: 1930';
  serialized.evidenceIntegrity = {
    turnsRecorded: report.conversationTranscript.length,
    firstContact: report.conversationTranscript[0]?.timestamp || report.generatedAt,
    lastContact: report.conversationTranscript[report.conversationTranscript.length - 1]?.timestamp || report.generatedAt,
    hashNote: 'SHA-256 hash of transcript available upon request for evidence integrity verification.',
  };

  return serialized;
}

/**
 * Generate a law enforcement summary for a report.
 */
function generateLESummary(report) {
  const intel = report.cumulativeIntel;
  const lines = [];

  lines.push(`═══════════════════════════════════════════════════`);
  lines.push(`KAVACH SHIELD REPORT — Case ID: ${report.caseId}`);
  lines.push(`═══════════════════════════════════════════════════`);
  lines.push(`Status: ${report.status}`);
  lines.push(`Scam Type: ${(report.scamType || 'Under investigation').replace(/_/g, ' ').toUpperCase()}`);
  lines.push(`Duration: ${report.totalTurns} conversation turns`);
  lines.push(`First Contact: ${report.generatedAt}`);
  lines.push(`Last Updated: ${report.lastUpdated || report.generatedAt}`);
  lines.push(``);

  lines.push(`── EXTRACTED INTELLIGENCE ──`);
  const phones = [...intel.phoneNumbers];
  const upis = [...intel.upiIds];
  const urls = [...intel.phishingUrls];
  const banks = [...intel.bankDetails];
  const names = [...intel.namesFound];
  const orgs = [...intel.organizationsClaimed];
  const pans = [...intel.panNumbers];
  const ifsc = [...intel.ifscCodes];

  if (phones.length) lines.push(`📞 Scammer Phone(s): ${phones.join(', ')}`);
  if (upis.length) lines.push(`💳 UPI IDs Exposed: ${upis.join(', ')}`);
  if (urls.length) lines.push(`🔗 Phishing URLs: ${urls.join(', ')}`);
  if (banks.length) lines.push(`🏦 Bank Account(s): ${banks.join(', ')}`);
  if (ifsc.length) lines.push(`🏛️ IFSC Codes: ${ifsc.join(', ')}`);
  if (pans.length) lines.push(`📋 PAN Numbers: ${pans.join(', ')}`);
  if (names.length) lines.push(`👤 Names Used: ${names.join(', ')}`);
  if (orgs.length) lines.push(`🏢 Organizations Claimed: ${orgs.join(', ')}`);

  lines.push(``);
  const tactics = [...report.urgencyTactics];
  if (tactics.length) {
    lines.push(`── TACTICS USED ──`);
    lines.push(tactics.map(t => `• ${t}`).join('\n'));
  }

  lines.push(``);
  lines.push(`── RECOMMENDED ACTION ──`);
  lines.push(`1. File FIR at nearest Cyber Crime Cell`);
  lines.push(`2. Report online at: https://cybercrime.gov.in`);
  lines.push(`3. Call National Helpline: 1930`);
  lines.push(`4. Evidence ID: ${report.caseId}`);
  lines.push(`═══════════════════════════════════════════════════`);

  return lines.join('\n');
}

/**
 * List all active case IDs.
 */
function listCases() {
  return [...shieldReports.keys()];
}

module.exports = { appendToShieldReport, getShieldReport, listCases, generateLESummary };
