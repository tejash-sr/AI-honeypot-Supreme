/**
 * KAVACH — Engagement Arc & Stalling Arsenal (SUPREMACY LAYER 5)
 * Designed to keep scammers engaged for 10–15 turns.
 * Each turn introduces a new stalling reason.
 * The scammer is never satisfied but never loses hope.
 *
 * No competitor does this. Their agent exits after 3-5 turns.
 * totalMessagesExchanged: 4 = low score. KAVACH targets 10-15.
 */

// The 10-turn engagement arc — per persona type
const ENGAGEMENT_ARC = {
  ELDERLY_WOMAN_HINDI: {
    GREETING:   ['Kaun bol raha hai? Kaun si bank se?', 'Arrey kya hua? Kaunsi organization se phone hai?', 'Haan ji, boliye... kaun hai?'],
    RAPPORT:    ['Pehle aap apna employee badge number batao', 'Mera beta kehta hai verify karna chahiye pehle', 'Aapka supervisor ka naam kya hai?', 'Kaunsi branch se call kar rahe ho?', 'Mujhe pehle apna ID proof dikhao'],
    FINANCIAL:  ['Passbook doosre kamre mein hai, ek moment', 'Mera chashma nahi mil raha, number nahi dikh raha', 'Canara wala account ya SBI wala? Do account hain mere', 'Beta ka naam bhi hai is account pe, usse poochna padega', 'Account number bahut lamba hai, likhne do'],
    EXTRACTION: ['OTP aaya, starts with... ruko chashma lagaun', 'Phone pe kuch aur dikha raha hai, confused hoon', 'Number bahut chhota hai screen pe, nahi dikh raha', 'Pehle 6 digit bataungi ya last 4? Samajh nahi aaya', 'Ruko, SMS bahut saare aa rahe hain, kaunsa wala?'],
    CLOSING:    ['Phone ki battery bahut kam hai, callback number do', '10 minute mein call karna, beta aa raha hai', 'Aapka naam aur ID number likhna hai mujhe records ke liye', 'Main bank branch jaake karungi kal, supervisor ka number do'],
  },
  HOUSEWIFE_SOUTH: {
    GREETING:   ['Yaaru pesuringa? Enga bank la irunthu?', 'Enna aachu? Ethana bank account-oda issue?'],
    RAPPORT:    ['Employee ID sollunga please', 'En husband kitta kekkanum intha matter', 'Branch address sollunga', 'Enoda bank manager kitta confirm pannaanum'],
    FINANCIAL:  ['Passbook almaari-la irukku, oru nimisham', 'Account number la doubt irukku... 2 accounts irukku', 'Ennoda phone-la net slow-a irukku'],
    EXTRACTION: ['OTP vandhirukku... screen chinna-a theriyuthu', 'Enna app-la paakkaNum? Confused-a irukku', 'Husband call pannuren, wait pannunga'],
    CLOSING:    ['Phone charge aaguthu, callback number sollunga', 'Naalaikku bank-ku poven... manager number sollunga'],
  },
  YOUNG_JOBSEEKER: {
    GREETING:   ['Kaun si company se bhai? Name nahi suna pehle', 'Resume mere kahaan se mila aapko?', 'Genuine hai kya yeh? Bahut scams hote hain aajkal...'],
    RAPPORT:    ['CTC package kya hai?', 'WFH hai ya office aana padega?', 'Offer letter pehle bhejo na email pe', 'HR portal ka link do, main verify karunga', 'LinkedIn pe company hai kya?'],
    FINANCIAL:  ['Registration fee? Yeh toh suspicious lag raha hai bhai', 'Account details kyon chahiye? Company directly deduct karegi na?', 'Main papa se pooch ke batata hoon'],
    EXTRACTION: ['UPI pe paise bhejne hain? Ruko confirm kar lun', 'Company ka registration number do pehle', 'Glassdoor pe reviews dekhna hai pehle'],
    CLOSING:    ['Main papa se baat karke call back karta hoon', 'Company website URL do, verify karunga', 'Email pe official offer bhejo, phir baat karte hain'],
  },
  BUSINESSMAN_GUJARATI: {
    GREETING:   ['Haan bhai, kya scheme hai? Detail mein batao', 'Company registered hai kya? SEBI approval hai?'],
    RAPPORT:    ['Previous returns ka proof hai? Statement dikhao', 'Kitne log ne invest kiya hai abhi tak?', 'Minimum investment kitna hai?'],
    FINANCIAL:  ['2 lakh toh hai mere paas... risk kitna hai exactly?', 'Tax implications kya hain? CA se poochna padega', 'Pehle 10 hazaar se start karein?'],
    EXTRACTION: ['UPI se bhejun? But account kiska hai company ka?', 'Company ka bank account number do, NEFT karunga', 'PAN card chahiye toh batao'],
    CLOSING:    ['Main CA ko call karke confirm karta hoon', 'Kal office hours mein call karna', 'Official brochure email karo pehle'],
  },
  ELDERLY_MAN_BENGALI: {
    GREETING:   ['Ke bolchen? Kothay theke phone korchen?', 'Amar account-e ki hoyeche?'],
    RAPPORT:    ['Apnar employee ID ta bolun', 'Amar meye Bangalore-e thake, take jigges korbo', 'Branch-er address ta bolun dada'],
    FINANCIAL:  ['Passbook almirah-te ache, ek minute', 'Account number ta mone nei, khata-te ache', 'Pension account ta ki affected?'],
    EXTRACTION: ['OTP eshche... kintu chokh-e bhalo dekhte pachi na', 'Phone-e onno kichu dikchche, confused hoyechi', 'Wait korun, meye ke phone kori'],
    CLOSING:    ['Phone-er charge kom, callback number din', 'Bank-e giye korbo kal morning-e', 'Apnar supervisor-er number ta din'],
  },
  EDUCATED_PROFESSIONAL: {
    GREETING:   ['Sorry, who is this? I\'m in a meeting right now', 'Which department are you calling from exactly?'],
    RAPPORT:    ['Can you send me an official email? I\'ll verify from my end', 'What\'s the ticket number for this issue?', 'Let me check my bank app... one second'],
    FINANCIAL:  ['I need to verify this with my bank manager first', 'Can you share the reference number?', 'Let me check my account online... it\'s loading'],
    EXTRACTION: ['OTP? Wait, I need to check which phone it came on', 'The app is asking for biometric, hold on', 'I want to call the official helpline first'],
    CLOSING:    ['Send me everything on email, I\'ll revert', 'I\'ll call the bank\'s official number to confirm', 'Give me your official extension number'],
  },
};

/**
 * Stalling Arsenal — manages per-session tactic rotation.
 * Never repeats a tactic. Never lets scammer close conversation.
 */
class StallingArsenal {
  constructor(personaType) {
    this.personaType = personaType;
    this.used = new Set();
    this.arc = ENGAGEMENT_ARC[personaType] || ENGAGEMENT_ARC.ELDERLY_WOMAN_HINDI;
  }

  /**
   * Get next unused stalling tactic for the current stage.
   * Returns null if all tactics exhausted (let LLM generate fresh).
   */
  getNextTactic(stage) {
    const pool = this.arc[stage] || this.arc.RAPPORT;
    const available = pool.filter(t => !this.used.has(t));
    if (!available.length) return null; // Let LLM generate

    const tactic = available[Math.floor(Math.random() * available.length)];
    this.used.add(tactic);
    return tactic;
  }

  /**
   * Serialize used tactics for session storage.
   */
  toJSON() {
    return {
      personaType: this.personaType,
      used: [...this.used],
    };
  }

  /**
   * Restore from serialized state.
   */
  static fromJSON(data) {
    const arsenal = new StallingArsenal(data.personaType);
    if (data.used) data.used.forEach(t => arsenal.used.add(t));
    return arsenal;
  }
}

module.exports = { ENGAGEMENT_ARC, StallingArsenal };
