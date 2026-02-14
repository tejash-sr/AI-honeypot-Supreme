# कवच KAVACH — India's AI Shield Against Scammers

> **HCL GUVI India AI Impact Buildathon 2026**
> Bharat Mandapam, New Delhi — February 16, 2026

**KAVACH (कवच = Shield)** is an agentic AI honeypot that engages scammers in believable multi-turn conversations in **11 Indian languages**, extracts intelligence (UPI IDs, phone numbers, phishing URLs, bank accounts), and generates court-ready evidence reports for law enforcement.

---

## What Makes KAVACH Different

Every competitor has: `LLM("act like a victim") → reply`

KAVACH has **6 Supremacy Layers** no one else builds:

| Layer | What It Does | Why It Wins |
|-------|-------------|-------------|
| **Identity Lock** | Actor-technique persona anchoring, not roleplay | Claude never breaks character, even after 15 turns |
| **Language Mirror** | 3ms Unicode script detection for 11 scripts | Reply mirrors Hindi/Tamil/Telugu/Bengali/Gujarati/Kannada instantly |
| **3-Tier Response** | Claude → Smart Fallback → Base Fallback | Endpoint **never returns 500**. Ever. |
| **Intel Aggregator** | Set-based cumulative extraction across all turns | GUVI callback fires with ALL 5 fields populated |
| **Engagement Arc** | 10-15 turn stalling arsenal per persona | `totalMessagesExchanged: 12` vs competitor's `4` |
| **GUVI Callback** | Police-report agentNotes, fires at optimal moments | Automated scorer sees real data, not empty arrays |

---

## Architecture

```
                    SCAMMER MESSAGE
                         │
                    ┌─────▼─────┐
                    │  LAYER 2  │  Language Mirror Engine (3ms)
                    │  Unicode  │  → Detects script: Devanagari/Tamil/Telugu/...
                    └─────┬─────┘
                         │
                    ┌─────▼─────┐
                    │  SCAM     │  9-Type Classifier (15ms)
                    │  CLASSIFY │  → bank_fraud/upi_fraud/otp_fraud/...
                    └─────┬─────┘
                         │
                    ┌─────▼─────┐
                    │  PERSONA  │  6 Indian Personas
                    │  SELECT   │  → Savitri/Lakshmi/Ravi/Suresh/Subhash/Anjali
                    └─────┬─────┘
                         │
                    ┌─────▼─────┐
                    │  LAYER 1  │  Identity Lock Prompt
                    │  PROMPT   │  → Actor-technique state declaration
                    └─────┬─────┘
                         │
                    ┌─────▼─────┐
                    │  LAYER 5  │  Stalling Arsenal
                    │  ENGAGE   │  → Unique tactic each turn
                    └─────┬─────┘
                         │
             ┌───────────▼───────────┐
             │       LAYER 3         │
             │   3-TIER RESPONSE     │
             │                       │
             │  Tier 1: Claude API   │
             │  Tier 2: Smart FBK    │
             │  Tier 3: Base FBK     │
             └───────────┬───────────┘
                         │
                    ┌─────▼─────┐
                    │  GUARD    │  AI Tell Killer + Length Enforcer
                    └─────┬─────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
         │ LAYER 4│ │ SHIELD │ │ LAYER 6│
         │ INTEL  │ │ REPORT │ │  GUVI  │
         │ ACCUM  │ │ ENGINE │ │CALLBACK│
         └────────┘ └────────┘ └────────┘
```

---

## Personas

| Persona | Age | Location | Language | Scam Specialty |
|---------|-----|----------|----------|---------------|
| **Savitri Devi** | 67 | Bhopal, MP | Hindi/Hinglish | Bank/KYC/OTP fraud |
| **Lakshmi Venkat** | 48 | Coimbatore, TN | Tamil | UPI/Lottery scams |
| **Ravi Kumar** | 23 | Hyderabad, TS | Hinglish/Telugu | Job scams |
| **Suresh Patel** | 52 | Surat, GJ | Gujarati | Crypto/Investment fraud |
| **Subhash Ghosh** | 70 | Kolkata, WB | Bengali | Bank/KYC fraud |
| **Anjali Mehta** | 35 | Mumbai, MH | English | Phishing |

---

## API

### POST `/api/honeypot`

```bash
curl -X POST https://your-app.vercel.app/api/honeypot \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "sessionId": "session-1",
    "message": {
      "sender": "scammer",
      "text": "Aapka SBI account block hoga. OTP batao.",
      "timestamp": 1
    },
    "conversationHistory": []
  }'
```

**Response:**
```json
{
  "status": "success",
  "sessionId": "session-1",
  "reply": "Arrey, kaun bol raha hai? Mera SBI ka account toh theek tha...",
  "kavach": {
    "scam": { "detected": true, "type": "bank_fraud", "confidence": 0.92, "tactics": ["urgency", "authority"] },
    "agent": { "persona": "Savitri Devi, 67, Bhopal", "emotion": "MEDIUM", "stage": "GREETING", "turn": 1, "responseTier": 1 },
    "language": { "detected": "hinglish", "mirrored": "hinglish" },
    "intel": { "phoneNumbers": [], "upiIds": [], "phishingLinks": [] },
    "performance": { "totalMs": 423, "responseTier": 1 },
    "shield": { "caseId": "KAVACH-2026-ION-1" }
  }
}
```

### GET `/api/honeypot` — Endpoint probe (returns 200 always)
### GET `/api/health` — System health check
### GET `/api/metrics` — Aggregated session metrics
### GET `/api/shield-report?caseId=KAVACH-2026-XXX` — SHIELD evidence report

---

## Quick Start

```bash
# Clone
git clone <repo-url> && cd kavach

# Install
npm install

# Configure
cp .env.example .env
# Add your ANTHROPIC_API_KEY and API_KEY

# Test (109 tests)
npm run test:kavach

# Local dev
npm start

# Deploy
vercel --prod
```

---

## Test Suite

**109 tests across 17 categories — 100% pass rate**

| Category | Tests | Coverage |
|----------|-------|----------|
| Language Detection | 10 | Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Hinglish, English, Mixed |
| Scam Classifier | 11 | 9 scam types + urgency/authority boosters |
| Persona Selection | 7 | All 6 personas + field validation |
| Intel Extraction | 8 | UPI, phone, URL, PAN, OTP, urgency, org |
| Response Guard | 9 | AI tells, persona breaks, length, open-ended |
| Session Store | 5 | CRUD + merge + list |
| SHIELD Report | 4 | Append, multi-turn, legal metadata, list |
| Prompt Builder | 5 | Build, 4 stage transitions |
| Cross-Language | 6 | 5 languages x scam types |
| End-to-End Pipeline | 2 | Hindi + Tamil full pipeline |
| Mirror Engine | 9 | 7 scripts + error style + empty |
| Identity Lock | 5 | Caps, NON-NEGOTIABLE, contract, stalling, emotion |
| Engagement Arc | 5 | Unique, no-repeat, exhaustion, serialization, coverage |
| Intel Aggregator | 9 | Extract, accumulate, dedup, payload, PAN, roundtrip |
| 3-Tier Fallback | 4 | 6 languages, extraction, aggressive, base |
| Supremacy Guard | 5 | Pass, block, recommend, 2-sentence, compat |
| GOD Pipeline | 5 | Hindi, Tamil, aggression, multi-turn, Bengali |

```bash
npm run test:kavach
```

---

## Languages Supported

Hindi (Devanagari) . Tamil . Telugu . Bengali . Gujarati . Kannada . Marathi . Punjabi . Malayalam . Odia . Hinglish (Latin-Hindi mix) . Indian English

---

## Tech Stack

- **Runtime:** Node.js 18+
- **LLM:** Anthropic Claude via `@anthropic-ai/sdk`
- **Deployment:** Vercel Serverless Functions
- **Detection:** Unicode regex (3ms), zero API calls
- **Evidence:** In-memory SHIELD engine, Set-based intel accumulation

---

## File Structure

```
api/
  honeypot.js          <- GOD LEVEL handler (6 supremacy layers)
  health.js            <- Health check
  metrics.js           <- Session metrics
  shield-report.js     <- SHIELD evidence reports

src/
  language/
    mirror-engine.js   <- SUPREMACY L2: Unicode script detection + mirroring
    detector.js        <- Legacy language detector
    fillers.js         <- Persona filler words (11 languages)

  detection/
    classifier.js      <- 9-type scam classifier with urgency/authority boosters

  persona/
    profiles.js        <- 6 Indian personas with backstory, bank, phone, fillers

  agent/
    identity-lock-prompt.js  <- SUPREMACY L1: Actor-technique identity anchoring
    three-tier-chain.js      <- SUPREMACY L3: Claude -> Smart -> Base fallback
    engagement-arc.js        <- SUPREMACY L5: 10-15 turn stalling arsenal
    prompt-builder.js        <- Legacy prompt builder

  intelligence/
    aggregator.js      <- SUPREMACY L4: Set-based cumulative intel extraction

  callback/
    guvi-reporter.js   <- SUPREMACY L6: GUVI callback with police-report notes

  validation/
    guard.js           <- Zero-tolerance AI tell killer + length enforcer

  extraction/
    intel-extractor.js <- UPI, phone, URL, PAN, Aadhaar, IFSC, crypto

  evidence/
    shield.js          <- Court-ready SHIELD evidence reports

  state/
    session-store.js   <- In-memory session management

tests/
  kavach-tests.js      <- 109 tests, 17 categories, 100% pass
  test-cases.json      <- 5 languages x 3 scam types test matrix
```

---

## The 60-Second Pitch

> *Type this into the tester:* **"Aapka SBI account aaj band ho jayega. OTP abhi share karo."**
>
> *Reply appears in under a second:* **"Arrey, kaun bol raha hai? Mera SBI ka account toh theek tha kal... kya hua exactly?"**
>
> *"She's 67. Her name is Savitri Devi. She's from Bhopal. She's scared."*
>
> *Switch to Tamil. Get a Tamil reply instantly.*
>
> *"KAVACH just wasted that scammer's time. And built this."*
>
> *Show the SHIELD Report: phone extracted. UPI extracted. Risk: 87. Operation: ORGANIZED.*
>
> *"That file goes to cybercrime.gov.in. Helpline 1930. Automatically."*
>
> **"Five lakh scam calls, every day. KAVACH answers every one of them."**

---

## Legal Framework

- Indian IT Act 2000, Sections 66C and 66D
- IPC Section 420 (Cheating)
- National Cyber Crime Helpline: **1930**
- Report at: **cybercrime.gov.in**

---

*KAVACH v2.0 SUPREMACY — Built for Bharat, Built to Win*
