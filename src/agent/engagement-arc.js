/**
 * KAVACH — Engagement Arc & Stalling Arsenal (SUPREMACY LAYER 5)
 * Designed to keep scammers engaged for 10–15 turns.
 * Each turn introduces a new stalling reason.
 * The scammer is never satisfied but never loses hope.
 *
 * No competitor does this. Their agent exits after 3-5 turns.
 * totalMessagesExchanged: 4 = low score. KAVACH targets 10-15.
 */

// The 10-turn engagement arc — per persona type (GOD LEVEL EXPANDED)
const ENGAGEMENT_ARC = {
  ELDERLY_WOMAN_HINDI: {
    GREETING:   [
      'Kaun bol raha hai? Kaun si bank se?', 
      'Arrey kya hua? Kaunsi organization se phone hai?', 
      'Haan ji, boliye... kaun hai?',
      'Hello? Suno nahi ja raha, zara uunchi awaaz mein bolo',
      'SBI se ya HDFC se? Mera dono mein account hai',
      'Bank wale ho toh naam batao apna pehle',
    ],
    RAPPORT:    [
      'Pehle aap apna employee badge number batao', 
      'Mera beta kehta hai verify karna chahiye pehle', 
      'Aapka supervisor ka naam kya hai?', 
      'Kaunsi branch se call kar rahe ho?', 
      'Mujhe pehle apna ID proof dikhao',
      'Beta ne bola hai pehle bank jaake confirm karo',
      'Yeh toh suspicious lag raha hai... zara ruko',
      'Tumhari company ka toll free number batao',
      'Mera pati bhi government mein tha, sab jaante hain hum',
      'TV pe bola tha fraud hota hai... tum genuine ho?',
      'Pehle ye batao tumhare paas mera number kaise aaya?',
    ],
    FINANCIAL:  [
      'Passbook doosre kamre mein hai, ek moment', 
      'Mera chashma nahi mil raha, number nahi dikh raha', 
      'Canara wala account ya SBI wala? Do account hain mere', 
      'Beta ka naam bhi hai is account pe, usse poochna padega', 
      'Account number bahut lamba hai, likhne do',
      'Arrey ruko, bahu bula rahi hai kitchen se',
      'Pension account hai ya savings? Dono alag hain',
      'ATM card dekhun? Wallet almirah mein hai',
      'Ek minute... puja ka time ho gaya, baad mein batati hoon',
      'Account number copy karwalo, main bahut slow bolti hoon',
      'Debit card ekspire ho gayi thi shayad... date check karna padega',
    ],
    EXTRACTION: [
      'OTP aaya, starts with... ruko chashma lagaun', 
      'Phone pe kuch aur dikha raha hai, confused hoon', 
      'Number bahut chhota hai screen pe, nahi dikh raha', 
      'Pehle 6 digit bataungi ya last 4? Samajh nahi aaya', 
      'Ruko, SMS bahut saare aa rahe hain, kaunsa wala?',
      'OTP ka message kahan dikhta hai? WhatsApp pe dekhu kya?',
      'Beta ne kaha tha kabhi OTP share mat karo... ye safe hai kya?',
      'Screen pe bahut saare number aa rahe, confusion ho rahi',
      'Zara hold karo... koi doorbell de raha hai',
      'Arrey ye toh phone ka password maang raha... galat jagah daal diya',
      'Message mein likha hai share mat karo... phir bhi batau?',
    ],
    CLOSING:    [
      'Phone ki battery bahut kam hai, callback number do', 
      '10 minute mein call karna, beta aa raha hai', 
      'Aapka naam aur ID number likhna hai mujhe records ke liye', 
      'Main bank branch jaake karungi kal, supervisor ka number do',
      'Shaam ko beta aayega, 6 baje call karna',
      'Kal subah bank jaake personally karungi',
      'Aapka WhatsApp number do, beta check karega genuine hai kya',
      'Complaint number do likhne ke liye',
    ],
  },
  HOUSEWIFE_SOUTH: {
    GREETING:   [
      'Yaaru pesuringa? Enga bank la irunthu?', 
      'Enna aachu? Ethana bank account-oda issue?',
      'Hello? Line problem irukku, speak louder please',
      'Which bank? I have SBI and Canara both',
      'Wait wait, I was cooking... boliye',
    ],
    RAPPORT:    [
      'Employee ID sollunga please', 
      'En husband kitta kekkanum intha matter', 
      'Branch address sollunga', 
      'Enoda bank manager kitta confirm pannaanum',
      'Husband evening-la varuvar, appo call pannunga',
      'TV-la fraud news paathein... neenga genuine-a?',
      'Un office-oda registration number enna?',
      'Toll free number sollunga, na call panni verify pannuven',
      'Ennoda friend-um bank-la velai seiyura, ava kitta kekka?',
    ],
    FINANCIAL:  [
      'Passbook almaari-la irukku, oru nimisham', 
      'Account number la doubt irukku... 2 accounts irukku', 
      'Ennoda phone-la net slow-a irukku',
      'ATM card husband kitta irukku, avar office-la irukkar',
      'Savings account-a illa fixed deposit-a? Rendu irukku',
      'Oru second... gas off pannanum kitchen-la',
      'Account number memorize pannala na, passbook edhukka pochein',
    ],
    EXTRACTION: [
      'OTP vandhirukku... screen chinna-a theriyuthu', 
      'Enna app-la paakkaNum? Confused-a irukku', 
      'Husband call pannuren, wait pannunga',
      'SMS vandhirukku but share pannatha nu ezhuthirukku...',
      'Oru nimisham... doorbell adichchirukku',
      'Phone hang aayidichchu, wait pannunga reload aaguthu',
      'OTP number wrong aayidichchu, innouru varum-a?',
    ],
    CLOSING:    [
      'Phone charge aaguthu, callback number sollunga', 
      'Naalaikku bank-ku poven... manager number sollunga',
      'Husband kitta discuss pannitu call panren 1 hour-la',
      'WhatsApp-la message pannunga, na save pannikiththen',
    ],
  },
  YOUNG_JOBSEEKER: {
    GREETING:   [
      'Kaun si company se bhai? Name nahi suna pehle', 
      'Resume mere kahaan se mila aapko?', 
      'Genuine hai kya yeh? Bahut scams hote hain aajkal...',
      'LinkedIn pe hai kya company? Profile link do please',
      'Kaun si post ke liye call kar rahe ho?',
    ],
    RAPPORT:    [
      'CTC package kya hai?', 
      'WFH hai ya office aana padega?', 
      'Offer letter pehle bhejo na email pe', 
      'HR portal ka link do, main verify karunga', 
      'LinkedIn pe company hai kya?',
      'Job description mail pe bhejo please',
      'Company ki Glassdoor rating kitni hai?',
      'Founder ka naam batao, Google karunga',
      'Interview rounds kitne hain? Process kya hai?',
      'Relocation assistance milega kya?',
      'Notice period kitna hai expected?',
    ],
    FINANCIAL:  [
      'Registration fee? Yeh toh suspicious lag raha hai bhai', 
      'Account details kyon chahiye? Company directly deduct karegi na?', 
      'Main papa se pooch ke batata hoon',
      'Training ke liye fees? MNC mein toh free hoti hai bhai',
      'Papa ka opinion lena zaroori hai bhai, ruko',
      'Security deposit? Official MNCs mein toh nahi maangte...',
      'Ye sab scam pattern hai bhai, YouTube pe dekha tha',
    ],
    EXTRACTION: [
      'UPI pe paise bhejne hain? Ruko confirm kar lun', 
      'Company ka registration number do pehle', 
      'Glassdoor pe reviews dekhna hai pehle',
      'Payment gateway secure hai? SSL certificate hai?',
      'Transaction ID kya hoga? Screenshot bhejoge na?',
      'Wait kar bhai, WiFi buffering ho rahi hai',
    ],
    CLOSING:    [
      'Main papa se baat karke call back karta hoon', 
      'Company website URL do, verify karunga', 
      'Email pe official offer bhejo, phir baat karte hain',
      'Twitter pe company handle kya hai? DM pe verify karunga',
      'Kal tak research karke call karta hoon pakka',
    ],
  },
  BUSINESSMAN_GUJARATI: {
    GREETING:   [
      'Haan bhai, kya scheme hai? Detail mein batao', 
      'Company registered hai kya? SEBI approval hai?',
      'ROI kitna hai? Guaranteed hai kya?',
      'Bhai, mujhe scams ka bahut experience hai... careful rehta hoon',
    ],
    RAPPORT:    [
      'Previous returns ka proof hai? Statement dikhao', 
      'Kitne log ne invest kiya hai abhi tak?', 
      'Minimum investment kitna hai?',
      'Lock-in period kitna hai? Withdrawal kab kar sakta hoon?',
      'Company ka CIN number batao, MCA pe check karunga',
      'RBI se approval hai kya is scheme ke liye?',
      'Reference chahiye already invested customers ka',
      'Franchise model hai ya MLM? Clear karo bhai',
    ],
    FINANCIAL:  [
      '2 lakh toh hai mere paas... risk kitna hai exactly?', 
      'Tax implications kya hain? CA se poochna padega', 
      'Pehle 10 hazaar se start karein?',
      'CA ko consult karna important hai tax ke liye',
      'Investment ka legal agreement milega kya?',
      'Cheque se payment chalega? Record rahega',
      'Quarterly returns milenge ya annually?',
    ],
    EXTRACTION: [
      'UPI se bhejun? But account kiska hai company ka?', 
      'Company ka bank account number do, NEFT karunga', 
      'PAN card chahiye toh batao',
      'GST number bhi do company ka, verify karunga',
      'Wire transfer karun ya RTGS? Amount large hai',
      'Company ke naam pe account hai na? Personal pe nahi bhejunga',
    ],
    CLOSING:    [
      'Main CA ko call karke confirm karta hoon', 
      'Kal office hours mein call karna', 
      'Official brochure email karo pehle',
      'MOU draft bhejo, lawyer se review karwaunga',
      'Weekend ke baad final decision dunga',
    ],
  },
  ELDERLY_MAN_BENGALI: {
    GREETING:   [
      'Ke bolchen? Kothay theke phone korchen?', 
      'Amar account-e ki hoyeche?',
      'Bank theke phone? Karon ki?',
      'Shunchi na bhalo, jore bolun',
    ],
    RAPPORT:    [
      'Apnar employee ID ta bolun', 
      'Amar meye Bangalore-e thake, take jigges korbo', 
      'Branch-er address ta bolun dada',
      'Apnar supervisor-er number din',
      'TV-te fraud-er khabar dekhechhi... apni genuine to?',
      'Apnar naam ta abar bolun please, likhchhi',
      'Official phone number ta bolun, verify korbo',
    ],
    FINANCIAL:  [
      'Passbook almirah-te ache, ek minute', 
      'Account number ta mone nei, khata-te ache', 
      'Pension account ta ki affected?',
      'Chasma lagano nei, number thik dekhte parchhi na',
      'Account book ta khujchhi, drawer-e ache',
      'Savings account na pension account? Duto ache',
    ],
    EXTRACTION: [
      'OTP eshche... kintu chokh-e bhalo dekhte pachi na', 
      'Phone-e onno kichu dikchche, confused hoyechi', 
      'Wait korun, meye ke phone kori',
      'Screen-e choto choto number, dekhte asubidha',
      'Message-e likha share korben na... tahole bolbo ki kore?',
      'Arektu time din, reading glass khujchhi',
    ],
    CLOSING:    [
      'Phone-er charge kom, callback number din', 
      'Bank-e giye korbo kal morning-e', 
      'Apnar supervisor-er number ta din',
      'Meye-ke jigges kore janabo, shondhe-te call korben',
      'Complaint number ta din please likhchhi',
    ],
  },
  EDUCATED_PROFESSIONAL: {
    GREETING:   [
      'Sorry, who is this? I\'m in a meeting right now', 
      'Which department are you calling from exactly?',
      'Can you hold for a second? I\'m just finishing something',
      'Hello? Your voice is breaking, which bank did you say?',
    ],
    RAPPORT:    [
      'Can you send me an official email? I\'ll verify from my end', 
      'What\'s the ticket number for this issue?', 
      'Let me check my bank app... one second',
      'I\'ll need to see some identification first',
      'What\'s your employee ID? I\'ll verify with the bank',
      'Can you tell me the last transaction on my account? To verify you have access',
      'I\'m going to call the official helpline to verify this',
      'What\'s your supervisor\'s name and extension?',
    ],
    FINANCIAL:  [
      'I need to verify this with my bank manager first', 
      'Can you share the reference number?', 
      'Let me check my account online... it\'s loading',
      'Wait, I have two accounts... which one are you referring to?',
      'The app is taking time to load, poor network here',
      'I see some discrepancy in what you\'re saying... let me check',
    ],
    EXTRACTION: [
      'OTP? Wait, I need to check which phone it came on', 
      'The app is asking for biometric, hold on', 
      'I want to call the official helpline first',
      'My company policy doesn\'t allow sharing OTP on phone',
      'Hold on, I\'m getting another call... might be my bank manager',
      'The OTP screen shows a warning about scams... should I still share?',
      'Wait, let me screenshot this for my records first',
    ],
    CLOSING:    [
      'Send me everything on email, I\'ll revert', 
      'I\'ll call the bank\'s official number to confirm', 
      'Give me your official extension number',
      'I\'ll discuss this with my CA and get back to you',
      'Let me verify through net banking first, then I\'ll call back',
      'Please share your details on WhatsApp, I\'ll verify and respond',
    ],
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
