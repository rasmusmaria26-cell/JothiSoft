export interface NakshatraInfo {
  nameEn: string;
  nameTa: string;
  rulingPlanet: string;
  rulingPlanetTa: string;
  deity: string;
  deityTa: string;
  symbol: string;
  symbolTa: string;
  luckyNumber: string;
  luckyColor: string;
  luckyColorTa: string;
  luckyDay: string;
  luckyDayTa: string;
  gemstone: string;
  gemstoneTa: string;
  career: { en: string; ta: string };
  love: { en: string; ta: string };
  health: { en: string; ta: string };
  finance: { en: string; ta: string };
  personality: { en: string; ta: string };
}

export const NAKSHATRA_DATA: Record<string, NakshatraInfo> = {
  "Ashwini": {
    nameEn: "Ashwini",
    nameTa: "அஸ்வினி",
    rulingPlanet: "Ketu",
    rulingPlanetTa: "கேது",
    deity: "Ashwini Kumaras",
    deityTa: "அஸ்வினி குமாரர்கள்",
    symbol: "Horse's Head",
    symbolTa: "குதிரை தலை",
    luckyNumber: "7",
    luckyColor: "Light Yellow",
    luckyColorTa: "இளமஞ்சள்",
    luckyDay: "Tuesday",
    luckyDayTa: "செவ்வாய்க்கிழமை",
    gemstone: "Cat's Eye",
    gemstoneTa: "வைடூரியம்",
    career: {
      en: "Suitable fields include medicine, defense, transportation, and entrepreneurial ventures. They excel in fast-paced environments that require quick decision-making and leadership skills. Innovation and independent roles bring them the highest success.",
      ta: "மருத்துவம், பாதுகாப்புத்துறை, போக்குவரத்து மற்றும் சுயதொழில் ஆகியவை இவர்களுக்கு சாதகமான துறைகளாகும். விரைவான முடிவெடுக்கும் திறன் மற்றும் தலைமைப்பண்பு தேவைப்படும் சூழல்களில் இவர்கள் சிறந்து விளங்குவார்கள். புதிய கண்டுபிடிப்புகள் மற்றும் சுதந்திரமான பணிகள் இவர்களுக்கு பெரும் வெற்றியைத் தரும்."
    },
    love: {
      en: "Passionate and loyal in relationships, but can be impulsive or quick-tempered. They seek adventurous partners who respect their need for freedom and personal space. Mutual trust and understanding ensure long-term harmony.",
      ta: "உறவுகளில் மிகுந்த பாசமும் விசுவாசமும் கொண்டவர்கள், ஆனால் சில நேரங்களில் அவசரப்பட்டு முடிவெடுப்பார்கள். தங்களின் சுதந்திரத்தை மதிக்கும் மற்றும் சாகச விரும்பியான துணையை இவர்கள் தேடுவார்கள். பரஸ்பர நம்பிக்கையும் புரிதலும் இவர்களின் நீண்ட கால தம்பத்திய வாழ்க்கைக்கு வழிவகுக்கும்."
    },
    health: {
      en: "Generally possess robust health and vital energy. However, they are prone to headaches, insomnia, and minor injuries due to impatience. Regular rest and stress-management practices are essential for their well-being.",
      ta: "பொதுவாக இவர்கள் நல்ல ஆரோக்கியமும் அதிக உயிர் ஆற்றலும் கொண்டிருப்பார்கள். எனினும், அவசர குணம் காரணமாக தலைவலி, தூக்கமின்மை மற்றும் சிறிய காயங்கள் ஏற்பட வாய்ப்புகள் உள்ளன. சீரான ஓய்வும் மன அழுத்த மேலாண்மையும் இவர்களின் ஆரோக்கியத்திற்கு இன்றியமையாததாகும்."
    },
    finance: {
      en: "Good at earning money through innovative ideas, but tend to spend impulsively. Financial stability comes later in life as they learn the value of strategic budgeting. Investments in real estate and short-term ventures can be profitable.",
      ta: "புதிய யோசனைகள் மூலம் பணம் சம்பாதிப்பதில் வல்லவர்கள், ஆனால் அவசரமாக செலவு செய்யும் குணம் கொண்டவர்கள். திட்டமிட்ட சேமிப்பை கற்றுக்கொள்ளும்போது வாழ்க்கையின் பிற்பகுதியில் நிதி ஸ்திரத்தன்மை ஏற்படும். ரியல் எஸ்டேட் மற்றும் குறுகிய கால முதலீடுகள் இவர்களுக்கு லாபம் தரும்."
    },
    personality: {
      en: "Energetic, pioneering, and dynamic individuals who love adventure and speed. They are enthusiastic learners but can sometimes become stubborn or restless. Their magnetic personality attracts friends and followers naturally.",
      ta: "சுறுசுறுப்பும், ஆற்றலும், சாகச விரும்பும் குணமும் கொண்டவர்கள். புதிய விஷயங்களை கற்றுக்கொள்வதில் ஆர்வம் காட்டுவார்கள், ஆனால் சில நேரங்களில் பிடிவாதமாகவோ அல்லது பொறுமையற்றவராகவோ மாறக்கூடும். இவர்களின் வசீகரமான குணம் மற்றவர்களை எளிதில் ஈர்க்கும்."
    }
  },
  "Bharani": {
    nameEn: "Bharani",
    nameTa: "பரணி",
    rulingPlanet: "Venus",
    rulingPlanetTa: "சுக்கிரன்",
    deity: "Yama",
    deityTa: "யமன்",
    symbol: "Yoni (Vagina)",
    symbolTa: "யோனி",
    luckyNumber: "9",
    luckyColor: "Dark Red",
    luckyColorTa: "அட சிவப்பு",
    luckyDay: "Friday",
    luckyDayTa: "வெள்ளிக்கிழமை",
    gemstone: "Diamond",
    gemstoneTa: "வைரம்",
    career: {
      en: "Thrive in arts, entertainment, judiciary, hospitality, and creative industries. They possess a strong sense of justice and creative brilliance that aids professional growth. Capable of handling immense workplace transformation and pressure.",
      ta: "கலை, பொழுதுபோக்கு, நீதித்துறை, விருந்துபசாரம் மற்றும் படைப்புத் துறைகளில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் நியாய உணர்வும் ஆக்கபூர்வமான திறனும் தொழில் வளர்ச்சிக்கு பெரிதும் உதவும். பணியிடத்தில் ஏற்படும் பெரிய மாற்றங்களையும் அழுத்தங்களையும் தாங்கும் திறன் இவர்களுக்கு உண்டு."
    },
    love: {
      en: "Intense, deeply emotional, and protective of their loved ones. They experience transformational relationships and seek absolute commitment from their partners. Can be possessive, requiring open communication to maintain peace.",
      ta: "உறவுகளில் தீவிரமான உணர்வுகளையும், அன்பானவர்களிடம் மிகுந்த பாதுகாப்புணர்வையும் கொண்டிருப்பார்கள். இவர்கள் தங்களின் துணையிடமிருந்து முழுமையான அர்ப்பணிப்பை எதிர்பார்ப்பார்கள். சில நேரங்களில் அதிக ஆதிக்கம் செலுத்த நினைப்பதால், அமைதியைப்பேண திறந்த மனதுடன் பேசுவது அவசியம்."
    },
    health: {
      en: "Prone to issues related to reproductive organs, lower abdomen, and vision. They have high endurance but must avoid extreme emotional stress to prevent physical ailments. Balanced nutrition and hydration are vital.",
      ta: "இனப்பெருக்க உறுப்புகள், கீழ் வயிறு மற்றும் கண் பார்வை தொடர்பான பிரச்சனைகள் ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் அதிக சகிப்புத்தன்மை கொண்டவர்கள் என்றாலும், உடல் நலக்குறைவைத் தவிர்க்க அதிகப்படியான மன அழுத்தத்தைத் தவிர்க்க வேண்டும். சீரான உணவும் நீர்ச்சத்தும் முக்கியம்."
    },
    finance: {
      en: "Blessed with steady wealth accumulation through luxury items, creative pursuits, or inheritance. They have a lavish lifestyle but know how to manage resources when challenged. Wise long-term financial plans bring immense stability.",
      ta: "ஆடம்பரப் பொருட்கள், கலைப்பணிகள் அல்லது பூர்வீக சொத்துக்கள் மூலம் நிலையான செல்வம் சேரும் யோகம் உண்டு. ஆடம்பரமாக வாழ விரும்பினாலும், சவாலான காலங்களில் வளங்களை எவ்வாறு நிர்வகிப்பது என்பதை அறிவர். புத்திசாலித்தனமான நீண்ட கால நிதி திட்டங்கள் இவர்களுக்கு ஸ்திரத்தன்மையை தரும்."
    },
    personality: {
      en: "Courageous, determined, and deeply resilient individuals who undergo major life changes. They hold strong moral opinions and are not easily swayed by others' judgment. Honesty and transparency define their inner nature.",
      ta: "துணிச்சலும், மன உறுதியும், வாழ்க்கையின் சவால்களை எதிர்கொள்ளும் அசாத்திய மீளெழுந்து வரும் திறனும் கொண்டவர்கள். இவர்கள் தங்களின் தார்மீகக் கருத்துக்களில் உறுதியாக இருப்பார்கள், மற்றவர்களின் விமர்சனங்களால் எளிதில் மாறமாட்டார்கள். நேர்மையும் வெளிப்படைத்தன்மையும் இவர்களின் இயல்பாகும்."
    }
  },
  "Krittika": {
    nameEn: "Krittika",
    nameTa: "கார்த்திகை",
    rulingPlanet: "Sun",
    rulingPlanetTa: "சூரியன்",
    deity: "Agni",
    deityTa: "அக்னி",
    symbol: "Razor or Flame",
    symbolTa: "கத்தி அல்லது சுடர்",
    luckyNumber: "1",
    luckyColor: "White",
    luckyColorTa: "வெள்ளை",
    luckyDay: "Sunday",
    luckyDayTa: "ஞாயிற்றுக்கிழமை",
    gemstone: "Ruby",
    gemstoneTa: "மாணிக்கம்",
    career: {
      en: "Excel in military services, leadership roles, engineering, and politics. Their fiery energy enables them to manage complex projects and enforce authority effectively. Teaching and administration roles also bring them recognition.",
      ta: "ராணுவம், தலைமைப் பொறுப்புகள், பொறியியல் மற்றும் அரசியல் ஆகிய துறைகளில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் நெருப்பு போன்ற ஆற்றல் சிக்கலான திட்டங்களை நிர்வகிக்கவும் அதிகாரத்தை நிலைநாட்டவும் உதவும். கற்பித்தல் மற்றும் நிர்வாகப் பணிகளும் இவர்களுக்கு நல்ல அங்கீகாரத்தைத் தரும்."
    },
    love: {
      en: "They are proud and protective, often taking the dominant role in romantic relationships. While honest and direct, they must learn to control their sharp speech to avoid misunderstandings with partners. Long-term loyalty is a hallmark of their bond.",
      ta: "இவர்கள் தங்களின் காதல் உறவுகளில் பெருமிதமும் பாதுகாப்புணர்வும் கொண்டவர்கள், பெரும்பாலும் ஆதிக்கம் செலுத்தும் பாத்திரத்தை வகிக்கிறார்கள். நேர்மையும் நேரிடைத் தன்மையும் கொண்ட இவர்கள், துணையுடன் கருத்து வேறுபாடுகளைத் தவிர்க்க தங்களின் கூர்மையான பேச்சைக் கட்டுப்படுத்தக் கற்றுக்கொள்ள வேண்டும். நீண்ட கால விசுவாசம் இவர்களின் பந்தத்தின் அடையாளமாகும்."
    },
    health: {
      en: "Prone to inflammatory fevers, throat issues, and headaches due to excess bodily heat. They should consume cooling foods and maintain proper digestive care. Engaging in physical outdoor activities preserves their stamina.",
      ta: "உடல் வெப்பம் காரணமாக அழற்சி காய்ச்சல், தொண்டை பிரச்சனைகள் மற்றும் தலைவலி ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் குளிர்ச்சியான உணவுகளை உட்கொள்ள வேண்டும் மற்றும் முறையான செரிமானப் பராமரிப்பைப் பேண வேண்டும். வெளிப்புற உடற்பயிற்சிகளில் ஈடுபடுவது இவர்களின் ஆற்றலைக் காக்கும்."
    },
    finance: {
      en: "Fluctuating financial patterns are common in youth, but they gain considerable wealth through independent work and government favors later. They must avoid lending money without legal documentation. Commercial property yields good growth.",
      ta: "இளமைப் பருவத்தில் நிதி நிலையில் ஏற்ற இறக்கங்கள் பொதுவானது, ஆனால் பின்னர் சுயதொழில் மற்றும் அரசு ஆதரவு மூலம் கணிசமான செல்வத்தைப் பெறுகிறார்கள். சட்டபூர்வமான ஆவணங்கள் இல்லாமல் பணம் கடன் கொடுப்பதைத் தவிர்க்க வேண்டும். வணிக சொத்துக்கள் நல்ல வளர்ச்சியைத் தரும்."
    },
    personality: {
      en: "Proud, sharp-witted, and highly ambitious individuals with a commanding aura. They possess high critical reasoning skills but must avoid excessive harshness in communication. They are deeply protective of their honor.",
      ta: "கம்பீரமான ஆளுமைத் திறன் கொண்ட பெருமை, கூர்மையான அறிவு மற்றும் லட்சியம் கொண்டவர்கள். இவர்களிடம் சிறந்த பகுத்தறிவு திறன் உள்ளது, ஆனால் பேச்சில் அதிகப்படியான கடுமையான தன்மையைத் தவிர்க்க வேண்டும். தங்களின் கௌரவத்தை பாதுகாப்பதில் மிகுந்த அக்கறை காட்டுவார்கள்."
    }
  },
  "Rohini": {
    nameEn: "Rohini",
    nameTa: "ரோகிணி",
    rulingPlanet: "Moon",
    rulingPlanetTa: "சந்திரன்",
    deity: "Brahma / Prajapati",
    deityTa: "பிரம்மா / பிரஜாபதி",
    symbol: "Chariot or Cart",
    symbolTa: "தேர்",
    luckyNumber: "2",
    luckyColor: "White",
    luckyColorTa: "வெள்ளை",
    luckyDay: "Monday",
    luckyDayTa: "திங்கட்கிழமை",
    gemstone: "Pearl",
    gemstoneTa: "முத்து",
    career: {
      en: "Highly successful in creative arts, fashion, agriculture, and hospitality. Their charming nature helps them excel in client-facing roles and public relations. Business ventures involving luxury goods or liquids also prosper.",
      ta: "படைப்புக் கலைகள், ஆடை வடிவமைப்பு, விவசாயம் மற்றும் விருந்தோம்பல் துறைகளில் இவர்கள் பெரும் வெற்றி பெறுவார்கள். இவர்களின் வசீகரமான குணம் வாடிக்கையாளர் தொடர்பு மற்றும் மக்கள் தொடர்பு பணிகளில் சிறந்து விளங்க உதவும். ஆடம்பரப் பொருட்கள் அல்லது திரவப் பொருட்கள் சார்ந்த வணிகம் இவர்களுக்கு நலம் தரும்."
    },
    love: {
      en: "Deeply romantic, nurturing, and devoted to family life. They seek physical attraction and emotional security in abundance from their spouse. They build beautiful homes and cherish long evenings of togetherness and emotional sharing.",
      ta: "மிகுந்த காதல் உணர்வு, அரவணைப்பு மற்றும் குடும்ப வாழ்க்கையில் அர்ப்பணிப்பு கொண்டவர்கள். இவர்கள் தங்களின் துணையிடமிருந்து உடல் ரீதியான ஈர்ப்பையும் உணர்ச்சி ரீதியான பாதுகாப்பையும் மிகுதியாக எதிர்பார்ப்பார்கள். இவர்கள் அழகான இல்லங்களை உருவாக்கி, துணையுடன் செலவிடும் மாலை நேரங்களை நேசிப்பார்கள்."
    },
    health: {
      en: "Vulnerable to respiratory congestion, fluid retention, and digestive fluctuations. Their physical well-being is heavily dependent on emotional balance. Adopting a light diet and regular exercise avoids weight fluctuations.",
      ta: "சுவாசக் கோளாறுகள், நீர் தேங்குதல் மற்றும் செரிமான ஏற்ற இறக்கங்களால் பாதிக்கப்படலாம். இவர்களின் உடல் நலம் உணர்ச்சி சமநிலையை பெரிதும் சார்ந்துள்ளது. லேசான உணவைக் கடைப்பிடிப்பதும், வழக்கமான உடற்பயிற்சியும் உடல் எடை மாறுபாடுகளைத் தவிர்க்கும்."
    },
    finance: {
      en: "Highly fortunate with material assets, fine cars, and high-value residential properties. Their wealth grows via family support, commercial trading, and creative business channels. Emotional spending should be controlled to maximize asset expansion.",
      ta: "பொருள் சொத்துக்கள், நல்ல வாகனங்கள் மற்றும் மதிப்புமிக்க குடியிருப்பு சொத்துக்களுடன் மிகவும் அதிர்ஷ்டசாலிகள். குடும்ப ஆதரவு, வணிக வர்த்தகம் மற்றும் ஆக்கபூர்வமான வணிக சேனல்கள் மூலம் இவர்களின் செல்வம் வளர்கிறது. சொத்து விரிவாக்கத்தை அதிகரிக்க உணர்ச்சிவசப்பட்டு செலவழிப்பதைக் கட்டுப்படுத்த வேண்டும்."
    },
    personality: {
      en: "Gentle, remarkably attractive, and highly elegant individuals with fine artistic tastes. They possess a calm demeanor but can become emotionally vulnerable or deeply sensitive at times. They love fine dressing and social elegance.",
      ta: "மென்மையான, வியக்கத்தக்க கவர்ச்சியான மற்றும் சிறந்த கலை சுவை கொண்ட நேர்த்தியான நபர்கள். இவர்கள் அமைதியான நடத்தை கொண்டவர்கள் ஆனால் சில நேரங்களில் உணர்ச்சிவசப்படக்கூடியவர்களாக அல்லது அதிக உணர்திறன் உடையவர்களாக மாறக்கூடும். நல்ல ஆடைகள் மற்றும் சமூக நேர்த்தியை விரும்புவார்கள்."
    }
  },
  "Mrigashira": {
    nameEn: "Mrigashira",
    nameTa: "மிருகசீரிடம்",
    rulingPlanet: "Mars",
    rulingPlanetTa: "செவ்வாய்",
    deity: "Soma",
    deityTa: "சோமன் / சந்திரன்",
    symbol: "Deer's Head",
    symbolTa: "மான் தலை",
    luckyNumber: "5",
    luckyColor: "Silver Grey",
    luckyColorTa: "வெள்ளி சாம்பல்",
    luckyDay: "Tuesday",
    luckyDayTa: "செவ்வாய்க்கிழமை",
    gemstone: "Coral",
    gemstoneTa: "பவளம்",
    career: {
      en: "Ideal careers lie in research, investigation, journalism, and software development. Their curious mind helps them discover hidden patterns and excel in analytical paths. Travel-related businesses or engineering also suit them well.",
      ta: "ஆராய்ச்சி, புலனாய்வு, பத்திரிகைத்துறை மற்றும் மென்பொருள் மேம்பாடு ஆகியவை இவர்களுக்கு ஏற்ற துறைகளாகும். இவர்களின் தேடல் குணம் மறைந்திருக்கும் உண்மைகளைக் கண்டறியவும் பகுப்பாய்வுப் பாதைகளில் சிறந்து விளங்கவும் உதவும். பயணம் சார்ந்த வணிகம் அல்லது பொறியியல் துறையும் இவர்களுக்குப் பொருந்தும்."
    },
    love: {
      en: "Affectionate, communicative, and playful lovers who enjoy intellectual compatibility. They appreciate relationships that involve frequent travel and exciting, exploratory discussions. Can be fickle if their mind is not constantly engaged.",
      ta: "அன்பான, நல்ல தகவல் தொடர்பு கொண்ட மற்றும் அறிவுசார்ந்த பொருத்தத்தை விரும்பும் விளையாட்டுத்தனமான காதலர்கள். அடிக்கடி பயணம் மற்றும் அற்புதமான விவாதங்களை உள்ளடக்கிய உறவுகளை இவர்கள் பாராட்டுவார்கள். இவர்களின் மனம் தொடர்ந்து ஈர்க்கப்படாவிட்டால் சலிப்படையக்கூடும்."
    },
    health: {
      en: "Prone to skin allergies, nerve sensitivities, and minor vocal infections. Their restless brain requires high mental relaxation to avoid insomnia and nervous exhaustion. Regular outdoor walks and meditation are deeply restorative.",
      ta: "தோல் ஒவ்வாமை, நரம்பு உணர்திறன் மற்றும் சிறிய குரல் தொற்று நோய்களுக்கு ஆளாக நேரிடலாம். இவர்களின் ஓய்வில்லாத மூளை தூக்கமின்மை மற்றும் நரம்பு சோர்வைத் தவிர்க்க அதிக மன அமைதி தேவைப்படுகிறது. வழக்கமான நடைபயிற்சி மற்றும் தியானம் இவர்களுக்கு புத்துயிர் அளிக்கும்."
    },
    finance: {
      en: "They possess high capacity to earn through diverse streams like trading, investments, and consulting roles. Their sharp intellect identifies early stock market trends easily. Setting aside liquid capital safeguards them during market turns.",
      ta: "வர்த்தகம், முதலீடுகள் மற்றும் ஆலோசனைப் பொறுப்புகள் போன்ற பல்வேறு வழிகளில் சம்பாதிக்கும் அதிக ஆற்றல் இவர்களிடம் உள்ளது. இவர்களின் கூர்மையான அறிவு பங்குச் சந்தை போக்குகளை எளிதில் கண்டறியும். திரவ மூலதனத்தை ஒதுக்கி வைப்பது சந்தை மாற்றங்களின் போது இவர்களைப் பாதுகாக்கும்."
    },
    personality: {
      en: "Curious, highly intellectual, and constantly searching for deep knowledge or hidden truths. They are friendly, conversational, and excellent at social networking across diverse fields. Their adaptable mind enjoys regular travel.",
      ta: "ஆர்வமுள்ள, ஆழமான அறிவு அல்லது மறைக்கப்பட்ட உண்மைகளைத் தொடர்ந்து தேடும் சிறந்த அறிவுஜீவிகள். இவர்கள் அன்பானவர்கள், உரையாடலில் வல்லவர்கள் மற்றும் பல்வேறு துறைகளில் சமூக தொடர்புகளை உருவாக்குவதில் சிறந்தவர்கள். இவர்களின் மாற்றியமைக்கக்கூடிய மனம் வழக்கமான பயணங்களை ரசிக்கும்."
    }
  },
  "Ardra": {
    nameEn: "Ardra",
    nameTa: "திருவாதிரை",
    rulingPlanet: "Rahu",
    rulingPlanetTa: "ராகு",
    deity: "Rudra",
    deityTa: "ருத்திரன்",
    symbol: "Teardrop or Diamond",
    symbolTa: "கண்ணீர் துளி",
    luckyNumber: "4",
    luckyColor: "Green",
    luckyColorTa: "பச்சை",
    luckyDay: "Wednesday",
    luckyDayTa: "புதன்கிழமை",
    gemstone: "Gomed / Hessonite",
    gemstoneTa: "கோமேதகம்",
    career: {
      en: "Succeed in technology, electronics, crisis management, and psychological research. They excel in fields that demand intense intellectual capacity and major structural overhauls. Healing professions or dealing with complex machinery is also common.",
      ta: "தொழில்நுட்பம், மின்னணுவியல், நெருக்கடி மேலாண்மை மற்றும் உளவியல் ஆராய்ச்சி ஆகியவற்றில் இவர்கள் வெற்றி பெறுவார்கள். தீவிர அறிவுத்திறன் மற்றும் பெரிய கட்டமைப்பு மாற்றங்கள் தேவைப்படும் துறைகளில் இவர்கள் சிறந்து விளங்குவார்கள். குணப்படுத்தும் தொழில்கள் அல்லது சிக்கலான இயந்திரங்களைக் கையாள்வதில் ஆர்வம் காட்டுவர்."
    },
    love: {
      en: "Relationships undergo dramatic changes, requiring patience and emotional balance. They love deeply but can show coldness or emotional intensity unpredictably. Finding a partner who acts as an stabilizing anchor is crucial for their happiness.",
      ta: "இவர்களின் உறவுகள் வியத்தகு மாற்றங்களுக்கு உள்ளாகின்றன, இதற்கு பொறுமையும் உணர்ச்சி சமநிலையும் தேவை. இவர்கள் ஆழமாகக் காதலிப்பார்கள் ஆனால் கணிக்க முடியாதபடி உணர்ச்சி தீவிரத்தைக் காட்டுவார்கள். தங்களை நிலைநிறுத்தும் ஒரு துணையைக் கண்டறிவது இவர்களின் மகிழ்ச்சிக்கு முக்கியமானது."
    },
    health: {
      en: "Prone to chronic skin rashes, allergies, neurological disorders, and respiratory problems. They must avoid damp environments and prioritize body detoxification. Mental grounding through yoga yields wonderful physical health benefits.",
      ta: "நாள்பட்ட தோல் வெடிப்பு, ஒவ்வாமை, நரம்பியல் கோளாறுகள் மற்றும் சுவாசப் பிரச்சனைகள் ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் ஈரப்பதமான சூழலைத் தவிர்க்க வேண்டும் மற்றும் உடல் நச்சு நீக்கத்திற்கு முன்னுரிமை அளிக்க வேண்டும். யோகா மூலம் மனதை ஒருமுகப்படுத்துவது சிறந்த உடல் நலனைத் தரும்."
    },
    finance: {
      en: "Financial success arrives after overcoming major structural challenges and life reversals. They earn well via technological innovation or hazard-handling ventures. Practicing disciplined insurance and saving protocols brings profound stability.",
      ta: "பெரிய கட்டமைப்பு சவால்கள் மற்றும் வாழ்க்கை மாற்றங்களை எதிர்கொண்ட பிறகு நிதி வெற்றி கிடைக்கிறது. தொழில்நுட்ப கண்டுபிடிப்புகள் அல்லது அபாயகரமான முயற்சிகள் மூலம் நன்றாக சம்பாதிக்கிறார்கள். ஒழுக்கமான காப்பீடு மற்றும் சேமிப்பு முறைகளைப் பின்பற்றுவது ஆழ்ந்த ஸ்திரத்தன்மையைக் கொண்டுவரும்."
    },
    personality: {
      en: "Intense, deeply compassionate, and highly resilient through extreme life turbulences. They are deep analytical thinkers who display emotional strength during crises. They express deep sympathy for the suffering of others.",
      ta: "தீவிரமான, ஆழ்ந்த இரக்கமுள்ள மற்றும் தீவிரமான வாழ்க்கை சவால்களின் மூலம் மீண்டெழும் திறன் கொண்டவர்கள். இவர்கள் நெருக்கடி காலங்களில் உணர்ச்சி வலிமையைக் காட்டும் ஆழமான பகுப்பாய்வு சிந்தனையாளர்கள். மற்றவர்களின் துன்பங்களுக்கு ஆழ்ந்த அனுதாபத்தை வெளிப்படுத்துவார்கள்."
    }
  },
  "Punarvasu": {
    nameEn: "Punarvasu",
    nameTa: "புனர்பூசம்",
    rulingPlanet: "Jupiter",
    rulingPlanetTa: "குரு",
    deity: "Aditi",
    deityTa: "அதிதி",
    symbol: "Bow and Quiver",
    symbolTa: "அம்புராவி",
    luckyNumber: "3",
    luckyColor: "Yellow",
    luckyColorTa: "மஞ்சள்",
    luckyDay: "Thursday",
    luckyDayTa: "வியாழக்கிழமை",
    gemstone: "Yellow Sapphire",
    gemstoneTa: "கனகபுஷ்பராகம்",
    career: {
      en: "Excel in education, counseling, literature, travel, and non-profit sectors. Their mentoring capabilities make them natural teachers, writers, and spiritual guides. They experience success when rebuilding failed ventures or projects.",
      ta: "கல்வி, ஆலோசனை வழங்குதல், இலக்கியம், சுற்றுலா மற்றும் தொண்டு நிறுவனங்கள் ஆகியவற்றில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் வழிகாட்டும் திறன் இவர்களை சிறந்த ஆசிரியர்களாகவும், எழுத்தாளர்களாகவும், ஆன்மீக வழிகாட்டிகளாகவும் மாற்றும். தோல்வியடைந்த திட்டங்களை மீண்டும் கட்டியெழுப்பும்போது இவர்கள் பெரும் வெற்றி பெறுவார்கள்."
    },
    love: {
      en: "Nurturing, kind-hearted, and strongly attached to domestic peace. They are forgiving partners who give multiple chances to preserve the relationship harmony. Family values and shared parental goals strengthen their marital bonds.",
      ta: "அரவணைப்பு, கனிவான இதயம் மற்றும் குடும்ப அமைதியில் மிகுந்த ஈடுபாடு கொண்டவர்கள். இவர்கள் உறவின் நல்லிணக்கத்தைப் பேண பல வாய்ப்புகளை வழங்கும் மன்னிக்கும் குணம் கொண்ட துணையாக இருப்பார்கள். குடும்ப விழுமியங்கள் இவர்களின் திருமண பந்தத்தை வலுப்படுத்தும்."
    },
    health: {
      en: "Sensitive respiratory systems, making them prone to lung blockages, bronchitis, and liver sluggishness. Maintaining clean indoor air quality and drinking clean warm water is highly helpful. They recover quickly from sickness naturally.",
      ta: "உணர்திறன் மிக்க சுவாச அமைப்பு இருப்பதால் நுரையீரல் அடைப்பு, மூச்சுக்குழாய் அழற்சி மற்றும் கல்லீரல் மந்தநிலை ஆகியவற்றிற்கு ஆளாக நேரிடலாம். சுத்தமான உட்புற காற்றின் தரத்தை பராமரிப்பதும், சுத்தமான வெதுவெதுப்பான நீரை குடிப்பதும் மிகவும் உதவும். இவர்கள் நோயிலிருந்து இயற்கையாகவே விரைவாக குணமடைவார்கள்."
    },
    finance: {
      en: "They experience a revolving financial pattern where wealth spent returns naturally. Inheritances or returns from real estate investments are highly profitable. They must build structural reserves to counteract occasional business slowdowns.",
      ta: "செலவழிக்கப்பட்ட செல்வம் இயற்கையாகவே திரும்பி வரும் சுழற்சி நிதி முறையை இவர்கள் அனுபவிக்கிறார்கள். பூர்வீக சொத்துக்கள் அல்லது ரியல் எஸ்டேட் முதலீடுகளின் வருமானம் அதிக லாபம் தரும். அவ்வப்போது ஏற்படும் வணிக மந்தநிலையை எதிர்கொள்ள இவர்கள் சேமிப்பை உருவாக்க வேண்டும்."
    },
    personality: {
      en: "Optimistic, kind-hearted, and highly philosophical individuals who radiate positive vibrations. They love freedom and always look at the bright side of life situations. Their content, peaceful aura brings immense comfort to friends.",
      ta: "நேர்மறை ஆற்றலை வெளிப்படுத்தும் நல்லெண்ணம், கனிவான இதயம் மற்றும் சிறந்த தத்துவ சிந்தனை கொண்டவர்கள். இவர்கள் சுதந்திரத்தை விரும்புகிறார்கள் மற்றும் எப்போதும் வாழ்க்கை சூழ்நிலைகளின் பிரகாசமான பக்கத்தைப் பார்க்கிறார்கள். இவர்களின் அமைதியான ஆளுமை நண்பர்களுக்கு மிகுந்த ஆறுதலைத் தரும்."
    }
  },
  "Pushya": {
    nameEn: "Pushya",
    nameTa: "பூசம்",
    rulingPlanet: "Saturn",
    rulingPlanetTa: "சனி",
    deity: "Brihaspati",
    deityTa: "பிருகஸ்பதி",
    symbol: "Cow's Udder or Lotus",
    symbolTa: "பசுவின் மடி",
    luckyNumber: "8",
    luckyColor: "Milky White",
    luckyColorTa: "பால் வெள்ளை",
    luckyDay: "Saturday",
    luckyDayTa: "சனிக்கிழமை",
    gemstone: "Blue Sapphire",
    gemstoneTa: "நீலம்",
    career: {
      en: "Highly favored for administrative, government, legal, and financial services. Their nurturing yet disciplined approach suits corporate governance, education, and banking industries. They earn trust through long-term dedication.",
      ta: "நிர்வாகம், அரசுப் பணிகள், சட்டத்துறை மற்றும் நிதிச் சேவைகளுக்கு இவர்கள் மிகவும் தகுதியானவர்கள். இவர்களின் அரவணைப்பு மற்றும் ஒழுக்கமான அணுகுமுறை கார்ப்பரேட் மேலாண்மை, கல்வி மற்றும் வங்கித் துறைகளுக்குப் பொருந்தும். நீண்ட கால அர்ப்பணிப்பு மூலம் இவர்கள் மற்றவர்களின் நம்பிக்கையைப் பெறுவார்கள்."
    },
    love: {
      en: "Exceedingly loyal, dependable, and highly protective of their family units. They express love through practical support, domestic stability, and traditional family structures. Mutual respect and emotional comfort are vital for their marriage.",
      ta: "மிகுந்த விசுவாசம், நம்பகத்தன்மை மற்றும் தங்கள் குடும்பத்தின் மீது அதிக பாதுகாப்புணர்வு கொண்டவர்கள். இவர்கள் நடைமுறை ஆதரவு, குடும்ப ஸ்திரத்தன்மை மற்றும் பாரம்பரிய குடும்ப அமைப்புகள் மூலம் அன்பை வெளிப்படுத்துகிறார்கள். பரஸ்பர மரியாதையும் மகிழ்ச்சியும் இவர்களின் திருமணத்திற்கு இன்றியமையாதவை."
    },
    health: {
      en: "Generally enjoys strong constitution, but vulnerable to stomach ulcers, bile excess, and knee or joint stiffness. Regular stretching and an alkalizing diet preserve long-term mobility. Preventing emotional bottling protects their gastric health.",
      ta: "பொதுவாக பலமான உடல் அமைப்பைக் கொண்டிருந்தாலும், வயிற்றுப் புண், பித்த ஆதிக்கம் மற்றும் முழங்கால் அல்லது மூட்டு விறைப்பு ஆகியவற்றால் பாதிக்கப்படலாம். வழக்கமான உடற்பயிற்சி மற்றும் கார உணவுமுறை இவர்களின் நீண்ட கால இயக்கத்தைக் காக்கும். உணர்ச்சிகளை அடக்காமல் இருப்பது இவர்களின் வயிற்று ஆரோக்கியத்தைப் பாதுகாக்கும்."
    },
    finance: {
      en: "Assured long-term wealth growth through steady, patient corporate investments, banking returns, and regular savings. They build massive assets slowly but securely over decades. Avoid risky speculative fields to guard their hard-earned money.",
      ta: "நிலையான, பொறுமையான கார்ப்பரேட் முதலீடுகள், வங்கி வருமானம் மற்றும் வழக்கமான சேமிப்பு மூலம் நீண்ட கால செல்வ வளர்ச்சி உறுதி செய்யப்படுகிறது. இவர்கள் பல தசாப்தங்களாக மெதுவாக ஆனால் பாதுகாப்பாக பெரிய சொத்துக்களை உருவாக்குகிறார்கள். கஷ்டப்பட்டு சம்பாதித்த பணத்தைப் பாதுகாக்க ஆபத்தான பந்தயங்களைத் தவிர்க்கவும்."
    },
    personality: {
      en: "Highly disciplined, responsible, mature, and deeply calm under intense work pressure. They respect traditional structures, law, and long-term commitments above short-term pleasure. They are dependable pillars of society.",
      ta: "தீவிரமான பணி அழுத்தத்தின் கீழ் மிகவும் ஒழுக்கமான, பொறுப்பான, முதிர்ந்த மற்றும் ஆழ்ந்த அமைதியான குணம் கொண்டவர்கள். குறுகிய கால இன்பங்களை விட பாரம்பரிய கட்டமைப்புகள், சட்டம் மற்றும் நீண்ட கால அர்ப்பணிப்புகளை மதிக்கிறார்கள். இவர்கள் சமூகத்தின் நம்பகமான தூண்கள் ஆவர்."
    }
  },
  "Ashlesha": {
    nameEn: "Ashlesha",
    nameTa: "ஆயில்யம்",
    rulingPlanet: "Mercury",
    rulingPlanetTa: "புதன்",
    deity: "Sarpas / Nagas",
    deityTa: "நாகங்கள்",
    symbol: "Coiled Serpent",
    symbolTa: "சுருண்ட பாம்பு",
    luckyNumber: "5",
    luckyColor: "Blackish Red",
    luckyColorTa: "கருஞ்சிவப்பு",
    luckyDay: "Wednesday",
    luckyDayTa: "புதன்கிழமை",
    gemstone: "Emerald",
    gemstoneTa: "மரகதம்",
    career: {
      en: "Prosper in commerce, international business, psychology, and chemical industries. Their strategic thinking and intuition provide a huge advantage in competitive corporate environments. They excel in intelligence gathering or auditing.",
      ta: "வணிகம், சர்வதேச வர்த்தகம், உளவியல் மற்றும் ரசாயனத் தொழில்களில் இவர்கள் செழித்து விளங்குவார்கள். இவர்களின் மூலோபாய சிந்தனையும் உள்ளுணர்வும் போட்டி நிறைந்த கார்ப்பரேட் சூழலில் பெரிய நன்மைகளைத் தரும். உளவுத்துறை அல்லது தணிக்கைத் துறையிலும் இவர்கள் சிறந்து விளங்குவார்கள்."
    },
    love: {
      en: "Intense, protective, and intensely loyal, though sometimes prone to jealousy or suspicion. They require deep psychological connection and absolute emotional transparency from partners. They express deep affection once trust is fully earned.",
      ta: "தீவிரமான, பாதுகாப்புணர்வு மற்றும் மிகுந்த விசுவாசம் கொண்டவர்கள், அதே சமயம் சில நேரங்களில் பொறாமை அல்லது சந்தேகத்திற்கு ஆளாக நேரிடலாம். இவர்கள் துணையிடமிருந்து ஆழமான உளவியல் ரீதியான தொடர்பையும் முழுமையான உணர்ச்சி வெளிப்படைத்தன்மையையும் எதிர்பார்ப்பார்கள். நம்பிக்கை ஏற்பட்டவுடன் ஆழ்ந்த அன்பை வெளிப்படுத்துவார்கள்."
    },
    health: {
      en: "Vulnerable to food poisonings, stomach sensitivities, arthritic pains, and psychological over-exhaustion. They must maintain strict dietary hygiene and avoid listening to excessive negative thoughts. Regular water therapy is highly therapeutic.",
      ta: "உணவு நச்சுத்தன்மை, வயிற்று உணர்திறன், மூட்டுவலி மற்றும் உளவியல் சோர்வு ஆகியவற்றால் பாதிக்கப்படலாம். இவர்கள் கடுமையான உணவு சுகாதாரத்தை பராமரிக்க வேண்டும் மற்றும் அதிகப்படியான எதிர்மறை எண்ணங்களைத் தவிர்க்க வேண்டும். வழக்கமான நீர் சிகிச்சை இவர்களுக்கு மிகவும் நல்லது."
    },
    finance: {
      en: "They can accumulate great wealth through strategic commerce, corporate partnerships, and shrewd negotiations. Unforeseen legal disputes could deplete savings if transparency is compromised. Diversifying wealth inside secure structures is ideal.",
      ta: "மூலோபாய வணிகம், கார்ப்பரேட் கூட்டாண்மை மற்றும் புத்திசாலித்தனமான பேச்சுவார்த்தைகள் மூலம் இவர்கள் பெரிய செல்வத்தை திரட்ட முடியும். வெளிப்படைத்தன்மை இல்லாவிட்டால் எதிர்பாராத சட்ட தகராறுகள் சேமிப்பை அழிக்கக்கூடும். பாதுகாப்பான கட்டமைப்புகளில் செல்வத்தைப் பல்வகைப்படுத்துவது நல்லது."
    },
    personality: {
      en: "Shrewd, highly intuitive, and deeply protective individuals with a strong mystical streak. They possess an intense gaze and exceptional capacity to read people's inner motives. Shrewdly independent, they guard their privacy.",
      ta: "வலுவான ஆன்மீகத் தன்மையுடன் புத்திசாலித்தனமான, உள்ளுணர்வு மிக்க மற்றும் தங்களை பாதுகாத்துக் கொள்ளும் குணம் கொண்டவர்கள். இவர்களிடம் தீவிரமான பார்வையும் மற்றவர்களின் உள்நோக்கங்களைப் படிக்கும் விதிவிலக்கான திறனும் உள்ளது. சுதந்திரமான இவர்கள் தங்கள் தனியுரிமையைப் பாதுகாப்பார்கள்."
    }
  },
  "Magha": {
    nameEn: "Magha",
    nameTa: "மகம்",
    rulingPlanet: "Ketu",
    rulingPlanetTa: "கேது",
    deity: "Pitris",
    deityTa: "பித்ருக்கள்",
    symbol: "Royal Throne",
    symbolTa: "சிம்மாசனம்",
    luckyNumber: "7",
    luckyColor: "Ivory",
    luckyColorTa: "யானைத்தந்த நிறம்",
    luckyDay: "Tuesday",
    luckyDayTa: "செவ்வாய்க்கிழமை",
    gemstone: "Cat's Eye",
    gemstoneTa: "வைடூரியம்",
    career: {
      en: "Excel in managerial roles, heritage conservation, politics, and top executive positions. They carry a royal presence that enables them to command authority in large organizations. Entrepreneurship and family-owned businesses suit them best.",
      ta: "மேலாண்மைப் பொறுப்புகள், பாரம்பரிய பாதுகாப்பு, அரசியல் மற்றும் உயர்மட்ட நிர்வாகப் பதவிகளில் இவர்கள் சிறந்து விளங்குவார்கள். பெரிய நிறுவனங்களில் அதிகாரத்தை நிலைநாட்டக்கூடிய கம்பீரமான ஆளுமை இவர்களிடம் உள்ளது. சுயதொழில் மற்றும் குடும்ப வணிகம் இவர்களுக்கு மிகவும் ஏற்றதாகும்."
    },
    love: {
      en: "Dignified, protective, and committed to traditional family values and lineage. They seek life partners who respect their family heritage and maintain a high social standing. They express affection through providing security and legacy.",
      ta: "கண்ணியமான, பாதுகாப்புணர்வு கொண்ட மற்றும் பாரம்பரிய குடும்ப விழுமியங்கள் மீது அர்ப்பணிப்புள்ளவர்கள். தங்களின் குடும்ப பாரம்பரியத்தை மதிக்கும் மற்றும் சமூக அந்தஸ்தைப் பேணும் வாழ்க்கைத்துணையை இவர்கள் தேடுவார்கள். இவர்கள் பாதுகாப்பு மற்றும் நல்வாழ்வை வழங்குவதன் மூலம் அன்பை வெளிப்படுத்துகிறார்கள்."
    },
    health: {
      en: "Prone to heart problems, back aches, spinal strain, and blood pressure fluctuations. They must avoid lifting excessively heavy loads and practice cardiac care through active cardio. Adequate posture management prevents later skeletal complications.",
      ta: "இதயப் பிரச்சனைகள், முதுகுவலி, முதுகெலும்பு பாதிப்பு மற்றும் இரத்த அழுத்த மாறுபாடுகள் ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் அதிக எடையைத் தூக்குவதைத் தவிர்க்க வேண்டும் மற்றும் சுறுசுறுப்பான உடற்பயிற்சி மூலம் இதயப் பராமரிப்பைப் பயிற்சி செய்ய வேண்டும். முறையான உட்காரும் நிலை எலும்புச் சிக்கல்களைத் தடுக்கும்."
    },
    finance: {
      en: "Possess strong financial luck with ancestral inheritances, land grants, or top executive perks. They spend generously on maintaining a high-status lifestyle and royal household. Long-term securities and blue-chip stocks are outstanding avenues.",
      ta: "பூர்வீக சொத்துக்கள், நில மானியங்கள் அல்லது உயர்மட்ட நிர்வாக சலுகைகள் மூலம் வலுவான நிதி அதிர்ஷ்டம் கொண்டவர்கள். உயர் அந்தஸ்து வாழ்க்கை முறை மற்றும் கம்பீரமான வீட்டை பராமரிக்க தாராளமாக செலவிடுகிறார்கள். நீண்ட காலப் பத்திரங்கள் மற்றும் புளூ-சிப் பங்குகள் சிறந்த வழிகளாகும்."
    },
    personality: {
      en: "Proud, noble, deeply respectful of ancestors, and carrying an innate royal presence. They possess high self-esteem and command natural authority wherever they go. They are intensely loyal friends and formidable adversaries.",
      ta: "பெருமை, உன்னதம், முன்னோர்களை ஆழமாக மதிக்கும் மற்றும் பிறப்பிலேயே கம்பீரமான ஆளுமை கொண்டவர்கள். சுயமரியாதை கொண்ட இவர்கள் செல்லும் இடமெல்லாம் இயற்கையான அதிகாரத்தை செலுத்துகிறார்கள். இவர்கள் விசுவாசமான நண்பர்களாகவும், வலிமையான எதிரிகளாகவும் இருப்பார்கள்."
    }
  },
  "Purva Phalguni": {
    nameEn: "Purva Phalguni",
    nameTa: "பூரம்",
    rulingPlanet: "Venus",
    rulingPlanetTa: "சுக்கிரன்",
    deity: "Bhaga",
    deityTa: "பாகன்",
    symbol: "Front Legs of Bed",
    symbolTa: "கட்டிலின் முன்பகுதி",
    luckyNumber: "9",
    luckyColor: "Light Brown",
    luckyColorTa: "இளம்பழுப்பு",
    luckyDay: "Friday",
    luckyDayTa: "வெள்ளிக்கிழமை",
    gemstone: "Diamond",
    gemstoneTa: "வைரம்",
    career: {
      en: "Thrive in event management, creative arts, photography, design, and internal relations. They possess a natural talent for socializing, making them excellent in client engagement and marketing. Entertainment industries yield magnificent results.",
      ta: "நிகழ்ச்சி மேலாண்மை, படைப்புக் கலைகள், புகைப்படம் எடுத்தல், வடிவமைப்பு மற்றும் மக்கள் தொடர்பு ஆகியவற்றில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் சமூக பழகும் திறன் வாடிக்கையாளர் ஈர்ப்பு மற்றும் சந்தைப்படுத்துதலில் சிறந்து விளங்க உதவும். பொழுதுபோக்குத் துறைகள் இவர்களுக்கு மகத்தான முடிவுகளைத் தரும்."
    },
    love: {
      en: "Romantic, highly affectionate, and joyful partners who prioritize mutual pleasure and friendship. They value high comfort, social gatherings, and sharing beautiful experiences with their spouse. Loyalty combined with lighthearted fun defines their bond.",
      ta: "பரஸ்பர மகிழ்ச்சி மற்றும் நட்பிற்கு முன்னுரிமை அளிக்கும் காதல், மிகுந்த அன்பு மற்றும் மகிழ்ச்சியான துணையாக இருப்பார்கள். இவர்கள் தங்கள் துணையுடன் வசதிகள், சமூகக் கூட்டங்கள் மற்றும் அழகான அனுபவங்களைப் பகிர்ந்துகொள்வதை மதிக்கிறார்கள். விசுவாசமும் விளையாட்டுத்தனமும் இவர்களின் பந்தத்தை வரையறுக்கின்றன."
    },
    health: {
      en: "Prone to lower spine stiffness, kidney issues, and physical exhaustion from excessive late-night socialization. Balancing heavy recreation with hydrating fluids and strict sleep schedules maintains their youthful physical frame.",
      ta: "கீழ் முதுகுத்தண்டு விறைப்பு, சிறுநீரகப் பிரச்சனைகள் மற்றும் அதிகப்படியான இரவு நேர சமூகக் கூட்டங்களால் உடல் சோர்வு ஏற்பட வாய்ப்புகள் உள்ளன. பொழுதுபோக்குகளை நீர்ச்சத்து மற்றும் கடுமையான தூக்க அட்டவணைகளுடன் சமநிலைப்படுத்துவது இவர்களின் இளமையான உடல் அமைப்பை பராமரிக்கும்."
    },
    finance: {
      en: "Blessed with continuous financial inflows via media, creative channels, and high-society connections. They are prone to spending excessively on high-end luxury, fine dining, and entertainment. Implementing automatic saving habits balances their finances.",
      ta: "ஊடகம், ஆக்கபூர்வமான சேனல்கள் மற்றும் உயர் சமூக தொடர்புகள் மூலம் தொடர்ச்சியான நிதி வரவு கொண்டவர்கள். இவர்கள் உயர்தர ஆடம்பரம், சிறந்த உணவு மற்றும் பொழுதுபோக்குகளுக்காக அதிகப்படியான செலவு செய்ய நேரிடலாம். தானியங்கி சேமிப்பு பழக்கங்களை செயல்படுத்துவது இவர்களின் நிதியை சமநிலைப்படுத்தும்."
    },
    personality: {
      en: "Joyful, creative, highly social, and loving comfort, fine arts, and high-end luxury. They possess a charming social aura that makes them highly popular in any gathering. They spread enthusiasm and lighthearted happiness easily.",
      ta: "மகிழ்ச்சியான, ஆக்கபூர்வமான, சமூக பழகும் குணம் மற்றும் வசதிகள், நுண்கலைகள், ஆடம்பரங்களை விரும்பும் நபர்கள். எந்தவொரு கூட்டத்திலும் இவர்களை மிகவும் பிரபலமாக்கும் வசீகரமான சமூக ஆளுமை இவர்களிடம் உள்ளது. இவர்கள் உற்சாகத்தையும் மகிழ்ச்சியையும் எளிதாகப் பரப்புவார்கள்."
    }
  },
  "Uttara Phalguni": {
    nameEn: "Uttara Phalguni",
    nameTa: "உத்திரம்",
    rulingPlanet: "Sun",
    rulingPlanetTa: "சூரியன்",
    deity: "Aryaman",
    deityTa: "அரியமான்",
    symbol: "Four Legs of Bed",
    symbolTa: "கட்டிலின் பின்பகுதி",
    luckyNumber: "1",
    luckyColor: "Bright Pink",
    luckyColorTa: "பிரகாசமான இளஞ்சிவப்பு",
    luckyDay: "Sunday",
    luckyDayTa: "ஞாயிற்றுக்கிழமை",
    gemstone: "Ruby",
    gemstoneTa: "மாணிக்கம்",
    career: {
      en: "Succeed in public services, international relations, philanthropy, and corporate leadership. Their reliable nature leads to stable careers in diplomacy, human resources, or social reforms. They are highly organized professionals.",
      ta: "பொதுச் சேவைகள், சர்வதேச உறவுகள், தொண்டு நிறுவனங்கள் மற்றும் கார்ப்பரேட் தலைமைத்துவத்தில் இவர்கள் வெற்றி பெறுவார்கள். இவர்களின் நம்பகமான குணம் தூதரக உறவுகள், மனித வளம் அல்லது சமூக சீர்திருத்தங்களில் நிலையான வாழ்க்கைக்கு வழிவகுக்கும். இவர்கள் மிகவும் ஒழுங்கமைக்கப்பட்ட நிபுணர்கள் ஆவார்."
    },
    love: {
      en: "Loyal, stable, and deeply committed to long-term partnerships or institutional marriage. They value honesty, punctuality, and mutual support in times of hardship. They make excellent life partners who stand firmly by their companion.",
      ta: "விசுவாசமான, நிலையான மற்றும் நீண்ட கால உறவுகள் அல்லது திருமண வாழ்க்கையில் ஆழ்ந்த அர்ப்பணிப்பு கொண்டவர்கள். இவர்கள் நேர்மை, நேரமின்மை மற்றும் கடினமான காலங்களில் பரஸ்பர ஆதரவை மதிக்கிறார்கள். இவர்கள் தங்கள் துணையுடன் உறுதியாக நிற்கும் சிறந்த வாழ்க்கைத்துணையாக இருப்பார்கள்."
    },
    health: {
      en: "Prone to high body temperature, mild cardiac strain, and lower back muscle injuries. They require a balanced, low-sodium food pattern and physical activities that soothe their high internal drive. Regular spinal alignment exercises are beneficial.",
      ta: "அதிக உடல் வெப்பநிலை, லேசான இதய பாதிப்பு மற்றும் கீழ் முதுகு தசை காயங்களுக்கு ஆளாக நேரிடலாம். இவர்களுக்கு சீரான, குறைந்த சோடியம் கொண்ட உணவு முறை மற்றும் உடலை அமைதிப்படுத்தும் உடல் செயல்பாடுகள் தேவை. வழக்கமான முதுகெலும்பு பயிற்சிகள் நன்மை பயக்கும்."
    },
    finance: {
      en: "Steady and respectable monetary positions acquired through personal diligence and government-allied ventures. They make careful financial allocations and avoid frivolous luxury expenditures. Solid returns emerge from long-term bonds and land ownership.",
      ta: "தனிப்பட்ட விடாமுயற்சி மற்றும் அரசு சார்ந்த முயற்சிகள் மூலம் பெறப்பட்ட நிலையான மற்றும் மரியாதைக்குரிய நிதி நிலை இவர்களுடையது. இவர்கள் கவனமாக நிதியை ஒதுக்குகிறார்கள் மற்றும் வீண் ஆடம்பர செலவுகளைத் தவிர்க்கிறார்கள். நீண்ட காலப் பத்திரங்கள் மற்றும் நில உடைமை மூலம் உறுதியான வருமானம் கிடைக்கும்."
    },
    personality: {
      en: "Kind, highly reliable, generous, and strongly committed to truth and social justice. They maintain lifelong friendships and hold themselves to high ethical behavior codes. They are dignified leaders who serve communities.",
      ta: "அன்பான, மிகவும் நம்பகமான, தாராள மனப்பான்மை கொண்ட மற்றும் உண்மை மற்றும் சமூக நீதிக்காக அர்ப்பணிப்புடன் செயல்படுபவர்கள். இவர்கள் வாழ்நாள் முழுவதும் நட்பைப் பேணுகிறார்கள் மற்றும் தங்களை உயர்ந்த நெறிமுறை நடத்தை விதிகளுக்குள் வைத்திருக்கிறார்கள். இவர்கள் சமூகத்திற்குச் சேவை செய்யும் கண்ணியமான தலைவர்கள்."
    }
  },
  "Hasta": {
    nameEn: "Hasta",
    nameTa: "அஸ்தம்",
    rulingPlanet: "Moon",
    rulingPlanetTa: "சந்திரன்",
    deity: "Savitr",
    deityTa: "சவிதா",
    symbol: "Hand or Fist",
    symbolTa: "கை முஷ்டி",
    luckyNumber: "2",
    luckyColor: "Deep Green",
    luckyColorTa: "அடர்பச்சை",
    luckyDay: "Monday",
    luckyDayTa: "திங்கட்கிழமை",
    gemstone: "Pearl",
    gemstoneTa: "முத்து",
    career: {
      en: "Brilliant in craftsmanship, arts, sales, communication, and accounting. Their manual dexterity and clever bargaining skills ensure high success in commercial business and logistics. They are excellent problem-solvers in dynamic jobs.",
      ta: "கைவினைத்திறன், கலைகள், விற்பனை, தகவல் தொடர்பு மற்றும் கணக்குப்பதிவியல் ஆகியவற்றில் இவர்கள் சிறந்தவர்கள். இவர்களின் கையாளுமைத் திறனும் புத்திசாலித்தனமான பேச்சுவார்த்தை திறனும் வணிகம் மற்றும் தளவாடத் துறைகளில் பெரும் வெற்றியை உறுதி செய்யும். மாறும் தன்மை கொண்ட பணிகளில் இவர்கள் சிறந்த தீர்வைக் காண்பார்கள்."
    },
    love: {
      en: "Charming, expressive, and highly devoted to romantic partners with a touch of playfulness. They use continuous communication and helpful acts of service to display deep love. May exhibit minor insecurity if affection is not returned.",
      ta: "வசீகரமான, உணர்ச்சிகளை வெளிப்படுத்தும் மற்றும் விளையாட்டுத்தனமான தொடுதலுடன் காதல் துணையிடம் மிகுந்த அர்ப்பணிப்புடன் இருப்பார்கள். ஆழ்ந்த அன்பைக் காட்ட தொடர்ச்சியான தகவல் தொடர்பு மற்றும் பயனுள்ள சேவைகளைப் பயன்படுத்துகிறார்கள். அன்பு திரும்பக் கிடைக்காதபோது சிறிய பாதுகாப்பின்மையை வெளிப்படுத்தலாம்."
    },
    health: {
      en: "Vulnerable to intestinal disorders, frequent bowel issues, skin eczema, and high nervous tension in the arms. They must manage digestive processes carefully through fiber-rich meals. Mental hobbies reduce muscle tension efficiently.",
      ta: "குடல் கோளாறுகள், அடிக்கடி ஏற்படும் வயிற்றுப் பிரச்சனைகள், தோல் அரிப்பு மற்றும் கைகளில் அதிக நரம்பு பதற்றம் ஆகியவற்றால் பாதிக்கப்படலாம். நார்ச்சத்து நிறைந்த உணவுகள் மூலம் செரிமான செயல்முறைகளை கவனமாக நிர்வகிக்க வேண்டும். மனதிற்கு பிடித்த பொழுதுபோக்குகள் தசை பதற்றத்தை திறம்பட குறைக்கும்."
    },
    finance: {
      en: "Exceptional earning talent through retail trade, brokerage, currency markets, and independent sales. Their quick-witted negotiations guarantee immediate transactional profit margins. Investing in family businesses or commercial storage brings steady growth.",
      ta: "சில்லறை வர்த்தகம், தரகு, நாணயச் சந்தைகள் மற்றும் சுயாதீன விற்பனை மூலம் விதிவிலக்கான வருவாய் ஈட்டும் திறன் கொண்டவர்கள். இவர்களின் புத்திசாலித்தனமான பேச்சுவார்த்தைகள் உடனடி பரிவர்த்தனை லாப வரம்புகளுக்கு உத்தரவாதம் அளிக்கின்றன. குடும்ப வணிகங்கள் அல்லது வணிகக் கிடங்குகளில் முதலீடு செய்வது நிலையான வளர்ச்சியைக் கொண்டுவரும்."
    },
    personality: {
      en: "Witty, practical, highly creative, and possessing excellent manual dexterity and memory skills. They maintain a cheerful, optimistic outlook but can hide subtle internal anxieties. They are clever problems solvers who love details.",
      ta: "சாதுரியமான, நடைமுறைக்குரிய, மிகவும் ஆக்கபூர்வமான மற்றும் சிறந்த கையாளுமைத் திறன் மற்றும் நினைவாற்றல் கொண்டவர்கள். இவர்கள் மகிழ்ச்சியான, நேர்மறையான பார்வையைப் பேணுகிறார்கள், ஆனால் நுட்பமான உள் கவலைகளை மறைக்க முடியும். இவர்கள் விவரங்களை விரும்பும் புத்திசாலித்தனமான சிக்கல் தீர்ப்பவர்கள்."
    }
  },
  "Chitra": {
    nameEn: "Chitra",
    nameTa: "சித்திரை",
    rulingPlanet: "Mars",
    rulingPlanetTa: "செவ்வாய்",
    deity: "Vishwakarma",
    deityTa: "விஸ்வகர்மா",
    symbol: "Pearl or Bright Jewel",
    symbolTa: "முத்து / பிரகாசமான ரத்தினம்",
    luckyNumber: "5",
    luckyColor: "Saffron",
    luckyColorTa: "குங்குமப்பூ நிறம்",
    luckyDay: "Tuesday",
    luckyDayTa: "செவ்வாய்க்கிழமை",
    gemstone: "Coral",
    gemstoneTa: "பவளம்",
    career: {
      en: "Excel in architecture, mechanical engineering, fashion design, and industrial creation. Their aesthetic sense and structural skills help them build lasting designs. Media production or jewelry crafting can also be rewarding.",
      ta: "கட்டிடக்கலை, இயந்திரப் பொறியியல், ஆடை வடிவமைப்பு மற்றும் தொழில்துறை உற்பத்தி ஆகியவற்றில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் அழகியல் உணர்வும் அமைப்புக் கலைத் திறனும் நீடித்த வடிவமைப்புகளை உருவாக்க உதவும். ஊடகத் தயாரிப்பு அல்லது நகை வடிவமைப்புத் துறையும் இவர்களுக்குப் பலன் தரும்."
    },
    love: {
      en: "Passionate, visually oriented, and deeply expressive in romantic relationships. They appreciate outer beauty, internal elegance, and refinement in their chosen life partner. Clear communication ensures that structural arguments are resolved peacefully.",
      ta: "காதல் உறவுகளில் உணர்ச்சிமிக்க, அழகியல் சார்ந்த மற்றும் ஆழ்ந்த வெளிப்பாட்டுத் தன்மை கொண்டவர்கள். இவர்கள் தங்களின் வாழ்க்கைத்துணையிடம் வெளி அழகையும், உள் நேர்த்தியையும் மதிக்கிறார்கள். தெளிவான தகவல் தொடர்பு இவர்களின் கருத்து வேறுபாடுகளை அமைதியான முறையில் தீர்க்க உதவும்."
    },
    health: {
      en: "Vulnerable to kidney stones, urinary tract irritation, forehead headaches, and minor dermatological issues. Drinking abundant water and avoiding processed heavy foods keeps their skin and inner organs operating properly. Rest prevents forehead tension.",
      ta: "சிறுநீரகக் கற்கள், சிறுநீர்க்குழாய் எரிச்சல், நெற்றித் தலைவலி மற்றும் சிறிய தோல் பிரச்சனைகளால் பாதிக்கப்படலாம். அதிகளவு தண்ணீர் குடிப்பது மற்றும் பதப்படுத்தப்பட்ட கனமான உணவுகளை தவிர்ப்பது இவர்களின் தோல் மற்றும் உள் உறுப்புகளை சரியாக இயங்க வைக்கும். ஓய்வு தலைவலியைத் தடுக்கும்."
    },
    finance: {
      en: "Financially prosperous through industrial manufacturing, gemstone trade, real estate building, or artistic crafts. They possess a deep instinct for enhancing asset valuations through design improvements. Precious stones and physical gold are successful items.",
      ta: "தொழில்துறை உற்பத்தி, ரத்தின வர்த்தகம், ரியல் எஸ்டேட் கட்டிடம் அல்லது கலைக் கைவினைப்பொருட்கள் மூலம் நிதி ரீதியாக செழிப்பானவர்கள். வடிவமைப்பு மேம்பாடுகள் மூலம் சொத்து மதிப்புகளை மேம்படுத்துவதில் ஆழமான உள்ளுணர்வு கொண்டவர்கள். விலைமதிப்பற்ற கற்கள் மற்றும் தங்கம் இவர்களுக்கு வெற்றிகரமான பொருட்கள் ஆகும்."
    },
    personality: {
      en: "Highly creative, visually artistic, and possessing an unyielding passion for structure and design. They love beautiful surroundings and express high confidence in their unique talents. They are charismatic trendsetters in society.",
      ta: "மிகவும் ஆக்கபூர்வமான, அழகியல் கலைத்திறன் மற்றும் அமைப்பு மற்றும் வடிவமைப்பு மீது அசைக்க முடியாத ஆர்வம் கொண்டவர்கள். இவர்கள் அழகான சூழலை விரும்புகிறார்கள் மற்றும் தங்களின் தனித்துவமான திறமைகளில் அதிக நம்பிக்கை காட்டுகிறார்கள். இவர்கள் சமூகத்தில் ஒரு புதிய போக்கை உருவாக்குபவர்கள்."
    }
  },
  "Swati": {
    nameEn: "Swati",
    nameTa: "சுவாதி",
    rulingPlanet: "Rahu",
    rulingPlanetTa: "ராகு",
    deity: "Vayu",
    deityTa: "வாயு",
    symbol: "Young Sprout or Coral",
    symbolTa: "இளம் தளிர்",
    luckyNumber: "4",
    luckyColor: "Black",
    luckyColorTa: "கருப்பு",
    luckyDay: "Monday",
    luckyDayTa: "திங்கட்கிழமை",
    gemstone: "Gomed / Hessonite",
    gemstoneTa: "கோமேதகம்",
    career: {
      en: "Succeed in independent trade, aviation, financial markets, and transportation. They possess great adaptability and thrive in business environments that offer freedom of movement. Public speaking and diplomacy are strong options.",
      ta: "சுயாதீன வர்த்தகம், விமான போக்குவரத்து, நிதிச் சந்தைகள் மற்றும் போக்குவரத்து ஆகியவற்றில் இவர்கள் வெற்றி பெறுவார்கள். இவர்கள் சிறந்த மாற்றியமைக்கும் திறன் கொண்டவர்கள் மற்றும் சுதந்திரமான வணிகச் சூழல்களில் செழித்து விளங்குவார்கள். பொதுப்பேச்சு மற்றும் தூதரகம் இவர்களின் பலமான தேர்வுகளாகும்."
    },
    love: {
      en: "Value personal independence even within long-term relationships and marriage. They seek open-minded partners who appreciate freedom, intellectual conversations, and social exploration. Harmony is sustained through mutual trust and friendship.",
      ta: "நீண்ட கால உறவுகள் மற்றும் திருமண வாழ்க்கையிலும் தனிப்பட்ட சுதந்திரத்தை மதிக்கிறார்கள். சுதந்திரம், அறிவுப்பூர்வமான உரையாடல்கள் மற்றும் சமூகத் தேடல்களைப் பாராட்டும் பரந்த மனப்பான்மை கொண்ட துணையை இவர்கள் தேடுவார்கள். பரஸ்பர நம்பிக்கை மற்றும் நட்பு மூலம் நல்லிணக்கம் நீடிக்கும்."
    },
    health: {
      en: "Sensitive digestive tracts, flatulence, hernia risks, and urinary bladder problems. They should emphasize a clean, organic plant-based diet and avoid gaseous heavy meals. Deep breathing practices supply vital oxygen to their lower body.",
      ta: "உணர்திறன் மிக்க செரிமானப் பாதை, வாய்வுத் தொல்லை, குடலிறக்க அபாயங்கள் மற்றும் சிறுநீர்ப்பை பிரச்சனைகள் ஏற்படலாம். இவர்கள் சுத்தமான, ஆர்கானிக் தாவர அடிப்படையிலான உணவை வலியுறுத்த வேண்டும் மற்றும் வாய்வு உண்டாக்கும் உணவுகளைத் தவிர்க்க வேண்டும். ஆழ்ந்த சுவாசப் பயிற்சி கீழ் உடலுக்கு முக்கிய ஆக்ஸிஜனை வழங்கும்."
    },
    finance: {
      en: "Wealth flows fluidly from multiple moving operations, air transit investments, or global corporate agencies. They adapt successfully to changing fiscal trends but must avoid overly speculative market ventures. Solid cash reserves provide mental peace.",
      ta: "பல்வேறு நகரும் செயல்பாடுகள், விமான போக்குவரத்து முதலீடுகள் அல்லது உலகளாவிய கார்ப்பரேட் முகமைகள் மூலம் செல்வம் தடையின்றி பாய்கிறது. மாறும் நிதிப் போக்குகளுக்கு வெற்றிகரமாகத் தகவமைத்துக் கொள்கிறார்கள் ஆனால் அதிகப்படியான பந்தயச் சந்தை முயற்சிகளைத் தவிர்க்க வேண்டும். உறுதியான பண இருப்பு மன அமைதியைத் தரும்."
    },
    personality: {
      en: "Independent, highly adaptable, flexible, and loving freedom of thought and physical movement. They are polite, highly diplomatic speakers who navigate diverse social situations with immense ease. They are constant learners.",
      ta: "சுயாதீனமான, மிகவும் மாற்றியமைக்கக்கூடிய, நெகிழ்வான மற்றும் சிந்தனை மற்றும் உடல் இயக்கத்தின் சுதந்திரத்தை விரும்பும் நபர்கள். இவர்கள் பலதரப்பட்ட சமூக சூழ்நிலைகளை மிக எளிதாகக் கையாளும் கண்ணியமான, தூதரகப் பேச்சாளர்கள் ஆவர். இவர்கள் தொடர்ந்து கற்றுக்கொள்பவர்கள்."
    }
  },
  "Vishakha": {
    nameEn: "Vishakha",
    nameTa: "விசாகம்",
    rulingPlanet: "Jupiter",
    rulingPlanetTa: "குரு",
    deity: "Indra and Agni",
    deityTa: "இந்திரன் மற்றும் அக்னி",
    symbol: "Triumphal Arch",
    symbolTa: "தோரணம்",
    luckyNumber: "3",
    luckyColor: "Golden Yellow",
    luckyColorTa: "தங்க மஞ்சள்",
    luckyDay: "Thursday",
    luckyDayTa: "வியாழக்கிழமை",
    gemstone: "Yellow Sapphire",
    gemstoneTa: "கனகபுஷ்பராகம்",
    career: {
      en: "Flourish in politics, law, corporate target achievements, and administrative positions. Their goal-oriented approach drives them to succeed in competitive sales, business expansion, or research fields. They persist until they reach the top.",
      ta: "அரசியல், சட்டம், கார்ப்பரேட் இலக்கு சாதனைகள் மற்றும் நிர்வாகப் பதவிகளில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் இலக்கு சார்ந்த அணுகுமுறை இவர்களை போட்டி விற்பனை, வணிக விரிவாக்கம் அல்லது ஆராய்ச்சித் துறைகளில் வெற்றி பெறச் செய்யும். உச்சியை அடையும் வரை இவர்கள் விடாமுயற்சியுடன் செயல்படுவார்கள்."
    },
    love: {
      en: "Intense, determined, and highly possessive in romantic associations. They expect unconditional allegiance and give deep emotional security to their partners. Balancing high expectations with realistic compromise ensures marital peace.",
      ta: "காதல் தொடர்புகளில் தீவிரமான, உறுதியான மற்றும் அதிக ஆதிக்கம் செலுத்தும் குணம் கொண்டவர்கள். இவர்கள் நிபந்தனையற்ற விசுவாசத்தை எதிர்பார்ப்பார்கள் மற்றும் தங்கள் துணைக்கு ஆழ்ந்த உணர்ச்சி பாதுகாப்பை வழங்குவார்கள். அதிக எதிர்பார்ப்புகளை நடைமுறையுடன் சமநிலைப்படுத்துவது திருமண அமைதியை உறுதி செய்யும்."
    },
    health: {
      en: "Prone to metabolic issues, elevated blood sugar levels, liver slow-down, and lower thigh fat accumulation. They must incorporate low-sugar food plans and consistent lower body physical exercises. Moderation in eating habits ensures sound health.",
      ta: "அதிவேக வளர்சிதை மாற்றப் பிரச்சனைகள், உயர்ந்த இரத்த சர்க்கரை அளவுகள், கல்லீரல் மந்தநிலை மற்றும் தொடை பகுதியில் கொழுப்பு சேருதல் ஆகியவை ஏற்படலாம். இவர்கள் குறைந்த சர்க்கரை உணவுத் திட்டங்களையும் நிலையான கீழ் உடல் பயிற்சிகளையும் இணைக்க வேண்டும். உணவுப் பழக்கத்தில் மிதமான தன்மை நல்ல ஆரோக்கியத்தை உறுதி செய்யும்."
    },
    finance: {
      en: "Financial accumulation is hard-earned in early life but grows exponentially after middle age via calculated target achievements. They gain heavy returns through commercial property leasing and large corporate expansion rewards. They are highly ambitious.",
      ta: "இளமைப் பருவத்தில் நிதிச் சேர்ப்பு கடினமாக இருக்கும் ஆனால் நடுத்தர வயதிற்குப் பிறகு கணக்கிடப்பட்ட இலக்கு சாதனைகள் மூலம் அதிவேகமாக வளரும். வணிக சொத்து குத்தகை மற்றும் பெரிய கார்ப்பரேட் விரிவாக்க வெகுமதிகள் மூலம் பெரிய வருவாயைப் பெறுகிறார்கள். இவர்கள் மிகுந்த லட்சியம் கொண்டவர்கள்."
    },
    personality: {
      en: "Highly focused, ambitious, determined, and possess single-minded drive toward their goals. They display high endurance but can sometimes show intense competitive behavior or jealousy. They achieve grand milestones eventually.",
      ta: "மிகவும் கவனம் செலுத்தும், லட்சியம் கொண்ட, உறுதியான மற்றும் தங்கள் இலக்குகளை நோக்கி ஒற்றை எண்ணத்துடன் செயல்படுபவர்கள். இவர்களிடம் அதிக சகிப்புத்தன்மை உள்ளது, ஆனால் சில நேரங்களில் தீவிரமான போட்டி குணம் அல்லது பொறாமையைக் காட்டலாம். இறுதியில் பெரிய மைல்கற்களை அடைவார்கள்."
    }
  },
  "Anuradha": {
    nameEn: "Anuradha",
    nameTa: "அனுஷம்",
    rulingPlanet: "Saturn",
    rulingPlanetTa: "சனி",
    deity: "Mitra",
    deityTa: "மித்திரன்",
    symbol: "Lotus or Archway",
    symbolTa: "தாமரை",
    luckyNumber: "8",
    luckyColor: "Reddish Brown",
    luckyColorTa: "செம்பழுப்பு",
    luckyDay: "Saturday",
    luckyDayTa: "சனிக்கிழமை",
    gemstone: "Blue Sapphire",
    gemstoneTa: "நீலம்",
    career: {
      en: "Succeed in international business, travel industries, corporate management, and scientific research. They operate beautifully in teams and excel at leading cross-cultural projects. Mining, geology, or counseling are also favorable.",
      ta: "சர்வதேச வர்த்தகம், சுற்றுலாத் துறை, கார்ப்பரேட் மேலாண்மை மற்றும் அறிவியல் ஆராய்ச்சி ஆகியவற்றில் இவர்கள் வெற்றி பெறுவார்கள். இவர்கள் குழுவாக அழகாகச் செயல்படுவார்கள் மற்றும் பல்வேறு கலாச்சாரத் திட்டங்களை வழிநடத்துவதில் சிறந்து விளங்குவார்கள். சுரங்கத்துறை, புவியியல் அல்லது ஆலோசனை வழங்குதலும் சாதகமானது."
    },
    love: {
      en: "Deeply romantic, idealistic, and heavily dedicated to maintaining peaceful partnerships. They possess great capacity for unconditional love and enjoy cross-cultural or long-distance bonds. Emotional vulnerability forms the core of their unity.",
      ta: "ஆழ்ந்த காதல், இலட்சியவாதம் மற்றும் அமைதியான உறவுகளைப் பேணுவதில் மிகுந்த அர்ப்பணிப்பு கொண்டவர்கள். நிபந்தனையற்ற அன்பிற்கான சிறந்த ஆற்றலைக் கொண்ட இவர்கள், வெவ்வேறு கலாச்சார அல்லது நீண்ட தூர பந்தங்களை அனுபவிப்பார்கள். உணர்ச்சிப்பூர்வமான புரிதலே இவர்களின் ஒற்றுமையின் மையமாகும்."
    },
    health: {
      en: "Prone to minor cardiac blocks, lower leg cramps, ankle sprains, and stomach gas imbalances. They possess great physical recovery capacity but must avoid cold, damp weather conditions. Warm foot baths and massage boost circulation.",
      ta: "லேசான இதய அடைப்புகள், கீழ் கால் பிடிப்புகள், கணுக்கால் சுளுக்கு மற்றும் வயிற்று வாய்வு சமநிலையின்மை ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் சிறந்த உடல் மீள்தன்மை கொண்டவர்கள் ஆனால் குளிர்ந்த, ஈரப்பதமான வானிலை நிலைகளைத் தவிர்க்க வேண்டும். வெதுவெதுப்பான பாதக் குளியல் மற்றும் மசாஜ் இரத்த ஓட்டத்தை அதிகரிக்கும்."
    },
    finance: {
      en: "Magnificent fiscal success derived from overseas assignments, international trading corporations, or travel-related networks. They cooperate expertly with foreign partners to enhance their personal net worth. Institutional investments bring great stability.",
      ta: "வெளிநாட்டுப் பணிகள், சர்வதேச வர்த்தக நிறுவனங்கள் அல்லது சுற்றுலா சார்ந்த நெட்வொர்க்குகள் மூலம் பெறப்பட்ட மகத்தான நிதி வெற்றி இவர்களுடையது. தனிப்பட்ட சொத்து மதிப்பை அதிகரிக்க வெளிநாட்டு கூட்டாளர்களுடன் நிபுணத்துவத்துடன் ஒத்துழைக்கிறார்கள். நிறுவன முதலீடுகள் சிறந்த ஸ்திரத்தன்மையைக் கொண்டுவரும்."
    },
    personality: {
      en: "Friendly, cooperative, highly resilient, and deeply dedicated to global harmony and networking. They maintain a soft exterior but harbor a highly resilient core that survives life's cold winters. They are loyal friends.",
      ta: "அன்பான, ஒத்துழைக்கும் குணம் கொண்ட, மீண்டெழும் திறன் மற்றும் உலகளாவிய நல்லிணக்கம் மற்றும் நெட்வொர்க்கிங்கில் அர்ப்பணிப்புள்ளவர்கள். இவர்கள் வெளியில் மென்மையாகத் தோன்றினாலும், வாழ்க்கையின் கடினமான காலங்களைத் தாங்கும் வலுவான உள்மனதைக் கொண்டுள்ளனர். இவர்கள் விசுவாசமான நண்பர்கள்."
    }
  },
  "Jyeshtha": {
    nameEn: "Jyeshtha",
    nameTa: "கேட்டை",
    rulingPlanet: "Mercury",
    rulingPlanetTa: "புதன்",
    deity: "Indra",
    deityTa: "இந்திரன்",
    symbol: "Umbrella or Earring",
    symbolTa: "குடை",
    luckyNumber: "5",
    luckyColor: "Cream",
    luckyColorTa: "கிரீம் நிறம்",
    luckyDay: "Wednesday",
    luckyDayTa: "புதன்கிழமை",
    gemstone: "Emerald",
    gemstoneTa: "மரகதம்",
    career: {
      en: "Thrive in defense services, corporate crisis control, protection management, and senior execution roles. Their commanding persona enables them to lead large teams during difficult transitions. Analytical fields and financial advising suit them.",
      ta: "பாதுகாப்பு சேவைகள், கார்ப்பரேட் நெருக்கடி கட்டுப்பாடு, பாதுகாப்பு மேலாண்மை மற்றும் மூத்த நிர்வாகப் பொறுப்புகளில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் ஆளுமைத்திறன் கடினமான காலங்களில் பெரிய குழுக்களை வழிநடத்த உதவும். பகுப்பாய்வுத் துறைகளும் நிதி ஆலோசனைகளும் இவர்களுக்குப் பொருந்தும்."
    },
    love: {
      en: "Protective, intensely emotional, and traditional in protecting their domestic partner. They seek mature companions who can handle their shifting mood swings and provide deep loyalty. Trust, once broken, is nearly impossible for them to restore.",
      ta: "தங்கள் குடும்பத் துணையைப் பாதுகாப்பதில் பாதுகாப்புணர்வு, தீவிர உணர்ச்சி மற்றும் பாரம்பரிய அணுகுமுறை கொண்டவர்கள். தங்களின் மாறும் மனநிலையைக் கையாளக்கூடிய மற்றும் ஆழமான விசுவாசத்தை வழங்கக்கூடிய முதிர்ந்த துணையை இவர்கள் தேடுவார்கள். நம்பிக்கை ஒருமுறை உடைந்தால், அதை மீட்டெடுப்பது இவர்களுக்கு சாத்தியமற்றது."
    },
    health: {
      en: "Vulnerable to chronic joint pain, muscular aches, right-side shoulder issues, and reproductive health struggles. Maintaining proper posture and active movement prevents early joint calcification. Regular physical examinations are protective.",
      ta: "நாள்பட்ட மூட்டு வலி, தசை வலிகள், வலது பக்க தோள்பட்டை பிரச்சனைகள் மற்றும் இனப்பெருக்க ஆரோக்கிய போராட்டங்களால் பாதிக்கப்படலாம். முறையான உட்காரும் நிலை மற்றும் சுறுசுறுப்பான இயக்கம் ஆரம்பகால மூட்டு விறைப்பைத் தடுக்கும். வழக்கமான மருத்துவ பரிசோதனைகள் பாதுகாப்பளிக்கும்."
    },
    finance: {
      en: "Earn strong income through protection management, government consulting roles, and strategic crisis management. They gain absolute wealth accumulation late in life but must watch out for family asset litigation. Shrewd tax planning preserves assets.",
      ta: "பாதுகாப்பு மேலாண்மை, அரசு ஆலோசனைப் பொறுப்புகள் மற்றும் மூலோபாய நெருக்கடி மேலாண்மை மூலம் வலுவான வருமானம் ஈட்டுவார்கள். வாழ்க்கையின் பிற்பகுதியில் முழுமையான செல்வச் சேர்க்கையைப் பெறுகிறார்கள் ஆனால் குடும்பச் சொத்து வழக்குகளில் கவனமாக இருக்க வேண்டும். புத்திசாலித்தனமான வரி திட்டமிடல் சொத்துக்களைக் காக்கும்."
    },
    personality: {
      en: "Courageous, highly protective, independent, and carrying a natural senior or elder persona. They are highly protective of their family circle but can exhibit severe pride or hidden insecurities. They are powerful leaders.",
      ta: "துணிச்சலான, தற்காப்பு குணம் கொண்ட, சுதந்திரமான மற்றும் இயற்கையிலேயே ஒரு மூத்த ஆளுமையைக் கொண்டவர்கள். இவர்கள் தங்களின் குடும்ப வட்டத்தைப் பாதுகாப்பதில் மிகுந்த கவனம் செலுத்துகிறார்கள், ஆனால் கடுமையான பெருமை அல்லது மறைக்கப்பட்ட பாதுகாப்பின்மையைக் காட்டலாம். இவர்கள் சக்திவாய்ந்த தலைவர்கள்."
    }
  },
  "Mula": {
    nameEn: "Mula",
    nameTa: "மூலம்",
    rulingPlanet: "Ketu",
    rulingPlanetTa: "கேது",
    deity: "Nirriti",
    deityTa: "நிருதி",
    symbol: "Tied Bunch of Roots",
    symbolTa: "வேர்களின் தொகுப்பு",
    luckyNumber: "7",
    luckyColor: "Mustard Yellow",
    luckyColorTa: "கடுகு மஞ்சள்",
    luckyDay: "Tuesday",
    luckyDayTa: "செவ்வாய்க்கிழமை",
    gemstone: "Cat's Eye",
    gemstoneTa: "வைடூரியம்",
    career: {
      en: "Excel in deep research, investigation, herbal medicine, philosophy, and historical studies. They prefer jobs that challenge the roots of concepts and involve uncovering ancient or hidden knowledge. Agriculture or dentistry can also be fields of interest.",
      ta: "ஆழ்ந்த ஆராய்ச்சி, புலனாய்வு, மூலிகை மருத்துவம், தத்துவம் மற்றும் வரலாற்று ஆய்வுகளில் இவர்கள் சிறந்து விளங்குவார்கள். கருத்துக்களின் அடிப்படையைச் சவாலுக்கு உட்படுத்தும் மற்றும் பண்டைய அல்லது மறைக்கப்பட்ட அறிவை வெளிப்படுத்தும் பணிகளை இவர்கள் விரும்புவார்கள். விவசாயம் அல்லது பல் மருத்துவமும் இவர்களின் ஆர்வமுள்ள துறைகளாக இருக்கலாம்."
    },
    love: {
      en: "Intense, independent, and frequently experiences transformational changes in love. They need non-judgmental partners who understand their complex philosophical outlook and spiritual nature. Mutual space and transparency preserve the relationship.",
      ta: "தீவிரமான, சுதந்திரமான மற்றும் காதலில் அடிக்கடி உருமாறும் மாற்றங்களை சந்திப்பவர்கள். இவர்களின் சிக்கலான தத்துவக் கண்ணோட்டத்தையும் ஆன்மீக இயல்பையும் புரிந்துகொள்ளும் விமர்சிக்காத துணையை இவர்கள் விரும்புகிறார்கள். பரஸ்பர இடமும் வெளிப்படைத்தன்மையும் உறவைக் காக்கும்."
    },
    health: {
      en: "Prone to sciatic nerve pain, hip joint discomfort, fractures, and blood impurities. They must practice mild joint stretches and follow a nutrient-dense organic eating habit. Avoiding psychological over-strain protects their neurological pathways.",
      ta: "சையாட்டிகா நரம்பு வலி, இடுப்பு மூட்டு அசௌகரியம், எலும்பு முறிவுகள் மற்றும் இரத்த அசுத்தங்கள் ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் லேசான மூட்டு பயிற்சிகளை மேற்கொள்ள வேண்டும் மற்றும் ஊட்டச்சத்து நிறைந்த ஆர்கானிக் உணவுப் பழக்கத்தைப் பின்பற்ற வேண்டும். மன அழுத்தத்தைத் தவிர்ப்பது இவர்களின் நரம்பு மண்டலத்தைப் பாதுகாக்கும்."
    },
    finance: {
      en: "Unpredictable financial patterns with sudden, immense windfalls followed by abrupt expenditures. They earn via deep extraction projects, rare resource trades, or research discoveries. Placing wealth into untouchable trust assets is highly recommended.",
      ta: "திடீர், மகத்தான வரவுகளும் அதைத் தொடர்ந்து திடீர் செலவுகளும் கொண்ட கணிக்க முடியாத நிதி முறைகள் இவர்களுடையது. ஆழமான பிரித்தெடுத்தல் திட்டங்கள், அரிய வள வர்த்தகம் அல்லது ஆராய்ச்சி கண்டுபிடிப்புகள் மூலம் சம்பாதிக்கிறார்கள். செல்வத்தை தொட முடியாத அறக்கட்டளை சொத்துக்களில் வைப்பது மிகவும் நல்லது."
    },
    personality: {
      en: "Philosophical, highly focused, non-conformist, and deeply interested in investigating root causes. They possess a bold, proud demeanor and are not afraid to destroy false concepts to reveal the truth. They are deeply spiritual.",
      ta: "தத்துவ சிந்தனை கொண்ட, மிகவும் கவனம் செலுத்தும், விதிகளை உடைக்கும் மற்றும் அடிப்படை காரணங்களை ஆராய்வதில் ஆழ்ந்த ஆர்வம் கொண்டவர்கள். இவர்களிடம் தைரியமான, பெருமிதமான நடத்தை உள்ளது, மேலும் உண்மையை வெளிப்படுத்த தவறான கருத்துக்களை அழிக்க பயப்பட மாட்டார்கள். இவர்கள் ஆழ்ந்த ஆன்மீகவாதிகள்."
    }
  },
  "Purva Ashadha": {
    nameEn: "Purva Ashadha",
    nameTa: "பூராடம்",
    rulingPlanet: "Venus",
    rulingPlanetTa: "சுக்கிரன்",
    deity: "Apas (Water Deity)",
    deityTa: "அபாஸ் (நீர் தேவதை)",
    symbol: "Winnowing Basket",
    symbolTa: "முறம்",
    luckyNumber: "9",
    luckyColor: "Blackish Pink",
    luckyColorTa: "கருமை கலந்த இளஞ்சிவப்பு",
    luckyDay: "Friday",
    luckyDayTa: "வெள்ளிக்கிழமை",
    gemstone: "Diamond",
    gemstoneTa: "வைரம்",
    career: {
      en: "Succeed in maritime jobs, creative writing, cinema, architecture, and public relations. Their natural optimistic energy helps them motivate teams and manage grand promotional events. They have high artistic potential.",
      ta: "கடல் சார்ந்த பணிகள், படைப்பு எழுத்து, சினிமா, கட்டடக்கலை மற்றும் மக்கள் தொடர்பு ஆகியவற்றில் இவர்கள் வெற்றி பெறுவார்கள். இவர்களின் இயல்பான நேர்மறை ஆற்றல் குழுக்களை ஊக்குவிக்கவும் பிரமாண்டமான விளம்பர நிகழ்ச்சிகளை நிர்வகிக்கவும் உதவும். இவர்களிடம் அதிக கலைத்திறன் உள்ளது."
    },
    love: {
      en: "Romantic, vibrant, and highly encouraging to their partners in marriage. They bring a joyful spirit into the household and cherish shared social activities and celebrations. They stand as pillars of hope during difficult emotional trials.",
      ta: "திருமண வாழ்க்கையில் தங்கள் துணைக்கு அன்பான, துடிப்பான மற்றும் மிகுந்த ஊக்கமளிப்பவராக இருப்பார்கள். இவர்கள் குடும்பத்திற்குள் ஒரு மகிழ்ச்சியான உணர்வைக் கொண்டுவருகிறார்கள் மற்றும் சமூக நடவடிக்கைகள் மற்றும் கொண்டாட்டங்களை விரும்புகிறார்கள். கடினமான காலங்களில் இவர்கள் நம்பிக்கையின் தூணாக நிற்கிறார்கள்."
    },
    health: {
      en: "Prone to kidney congestion, water retention, thigh muscle pull, and bladder infections. They should drink extensive amounts of herbal tea and water to maintain inner system clarity. Routine physical workouts defend their physical health.",
      ta: "சிறுநீரக நெரிசல், நீர் தேங்குதல், தொடை தசைப்பிடிப்பு மற்றும் சிறுநீர்ப்பை தொற்றுகள் ஏற்பட வாய்ப்புகள் உள்ளன. உட்புற அமைப்பின் தெளிவை பராமரிக்க இவர்கள் அதிக அளவு மூலிகை தேநீர் மற்றும் தண்ணீர் குடிக்க வேண்டும். வழக்கமான உடற்பயிற்சிகள் இவர்களின் உடல் ஆரோக்கியத்தைக் காக்கும்."
    },
    finance: {
      en: "Fortunate wealth growth through creative writing assets, water utility trades, luxury hotels, or strategic public promotions. They enjoy deep liquidity and expand their reach continuously. Diversifying into stable agriculture balances their profile.",
      ta: "படைப்பு எழுத்துச் சொத்துக்கள், நீர் பயன்பாட்டு வர்த்தகங்கள், ஆடம்பர ஹோட்டல்கள் அல்லது மூலோபாய பொது விளம்பரங்கள் மூலம் அதிர்ஷ்டமான செல்வ வளர்ச்சி இவர்களுடையது. இவர்கள் ஆழ்ந்த பணப்புழக்கத்தை அனுபவித்து, தங்கள் எல்லையைத் தொடர்ந்து விரிவுபடுத்துகிறார்கள். நிலையான விவசாயத்தில் ஈடுபடுவது இவர்களின் நிதியை சமநிலைப்படுத்தும்."
    },
    personality: {
      en: "Optimistic, charismatic, highly expressive, and possessing an unshakeable faith in their destiny. They love beautiful creations, clean waters, and large social gatherings where they serve as stars. They motivate others naturally.",
      ta: "நேர்மறையான, வசீகரமான, உணர்ச்சிகளை வெளிப்படுத்தும் மற்றும் தங்களின் விதியின் மீது அசைக்க முடியாத நம்பிக்கை கொண்டவர்கள். இவர்கள் அழகான படைப்புகள், தூய்மையான நீர்நிலைகள் மற்றும் தாங்கள் நட்சத்திரங்களாக விளங்கும் பெரிய சமூகக் கூட்டங்களை விரும்புகிறார்கள். மற்றவர்களை இயற்கையாகவே ஊக்குவிப்பார்கள்."
    }
  },
  "Uttara Ashadha": {
    nameEn: "Uttara Ashadha",
    nameTa: "உத்திராடம்",
    rulingPlanet: "Sun",
    rulingPlanetTa: "சூரியன்",
    deity: "Vishwadevas",
    deityTa: "விஸ்வதேவர்கள்",
    symbol: "Elephant's Tusk",
    symbolTa: "யானை தந்தம்",
    luckyNumber: "1",
    luckyColor: "Copper",
    luckyColorTa: "செப்பு நிறம்",
    luckyDay: "Sunday",
    luckyDayTa: "ஞாயிற்றுக்கிழமை",
    gemstone: "Ruby",
    gemstoneTa: "மாணிக்கம்",
    career: {
      en: "Thrive in public services, judicial roles, governance, and long-term corporate management. Their unyielding dedication to duty earns respect in administrative and high-ranking official jobs. They rarely change careers once settled.",
      ta: "பொதுச் சேவைகள், நீதித்துறைப் பொறுப்புகள், ஆட்சி மற்றும் நீண்ட கால கார்ப்பரேட் மேலாண்மையில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் கடமை தவறாத அர்ப்பணிப்பு நிர்வாக மற்றும் உயர்தர அதிகாரப்பூர்வ பணிகளில் மதிப்பைத் தரும். ஒருமுறை நிலைபெற்ற பிறகு இவர்கள் தொழிலை மாற்றுவது அரிது."
    },
    love: {
      en: "Exceedingly faithful, stable, and deeply enduring in long-term matrimonial bonds. They take relationships seriously and demonstrate love through quiet actions rather than grand verbal expressions. Absolute honesty is their foundational requirement.",
      ta: "நீண்ட கால திருமண பந்தங்களில் மிகுந்த விசுவாசம், ஸ்திரத்தன்மை மற்றும் ஆழ்ந்த சகிப்புத்தன்மை கொண்டவர்கள். இவர்கள் உறவுகளை தீவிரமாக எடுத்துக்கொள்கிறார்கள் மற்றும் பிரமாண்டமான வார்த்தைகளை விட அமைதியான செயல்கள் மூலம் அன்பை நிரூபிக்கிறார்கள். முழுமையான நேர்மை இவர்களின் அடிப்படைத் தேவையாகும்."
    },
    health: {
      en: "Prone to knee arthritis, joint degradation, skin dryness, and sluggish digestion during cold seasons. Consuming healthy dietary fats, staying hydrated, and keeping knees warm preserves active longevity. Sun exposure is highly health-promoting.",
      ta: "முழங்கால் மூட்டுவலி, மூட்டு தேய்மானம், தோல் வறட்சி மற்றும் குளிர் காலங்களில் மந்தமான செரிமானம் ஆகியவை ஏற்படலாம். ஆரோக்கியமான கொழுப்புகளை உட்கொள்வது, நீர்ச்சத்துடன் இருப்பது மற்றும் முழங்கால்களை வெதுவெதுப்பாக வைத்திருப்பது நீண்ட கால இயக்கத்தை பராமரிக்கும். சூரிய ஒளி படுவது ஆரோக்கியத்தை மேம்படுத்தும்."
    },
    finance: {
      en: "Highly stable, solid, and reliable financial growth that ascends steadily each year. They accumulate extensive wealth via long-term real estate, government partnerships, and blue-chip stocks. They never lose money on reckless, unproven trends.",
      ta: "ஒவ்வொரு ஆண்டும் சீராக உயரும் மிகவும் நிலையான, உறுதியான மற்றும் நம்பகமான நிதி வளர்ச்சி இவர்களுடையது. நீண்ட கால ரியல் எஸ்டேட், அரசு கூட்டாண்மை மற்றும் புளூ-சிப் பங்குகள் மூலம் விரிவான செல்வத்தை திரட்டுகிறார்கள். நிரூபிக்கப்படாத வழிகளில் இவர்கள் ஒருபோதும் பணத்தை இழக்க மாட்டார்கள்."
    },
    personality: {
      en: "Virtuous, stable, intensely disciplined, and highly respected for their absolute honesty. They hold a calm, dignified nature and perform duties flawlessly without expecting quick praise. They are reliable anchors for everyone.",
      ta: "நற்பண்புகள் கொண்ட, நிலையான, தீவிரமான ஒழுக்கமுடைய மற்றும் தங்களின் முழுமையான நேர்மைக்காக மிகவும் மதிக்கப்படுபவர்கள். இவர்கள் அமைதியான, கண்ணியமான இயல்பைக் கொண்டவர்கள் மற்றும் விரைவான பாராட்டை எதிர்பார்க்காமல் கடமைகளைச் சரியாகச் செய்வார்கள். அனைவருக்கும் நம்பகமான நங்கூரம் போன்றவர்கள்."
    }
  },
  "Shravana": {
    nameEn: "Shravana",
    nameTa: "திருவோணம்",
    rulingPlanet: "Moon",
    rulingPlanetTa: "சந்திரன்",
    deity: "Vishnu",
    deityTa: "விஷ்ணு",
    symbol: "Three Footprints",
    symbolTa: "மூன்று காலடிச்சுவடுகள்",
    luckyNumber: "2",
    luckyColor: "Light Blue",
    luckyColorTa: "இளநீலம்",
    luckyDay: "Monday",
    luckyDayTa: "திங்கட்கிழமை",
    gemstone: "Pearl",
    gemstoneTa: "முத்து",
    career: {
      en: "Excel in teaching, music, oral communication, broadcasting, and organizational training. Their listening abilities make them wonderful counselors, human resource specialists, and consultants. Translation or language preservation also suits them.",
      ta: "கற்பித்தல், இசை, வாய்மொழி தகவல் தொடர்பு, ஒளிபரப்பு மற்றும் நிறுவனப் பயிற்சி ஆகியவற்றில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் கேட்கும் திறன் இவர்களை சிறந்த ஆலோசகர்களாகவும், மனிதவள நிபுணர்களாகவும், ஆலோசகர்களாகவும் மாற்றும். மொழிபெயர்ப்பு அல்லது மொழிப் பாதுகாப்புத் துறையும் இவர்களுக்கு ஏற்றது."
    },
    love: {
      en: "Gentle, receptive, and highly respectful of their life partner's emotional choices. They enjoy serene, harmonious domestic environments filled with educational books, peaceful music, and philosophy. Open listening prevents major marital misunderstandings.",
      ta: "மென்மையான, ஏற்றுக்கொள்ளும் குணம் கொண்ட மற்றும் தங்கள் வாழ்க்கைத்துணையின் உணர்ச்சிப்பூர்வமான தேர்வுகளை மிகவும் மதிக்கும் குணம் கொண்டவர்கள். இவர்கள் புத்தகங்கள், அமைதியான இசை நிறைந்த இணக்கமான குடும்பச் சூழலை விரும்புகிறார்கள். திறந்த மனதுடன் கேட்பது பெரிய திருமண விபரீதங்களைத் தடுக்கும்."
    },
    health: {
      en: "Vulnerable to ear infections, skin hypersensitivities, digestive problems from anxiety, and upper back tightness. They must guard ears against heavy sound noises and practice mindfulness to balance digestive patterns. Periodic quiet time heals them.",
      ta: "காது தொற்றுகள், தோல் ஒவ்வாமை, கவலையால் ஏற்படும் செரிமான பிரச்சனைகள் மற்றும் மேல் முதுகு விறைப்பு ஆகியவற்றால் பாதிக்கப்படலாம். இவர்கள் அதிக சத்தத்திலிருந்து காதுகளைப் பாதுகாக்க வேண்டும் மற்றும் செரிமானத்தை சமநிலைப்படுத்த தியானம் செய்ய வேண்டும். அவ்வப்போது தனிமையில் இருப்பது இவர்களைக் குணப்படுத்தும்."
    },
    finance: {
      en: "Prosperous through education services, publishing projects, advisory consulting, and community networks. They attract comfortable wealth by maintaining absolute professional ethics and high social respect. Assets expand through intellectual rights.",
      ta: "கல்விச் சேவைகள், பதிப்பகத் திட்டங்கள், ஆலோசனை மற்றும் சமூக நெட்வொர்க்குகள் மூலம் செழிப்பானவர்கள். முழுமையான தொழில்முறை நெறிமுறைகள் மற்றும் உயர்ந்த சமூக மரியாதையைப் பராமரிப்பதன் மூலம் இவர்கள் வசதியான செல்வத்தை ஈர்க்கிறார்கள். அறிவுசார் உரிமைகள் மூலம் சொத்துக்கள் விரிவடைகின்றன."
    },
    personality: {
      en: "Knowledgeable, gentle, patient, and possessing incredible listening and learning capabilities. They values peace, high education, moral conduct, and traditional scriptures. Their peaceful presence heals chaotic situations.",
      ta: "அறிவு கூர்மை, மென்மையான, பொறுமையான மற்றும் வியக்கத்தக்க வகையில் கேட்கும் மற்றும் கற்கும் திறன் கொண்டவர்கள். இவர்கள் அமைதி, உயர் கல்வி, ஒழுக்கமான நடத்தை மற்றும் பாரம்பரிய நூல்களை மதிக்கிறார்கள். இவர்களின் அமைதியான ஆளுமை குழப்பமான சூழ்நிலைகளைச் சீராக்கும்."
    }
  },
  "Dhanishta": {
    nameEn: "Dhanishta",
    nameTa: "அவிட்டம்",
    rulingPlanet: "Mars",
    rulingPlanetTa: "செவ்வாய்",
    deity: "Eight Vasus",
    deityTa: "அஷ்ட வசுக்கள்",
    symbol: "Drum or Flute",
    symbolTa: "உடுக்கை / மிருதங்கம்",
    luckyNumber: "5",
    luckyColor: "Silver",
    luckyColorTa: "வெள்ளி",
    luckyDay: "Tuesday",
    luckyDayTa: "செவ்வாய்க்கிழமை",
    gemstone: "Coral",
    gemstoneTa: "பவளம்",
    career: {
      en: "Succeed in real estate, banking, music production, engineering, and resource management. Their connection with wealth and rhythm makes them excel in performing arts or high-stakes wealth management. They possess great structural foresight.",
      ta: "ரியல் எஸ்டேட், வங்கித்துறை, இசைத் தயாரிப்பு, பொறியியல் மற்றும் வள மேலாண்மை ஆகியவற்றில் இவர்கள் வெற்றி பெறுவார்கள். செல்வம் மற்றும் தாளத்துடனான இவர்களின் தொடர்பு இவர்களை நிகழ்த்து கலைகள் அல்லது உயர் நிதி நிர்வாகத்தில் சிறந்து விளங்கச் செய்யும். இவர்களிடம் சிறந்த தொலைநோக்கு பார்வை உள்ளது."
    },
    love: {
      en: "Express high devotion, marital commitment, and strong protection toward family members. They like sharing social accomplishments, musical interests, and financial successes with their spouse. Respecting the partner's individuality brings excellent peace.",
      ta: "குடும்ப உறுப்பினர்களிடம் அதிக அர்ப்பணிப்பு, திருமண உறுதி மற்றும் வலுவான பாதுகாப்புணர்வைக் காட்டுவார்கள். இவர்கள் சமூக சாதனைகள், இசை ஆர்வங்கள் மற்றும் நிதி வெற்றிகளைத் தங்கள் துணையுடன் பகிர்ந்து கொள்ள விரும்புகிறார்கள். துணையின் தனித்துவத்தை மதிப்பது சிறந்த அமைதியைத் தரும்."
    },
    health: {
      en: "Prone to ankle weakness, lower leg bone injuries, cardiac rhythm fluctuations, and anemia. Incorporating iron-rich nutrition and leg strengthening therapies ensures great physical health. Music-based meditation reduces blood pressure.",
      ta: "கணுக்கால் பலவீனம், கீழ் கால் எலும்பு காயங்கள், இதய துடிப்பு மாறுபாடுகள் மற்றும் இரத்த சோகை ஏற்பட வாய்ப்புகள் உள்ளன. இரும்புச்சத்து நிறைந்த உணவு மற்றும் கால் வலுப்படுத்தும் பயிற்சிகளை இணைப்பது சிறந்த ஆரோக்கியத்தை உறுதி செய்யும். இசை சார்ந்த தியானம் இரத்த அழுத்தத்தைக் குறைக்கும்."
    },
    finance: {
      en: "Vast wealth opportunities connected with musical properties, massive land banking, steel industries, or entertainment platforms. They carry natural financial accumulation genes and excel at expanding family capital. Secure assets guarantee long-term safety.",
      ta: "இசைச் சொத்துக்கள், பிரமாண்டமான நில வங்கி, எஃகு தொழில்கள் அல்லது பொழுதுபோக்கு தளங்களுடன் தொடர்புடைய பரந்த நிதி வாய்ப்புகள் இவர்களுடையது. இயற்கையான செல்வச் சேர்க்கை மரபணுக்களைக் கொண்ட இவர்கள், குடும்ப மூலதனத்தை விரிவாக்குவதில் சிறந்தவர்கள். பாதுகாப்பான சொத்துக்கள் நீண்ட கால பாதுகாப்பிற்கு உத்தரவாதம் அளிக்கின்றன."
    },
    personality: {
      en: "Vibrant, courageous, highly resourceful, and possessing a natural love for music, rhythm, and wealth. They are bold leaders who express high confidence and survive dark times with an energetic smile. They build grand legacies.",
      ta: "துடிப்பான, தைரியமான, அதிக வளம் கொண்ட மற்றும் இசை, தாளம் மற்றும் செல்வத்தின் மீது இயற்கையான அன்பு கொண்டவர்கள். இவர்கள் அதிக நம்பிக்கையை வெளிப்படுத்தும் தைரியமான தலைவர்கள் மற்றும் கடினமான காலங்களை சுறுசுறுப்பான புன்னகையுடன் கடப்பார்கள். இவர்கள் பெரிய பாரம்பரியத்தை உருவாக்குவார்கள்."
    }
  },
  "Shatabhisha": {
    nameEn: "Shatabhisha",
    nameTa: "சதயம்",
    rulingPlanet: "Rahu",
    rulingPlanetTa: "ராகு",
    deity: "Varuna",
    deityTa: "வருணன்",
    symbol: "100 Physicians or Empty Circle",
    symbolTa: "நூறு மருத்துவர்கள் / வட்டம்",
    luckyNumber: "4",
    luckyColor: "Aquamarine",
    luckyColorTa: "அக்வாமரைன்",
    luckyDay: "Saturday",
    luckyDayTa: "சனிக்கிழமை",
    gemstone: "Gomed / Hessonite",
    gemstoneTa: "கோமேதகம்",
    career: {
      en: "Prosper in technology, research science, aviation, advanced electronics, and healing arts. They work well in futuristic projects and fields requiring complex diagnostic problem-solving. Secretive or deep analytical roles attract them.",
      ta: "தொழில்நுட்பம், ஆராய்ச்சி அறிவியல், விமான போக்குவரத்து, மேம்பட்ட மின்னணுவியல் மற்றும் மருத்துவக் கலைகளில் இவர்கள் செழித்து விளங்குவார்கள். எதிர்கால திட்டங்கள் மற்றும் சிக்கலான கண்டறியும் சிக்கல்களைத் தீர்க்கும் துறைகளில் இவர்கள் சிறப்பாகச் செயல்படுவார்கள். ரகசியமான அல்லது ஆழமான பகுப்பாய்வுப் பாத்திரங்கள் இவர்களை ஈர்க்கும்."
    },
    love: {
      en: "Highly secretive, deeply emotional, and idealistic in searching for their perfect soulmate. They face initial emotional blockages but develop unshakeable loyalty once deep trust is realized. They need understanding companions who respect solitary reflection.",
      ta: "தங்களின் சரியான ஆத்மார்த்தமான துணையைத் தேடுவதில் மிகவும் ரகசியமான, ஆழ்ந்த உணர்ச்சி மற்றும் இலட்சியவாதம் கொண்டவர்கள். இவர்கள் ஆரம்பத்தில் உணர்ச்சித் தடைகளை எதிர்கொண்டாலும், ஆழமான நம்பிக்கை ஏற்பட்டவுடன் அசைக்க முடியாத விசுவாசத்தை வளர்த்துக் கொள்கிறார்கள். தனிமையை மதிக்கும் துணையை இவர்கள் விரும்புகிறார்கள்."
    },
    health: {
      en: "Prone to complex medical diagnoses, chronic skin eczemas, leg palpitations, and neural conditions. They must steer clear of intoxicating substances and heavily processed medicines. Natural healing through fasts and clean living works best.",
      ta: "சிக்கலான மருத்துவக் கண்டறிதல்கள், நாள்பட்ட தோல் அரிப்பு, கால் படபடப்பு மற்றும் நரம்பு நிலைகள் ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் போதைப்பொருள் மற்றும் அதிக பதப்படுத்தப்பட்ட மருந்துகளைத் தவிர்க்க வேண்டும். விரதங்கள் மற்றும் தூய்மையான வாழ்க்கை மூலம் இயற்கை சிகிச்சை சிறந்த பலனைத் தரும்."
    },
    finance: {
      en: "Financial gains emerge from advanced scientific discoveries, electronic trade, global networks, and alternative therapies. They can face sudden fluctuations if financial records are poorly managed. Professional wealth oversight is vital.",
      ta: "மேம்பட்ட அறிவியல் கண்டுபிடிப்புகள், மின்னணு வர்த்தகம், உலகளாவிய நெட்வொர்க்குகள் மற்றும் மாற்று சிகிச்சைகள் மூலம் நிதி ஆதாயங்கள் வெளிப்படுகின்றன. நிதிப் பதிவுகள் மோசமாக நிர்வகிக்கப்பட்டால் திடீர் ஏற்ற இறக்கங்களைச் சந்திக்க நேரிடலாம். தொழில்முறை நிதி மேற்பார்வை முக்கியமானது."
    },
    personality: {
      en: "Mystical, highly philosophical, reclusive, and carrying an eccentric, forward-looking visionary mind. They look at the world from a unique angle and love solitary thinking or serving large human welfare causes. They are deeply private.",
      ta: "ஆன்மீகத் தன்மை, தத்துவ சிந்தனை, தனிமை விரும்பும் மற்றும் முன்னோக்கு சிந்தனை கொண்ட தொலைநோக்கு பார்வை உடையவர்கள். உலகை ஒரு தனித்துவமான கோணத்தில் பார்க்கும் இவர்கள், தனித்து சிந்திப்பதையோ அல்லது பெரிய மனிதநேயப் பணிகளுக்குச் சேவை செய்வதையோ விரும்புவார்கள். ரகசியமானவர்கள்."
    }
  },
  "Purva Bhadrapada": {
    nameEn: "Purva Bhadrapada",
    nameTa: "பூரட்டாதி",
    rulingPlanet: "Jupiter",
    rulingPlanetTa: "குரு",
    deity: "Aja Ekapada",
    deityTa: "அஜ ஏகபாதன்",
    symbol: "Swords or Front of Funeral Cot",
    symbolTa: "கட்டிலின் கால் பகுதி",
    luckyNumber: "3",
    luckyColor: "Silver Grey",
    luckyColorTa: "வெள்ளி சாம்பல்",
    luckyDay: "Thursday",
    luckyDayTa: "வியாழக்கிழமை",
    gemstone: "Yellow Sapphire",
    gemstoneTa: "கனகபுஷ்பராகம்",
    career: {
      en: "Excel in high finance, corporate restructuring, teaching, occult studies, and non-profit reforms. Their intense focus allows them to complete visionary transformations that others consider impossible. They are dedicated pioneers.",
      ta: "உயர் நிதி, கார்ப்பரேட் மறுசீரமைப்பு, கற்பித்தல், ஆன்மீக ஆய்வுகள் மற்றும் தொண்டு நிறுவன சீர்திருத்தங்களில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் தீவிர கவனம் மற்றவர்கள் சாத்தியமற்றது என்று கருதும் தொலைநோக்கு மாற்றங்களை முடிக்க அனுமதிக்கும். இவர்கள் அர்ப்பணிப்புள்ள முன்னோடிகள்."
    },
    love: {
      en: "Passionate, intense, and ready to undergo massive sacrifices for their romantic companion. They hold idealistic views of relationships and can become deeply attached or detached abruptly. Finding emotional balance together is the key.",
      ta: "உணர்ச்சிமிக்க, தீவிரமான மற்றும் தங்கள் காதல் துணையாக பெரிய தியாகங்களைச் செய்யத் தயாராக இருப்பவர்கள். இவர்கள் உறவுகளைப் பற்றிய இலட்சியக் கருத்துக்களைக் கொண்டுள்ளனர் மற்றும் திடீரென ஆழமான ஈடுபாடு அல்லது பற்றின்மையை அடையலாம். ஒன்றிணைந்து உணர்ச்சி சமநிலையைக் கண்டறிவதே இதன் முக்கிய ரகசியமாகும்."
    },
    health: {
      en: "Prone to foot swelling, liver swelling, low digestive enzyme production, and sleeping difficulties. Adopting a low-fat dietary habit and staying active throughout the daytime hours corrects these metabolic processes. Regular deep sleep patterns heal them.",
      ta: "கால் வீக்கம், கல்லீரல் வீக்கம், குறைந்த செரிமான நொதி உற்பத்தி மற்றும் தூக்கக் சிரமங்கள் ஏற்பட வாய்ப்புகள் உள்ளன. குறைந்த கொழுப்புள்ள உணவுப் பழக்கத்தைக் கடைப்பிடிப்பதும், பகல் நேரத்தில் சுறுசுறுப்பாக இருப்பதும் இந்த வளர்சிதை மாற்ற செயல்முறைகளைச் சீராக்கும். வழக்கமான ஆழ்ந்த உறக்கம் இவர்களைக் குணப்படுத்தும்."
    },
    finance: {
      en: "Wealth is generated through corporate planning, major institutional assets, education systems, or high-end inheritance. They focus on executing large projects that yield massive future payouts. Wise distribution prevents legal tax complexities.",
      ta: "கார்ப்பரேட் திட்டமிடல், பெரிய நிறுவன சொத்துக்கள், கல்வி முறைகள் அல்லது உயர்தர பரம்பரை சொத்துக்கள் மூலம் செல்வம் உருவாக்கப்படுகிறது. எதிர்காலத்தில் பெரும் பலனைத் தரும் பெரிய திட்டங்களை செயல்படுத்துவதில் கவனம் செலுத்துகிறார்கள். புத்திசாலித்தனமான பகிர்வு சட்டபூர்வமான வரி சிக்கல்களைத் தவிர்க்கும்."
    },
    personality: {
      en: "Intense, idealistic, deeply passionate, and possessing a unique dual nature of severe focus and complete detachments. They express independent views boldly and fight fiercely for social causes or transformational paths. They are visionary rebels.",
      ta: "தீவிரமான, இலட்சியவாத, ஆழ்ந்த உணர்ச்சிமிக்க மற்றும் கடுமையான கவனம் மற்றும் முழுமையான பற்றின்மை போன்ற தனித்துவமான இரட்டை இயல்பைக் கொண்டவர்கள். இவர்கள் சுயாதீனமான கருத்துக்களை தைரியமாக வெளிப்படுத்துகிறார்கள் மற்றும் சமூக காரணங்களுக்காக அல்லது மாற்று வழிகளுக்காக கடுமையாக போராடுகிறார்கள். தொலைநோக்கு பார்வை கொண்டவர்கள்."
    }
  },
  "Uttara Bhadrapada": {
    nameEn: "Uttara Bhadrapada",
    nameTa: "உத்திரட்டாதி",
    rulingPlanet: "Saturn",
    rulingPlanetTa: "சனி",
    deity: "Ahirbudhnya",
    deityTa: "அஹிர்புத்னியன்",
    symbol: "Twins or Back of Funeral Cot",
    symbolTa: "இரட்டையர்கள்",
    luckyNumber: "8",
    luckyColor: "Purple",
    luckyColorTa: "ஊதா",
    luckyDay: "Saturday",
    luckyDayTa: "சனிக்கிழமை",
    gemstone: "Blue Sapphire",
    gemstoneTa: "நீலம்",
    career: {
      en: "Succeed in global investments, corporate counseling, spirituality, writing, and administrative fields. They bring stability and deep wisdom to any corporate board or organization they serve. Retirement planning or long-term projects are ideal.",
      ta: "உலகளாவிய முதலீடுகள், கார்ப்பரேட் ஆலோசனை, ஆன்மீகம், எழுத்து மற்றும் நிர்வாகத் துறைகளில் இவர்கள் வெற்றி பெறுவார்கள். இவர்கள் சேவை செய்யும் எந்தவொரு கார்ப்பரேட் குழுவிற்கும் அல்லது நிறுவனத்திற்கும் ஸ்திரத்தன்மையையும் ஆழமான ஞானத்தையும் கொண்டு வருகிறார்கள். ஓய்வூதியத் திட்டமிடல் அல்லது நீண்ட கால திட்டங்கள் இவர்களுக்கு ஏற்றவை."
    },
    love: {
      en: "Nurturing, extremely stable, and deeply compassionate life partners. They excel at building highly organized, peaceful, and comforting homes for their loved ones. They express affection through enduring patience and wise advice.",
      ta: "அரவணைப்பு, மிகவும் நிலையான மற்றும் ஆழ்ந்த இரக்கமுள்ள வாழ்க்கைத்துணையாக இருப்பார்கள். இவர்கள் தங்கள் அன்புக்குரியவர்களுக்காக மிகவும் ஒழுங்கமைக்கப்பட்ட, அமைதியான மற்றும் ஆறுதலான இல்லங்களை உருவாக்குவதில் சிறந்தவர்கள். இவர்கள் நீடித்த பொறுமை மற்றும் புத்திசாலித்தனமான ஆலோசனைகள் மூலம் அன்பை வெளிப்படுத்துகிறார்கள்."
    },
    health: {
      en: "Vulnerable to foot nerve pain, cold extremities, bone issues in the feet, and general lethargy. Keeping the feet warm, using therapeutic massage oils, and remaining physically active safeguards their continuous energy flow. Hydration is required.",
      ta: "கால் நரம்பு வலி, குளிர்ச்சியான கைகால்கள், பாதங்களில் எலும்புப் பிரச்சனைகள் மற்றும் பொதுவான மந்தநிலை ஆகியவற்றால் பாதிக்கப்படலாம். பாதங்களை வெதுவெதுப்பாக வைத்திருப்பது, மசாஜ் எண்ணெய்களைப் பயன்படுத்துவது மற்றும் சுறுசுறுப்பாக இருப்பது இவர்களின் ஆற்றல் ஓட்டத்தைப் பாதுகாக்கும். நீர்ச்சத்து அவசியம்."
    },
    finance: {
      en: "Excellent long-term wealth stability through real estate acquisition, global trust accounts, and conservative retirement funds. They make secure decisions and are often custodians of ancestral or community capital. Steady growth matches their life path.",
      ta: "ரியல் எஸ்டேட் கையகப்படுத்துதல், உலகளாவிய அறக்கட்டளை கணக்குகள் மற்றும் பழமைவாத ஓய்வூதிய நிதிகள் மூலம் சிறந்த நீண்ட கால நிதி ஸ்திரத்தன்மை இவர்களுடையது. இவர்கள் பாதுகாப்பான முடிவுகளை எடுக்கிறார்கள் மற்றும் பெரும்பாலும் பூர்வீக அல்லது சமூக மூலதனத்தின் பாதுகாவலர்களாக இருக்கிறார்கள். நிலையான வளர்ச்சி இவர்களின் வாழ்க்கைப்பாதைக்கு பொருந்தும்."
    },
    personality: {
      en: "Calm, profoundly wise, compassionate, and possessing stable emotional control and patience. They act as exceptional counselors and spiritual guides who heal suffering people with wise words. They enjoy solitude and long projects.",
      ta: "அமைதியான, ஆழமான ஞானம், இரக்கம் மற்றும் நிலையான உணர்ச்சி கட்டுப்பாடு மற்றும் பொறுமை கொண்டவர்கள். இவர்கள் துன்பப்படும் மக்களுக்கு புத்திசாலித்தனமான வார்த்தைகளால் குணப்படுத்தும் விதிவிலக்கான ஆலோசகர்களாகவும் ஆன்மீக வழிகாட்டிகளாகவும் செயல்படுகிறார்கள். தனிமையையும் நீண்ட திட்டங்களையும் விரும்புவார்கள்."
    }
  },
  "Revati": {
    nameEn: "Revati",
    nameTa: "ரேவதி",
    rulingPlanet: "Mercury",
    rulingPlanetTa: "புதன்",
    deity: "Pushan",
    deityTa: "பூஷன்",
    symbol: "Fish",
    symbolTa: "மீன்",
    luckyNumber: "5",
    luckyColor: "Brown",
    luckyColorTa: "பழுப்பு",
    luckyDay: "Wednesday",
    luckyDayTa: "புதன்கிழமை",
    gemstone: "Emerald",
    gemstoneTa: "மரகதம்",
    career: {
      en: "Thrive in arts, international relations, travel guidance, veterinary medicine, and media production. Their compassionate nature and creative vision ensure beautiful outcomes in visual arts or social welfare. They are brilliant in jobs requiring empathy.",
      ta: "கலை, சர்வதேச உறவுகள், சுற்றுலா வழிகாட்டுதல், கால்நடை மருத்துவம் மற்றும் ஊடகத் தயாரிப்பு ஆகியவற்றில் இவர்கள் சிறந்து விளங்குவார்கள். இவர்களின் இரக்கமுள்ள குணமும் ஆக்கபூர்வமான பார்வையும் காட்சி கலைகள் அல்லது சமூக நலனில் அழகான முடிவுகளை உறுதி செய்யும். அனுதாபம் தேவைப்படும் பணிகளில் இவர்கள் சிறந்தவர்கள்."
    },
    love: {
      en: "Compassionate, unconditionally loving, and deeply spiritual in romantic unions. They support their partner's dreams selflessly and cultivate a soft, imaginative domestic environment. They need protective spouses to guard them against exploitation.",
      ta: "காதல் இணைப்புகளில் இரக்கமுள்ள, நிபந்தனையற்ற அன்பான மற்றும் ஆழ்ந்த ஆன்மீக குணம் கொண்டவர்கள். இவர்கள் தங்கள் துணையின் கனவுகளுக்கு சுயநலமின்றி ஆதரவளிப்பார்கள் மற்றும் ஒரு மென்மையான, கற்பனையான குடும்பச் சூழலை வளர்ப்பார்கள். சுரண்டலில் இருந்து தங்களைப் பாதுகாக்க இவர்களுக்குப் பாதுகாப்புள்ள துணை தேவை."
    },
    health: {
      en: "Prone to delicate digestive organs, foot deformities, abdominal cramps, and mental anxiety syndromes. They must establish strict daily feeding times and practice daily grounding techniques near water or green grass. Soft exercises work best.",
      ta: "மென்மையான செரிமான உறுப்புகள், பாத குறைபாடுகள், வயிற்றுப் பிடிப்பு மற்றும் மனக்கவலை நோய்க்குறிகள் ஏற்பட வாய்ப்புகள் உள்ளன. இவர்கள் கண்டிப்பான தினசரி உணவு நேரத்தை நிறுவ வேண்டும் மற்றும் தண்ணீர் அல்லது பச்சை புல் அருகில் தியானம் செய்ய வேண்டும். மென்மையான உடற்பயிற்சிகள் சிறப்பாகச் செயல்படும்."
    },
    finance: {
      en: "Abundant financial luck in international shipping, creative fine arts, hospitality chains, and language travel businesses. They often receive unexpected fiscal support from abroad or helpful mentors. Secure insurance policies protect their fluid wealth.",
      ta: "சர்வதேச கப்பல் போக்குவரத்து, ஆக்கபூர்வமான நுண்கலைகள், விருந்தோம்பல் சங்கிலிகள் மற்றும் மொழி சுற்றுலா வணிகங்களில் ஏராளமான நிதி அதிர்ஷ்டம் இவர்களுடையது. இவர்கள் பெரும்பாலும் வெளிநாட்டில் இருந்து அல்லது உதவிகரமான வழிகாட்டிகளிடமிருந்து எதிர்பாராத நிதி ஆதரவைப் பெறுகிறார்கள். பாதுகாப்பான காப்பீட்டு கொள்கைகள் இவர்களின் செல்வத்தைப் பாதுகாக்கும்."
    },
    personality: {
      en: "Compassionate, imaginative, deeply artistic, and possessing a gentle, sweet, and welcoming persona. They love traveling, fine arts, animals, and guiding lost souls safely back to their paths. They are pure-hearted dreamers.",
      ta: "இரக்கமுள்ள, கற்பனைத்திறன் மிக்க, ஆழ்ந்த கலைநயம் கொண்ட மற்றும் மென்மையான, இனிமையான மற்றும் வரவேற்கும் ஆளுமை கொண்டவர்கள். இவர்கள் பயணம், நுண்கலைகள், விலங்குகளை விரும்புவார்கள் மற்றும் இழந்த ஆன்மாக்களை பாதுகாப்பாக அவர்களின் பாதைகளுக்கு வழிநடத்துவார்கள். தூய இதயம் கொண்ட கனவு காண்பவர்கள்."
    }
  },
};
