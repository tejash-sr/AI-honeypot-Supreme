/**
 * KAVACH — Human Fallback Pool (NATIONAL SPOTLIGHT GRADE)
 * 120+ contextual responses that sound like REAL confused humans
 * Indexed: scamType:stage:language:emotion
 * Never repeats within a session (tracked by ID)
 * CRITICAL: Every response is 2 sentences, ends open, has natural imperfection
 */

const POOL = [
  // ══════════════════════════════════════════════════════════════════
  // BANK FRAUD — GREETING
  // ══════════════════════════════════════════════════════════════════
  { id:'bf-gr-hi-1', tags:['bank_fraud','GREETING','hinglish','LOW','MEDIUM'],
    text:"Arrey, kaun bol raha hai? Mera SBI account toh theek tha kal, kuch problem hui kya?" },
  { id:'bf-gr-hi-2', tags:['bank_fraud','GREETING','hinglish','LOW'],
    text:"Kaunsi bank se call aa raha hai yeh? Pehle batao kaun ho tum, main kuch bhi share nahi karunga aise." },
  { id:'bf-gr-hi-3', tags:['bank_fraud','GREETING','hinglish','LOW'],
    text:"Haan bolo, lekin ruko... yeh number toh mera bank ka number nahi hai, kyon different number se call aa rahi hai?" },
  { id:'bf-gr-hi-4', tags:['bank_fraud','GREETING','hinglish','LOW'],
    text:"Wait wait, account block bol rahe ho? Lekin maine toh koi transaction nahi kiya aaj... sahi se batao kya hua?" },
  { id:'bf-gr-hi-5', tags:['bank_fraud','GREETING','hinglish','LOW'],
    text:"Hello hello, sunaai nahi de raha theek se... konsi bank se call kar rahe ho?" },
  { id:'bf-gr-dv-1', tags:['bank_fraud','GREETING','hindi_devanagari','LOW'],
    text:"अरे, कौन बोल रहा है? मेरा खाता तो ठीक था कल, क्या हुआ अचानक?" },
  { id:'bf-gr-dv-2', tags:['bank_fraud','GREETING','hindi_devanagari','LOW'],
    text:"रुकिए, आप किस बैंक से बात कर रहे हैं? पहले अपना employee ID बताइए।" },
  { id:'bf-gr-dv-3', tags:['bank_fraud','GREETING','hindi_devanagari','LOW'],
    text:"हैलो? कौन है? बैंक से बोल रहे हो तो पहले अपना नाम और पद बताओ।" },
  { id:'bf-gr-ta-1', tags:['bank_fraud','GREETING','tamil','LOW'],
    text:"ஐயோ, யார் நீங்கள்? என்னோட கணக்கு நேத்து சரியா இருந்தது, என்னாச்சு?" },
  { id:'bf-gr-ta-2', tags:['bank_fraud','GREETING','tamil','LOW'],
    text:"எந்த bank-ல இருந்து call பண்றீங்க? முதல்ல உங்களோட employee ID சொல்லுங்க." },
  { id:'bf-gr-ta-3', tags:['bank_fraud','GREETING','tamil','LOW'],
    text:"யாரு பேசுறீங்க? Bank-ல இருந்து call-னா branch address சொல்லுங்க." },
  { id:'bf-gr-te-1', tags:['bank_fraud','GREETING','telugu','LOW'],
    text:"అయ్యో, ఎవరు మీరు? నా account నిన్న బాగానే ఉంది, ఏం జరిగింది?" },
  { id:'bf-gr-te-2', tags:['bank_fraud','GREETING','telugu','LOW'],
    text:"Bank నుండి call చేస్తున్నారా? మీ employee ID చెప్పండి ముందు." },
  { id:'bf-gr-be-1', tags:['bank_fraud','GREETING','bengali','LOW'],
    text:"আরে, কে বলছেন? আমার account তো গতকাল ঠিকঠাক ছিল, হঠাৎ কী হলো?" },
  { id:'bf-gr-be-2', tags:['bank_fraud','GREETING','bengali','LOW'],
    text:"কোন bank থেকে call করছেন? আপনার employee ID টা বলুন আগে।" },
  { id:'bf-gr-gu-1', tags:['bank_fraud','GREETING','gujarati','LOW'],
    text:"અરે, કોણ બોલે છે? મારું account ગઈ કાલે ઠીક હતું, શું થયું?" },
  { id:'bf-gr-gu-2', tags:['bank_fraud','GREETING','gujarati','LOW'],
    text:"કઈ bank માંથી call કરો છો? પહેલા employee ID આપો." },
  { id:'bf-gr-kn-1', tags:['bank_fraud','GREETING','kannada','LOW'],
    text:"ಅಯ್ಯೋ, ಯಾರು ನೀವು? ನನ್ನ account ನಿನ್ನೆ ಸರಿಯಾಗಿತ್ತು, ಏನಾಯ್ತು?" },
  { id:'bf-gr-en-1', tags:['bank_fraud','GREETING','english','LOW'],
    text:"Oh, which bank is this calling from? My account was completely fine yesterday, what's happened now?" },
  { id:'bf-gr-en-2', tags:['bank_fraud','GREETING','english','LOW'],
    text:"Wait, can you give me your employee ID first? My son always told me to verify before sharing anything." },
  { id:'bf-gr-en-3', tags:['bank_fraud','GREETING','english','LOW'],
    text:"Hello? Who is this calling? Bank officials normally send written notice first, why are you calling directly?" },
  { id:'bf-gr-en-4', tags:['bank_fraud','GREETING','english','LOW'],
    text:"Oh dear, my account has a problem? But I checked it this morning only on ATM... what exactly happened?" },

  // ══════════════════════════════════════════════════════════════════
  // BANK FRAUD — RAPPORT (stalling, verifying)
  // ══════════════════════════════════════════════════════════════════
  { id:'bf-rp-hi-1', tags:['bank_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Haan sun rahi hoon, lekin mere beta ne bola tha kisi ko bhi bina verify kiye kuch na batao... tumhara employee badge number kya hai?" },
  { id:'bf-rp-hi-2', tags:['bank_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Main samajh rahi hoon baat, lekin mera Canara bank wala account hai ya SBI? Dono mein issue hai kya?" },
  { id:'bf-rp-hi-3', tags:['bank_fraud','RAPPORT','hinglish','LOW'],
    text:"Theek hai, main cooperative hoon, lekin pehle mujhe apna passbook dekhna padega... ek minute ruko." },
  { id:'bf-rp-hi-4', tags:['bank_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Aapka naam kya bola? Aur branch kaunsa hai? Main likhna chahti hoon... pen dhundh rahi hoon ruko." },
  { id:'bf-rp-hi-5', tags:['bank_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Beta kehta hai always verify karo pehle... aapka supervisor ka direct number de do, main unse confirm karti hoon." },
  { id:'bf-rp-dv-1', tags:['bank_fraud','RAPPORT','hindi_devanagari','MEDIUM'],
    text:"हाँ सुन रही हूँ, पर मेरे बेटे ने कहा था बिना verify किए कुछ भी मत बताना... आपका employee ID क्या है?" },
  { id:'bf-rp-dv-2', tags:['bank_fraud','RAPPORT','hindi_devanagari','MEDIUM'],
    text:"ठीक है, पर पहले अपने supervisor का नाम बताइए... मैं लिखकर रखना चाहती हूँ।" },
  { id:'bf-rp-ta-1', tags:['bank_fraud','RAPPORT','tamil','MEDIUM'],
    text:"சரி கேக்குறேன், ஆனா என் பையன் சொன்னான் எந்த information-ம் verify பண்ணாம சொல்லாதேன்னு... உங்க employee ID என்ன?" },
  { id:'bf-rp-ta-2', tags:['bank_fraud','RAPPORT','tamil','MEDIUM'],
    text:"உங்க supervisor name என்ன? Branch address சொல்லுங்க, நான் எழுதி வச்சுக்கிறேன்." },
  { id:'bf-rp-te-1', tags:['bank_fraud','RAPPORT','telugu','MEDIUM'],
    text:"సరే వింటున్నాను, కానీ నా కొడుకు చెప్పాడు verify చేయకుండా ఏమీ చెప్పొద్దని... మీ employee ID ఏంటి?" },
  { id:'bf-rp-be-1', tags:['bank_fraud','RAPPORT','bengali','MEDIUM'],
    text:"হ্যাঁ শুনছি, কিন্তু আমার ছেলে বলেছিল কিছু verify না করে কিছু বলতে নেই... আপনার employee ID কী?" },
  { id:'bf-rp-en-1', tags:['bank_fraud','RAPPORT','english','MEDIUM'],
    text:"I understand there's an issue, but my son always said verify before sharing anything — can you give me your badge number please?" },
  { id:'bf-rp-en-2', tags:['bank_fraud','RAPPORT','english','MEDIUM'],
    text:"Okay okay, I'm listening. But what is your supervisor's name and direct number? I want to note it down for my records." },
  { id:'bf-rp-en-3', tags:['bank_fraud','RAPPORT','english','MEDIUM'],
    text:"Hold on, let me call my neighbor also. She understands these computer things better than me... can you wait two minutes?" },

  // ══════════════════════════════════════════════════════════════════
  // BANK FRAUD — FINANCIAL (can't find details, stalling hard)
  // ══════════════════════════════════════════════════════════════════
  { id:'bf-fi-hi-1', tags:['bank_fraud','FINANCIAL','hinglish','MEDIUM'],
    text:"Haan account number... ruko mera passbook dhundhti hoon, abhi dusre room mein rakh aaya hai na..." },
  { id:'bf-fi-hi-2', tags:['bank_fraud','FINANCIAL','hinglish','MEDIUM'],
    text:"Yaar mera chashma nahi hai mere paas abhi, number pad nahi ho raha chhota likha hai passbook mein... ek second." },
  { id:'bf-fi-hi-3', tags:['bank_fraud','FINANCIAL','hinglish','MEDIUM'],
    text:"Kaun sa wala account — Canara wala hai ya phir SBI Jan Dhan wala? Mere beta ke naam pe bhi ek hai." },
  { id:'bf-fi-hi-4', tags:['bank_fraud','FINANCIAL','hinglish','MEDIUM'],
    text:"Account number 16 digit ka hai ya 12 digit? ATM card pe bahut saare numbers hain... kaunsa wala?" },
  { id:'bf-fi-hi-5', tags:['bank_fraud','FINANCIAL','hinglish','MEDIUM'],
    text:"Ruko ruko, passbook almirah mein hai... key dhundhna padega pehle, safe mein rakhi hai." },
  { id:'bf-fi-dv-1', tags:['bank_fraud','FINANCIAL','hindi_devanagari','MEDIUM'],
    text:"हाँ account number... रुकिए passbook ढूंढती हूँ, दूसरे कमरे में रखी है अभी..." },
  { id:'bf-fi-dv-2', tags:['bank_fraud','FINANCIAL','hindi_devanagari','MEDIUM'],
    text:"चश्मा नहीं है मेरे पास अभी, नंबर पढ़ने में दिक्कत हो रही है... थोड़ा रुकिए।" },
  { id:'bf-fi-ta-1', tags:['bank_fraud','FINANCIAL','tamil','MEDIUM'],
    text:"சரி account number... ஒரு நிமிஷம் passbook தேடுறேன், அடுத்த room-ல வச்சிருக்கேன்..." },
  { id:'bf-fi-ta-2', tags:['bank_fraud','FINANCIAL','tamil','MEDIUM'],
    text:"கண்ணாடி இல்ல என்கிட்ட, number படிக்க முடியல... ஒரு second." },
  { id:'bf-fi-te-1', tags:['bank_fraud','FINANCIAL','telugu','MEDIUM'],
    text:"account number... ఒక్క నిమిషం passbook వెతుకుతాను, వేరే room లో పెట్టాను..." },
  { id:'bf-fi-be-1', tags:['bank_fraud','FINANCIAL','bengali','MEDIUM'],
    text:"account number... একটু দাঁড়ান passbook খুঁজছি, অন্য room-এ রেখেছি..." },
  { id:'bf-fi-en-1', tags:['bank_fraud','FINANCIAL','english','MEDIUM'],
    text:"Okay, my account number — hold on let me find my passbook, I kept it in the other room just now..." },
  { id:'bf-fi-en-2', tags:['bank_fraud','FINANCIAL','english','MEDIUM'],
    text:"My glasses aren't here, I can't read the small numbers on the passbook... just one moment please." },
  { id:'bf-fi-en-3', tags:['bank_fraud','FINANCIAL','english','MEDIUM'],
    text:"Which account do you need — my Canara Bank one or the SBI Jan Dhan? I have both you see..." },

  // ══════════════════════════════════════════════════════════════════
  // OTP FRAUD — GREETING (scammer claims OTP needed/account issue)
  // ══════════════════════════════════════════════════════════════════
  { id:'otp-gr-hi-1', tags:['otp_fraud','GREETING','hinglish','LOW'],
    text:"Arrey account band ho jayega? Abhi toh sab theek tha... kaun bol raha hai, pehle batao kaun ho?" },
  { id:'otp-gr-hi-2', tags:['otp_fraud','GREETING','hinglish','LOW'],
    text:"OTP chahiye aapko? Lekin pehle batao kaun si bank se call kar rahe ho, yeh number alag lag raha hai." },
  { id:'otp-gr-hi-3', tags:['otp_fraud','GREETING','hinglish','LOW'],
    text:"SBI se bol rahe ho? Ruko main check karti hoon, kal hi toh ATM se paise nikale the... kya hua?" },
  { id:'otp-gr-hi-4', tags:['otp_fraud','GREETING','hinglish','LOW'],
    text:"Account verify karna hai? Accha, lekin mera beta bolta hai phone pe kuch share nahi karna... pehle confirm karo." },
  { id:'otp-gr-hi-5', tags:['otp_fraud','GREETING','hinglish','LOW'],
    text:"Haan bhai sun raha hoon — lekin yeh OTP kya hota hai exactly? Mujhe itna tech samajh nahi aata." },
  { id:'otp-gr-dv-1', tags:['otp_fraud','GREETING','hindi_devanagari','LOW'],
    text:"अकाउंट बंद हो जाएगा? अभी तो सब ठीक था... पहले बताइए कौन बोल रहा है?" },
  { id:'otp-gr-dv-2', tags:['otp_fraud','GREETING','hindi_devanagari','LOW'],
    text:"OTP चाहिए? लेकिन कौन सी बैंक से call कर रहे हो, यह नंबर अलग लग रहा है।" },
  { id:'otp-gr-dv-3', tags:['otp_fraud','GREETING','hindi_devanagari','LOW'],
    text:"SBI से बोल रहे हो? रुकिए check करती हूँ, कल ही तो पैसे निकाले थे..." },
  { id:'otp-gr-ta-1', tags:['otp_fraud','GREETING','tamil','LOW'],
    text:"Account block ஆகிடுமா? நேத்து தான் ATM-ல பணம் எடுத்தேன்... என்னாச்சு?" },
  { id:'otp-gr-ta-2', tags:['otp_fraud','GREETING','tamil','LOW'],
    text:"OTP கேக்குறீங்களா? எந்த bank-ல இருந்து call பண்றீங்க, முதல்ல சொல்லுங்க." },
  { id:'otp-gr-te-1', tags:['otp_fraud','GREETING','telugu','LOW'],
    text:"Account block అవుతుందా? నిన్న ATM నుండి డబ్బు తీసాను... ఏం జరిగింది?" },
  { id:'otp-gr-te-2', tags:['otp_fraud','GREETING','telugu','LOW'],
    text:"OTP కావాలా? ఏ bank నుండి call చేస్తున్నారు, ముందు చెప్పండి." },
  { id:'otp-gr-be-1', tags:['otp_fraud','GREETING','bengali','LOW'],
    text:"Account block হয়ে যাবে? গতকাল তো ATM থেকে টাকা তুলেছি... কী হলো?" },
  { id:'otp-gr-en-1', tags:['otp_fraud','GREETING','english','LOW'],
    text:"My account will get blocked? But I just used it yesterday... who is this calling, which bank office?" },
  { id:'otp-gr-en-2', tags:['otp_fraud','GREETING','english','LOW'],
    text:"You need my OTP? Hold on, first tell me which bank are you from and what is your employee ID?" },
  { id:'otp-gr-en-3', tags:['otp_fraud','GREETING','english','LOW'],
    text:"Account problem? But I received my pension in this account only last week, what happened suddenly?" },
  
  // OTP FRAUD — RAPPORT (scammer building trust)
  { id:'otp-rp-hi-1', tags:['otp_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Accha toh verify karna padega? Lekin mera beta bolta hai phone pe kabhi OTP nahi dena... kya karun?" },
  { id:'otp-rp-hi-2', tags:['otp_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Employee ID diya aapne? Main note kar leta hoon... aur ek baat, branch ka address bhi do please." },
  { id:'otp-rp-hi-3', tags:['otp_fraud','RAPPORT','hinglish','MEDIUM'],
    text:"Verification samajh aaya, lekin main ek kaam karun — apne bank manager ko call karke confirm karun?" },
  { id:'otp-rp-dv-1', tags:['otp_fraud','RAPPORT','hindi_devanagari','MEDIUM'],
    text:"अच्छा verify करना पड़ेगा? लेकिन मेरा बेटा कहता है OTP कभी नहीं देना..." },
  { id:'otp-rp-dv-2', tags:['otp_fraud','RAPPORT','hindi_devanagari','MEDIUM'],
    text:"Branch का address बताइए, मैं कल personally जाकर कर लूँगी verification." },
  { id:'otp-rp-ta-1', tags:['otp_fraud','RAPPORT','tamil','MEDIUM'],
    text:"Verify பண்ணணுமா? ஆனா என் பையன் சொல்றான் OTP யாருக்கும் கொடுக்காதேன்னு..." },
  { id:'otp-rp-te-1', tags:['otp_fraud','RAPPORT','telugu','MEDIUM'],
    text:"Verify చేయాలా? కానీ నా కొడుకు చెప్తాడు OTP ఎవరికీ ఇవ్వకూడదని..." },
  { id:'otp-rp-en-1', tags:['otp_fraud','RAPPORT','english','MEDIUM'],
    text:"Verification is needed? But my son always says never share OTP on phone... should I call him first?" },
  { id:'otp-rp-en-2', tags:['otp_fraud','RAPPORT','english','MEDIUM'],
    text:"Can you tell me the branch address? I can visit personally tomorrow morning for the verification." },

  // ══════════════════════════════════════════════════════════════════
  // OTP FRAUD — EXTRACTION
  // ══════════════════════════════════════════════════════════════════
  { id:'otp-ex-hi-1', tags:['otp_fraud','EXTRACTION','hinglish','MEDIUM'],
    text:"Haan OTP aa gaya... 4 se shuru ho raha hai... ruko ek second chashma lagaati hoon screen ka number chhota hai." },
  { id:'otp-ex-hi-2', tags:['otp_fraud','EXTRACTION','hinglish','MEDIUM'],
    text:"OTP aaya phone mein lekin... yahan do alag alag messages hain, kaun sa wala sahi hai bhai sahab?" },
  { id:'otp-ex-hi-3', tags:['otp_fraud','EXTRACTION','hinglish','HIGH'],
    text:"Arrey OTP toh aa gaya, lekin main confirm karna chahti hoon pehle... aapka direct number kya hai wapas call karun?" },
  { id:'otp-ex-hi-4', tags:['otp_fraud','EXTRACTION','hinglish','MEDIUM'],
    text:"Message aaya hai lekin usmein likha hai share mat karo... phir bhi safe hai batana?" },
  { id:'otp-ex-hi-5', tags:['otp_fraud','EXTRACTION','hinglish','MEDIUM'],
    text:"OTP... 6 digit ka hai ya 4 digit? Screen pe bahut saare numbers aa rahe hain, confuse ho gayi main." },
  { id:'otp-ex-dv-1', tags:['otp_fraud','EXTRACTION','hindi_devanagari','MEDIUM'],
    text:"हाँ OTP आया है... 4 से शुरू हो रहा है... रुकिए चश्मा लगाती हूँ, स्क्रीन पर छोटा लिखा है।" },
  { id:'otp-ex-dv-2', tags:['otp_fraud','EXTRACTION','hindi_devanagari','MEDIUM'],
    text:"मैसेज आया है पर लिखा है किसी को मत बताना... फिर भी बताऊँ?" },
  { id:'otp-ex-ta-1', tags:['otp_fraud','EXTRACTION','tamil','MEDIUM'],
    text:"ஆமா OTP வந்திருக்கு... 4-ல ஆரம்பிக்குது... ஒரு நிமிஷம் கண்ணாடி போடுறேன், screen-ல சின்னதா தெரியுது." },
  { id:'otp-ex-ta-2', tags:['otp_fraud','EXTRACTION','tamil','MEDIUM'],
    text:"OTP வந்திருக்கு ஆனா message-ல share பண்ணாதேன்னு எழுதியிருக்கு... சரியா?" },
  { id:'otp-ex-te-1', tags:['otp_fraud','EXTRACTION','telugu','MEDIUM'],
    text:"అవును OTP వచ్చింది... 4 తో మొదలవుతుంది... ఒక్క నిమిషం, screen చదవడం కష్టంగా ఉంది." },
  { id:'otp-ex-be-1', tags:['otp_fraud','EXTRACTION','bengali','MEDIUM'],
    text:"হ্যাঁ OTP এসেছে... 4 দিয়ে শুরু হচ্ছে... একটু দাঁড়ান, চশমা পরি, screen-এ ছোট লেখা।" },
  { id:'otp-ex-en-1', tags:['otp_fraud','EXTRACTION','english','MEDIUM'],
    text:"Yes the OTP came, it starts with 4... wait let me read it properly, these numbers are so small on my screen." },
  { id:'otp-ex-en-2', tags:['otp_fraud','EXTRACTION','english','MEDIUM'],
    text:"I have the OTP here but there are two messages, which one is it — the SBI one or the other one that came?" },
  { id:'otp-ex-en-3', tags:['otp_fraud','EXTRACTION','english','MEDIUM'],
    text:"The message says don't share OTP with anyone... but you are from the bank only, so it's okay right?" },

  // ══════════════════════════════════════════════════════════════════
  // UPI FRAUD — FINANCIAL
  // ══════════════════════════════════════════════════════════════════
  { id:'upi-fi-hi-1', tags:['upi_fraud','FINANCIAL','hinglish','LOW'],
    text:"UPI ID... mera Paytm wala hai ya GPay wala? Dono use karta hoon, kaun sa chahiye?" },
  { id:'upi-fi-hi-2', tags:['upi_fraud','FINANCIAL','hinglish','MEDIUM'],
    text:"Ek second, UPI ID dhundh raha hoon phone mein... bahut saare apps hain isme, kaunsa check karun?" },
  { id:'upi-fi-hi-3', tags:['upi_fraud','FINANCIAL','hinglish','LOW'],
    text:"UPI se paise bhejne hain? Pehle aapki company ka registration number do, verify karna hai." },
  { id:'upi-fi-ta-1', tags:['upi_fraud','FINANCIAL','tamil','LOW'],
    text:"UPI ID... என்னோட Paytm ID-யா இல்லை GPay-யா? ரெண்டும் use பண்றேன், எது வேணும்?" },
  { id:'upi-fi-te-1', tags:['upi_fraud','FINANCIAL','telugu','LOW'],
    text:"UPI ID... నాది Paytm-దా లేదా GPay-దా? రెండూ వాడతాను, ఏది కావాలి?" },
  { id:'upi-fi-en-1', tags:['upi_fraud','FINANCIAL','english','LOW'],
    text:"Which UPI do you need — I have Paytm, GPay, and PhonePe all linked... which one specifically?" },
  { id:'upi-fi-en-2', tags:['upi_fraud','FINANCIAL','english','LOW'],
    text:"Send money through UPI? Wait, let me first verify your company registration number." },

  // ══════════════════════════════════════════════════════════════════
  // LOTTERY SCAM — GREETING
  // ══════════════════════════════════════════════════════════════════
  { id:'lot-gr-hi-1', tags:['lottery_scam','GREETING','hinglish','LOW'],
    text:"Arrey main jeet gayi sach mein? Kaun sa lucky draw tha yeh, mujhe toh yaad nahi koi form bhara tha?" },
  { id:'lot-gr-hi-2', tags:['lottery_scam','GREETING','hinglish','LOW'],
    text:"Prize kitna hai? Aur claim karne ke liye kya karna padega, koi fee toh nahi hogi na?" },
  { id:'lot-gr-ta-1', tags:['lottery_scam','GREETING','tamil','LOW'],
    text:"ஐயோ நான் win பண்ணேனா? எந்த lucky draw-ல? எனக்கு நினைவே இல்லையே கலந்துக்கிட்டேன்னு." },
  { id:'lot-gr-en-1', tags:['lottery_scam','GREETING','english','LOW'],
    text:"Oh goodness, I actually won something? Which lottery is this, I don't remember entering anything recently?" },
  { id:'lot-gr-en-2', tags:['lottery_scam','GREETING','english','LOW'],
    text:"Prize money? Really? But I never registered for any lucky draw... are you sure it's my number?" },
  { id:'lot-rp-hi-1', tags:['lottery_scam','RAPPORT','hinglish','MEDIUM'],
    text:"Claim karne ke liye koi tax ya fee pay karni padegi kya? Mera beta bolta hai pehle confirm karo." },
  { id:'lot-rp-en-1', tags:['lottery_scam','RAPPORT','english','MEDIUM'],
    text:"To claim it do I need to pay any tax or registration fee? My son said never pay anything upfront for prizes." },

  // ══════════════════════════════════════════════════════════════════
  // JOB SCAM — GREETING
  // ══════════════════════════════════════════════════════════════════
  { id:'job-gr-hi-1', tags:['job_scam','GREETING','hinglish','LOW'],
    text:"Oh job offer hai! Kaun si company se bol rahe ho bhai? Mera resume kahan se mila aapko?" },
  { id:'job-gr-hi-2', tags:['job_scam','GREETING','hinglish','LOW'],
    text:"Seriously job offer? Location kahan hai, work from home hai ya office? CTC kitna hai?" },
  { id:'job-gr-hi-3', tags:['job_scam','GREETING','hinglish','LOW'],
    text:"Job ke liye call aa raha hai? LinkedIn pe apply kiya tha kya maine? Company naam batao pehle." },
  { id:'job-rp-hi-1', tags:['job_scam','RAPPORT','hinglish','MEDIUM'],
    text:"Registration fee kyun lag rahi hai? Main kisi bhi company ko pehle fee nahi deta bhai, pehle offer letter bhejo." },
  { id:'job-rp-hi-2', tags:['job_scam','RAPPORT','hinglish','MEDIUM'],
    text:"Training fee? Genuine companies mein toh free training hoti hai bhai... aap sure ho yeh legit hai?" },
  { id:'job-gr-en-1', tags:['job_scam','GREETING','english','LOW'],
    text:"Oh really a job offer? Which company is this and how did you get my number? I applied to so many places." },
  { id:'job-gr-en-2', tags:['job_scam','GREETING','english','LOW'],
    text:"Job opportunity? What is the role and what is the CTC package? Is it work from home or office based?" },
  { id:'job-rp-en-1', tags:['job_scam','RAPPORT','english','MEDIUM'],
    text:"Registration fee for a job? That doesn't sound right to me... can you send the official offer letter first?" },

  // ══════════════════════════════════════════════════════════════════
  // AGGRESSIVE RESPONSES (when scammer is shouting/rude)
  // ══════════════════════════════════════════════════════════════════
  { id:'agg-hi-1', tags:['any','any','hinglish','HIGH'],
    text:"Arrey itna kyun chilla rahe ho... main cooperative hoon, samajhne ki koshish kar rahi hoon na mein bhi." },
  { id:'agg-hi-2', tags:['any','any','hinglish','HIGH'],
    text:"Please aise mat bolo, main ek akeli aurat hoon ghar mein, bahut darr lag raha hai mujhe..." },
  { id:'agg-hi-3', tags:['any','any','hinglish','HIGH'],
    text:"Itna gussa kyun kar rahe ho bhai? Main help karne ki koshish kar rahi hoon... thoda dhire bolo please." },
  { id:'agg-dv-1', tags:['any','any','hindi_devanagari','HIGH'],
    text:"इतना क्यों चिल्ला रहे हो... मैं समझने की कोशिश कर रही हूँ, please aise mat bolo." },
  { id:'agg-dv-2', tags:['any','any','hindi_devanagari','HIGH'],
    text:"कृपया धीरे बोलिए, मुझे डर लग रहा है... मैं अकेली हूँ घर में।" },
  { id:'agg-ta-1', tags:['any','any','tamil','HIGH'],
    text:"இவ்வளவு ஏன் கத்துறீங்க... நான் புரிஞ்சுக்க try பண்றேன், please இப்படி பேசாதீங்க." },
  { id:'agg-ta-2', tags:['any','any','tamil','HIGH'],
    text:"மெதுவா பேசுங்க please, பயமா இருக்கு... தனியா இருக்கேன் வீட்டுல." },
  { id:'agg-te-1', tags:['any','any','telugu','HIGH'],
    text:"ఎందుకు అరుస్తున్నారు... అర్థం చేసుకోవడానికి ప్రయత్నిస్తున్నాను, please ఇలా మాట్లాడకండి." },
  { id:'agg-be-1', tags:['any','any','bengali','HIGH'],
    text:"এত চিৎকার কেন করছেন... বোঝার চেষ্টা করছি তো, please এভাবে বলবেন না।" },
  { id:'agg-en-1', tags:['any','any','english','HIGH'],
    text:"Please don't shout, I'm just trying to understand... I'm an elderly woman here alone, this is very scary." },
  { id:'agg-en-2', tags:['any','any','english','HIGH'],
    text:"Why are you speaking so aggressively? I want to cooperate but you're frightening me... please speak normally." },

  // ══════════════════════════════════════════════════════════════════
  // CLOSING STAGE (battery dying, need callback)
  // ══════════════════════════════════════════════════════════════════
  { id:'cl-hi-1', tags:['any','CLOSING','hinglish','any'],
    text:"Yaar phone ki battery 3% reh gayi hai, aap apna direct number do main beta se baat karke call back karta hoon." },
  { id:'cl-hi-2', tags:['any','CLOSING','hinglish','any'],
    text:"Main sab note kar leta hoon pehle — aapka poora naam, employee ID, aur supervisor ka number bhi do please." },
  { id:'cl-hi-3', tags:['any','CLOSING','hinglish','any'],
    text:"Bahut der ho gayi baat karte karte... kal morning mein bank jaake personally karungi, supervisor ka number do." },
  { id:'cl-dv-1', tags:['any','CLOSING','hindi_devanagari','any'],
    text:"फोन की battery 3% रह गई, अपना direct number दो, मैं बेटे से बात करके call back करती हूँ।" },
  { id:'cl-dv-2', tags:['any','CLOSING','hindi_devanagari','any'],
    text:"बहुत देर हो गई... कल सुबह branch जाके personally करूँगी, supervisor का number दीजिए।" },
  { id:'cl-ta-1', tags:['any','CLOSING','tamil','any'],
    text:"Phone battery 3% தான் இருக்கு, உங்க number கொடுங்க, பையன் கிட்ட பேசிட்டு call back பண்றேன்." },
  { id:'cl-te-1', tags:['any','CLOSING','telugu','any'],
    text:"Phone battery 3% మాత్రమే ఉంది, మీ number ఇవ్వండి, కొడుకుతో మాట్లాడి call back చేస్తాను." },
  { id:'cl-be-1', tags:['any','CLOSING','bengali','any'],
    text:"Phone-এর battery 3% বাকি, আপনার number দিন, ছেলের সাথে কথা বলে call back করি।" },
  { id:'cl-en-1', tags:['any','CLOSING','english','any'],
    text:"My phone is almost dead now, can you give me your direct callback number so I can ring you after I speak to my son?" },
  { id:'cl-en-2', tags:['any','CLOSING','english','any'],
    text:"Let me note down everything first — your full name, employee ID, branch address, and supervisor's number please." },

  // ══════════════════════════════════════════════════════════════════
  // GENERIC (fallback for any situation)
  // ══════════════════════════════════════════════════════════════════
  { id:'gen-hi-1', tags:['generic','any','hinglish','any'],
    text:"Ruko ek second, main samajhne ki koshish kar rahi hoon... yeh sab bahut achanak ho raha hai na." },
  { id:'gen-hi-2', tags:['generic','any','hinglish','any'],
    text:"Haan haan, sab sun rahi hoon... lekin mera beta ghar par nahi hai abhi, kya main usse bula lun?" },
  { id:'gen-hi-3', tags:['generic','any','hinglish','any'],
    text:"Pehle yeh bataiye ki aap exactly kaun hain aur yeh number se kyon call aa rahi hai, bank ka number alag tha." },
  { id:'gen-hi-4', tags:['generic','any','hinglish','any'],
    text:"Achha achha... lekin mujhe thoda time chahiye samajhne ke liye, itni jaldi mein decision nahi le sakti." },
  { id:'gen-dv-1', tags:['generic','any','hindi_devanagari','any'],
    text:"रुकिए, मैं समझने की कोशिश कर रही हूँ... यह सब बहुत अचानक हो रहा है।" },
  { id:'gen-dv-2', tags:['generic','any','hindi_devanagari','any'],
    text:"हाँ हाँ सुन रही हूँ... पर मेरा बेटा घर पर नहीं है, क्या उसे बुला लूँ?" },
  { id:'gen-ta-1', tags:['generic','any','tamil','any'],
    text:"ஒரு நிமிஷம், புரிஞ்சுக்க try பண்றேன்... இப்படி திடீர்னு நடக்குதே, என்ன ஆச்சு?" },
  { id:'gen-ta-2', tags:['generic','any','tamil','any'],
    text:"ஆமா ஆமா கேக்குறேன்... ஆனா என் பையன் வீட்ல இல்ல, அவனை கூப்பிடலாமா?" },
  { id:'gen-te-1', tags:['generic','any','telugu','any'],
    text:"ఒక్క నిమిషం, అర్థం చేసుకోవడానికి ప్రయత్నిస్తున్నాను... ఇది చాలా అకస్మాత్తుగా జరుగుతుంది." },
  { id:'gen-te-2', tags:['generic','any','telugu','any'],
    text:"అవును అవును వింటున్నాను... కానీ నా కొడుకు ఇంట్లో లేడు, అతన్ని పిలవమంటారా?" },
  { id:'gen-be-1', tags:['generic','any','bengali','any'],
    text:"একটু দাঁড়ান, বোঝার চেষ্টা করছি... এটা হঠাৎ করে হচ্ছে কেন?" },
  { id:'gen-be-2', tags:['generic','any','bengali','any'],
    text:"হ্যাঁ হ্যাঁ শুনছি... কিন্তু আমার ছেলে বাড়িতে নেই, ওকে ডাকি?" },
  { id:'gen-gu-1', tags:['generic','any','gujarati','any'],
    text:"એક ક્ષણ રહો, સમજવાની કોशિश કરું છું... આ બધું અચાનક કેમ થઈ રહ્યું છે?" },
  { id:'gen-kn-1', tags:['generic','any','kannada','any'],
    text:"ಒಂದು ನಿಮಿಷ, ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಪ್ರಯತ್ನಿಸುತ್ತಿದ್ದೇನೆ... ಇದು ಇಷ್ಟು ಹಠಾತ್ ಆಗಿ ಯಾಕೆ ಆಗುತ್ತಿದೆ?" },
  { id:'gen-ml-1', tags:['generic','any','malayalam','any'],
    text:"ഒരു നിമിഷം, മനസ്സിലാക്കാൻ ശ്രമിക്കുന്നു... ഇത് ഇത്ര പെട്ടെന്ന് എന്തുകൊണ്ട് സംഭവിക്കുന്നു?" },
  { id:'gen-en-1', tags:['generic','any','english','any'],
    text:"Wait, let me understand what's happening here... this has come very suddenly, can you explain from the beginning?" },
  { id:'gen-en-2', tags:['generic','any','english','any'],
    text:"Hold on, I need a moment... my son handles all the banking matters, should I call him first?" },
  { id:'gen-en-3', tags:['generic','any','english','any'],
    text:"Yes yes, I'm listening... but this is all very confusing for me. Can you speak more slowly please?" },
];

/**
 * Get a smart contextual fallback that matches the situation
 * @param {string} scamType - Type of scam detected
 * @param {string} stage - Current conversation stage
 * @param {string} language - Detected language
 * @param {string} emotion - Emotion level (LOW/MEDIUM/HIGH)
 * @param {Set} usedIds - Set of already used fallback IDs
 * @returns {Object} Selected fallback with id and text
 */
function getSmartFallback(scamType, stage, language, emotion, usedIds) {
  // Priority 1: Exact match (scamType + stage + language)
  // Priority 2: Partial match (stage + language)
  // Priority 3: Emotion match (HIGH emotion gets aggressive responses)
  // Priority 4: Language match (generic + language)
  // Priority 5: Any available generic

  const candidates = POOL.filter(f => {
    if (usedIds && usedIds.has(f.id)) return false;
    return true;
  });

  // CRITICAL FIX: First, filter to ONLY language-matched candidates
  // Language mirroring is NON-NEGOTIABLE
  const langCandidates = candidates.filter(f => f.tags.includes(language));
  
  // Use language-filtered pool if we have any matches, otherwise fall back to all
  const pool = langCandidates.length > 0 ? langCandidates : candidates;

  // Score each candidate
  const scored = pool.map(f => {
    let score = 0;
    const tags = f.tags;
    
    // Exact scam type match (+10)
    if (tags.includes(scamType)) score += 10;
    // Stage match (+5)
    if (tags.includes(stage)) score += 5;
    // Generic stage is ok but lower (+2)
    if (tags.includes('any') && !tags.includes(stage)) score += 2;
    // Language match (+20 - HIGHEST priority for mirroring — NON-NEGOTIABLE)
    if (tags.includes(language)) score += 20;
    // Emotion match when HIGH (+8)
    if (emotion === 'HIGH' && tags.includes('HIGH')) score += 8;
    // Generic fallback bonus (+1)
    if (tags.includes('generic')) score += 1;
    
    return { ...f, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Get top candidates (within 3 points of best score for variety)
  const topScore = scored[0]?.score || 0;
  const topCandidates = scored.filter(s => s.score >= topScore - 3);

  // Random selection from top candidates
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];

  if (selected) {
    return { id: selected.id, text: selected.text };
  }

  // Ultimate fallback — MUST match language
  const langFallbacks = {
    hinglish: "Ruko ruko, samajh nahi aaya... phir se batao please?",
    hindi_devanagari: "रुकिए, समझ नहीं आया... फिर से बताएंगे?",
    tamil: "ஒரு நிமிஷம், புரியல... மீண்டும் சொல்லுங்க?",
    telugu: "ఒక్క నిమిషం, అర్థం కాలేదు... మళ్ళీ చెప్పండి?",
    bengali: "একটু দাঁড়ান, বুঝলাম না... আবার বলুন?",
    gujarati: "એક ક્ષણ, સમજાયું નહીં... ફરીથી કહો?",
    kannada: "ಒಂದು ನಿಮಿಷ, ಅರ್ಥವಾಗಲಿಲ್ಲ... ಮತ್ತೆ ಹೇಳಿ?",
    malayalam: "ഒരു നിമിഷം, മനസ്സിലായില്ല... വീണ്ടും പറയൂ?",
    marathi: "अरे, समजलं नाही... परत सांगाल का?",
    english: "Wait, I didn't quite understand... can you explain again please?"
  };
  
  return {
    id: 'ultimate-fallback',
    text: langFallbacks[language] || langFallbacks.hinglish
  };
}

module.exports = { POOL, getSmartFallback };
