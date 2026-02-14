# KAVACH कवच — Setup Guide

## Multi-LLM Configuration (NATIONAL SPOTLIGHT GRADE)

KAVACH uses a **6-tier failsafe cascade** that ensures the endpoint NEVER fails:

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: GROQ (llama-3.3-70b)         │ ~200ms  │ PRIMARY   │
│  TIER 2: GEMINI (3-model cascade)     │ ~800ms  │ SECONDARY │
│  TIER 3: CLAUDE (haiku)               │ ~1200ms │ TERTIARY  │
│  TIER 4: HUMAN POOL (120+ responses)  │ <1ms    │ FALLBACK  │
│  TIER 5: SMART FALLBACKS (450+)       │ <1ms    │ BACKUP    │
│  TIER 6: BASE FALLBACKS               │ <1ms    │ ULTIMATE  │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

Add these to your Vercel project or `.env` file:

### Required (at least one LLM)
```bash
# Groq - PRIMARY (fastest, 200ms latency)
# Get free API key: https://console.groq.com
GROQ_API_KEY=gsk_...

# Gemini - SECONDARY (3-model cascade)
# Get free API key: https://aistudio.google.com/app/apikey  
GEMINI_API_KEY=AIza...
```

### Optional (enhanced reliability)
```bash
# Claude - TERTIARY (paid, ultra-reliable)
# Get API key: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# ElevenLabs - Voice TTS for demo
# Get free API key: https://elevenlabs.io (10k chars/month free)
ELEVENLABS_API_KEY=xi_...

# API Authentication (optional but recommended)
API_KEY=your-custom-api-key
```

---

## Free Tier Limits

| Provider | Free Tier | Rate Limit | Best For |
|----------|-----------|------------|----------|
| **Groq** | Unlimited (30 RPM) | 14,400 req/day | Primary responses |
| **Gemini** | 1M tokens/day | 15 RPM | Backup cascade |
| **Claude** | Paid only | 60 RPM | Emergency fallback |
| **ElevenLabs** | 10k chars/month | 100 req/min | Demo voice |

---

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login and Link
```bash
vercel login
vercel link
```

### 3. Add Environment Variables
```bash
vercel env add GROQ_API_KEY
vercel env add GEMINI_API_KEY
vercel env add API_KEY
```

### 4. Deploy
```bash
vercel --prod
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/honeypot` | POST | Main honeypot conversation |
| `/api/honeypot` | GET | Health check / status |
| `/api/health` | GET | Detailed health with latency |
| `/api/metrics` | GET | Session and performance stats |
| `/api/shield-report` | GET | Court-ready evidence report |

---

## Request Format

```json
POST /api/honeypot
Content-Type: application/json
x-api-key: your-api-key

{
  "sessionId": "unique-session-id",
  "message": {
    "text": "Hello, this is SBI calling about your account",
    "timestamp": "2026-02-16T10:00:00Z"
  },
  "conversationHistory": [
    { "sender": "scammer", "text": "Previous message" },
    { "sender": "honeypot", "text": "Previous reply" }
  ]
}
```

---

## Response Format

```json
{
  "status": "success",
  "sessionId": "unique-session-id",
  "reply": "Arrey, kaun bol raha hai? Mera SBI account toh theek hai...",
  "kavach": {
    "scam": {
      "detected": true,
      "type": "bank_fraud",
      "confidence": 0.92,
      "tactics": ["impersonation", "urgency"]
    },
    "agent": {
      "persona": "Savitri Devi, 58, Delhi",
      "personaId": "savitri_devi",
      "emotion": "LOW",
      "stage": "GREETING",
      "turn": 1,
      "responseTier": 1,
      "provider": "groq",
      "model": "llama-3.3-70b-versatile"
    },
    "language": {
      "detected": "hinglish",
      "mirrored": "hinglish",
      "directive": "Mix Hindi and English naturally"
    },
    "intel": {
      "phoneNumbers": [],
      "bankAccounts": [],
      "names": ["SBI"],
      "threats": 0
    },
    "performance": {
      "totalMs": 245,
      "responseTier": 1
    }
  }
}
```

---

## Response Providers

The `provider` field tells you which LLM generated the response:

| Provider | Tier | Description |
|----------|------|-------------|
| `groq` | 1 | Groq LLM (fastest) |
| `gemini` | 2 | Google Gemini (cascade) |
| `claude` | 3 | Anthropic Claude (paid) |
| `human-pool` | 4 | 120+ pre-written responses |
| `smart-fallback` | 5 | 450+ contextual fallbacks |
| `base-fallback` | 6 | Simple language fallbacks |

---

## Supported Languages

KAVACH automatically detects and mirrors 13 Indian languages:

- Hindi (Devanagari)
- Hinglish (Hindi + English)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Punjabi (ਪੰਜਾਬੀ)
- Odia (ଓଡ଼ିଆ)
- English

---

## Testing

### Run Test Suite
```bash
npm test
```

### Quick API Test
```bash
curl -X POST https://your-deployment.vercel.app/api/honeypot \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-key" \
  -d '{"sessionId":"test-123","message":{"text":"Hello, SBI speaking"}}'
```

---

## Demo at Bharat Mandapam

For the HCL GUVI India AI Impact Buildathon 2026 demo:

1. Open `https://your-deployment.vercel.app` in browser
2. Use the demo UI to simulate scam conversations
3. Show real-time scam detection and persona responses
4. Display SHIELD evidence report generation

---

## Troubleshooting

### "Rate limit exceeded"
- Groq: Wait 2 seconds (30 RPM limit)
- Gemini: Auto-cascades to backup model
- Both: Falls back to human pool (NEVER fails)

### "Response too similar"
- Anti-repetition system activated
- Automatically selects different response
- 70% similarity threshold

### "Empty response"
- LLM returned invalid output
- Auto-falls back to next tier
- Human pool has 120+ options

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        KAVACH कवच                                │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   GROQ      │→ │   GEMINI    │→ │   CLAUDE    │→ fallback   │
│  │  (200ms)    │  │  (cascade)  │  │  (backup)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         ↓                ↓                ↓                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              HUMAN POOL (120+ responses)                    ││
│  │              SMART FALLBACKS (450+ options)                 ││
│  │              BASE FALLBACKS (all languages)                 ││
│  └─────────────────────────────────────────────────────────────┘│
│         ↓                                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                 RESPONSE GUARD                              ││
│  │         (strips AI tells, enforces persona)                 ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

Built with 🇮🇳 for HCL GUVI India AI Impact Buildathon 2026
