# OLD ITEMS - Legacy System Files

This folder contains legacy files from **System 1** (the original implementation) that have been replaced by the **SUPREMACY System 2** architecture.

## Moved on: February 13, 2026

---

## Legacy System 1 Files (NO LONGER USED)

### Core Server
- **`index.js`** - Old Express.js server (replaced by Vercel serverless functions)

### Legacy Agent System
- **`agent/brain.js`** - Old conversation brain (replaced by `identity-lock-prompt.js` + `three-tier-chain.js`)
- **`agent/orchestrator.js`** - Old orchestrator (replaced by GOD LEVEL honeypot handler)

### Legacy Detection & Extraction
- **`detection/scam-detector.js`** - Old detector (replaced by `classifier.js`)
- **`extraction/extractor.js`** - Old intel extractor (replaced by `aggregator.js`)

### Legacy State & Validation
- **`state/machine.js`** - Old state machine (replaced by simplified stage logic in honeypot)
- **`validation/safety.js`** - Old safety validator (replaced by `guard.js`)

### Legacy Utilities
- **`utils/metrics.js`** - Old metrics tracker (not used in System 2)

### Legacy Tests
- **`api-test.js`** - Old API test suite
- **`test-runner.js`** - Old test runner script

### Documentation
- **`docs/DESIGN_DOCUMENT.md`** - Original design document (version 1.0)
- **`docs/OR.TEXT`** - Unknown legacy file

### Architecture Diagrams
- **`architecture-diagram.jpg`** - Old architecture diagram
- **`architecture-diagram.png`** - Old architecture diagram

---

## Current Active System (SUPREMACY System 2)

### API Endpoints (4)
- `api/honeypot.js` - GOD LEVEL handler with 6 supremacy layers
- `api/health.js` - Health check endpoint
- `api/metrics.js` - Session metrics aggregator
- `api/shield-report.js` - SHIELD evidence report generator

### Supremacy Modules (6 Layers)
- **L1:** `agent/identity-lock-prompt.js` - Actor-technique persona anchoring
- **L2:** `language/mirror-engine.js` - 3ms Unicode script detection
- **L3:** `agent/three-tier-chain.js` - Claude → Smart → Base fallback
- **L4:** `intelligence/aggregator.js` - Set-based cumulative intel extraction
- **L5:** `agent/engagement-arc.js` - 10-15 turn stalling arsenal
- **L6:** `callback/guvi-reporter.js` - GUVI callback with police-report notes

### Supporting Modules
- `detection/classifier.js` - 9-type scam classifier
- `persona/profiles.js` - 6 Indian personas
- `validation/guard.js` - AI tell killer + length enforcer
- `evidence/shield.js` - Court-ready evidence reports
- `state/session-store.js` - In-memory session management
- `language/detector.js` - Legacy language detector (still used in tests)
- `language/fillers.js` - Persona filler words
- `extraction/intel-extractor.js` - Legacy extractor (still used in tests)
- `agent/prompt-builder.js` - Legacy prompt builder (still used in tests)

### Tests
- `tests/kavach-tests.js` - 109 tests, 17 categories, 100% pass rate
- `tests/test-cases.json` - Test data matrix

---

## Why These Files Were Moved

The original System 1 implementation used a traditional orchestrator-brain-state machine architecture. It worked, but had limitations:

1. **Character breaking** - Claude would sometimes break persona after 5-6 turns
2. **Single-tier response** - One Claude failure = 500 error
3. **Per-message intel** - Extracted from one message, then lost
4. **Generic stalling** - No per-persona engagement tactics
5. **Debug logs** - GUVI callback had developer notes, not police reports
6. **No language mirroring** - Slow language detection, no instant reply directive

**System 2 (SUPREMACY)** solved all of these with the 6-layer architecture:
- Identity Lock → Never breaks character
- Language Mirror → 3ms detection, instant mirroring
- 3-Tier Response → Endpoint never dies
- Intel Aggregator → Cumulative across ALL turns
- Engagement Arc → 10-15 turn stalling
- GUVI Callback → Police-report agentNotes

**Result:** 109/109 tests pass. Ready for HCL GUVI India AI Impact Buildathon 2026.

---

*These files are preserved for historical reference and can be deleted after the buildathon if needed.*
