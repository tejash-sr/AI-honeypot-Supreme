/**
 * KAVACH — ElevenLabs Flash v2.5 TTS Integration
 * Free tier: 10,000 chars/month
 * Flash v2.5: sub-second latency — perfect for demo
 * Voice IDs mapped to personas for authentic character voices
 */

// ElevenLabs Voice IDs — pre-selected for Indian English accent + emotion
const VOICE_MAP = {
  ELDERLY_WOMAN_HINDI:     'pNInz6obpgDQGcFmaJgB', // "Adam" — warm, slightly older
  HOUSEWIFE_SOUTH:         'EXAVITQu4vr4xnSDxMaL', // "Bella" — gentle, softer
  YOUNG_JOBSEEKER:         'VR6AewLTigWG4xSOukaG', // "Arnold" — younger energy
  BUSINESSMAN_GUJARATI:    'onwK4e9ZLuTAKqWW03F9', // "Daniel" — formal, measured
  ELDERLY_MAN_BENGALI:     'pNInz6obpgDQGcFmaJgB', // "Adam"
  EDUCATED_PROFESSIONAL:   '21m00Tcm4TlvDq8ikWAM', // "Rachel" — crisp, professional
};

// Language → ElevenLabs language code
const LANG_CODES = {
  hindi_devanagari: 'hi',
  hinglish: 'hi',
  hindi: 'hi',
  tamil: 'ta',
  telugu: 'te',
  bengali: 'bn',
  gujarati: 'gu',
  kannada: 'kn',
  malayalam: 'ml',
  marathi: 'mr',
  punjabi: 'pa',
  odia: 'or',
  english: 'en',
};

/**
 * Convert text to speech using ElevenLabs Flash v2.5
 * @param {string} text - Text to convert
 * @param {string} personaId - Persona ID for voice selection
 * @param {string} language - Detected language
 * @returns {Object|null} Audio data or null if unavailable
 */
async function textToSpeech(text, personaId, language) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return null;

  const voiceId = VOICE_MAP[personaId] || VOICE_MAP.ELDERLY_WOMAN_HINDI;
  const langCode = LANG_CODES[language] || 'hi';

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': key,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2_5',  // Sub-second latency model
        language_code: langCode,
        voice_settings: {
          stability: 0.45,           // Lower = more emotional variation
          similarity_boost: 0.75,
          style: 0.3,                // Natural, not over-expressive
          use_speaker_boost: true,
        },
      }),
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) return null;
    
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return {
      audio_base64: base64Audio,
      content_type: 'audio/mpeg',
      voice_used: voiceId,
      model: 'eleven_flash_v2_5',
      language: langCode,
    };
  } catch (error) {
    console.error('[KAVACH TTS] Error:', error.message);
    return null;
  }
}

module.exports = { textToSpeech, VOICE_MAP, LANG_CODES };
