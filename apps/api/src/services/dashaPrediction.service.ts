export interface DashaPredictionResult {
  mahadasha_lord: string;
  bhukti_lord: string;
  mahadasha_prediction_en: string;
  mahadasha_prediction_ta: string;
  bhukti_prediction_en: string;
  bhukti_prediction_ta: string;
}

const MAHADASHA_PREDICTIONS: Record<string, { en: string; ta: string }> = {
  Sun: {
    en: 'The Sun (Surya) Mahadasha brings focus on career, power, administrative authority, and leadership. You will experience an increase in self-confidence, recognition from superiors, and support from government bodies or father figures. However, watch out for high ego, heat-related health issues, or headstrong decisions.',
    ta: 'சூரிய மகாதிசை உங்களுக்கு தொழில், அதிகாரம், நிர்வாகத் திறன் மற்றும் தலைமைத்துவத்தில் முன்னேற்றத்தைத் தரும். தன்னம்பிக்கை அதிகரிக்கும், அரசு வழியில் அல்லது தந்தை வழியில் ஆதாயம் உண்டாகும். எனினும், அதிக கோபம், உஷ்ணம் சம்பந்தமான உடல் உபாதைகள் மற்றும் அவசர முடிவுகளைத் தவிர்ப்பது நல்லது.'
  },
  Moon: {
    en: 'The Moon (Chandra) Mahadasha centers on mental peace, emotions, domestic happiness, and creativity. It is a period of journeys, artistic achievements, public connection, and support from mother figures. If the Moon is well-placed, it brings prosperity and liquid wealth; if weak, it might cause emotional instability or cold-related ailments.',
    ta: 'சந்திர மகாதிசை மன அமைதி, சுப காரியங்கள், தாய்வழி ஆதரவு மற்றும் கலைத் துறையில் ஆர்வத்தை ஏற்படுத்தும். பயணங்கள் மூலம் நன்மை விளையும், திரவ வஸ்துக்கள் வழியே லாபம் உண்டாகும். சந்திரன் பலவீனமாக இருந்தால் மனக்குழப்பம், சளி அல்லது நுரையீரல் சார்ந்த உபாதைகள் வந்து நீங்கும்.'
  },
  Mars: {
    en: 'The Mars (Sevvai) Mahadasha is a time of courage, high energy, property purchases, and brothers. You will gain strength to overcome enemies and succeed in litigation. Opportunities in real estate, engineering, or security fields are favored. Guard against anger, blood pressure, accident risks, and arguments.',
    ta: 'செவ்வாய் மகாதிசை உங்களுக்கு தைரியம், சுறுசுறுப்பு, பூமி அல்லது வீடு வாங்குதல் மற்றும் சகோதரர்கள் மூலம் நன்மைகளைத் தரும். எதிரிகளை வெல்லும் ஆற்றல் உண்டாகும். ரியல் எஸ்டேட் மற்றும் பொறியியல் துறைகளில் லாபம் கிட்டும். அதிக கோபம், இரத்த அழுத்தம் மற்றும் விபத்துகளில் எச்சரிக்கை தேவை.'
  },
  Rahu: {
    en: 'The Rahu Mahadasha brings sudden gains, foreign opportunities, ambition, and material desires. It is a highly transformative period where you can achieve unconventional success. However, Rahu can also bring illusions, confusion, mental anxiety, sudden changes, and unknown fears if not spiritually aligned.',
    ta: 'ராகு மகாதிசை உங்களுக்கு திடீர் தனலாபம், வெளிநாட்டுப் பயணங்கள், பெரும் ஆசைகள் மற்றும் பொருள்வழியில் முன்னேற்றத்தைத் தரும். வழக்கத்திற்கு மாறான வழிகளில் வெற்றி கிடைக்கலாம். அதேசமயம், மனக்குழப்பம், இனம் புரியாத பயம், தேவையற்ற அலைச்சல்கள் மற்றும் ஏமாற்றங்கள் ஏற்படவும் வாய்ப்புள்ளது.'
  },
  Jupiter: {
    en: 'The Jupiter (Guru) Mahadasha is highly auspicious, bringing wisdom, spiritual growth, marriage, progeny, and wealth expansion. You will receive respect from society, success in education, and blessings of elders/gurus. This is a period of virtue, charity, and general happiness.',
    ta: 'குரு மகாதிசை மிகவும் சுபமான காலமாகும். இது உங்களுக்கு ஞானம், ஆன்மீக ஈடுபாடு, திருமணம், புத்திர பாக்கியம் மற்றும் தன வரவைத் தரும். சமூகத்தில் நல்ல மதிப்பும் மரியாதையும் உண்டாகும். சுப காரியங்கள் தடையின்றி நடக்கும், பெரியோர்களின் ஆசிகள் கிட்டும்.'
  },
  Saturn: {
    en: 'The Saturn (Sani) Mahadasha emphasizes discipline, patience, hard work, and life lessons. You will rise steadily through labor and perseverance. While it can bring delays, career struggles, joint pains, or mental pressure, it ultimately establishes maturity, long-term stability, and spiritual depth.',
    ta: 'சனி மகாதிசை பொறுமை, கடின உழைப்பு, மற்றும் வாழ்க்கைப் பாடங்களை உணர்த்தும் காலமாகும். விடாமுயற்சியால் படிப்படியான முன்னேற்றம் உண்டாகும். சில காரியத் தாமதங்கள், எலும்பு/மூட்டு வலி, அல்லது மன அழுத்தம் ஏற்பட்டாலும், இறுதியாக நிலையான நற்பெயரையும் ஆன்மீக முதிர்ச்சியையும் தரும்.'
  },
  Mercury: {
    en: 'The Mercury (Budhan) Mahadasha enhances intellect, speech, business success, education, and learning. It is an excellent period for writing, communications, trade, and starting new ventures. Relations with maternal uncles and siblings will improve. Enjoy a witty, active mind.',
    ta: 'புதன் மகாதிசை உங்களுக்கு அறிவுத்திறன், வாக்கு வன்மை, வியாபார வளர்ச்சி, கல்வி மற்றும் புதிய கலைகளைக் கற்கும் ஆற்றலைத் தரும். எழுத்து, தொடர்பு மற்றும் தரகு தொழில்களில் பெரும் லாபம் கிட்டும். குடும்பத்தில் மகிழ்ச்சியும், புத்திசாலித்தனமான முடிவுகளும் கைகூடும்.'
  },
  Ketu: {
    en: 'The Ketu Mahadasha represents detachment, spiritual liberation (Moksha), and interest in occult sciences. You might lose interest in worldly pleasures but gain deep inner peace. Some obstacles in career or relationships are indicated, serving to direct you toward spiritual realization.',
    ta: 'கேது மகாதிசை பற்றற்ற நிலை, ஆன்மீக நாட்டம், மற்றும் மறைபொருள் அறிவை வளர்க்கும் காலமாகும். உலகியல் இன்பங்களில் ஆர்வம் குறையலாம் ஆனால் ஆன்ம பலம் கூடும். தொழிலில் அல்லது உறவுகளில் சில தடைகளும் குழப்பங்களும் உங்களை ஆன்மீகப் பாதைக்கு வழிநடத்தும்.'
  },
  Venus: {
    en: 'The Venus (Sukran) Mahadasha is a highly creative and luxurious period. It brings material comfort, vehicles, marriage, love, arts, and general prosperity. Your social circle will expand, and you will enjoy premium comforts and pleasures. Guard against laziness or excessive indulgence.',
    ta: 'சுக்கிர மகாதிசை ஆடம்பரம், கலை ஆர்வம், வாகனம் வாங்குதல், திருமணம் மற்றும் சுகபோகங்களை அள்ளித்தரும் பொற்காலமாகும். சமூகத்தில் உங்களது செல்வாக்கு உயரும். புதிய சேர்க்கைகளால் மகிழ்ச்சி உண்டாகும். அதேசமயம் சோம்பேறித்தனம் மற்றும் வீண் விரயங்களைத் தவிர்க்கவும்.'
  }
};

const BHUKTI_PREDICTIONS: Record<string, Record<string, { en: string; ta: string }>> = {
  Sun: {
    Sun: {
      en: 'Sun Bhukti in Sun Dasa yields career growth, strong willpower, support from authorities, but high pride and risk of minor conflicts with father or elders.',
      ta: 'சூரிய திசையில் சூரிய புத்தி: உத்தியோக உயர்வு, தன்னம்பிக்கை அதிகரிக்கும். எனினும் அதிக கோபமும், தந்தை அல்லது அதிகாரிகளுடன் சிறு கருத்து வேறுபாடுகளும் ஏற்படலாம்.'
    },
    Moon: {
      en: 'Moon Bhukti in Sun Dasa brings mental peace, domestic comfort, and general success, though dual planetary energies can sometimes cause emotional fluctuations.',
      ta: 'சூரிய திசையில் சந்திர புத்தி: மன அமைதி, குடும்பத்தில் மகிழ்ச்சி ஏற்படும். எனினும் இருவேறு கிரக ஆதிக்கத்தால் அவ்வப்போது மனக்குழப்பம் வந்து நீங்கும்.'
    },
    Mars: {
      en: 'Mars Bhukti in Sun Dasa gives immense energy and courage. Good for property matters, but increases aggression, risk of accidents, and disputes.',
      ta: 'சூரிய திசையில் செவ்வாய் புத்தி: பூமி லாபம், தைரியம் கூடும். ஆனால் கோபம், சச்சரவுகள் மற்றும் உடல் உஷ்ணம் சார்ந்த நோய்கள் வர வாய்ப்புள்ளது.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Sun Dasa is a volatile period. Avoid new partnerships; expect unexpected changes, minor health scares, or administrative delays.',
      ta: 'சூரிய திசையில் ராகு புத்தி: திடீர் மாற்றங்கள், காரிய தாமதம் உண்டாகலாம். புதிய தொழில் முதலீடுகளைத் தவிர்த்து, ஆரோக்கியத்தில் கவனம் செலுத்துவது நல்லது.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Sun Dasa is highly auspicious. Success in career, learning, guidance from mentors, birth of children, and overall happiness.',
      ta: 'சூரிய திசையில் குரு புத்தி: மிகவும் அனுகூலமான காலம். பதவி உயர்வு, பண வரவு, குழந்தை பாக்கியம் மற்றும் ஆன்மீக காரியங்கள் கைகூடும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Sun Dasa is a testing period due to planetary enmity. Expect career delays, stress, and conflicts. Keep a low profile.',
      ta: 'சூரிய திசையில் சனி புத்தி: பகை கிரகங்களின் காலம் என்பதால் காரிய தடைகள், மன உளைச்சல் மற்றும் தேவையற்ற அலைச்சல்கள் ஏற்படலாம். பொறுமை அவசியம்.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Sun Dasa favors trade, education, logic, and communications. Success in intellectual pursuits and business dealings.',
      ta: 'சூரிய திசையில் புதன் புத்தி: வியாபார வளர்ச்சி, கல்வி முன்னேற்றம், புதிய தொடர்புகள் மூலம் நன்மைகள் விளையும். அறிவுபூர்வமான சிந்தனைகள் கைகூடும்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Sun Dasa brings detachment and spiritual inclination, along with professional confusion. Take care of physical health.',
      ta: 'சூரிய திசையில் கேது புத்தி: ஆன்மீக நாட்டம் அதிகரிக்கும். உத்தியோகத்தில் குழப்பங்கள் அல்லது அலைச்சல்கள் வரலாம். உடல்நலத்தில் அக்கறை காட்டவும்.'
    },
    Venus: {
      en: 'Venus Bhukti in Sun Dasa is moderately favorable. Good for social events, comfort, but guard against excessive spending and relationship differences.',
      ta: 'சூரிய திசையில் சுக்கிர புத்தி: சுப நிகழ்ச்சிகள், ஆடை ஆபரண சேர்க்கை உண்டாகும். அதேசமயம் குடும்பத்தில் சிறு கருத்து வேறுபாடுகள் வந்து நீங்கும்.'
    }
  },
  Moon: {
    Sun: {
      en: 'Sun Bhukti in Moon Dasa balances emotions with confidence. Good for work, but avoid being dominant or headstrong in family life.',
      ta: 'சந்திர திசையில் சூரிய புத்தி: தன்னம்பிக்கை உயரும், உத்தியோகம் சிறக்கும். எனினும் குடும்பத்தில் வீண் பிடிவாதங்களைத் தவிர்ப்பது நல்லது.'
    },
    Moon: {
      en: 'Moon Bhukti in Moon Dasa increases emotional depth, connection with mother/family, and artistic creativity, but causes minor cold/respiratory issues.',
      ta: 'சந்திர திசையில் சந்திர புத்தி: குடும்ப மகிழ்ச்சி, தாய்வழி ஆதரவு, புதிய சிந்தனைகள் பிறக்கும். நீர் சம்பந்தமான உபாதைகள் வரக்கூடும்.'
    },
    Mars: {
      en: 'Mars Bhukti in Moon Dasa brings rapid action, property gains, but high emotional anger and disputes. Maintain coolness.',
      ta: 'சந்திர திசையில் செவ்வாய் புத்தி: பூமி யோகம், சுறுசுறுப்பு கூடும். ஆனால் அவசர முடிவுகளாலும் கோபத்தாலும் தேவையற்ற சண்டைகள் வரலாம்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Moon Dasa triggers mental anxiety, bad dreams, and minor fears. Stay spiritually active and avoid negative thoughts.',
      ta: 'சந்திர திசையில் ராகு புத்தி: மன அமைதி குறையலாம், இனம் புரியாத பயம் தோன்றும். குலதெய்வ வழிபாடு மற்றும் நேர்மறை எண்ணங்கள் நன்மை தரும்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Moon Dasa (Gaja Kesari effect) is highly beneficial. Wealth, child birth, respect in society, and spiritual happiness.',
      ta: 'சந்திர திசையில் குரு புத்தி: கஜகேசரி யோகப் பலன்கள் கிட்டும். பண வரவு, புத்திர பாக்கியம், சுப காரியங்கள் கைகூடும். செல்வாக்கு உயரும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Moon Dasa causes delays, emotional distress, and sluggishness. Hard work is needed to sustain rewards.',
      ta: 'சந்திர திசையில் சனி புத்தி: காரிய அலைச்சல், மனச்சோர்வு, பணத் தட்டுப்பாடு வரலாம். எதிலும் கூடுதல் உழைப்பு செலுத்த வேண்டியதிருக்கும்.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Moon Dasa is excellent for trade, education, and clever calculations. Good relationship with family members.',
      ta: 'சந்திர திசையில் புதன் புத்தி: கல்வி மேன்மை, வியாபாரத்தில் லாபம், குடும்பத்தில் மகிழ்ச்சியான சூழல் நிலவும். புத்தி கூர்மை அடையும்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Moon Dasa represents spiritual insight but emotional alienation. Focus on meditation and temple visits.',
      ta: 'சந்திர திசையில் கேது புத்தி: ஆன்மீக ஈடுபாடு, தியானம், கோவில் வழிபாடுகள் மன அமைதியைத் தரும். உறவுகளிடம் பற்றற்ற நிலை வரலாம்.'
    },
    Venus: {
      en: 'Venus Bhukti in Moon Dasa is extremely pleasant. Purchase of luxury items, joy in marital life, financial comforts, and arts success.',
      ta: 'சந்திர திசையில் சுக்கிர புத்தி: ஆடை, ஆபரணம், வண்டி வாகன சேர்க்கை உண்டாகும். திருமண வாழ்க்கை மகிழ்ச்சி தரும், பணவரவு திருப்திகரமாக இருக்கும்.'
    }
  },
  Mars: {
    Sun: {
      en: 'Sun Bhukti in Mars Dasa is a highly fiery, energetic phase. Victory over opponents, high authority, but watch out for heat-related health and anger.',
      ta: 'செவ்வாய் திசையில் சூரிய புத்தி: அதிகார பலம், எதிரிகளை வெல்லும் ஆற்றல் உண்டாகும். ஆனால் உஷ்ண நோய்கள் மற்றும் கோபத்தை கட்டுப்படுத்த வேண்டும்.'
    },
    Moon: {
      en: 'Moon Bhukti in Mars Dasa gives emotional relief and properties, but can create relationship differences due to impulsive arguments.',
      ta: 'செவ்வாய் திசையில் சந்திர புத்தி: தாய்வழி ஆதரவு, பூமி சேர்க்கை உண்டாகும். எதையும் அவசரமாகப் பேசி வம்பில் மாட்டிக்கொள்ள வேண்டாம்.'
    },
    Mars: {
      en: 'Mars Bhukti in Mars Dasa yields extreme energy. Great for construction/property, but highly prone to injuries, arguments, and hot temper.',
      ta: 'செவ்வாய் திசையில் செவ்வாய் புத்தி: வீடு கட்டும் யோகம் கூடிவரும். ஆனால் இரத்த காயம், சண்டைகள் மற்றும் கோப உணர்வு மிக அதிகமாக இருக்கும்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Mars Dasa (Angaraka effect) is volatile. Watch out for accidents, sudden losses, and false accusations. Stay calm and prayerful.',
      ta: 'செவ்வாய் திசையில் ராகு புத்தி: விபத்து மற்றும் வீண் பழிச்சொற்கள் ஏற்பட வாய்ப்புள்ளது. புதிய முயற்சிகளைத் தவிர்த்து அமைதி காப்பது உசிதம்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Mars Dasa brings wisdom, wealth, marriage, and victory in legal disputes. Highly protective planetary phase.',
      ta: 'செவ்வாய் திசையில் குரு புத்தி: வழக்கு விவகாரங்களில் வெற்றி, தன லாபம், குடும்பத்தில் சுப நிகழ்வுகள் தடையின்றி நடக்கும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Mars Dasa is a period of friction and delays. Hard work will not get immediate rewards. Be careful of bone injuries.',
      ta: 'செவ்வாய் திசையில் சனி புத்தி: காரியத் தடைகள், உடல் நலிவு மற்றும் அலைச்சல்கள் இருக்கும். வண்டி வாகனங்களில் செல்லும்போது கூடுதல் கவனம் தேவை.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Mars Dasa is favorable for learning new skills, business, and sorting out financial debts. Avoid harsh words.',
      ta: 'செவ்வாய் திசையில் புதன் புத்தி: புதிய வித்தைகளைக் கற்றுக்கொள்ளலாம். கடன் சுமைகள் குறைய வழிகள் பிறக்கும். பேச்சில் நிதானம் தேவை.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Mars Dasa brings high spiritual focus but risk of cuts, burns, or misunderstandings. Keep away from arguments.',
      ta: 'செவ்வாய் திசையில் கேது புத்தி: ஆன்மீகத் தேடல் அதிகரிக்கும். நெருப்பு, கத்தி போன்ற ஆயுதங்களை கையாளும்போது எச்சரிக்கை தேவை.'
    },
    Venus: {
      en: 'Venus Bhukti in Mars Dasa is sweet but expensive. Luxuries, marriage, but high outflow of cash for decorative items or repairs.',
      ta: 'செவ்வாய் திசையில் சுக்கிர புத்தி: திருமண யோகம் கைகூடும். ஆடை ஆபரணம் வாங்க அதிக செலவு ஏற்படும். சுப விரயங்கள் உண்டாகும்.'
    }
  },
  Rahu: {
    Sun: {
      en: 'Sun Bhukti in Rahu Dasa is a challenging period. Fear of government or superiors, health issues, and conflicts with elders. Be patient.',
      ta: 'ராகு திசையில் சூரிய புத்தி: அரசு வழியில் அல்லது மேலதிகாரிகளால் நெருக்கடி, கண் திருஷ்டி, உடல் உபாதைகள் வந்து நீங்கும். பொறுமை அவசியம்.'
    },
    Moon: {
      en: 'Moon Bhukti in Rahu Dasa causes heavy mental tension, depressive thoughts, and confusion. Seek support of family and focus on prayer.',
      ta: 'ராகு திசையில் சந்திர புத்தி: மனக்குழப்பம், தேவையற்ற கற்பனை பயங்கள் ஏற்படும். தியானம் செய்வதும், அம்பாள் வழிபாடு செய்வதும் நலம் பயக்கும்.'
    },
    Mars: {
      en: 'Mars Bhukti in Rahu Dasa brings risk of accidents, injuries, and litigation. Avoid hot-headed arguments and drive slowly.',
      ta: 'ராகு திசையில் செவ்வாய் புத்தி: காரிய தடைகள், விபத்துக்கள், தேவையற்ற வீண் சச்சரவுகள் வரலாம். முருக வழிபாடு அமைதி தரும்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Rahu Dasa is a period of massive changes, foreign contacts, but heavy mental confusion and relationship tests.',
      ta: 'ராகு திசையில் ராகு புத்தி: இடமாற்றம், தொழில் மாற்றம் அல்லது வெளிநாட்டுப் பயணங்கள் ஏற்படலாம். மன அமைதி குறைய வாய்ப்புள்ளது.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Rahu Dasa is highly supportive. Recovery from health issues, spiritual guidance, financial improvements, and home comforts.',
      ta: 'ராகு திசையில் குரு புத்தி: சவால்கள் மறைந்து சுப விடிவு பிறக்கும். பண வரவு சீராகும், ஆன்மீக ஈடுபாடு மற்றும் குடும்பத்தில் மகிழ்ச்சி உண்டாகும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Rahu Dasa causes delays in career, obstacles, joint aches, and heavy workload. Steady patience is needed.',
      ta: 'ராகு திசையில் சனி புத்தி: தொழில் மந்த நிலை, உடல் சோர்வு, அதிக வேலைப்பளு இருக்கும். எதிலும் நிதானமாகச் செயல்படுவது நல்லது.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Rahu Dasa brings business development, positive communications, foreign travel, and success in learning.',
      ta: 'ராகு திசையில் புதன் புத்தி: புத்தி கூர்மையால் வியாபாரத்தில் வெற்றி, சுப செய்திகள், புதிய தொழில் வாய்ப்புகள் கைகூடும்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Rahu Dasa represents detachment, relationship testing, and sudden travels. Pray to Lord Ganesha for peace.',
      ta: 'ராகு திசையில் கேது புத்தி: பற்றற்ற நிலை, நண்பர்கள் அல்லது உறவினர்களுடன் மனஸ்தாபம் வரலாம். விநாயகர் வழிபாடு தடைகளை நீக்கும்.'
    },
    Venus: {
      en: 'Venus Bhukti in Rahu Dasa brings material pleasure, buying vehicle or home ornaments, but high spending. Maintain moderation.',
      ta: 'ராகு திசையில் சுக்கிர புத்தி: ஆடம்பரப் பொருட்கள் வாங்குதல், வண்டி வாகன சேர்க்கை உண்டாகும். அதேசமயம் ஆடம்பரச் செலவுகளைக் குறைப்பது நல்லது.'
    }
  },
  Jupiter: {
    Sun: {
      en: 'Sun Bhukti in Jupiter Dasa is highly positive. Government favors, promotions, health recovery, and spiritual visits.',
      ta: 'குரு திசையில் சூரிய புத்தி: அரசு வழியில் அனுகூலம், பதவி உயர்வு, ஆரோக்கியம் மேம்படும். ஆன்மீகப் பயணங்கள் மேற்கொள்ளலாம்.'
    },
    Moon: {
      en: 'Moon Bhukti in Jupiter Dasa (Kesari Yoga) brings high reputation, learning, birth of child, domestic bliss, and public support.',
      ta: 'குரு திசையில் சந்திர புத்தி: சமூகத்தில் நன்மதிப்பு, குழந்தை பாக்கியம், குடும்பத்தில் குதூகலம், பண வரவு திருப்திகரமாக இருக்கும்.'
    },
    Mars: {
      en: 'Mars Bhukti in Jupiter Dasa yields property purchases, resolution of court cases, and active professional success.',
      ta: 'குரு திசையில் செவ்வாய் புத்தி: பூமி லாபம், புதிய சொத்துக்கள் வாங்குதல், வழக்கு விவகாரங்களில் சாதகமான தீர்வு கிடைக்கும்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Jupiter Dasa gives success after initial struggles. Avoid speculative investments; prioritize health.',
      ta: 'குரு திசையில் ராகு புத்தி: ஆரம்பத் தடைகளுக்குப் பின் காரிய வெற்றி உண்டாகும். பங்குச்சந்தை போன்ற யூக வணிக முதலீடுகளைத் தவிர்க்கவும்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Jupiter Dasa is extremely auspicious. Spiritual expansion, success in education, wisdom, birth of child, and wealth.',
      ta: 'குரு திசையில் குரு புத்தி: குடும்பத்தில் சுப நிகழ்வுகள், ஆன்மீக நாட்டம், கல்வி மேன்மை, புதிய தொழில் வாய்ப்புகள் கிட்டும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Jupiter Dasa balances expansion with discipline. Steady growth in career. Guard against joint pains or slow progress.',
      ta: 'குரு திசையில் சனி புத்தி: உத்தியோகத்தில் சீரான வளர்ச்சி காணப்படும். சனி பகவானின் தாக்கத்தால் உழைப்பு அதிகமாகும். மூட்டு வலி வரலாம்.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Jupiter Dasa is excellent for education, business partnerships, learning new subjects, and writing.',
      ta: 'குரு திசையில் புதன் புத்தி: கல்வி மற்றும் வியாபாரத்தில் நல்ல மேன்மை உண்டாகும். புதிய ஆவணங்களில் கையெழுத்திட உகந்த காலம்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Jupiter Dasa favors spiritual realization, pilgrimage tours, and detachment from worldly stress. Neutral results.',
      ta: 'குரு திசையில் கேது புத்தி: ஆன்மீகப் பயணங்கள், குலதெய்வ வழிபாடு மன அமைதி தரும். உலகியல் விஷயங்களில் சற்று மந்த நிலை இருக்கும்.'
    },
    Venus: {
      en: 'Venus Bhukti in Jupiter Dasa brings luxury, marriage, family comforts, new friendships, and financial gains. Highly favorable.',
      ta: 'குரு திசையில் சுக்கிர புத்தி: திருமண வைபவங்கள், ஆபரண சேர்க்கை, சொகுசு வாழ்க்கை அமையும். பண வரவு மிகச் சிறப்பாக இருக்கும்.'
    }
  },
  Saturn: {
    Sun: {
      en: 'Sun Bhukti in Saturn Dasa is a hostile phase. Differences with father/boss, administrative obstacles, and health issues. Stay calm.',
      ta: 'சனி திசையில் சூரிய புத்தி: தந்தை அல்லது மேலதிகாரிகளுடன் பகைமை, அரசு வழியில் தடைகள், உடல் உபாதைகள் வந்து நீங்கும். பொறுமை தேவை.'
    },
    Moon: {
      en: 'Moon Bhukti in Saturn Dasa causes mental distress, slow progress, and physical tiredness. Pray to Lord Shiva or Hanuman.',
      ta: 'சனி திசையில் சந்திர புத்தி: மன அழுத்தம், காரியத் தாமதம், உடல் சோர்வு ஏற்படலாம். சிவ வழிபாடு அல்லது ஹனுமான் வழிபாடு நன்மை தரும்.'
    },
    Mars: {
      en: 'Mars Bhukti in Saturn Dasa increases friction, injury risks, and court cases. Keep away from disputes and work steadily.',
      ta: 'சனி திசையில் செவ்வாய் புத்தி: தேவையற்ற சண்டைகள், விபத்துக்கள், அல்லது பண விரயம் உண்டாகலாம். வண்டி வாகனங்களில் மெதுவாகச் செல்லவும்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Saturn Dasa is highly challenging (Shrapit Yoga effect). Obstacles in career, relationship tests, and low energy. Stay strong.',
      ta: 'சனி திசையில் ராகு புத்தி: காரியத் தடைகள், மன உளைச்சல், வேலையில் தேக்க நிலை ஏற்படலாம். சனிக்கிழமைகளில் எள் தீபம் ஏற்றி வழிபடவும்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Saturn Dasa brings relief. Solutions to long-standing problems, financial gains, and family harmony return.',
      ta: 'சனி திசையில் குரு புத்தி: நீண்ட நாள் பிரச்சனைகளுக்கு சுப தீர்வு கிடைக்கும். பண வரவு அதிகரிக்கும், குடும்பத்தில் அமைதி திரும்பும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Saturn Dasa demands hard labor and discipline. Career will settle slowly. Take care of joints, teeth, and food habits.',
      ta: 'சனி திசையில் சனி புத்தி: கடுமையான உழைப்புக்குப் பின்பே பலன் கிடைக்கும். உடல்நலனில் (குறிப்பாக எலும்புகள், பற்கள்) கூடுதல் கவனம் தேவை.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Saturn Dasa is favorable for business, accounts, writing, learning new languages, and resolving old disputes.',
      ta: 'சனி திசையில் புதன் புத்தி: வியாபார அபிவிருத்தி, கடன் தொல்லைகள் குறையும், புத்தி கூர்மையால் காரியங்களில் வெற்றி பெறலாம்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Saturn Dasa favors detachment and meditation. Professional transitions or travels are likely. Keep low profile.',
      ta: 'சனி திசையில் கேது புத்தி: இடமாற்றம் அல்லது தொழில் மாற்றம் ஏற்படலாம். ஆன்மீக ஈடுபாடு, பற்றற்ற நிலை மன நிம்மதி தரும்.'
    },
    Venus: {
      en: 'Venus Bhukti in Saturn Dasa brings success after delays. Purchase of land, comfort in marriage, and financial gains.',
      ta: 'சனி திசையில் சுக்கிர புத்தி: தாமதமான காரியங்கள் கைகூடும். சொத்துக்கள் வாங்குதல், சுப நிகழ்வுகள் மற்றும் பண வரவு திருப்தி தரும்.'
    }
  },
  Mercury: {
    Sun: {
      en: 'Sun Bhukti in Mercury Dasa favors intellect, career status, government connections, and general recognition from superiors.',
      ta: 'புதன் திசையில் சூரிய புத்தி: உத்தியோக உயர்வு, அரசு வழியில் நன்மைகள், சமூகத்தில் நல்ல மதிப்பும் மரியாதையும் உண்டாகும்.'
    },
    Moon: {
      en: 'Moon Bhukti in Mercury Dasa brings domestic happiness, creative writing success, travel, but watch out for skin allergies or cold.',
      ta: 'புதன் திசையில் சந்திர புத்தி: குடும்பத்தில் சுப காரியங்கள், கலைத் துறை மேன்மை, பயணங்கள் அமையும். தோல் அல்லது சளி உபாதைகள் வரலாம்.'
    },
    Mars: {
      en: 'Mars Bhukti in Mercury Dasa gives energy and active business progress, but watch your language. Avoid arguments.',
      ta: 'புதன் திசையில் செவ்வாய் புத்தி: வியாபாரத்தில் சுறுசுறுப்பும் லாபமும் கூடும். அதேசமயம் பேச்சில் நிதானம் தேவை, வாக்குவாதங்களைத் தவிர்க்கவும்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Mercury Dasa is a mixture of gains and anxiety. Good for foreign trade, but watch out for skin allergies or confusion.',
      ta: 'புதன் திசையில் ராகு புத்தி: கலவையான பலன்கள் இருக்கும். வெளிநாட்டு வர்த்தகம் அனுகூலம் தரும், ஒவ்வாமை மற்றும் மனக்குழப்பம் வரலாம்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Mercury Dasa is excellent. Expansion in knowledge, education success, birth of child, and wisdom.',
      ta: 'புதன் திசையில் குரு புத்தி: புத்தி கூர்மை, கல்வி மேன்மை, புத்திர பாக்கியம், பெரிய மனிதர்களின் சேர்க்கை மற்றும் தன லாபம் கிட்டும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Mercury Dasa brings career stability but heavy workload. Keep your focus high and proceed methodically.',
      ta: 'புதன் திசையில் சனி புத்தி: வேலைப்பளு அதிகரிக்கும் ஆனால் தொழில் நிலைத்தன்மை பெறும். திட்டமிட்டுச் செயல்படுவது வெற்றியைத் தரும்.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Mercury Dasa gives high intellect, trade success, publication opportunities, new learning, and happy friendships.',
      ta: 'புதன் திசையில் புதன் புத்தி: வியாபார மேன்மை, புதிய நண்பர்கள் சேர்க்கை, கவிதை/எழுத்துத் துறை ஆர்வம், கல்வி வெற்றி உண்டாகும்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Mercury Dasa brings spiritual inclination but career confusion. Chant Ganesha prayers for obstacle removal.',
      ta: 'புதன் திசையில் கேது புத்தி: ஆன்மீகத் தேடல் கூடும். தொழிலில் சில தடைகள் அல்லது குழப்பங்கள் வரலாம். விநாயகர் வழிபாடு தடைகளை நீக்கும்.'
    },
    Venus: {
      en: 'Venus Bhukti in Mercury Dasa is highly beautiful. Marriage, luxuries, social circles, financial comfort, and high artistic growth.',
      ta: 'புதன் திசையில் சுக்கிர புத்தி: திருமண யோகம், ஆடை ஆபரண சேர்க்கை, உல்லாசப் பயணங்கள், மற்றும் பண வரவு மிகச் சிறப்பாக இருக்கும்.'
    }
  },
  Ketu: {
    Sun: {
      en: 'Sun Bhukti in Ketu Dasa is challenging. Health of self or father might cause worry. Keep low profile and pray to Shiva.',
      ta: 'கேது திசையில் சூரிய புத்தி: உடல்நலப் பாதிப்பு, தந்தை வழி உறவில் விரிசல் அல்லது அலைச்சல்கள் ஏற்படலாம். சூரிய வழிபாடு நன்மை தரும்.'
    },
    Moon: {
      en: 'Moon Bhukti in Ketu Dasa triggers mental distress, emotional swings, and fear. Practice meditation and seek solace in prayers.',
      ta: 'கேது திசையில் சந்திர புத்தி: மன உளைச்சல், தேவையற்ற கவலைகள், தூக்கமின்மை ஏற்படலாம். தியானம் மற்றும் அம்பாள் வழிபாடு அவசியம்.'
    },
    Mars: {
      en: 'Mars Bhukti in Ketu Dasa increases danger of injuries, blood issues, and heated arguments. Do not indulge in property disputes.',
      ta: 'கேது திசையில் செவ்வாய் புத்தி: விபத்து, காயங்கள் அல்லது சகோதரர்களுடன் கருத்து வேறுபாடுகள் வரலாம். நிதானமாகச் செயல்படுவது நல்லது.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Ketu Dasa is highly volatile. Stay away from conflicts, bad associations, and check files twice before signing.',
      ta: 'கேது திசையில் ராகு புத்தி: குழப்பங்கள் நிறைந்த காலம். புதிய ஒப்பந்தங்களில் கையெழுத்திட வேண்டாம். வீண் விவாதங்களைத் தவிர்க்கவும்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Ketu Dasa brings spiritual alignment, relief from disease, guidance from noble souls, and peace.',
      ta: 'கேது திசையில் குரு புத்தி: ஆன்மீக நாட்டம், நோய்களிலிருந்து நிவாரணம், பெரியோர்களின் வழிகாட்டுதல் மற்றும் மன நிம்மதி கிடைக்கும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Ketu Dasa causes delays, fatigue, joint issues, and minor losses. Remain patient and perform charity.',
      ta: 'கேது திசையில் சனி புத்தி: காரிய அலைச்சல், உடல் மந்த நிலை, தேவையற்ற வீண் செலவுகள் இருக்கும். பொறுமையுடன் செயல்பட வேண்டும்.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Ketu Dasa balances logic with spiritual thoughts. Favorable for learning, but avoid being double-minded.',
      ta: 'கேது திசையில் புதன் புத்தி: கல்வி மேன்மை, வியாபாரத்தில் ஓரளவுக்கு லாபம், புதிய விஷயங்களைக் கற்றுக்கொள்ளும் ஆர்வம் உண்டாகும்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Ketu Dasa brings heavy detachment, spiritual tours, and deep self-discovery. Wordly things may stall.',
      ta: 'கேது திசையில் கேது புத்தி: பற்றற்ற நிலை, குலதெய்வ வழிபாடு, ஆன்மீகப் பயணங்கள் மற்றும் சுயசிந்தனை கூடும். உலகியல் விஷயங்களில் தேக்கம் நிலவும்.'
    },
    Venus: {
      en: 'Venus Bhukti in Ketu Dasa is moderately favorable. Home repairs, buying new clothes, but emotional friction in marital life.',
      ta: 'கேது திசையில் சுக்கிர புத்தி: சொத்து அல்லது வண்டி வாகன பழுது நீக்கம், ஆடை சேர்க்கை உண்டாகும். திருமண வாழ்க்கையில் சிறு சச்சரவுகள் வரலாம்.'
    }
  },
  Venus: {
    Sun: {
      en: 'Sun Bhukti in Venus Dasa brings success in work but relationship stress due to ego clashes. Balance work and life.',
      ta: 'சுக்கிர திசையில் சூரிய புத்தி: உத்தியோக உயர்வு, தன லாபம். எனினும் குடும்பத்தில் வீண் பிடிவாதங்களாலும் அகந்தையாலும் அமைதி குறையலாம்.'
    },
    Moon: {
      en: 'Moon Bhukti in Venus Dasa yields comfort, creative achievements, purchase of luxury goods, and family happiness.',
      ta: 'சுக்கிர திசையில் சந்திர புத்தி: மன மகிழ்ச்சி, ஆடை ஆபரண சேர்க்கை, வண்டி வாகன வசதி, மற்றும் குடும்பத்தில் சுப காரியங்கள் நடக்கும்.'
    },
    Mars: {
      en: 'Mars Bhukti in Venus Dasa yields land purchases, active business gains, but risk of high blood pressure or disagreements.',
      ta: 'சுக்கிர திசையில் செவ்வாய் புத்தி: சொத்து சேர்க்கை, வியாபார அபிவிருத்தி உண்டாகும். அதேசமயம் உஷ்ண நோய்கள் அல்லது கோபம் வரலாம்.'
    },
    Rahu: {
      en: 'Rahu Bhukti in Venus Dasa gives massive foreign trade or media success, but keep clean associations. High expenditure.',
      ta: 'சுக்கிர திசையில் ராகு புத்தி: வெளிநாட்டுத் தொடர்புகளால் யோகம், ஊடகத் துறையில் வெற்றி கிட்டும். ஆடம்பரச் செலவுகள் அதிகமாகும்.'
    },
    Jupiter: {
      en: 'Jupiter Bhukti in Venus Dasa is a highly protective and blessed phase. Wealth, child birth, happy travels, and respects.',
      ta: 'சுக்கிர திசையில் குரு புத்தி: புத்திர பாக்கியம், பண வரவு, உயர் பதவி, ஆன்மீக காரியங்களில் வெற்றி. மிகவும் யோகமான காலமாகும்.'
    },
    Saturn: {
      en: 'Saturn Bhukti in Venus Dasa balances pleasures with duties. Hard work pays off eventually. Take care of digestive tract.',
      ta: 'சுக்கிர திசையில் சனி புத்தி: உழைப்புக்கேற்ற பலன் கிட்டும். குடும்பப் பொறுப்புகள் கூடும். உடல் ஆரோக்கியத்தில் கவனம் தேவை.'
    },
    Mercury: {
      en: 'Mercury Bhukti in Venus Dasa is extremely favorable for trade, logic, learning, writing, and making friends.',
      ta: 'சுக்கிர திசையில் புதன் புத்தி: வியாபார மேன்மை, புதிய முதலீடுகள் அனுகூலம் தரும், கவிதை/எழுத்துத் துறையில் பெரும் வெற்றி பெறலாம்.'
    },
    Ketu: {
      en: 'Ketu Bhukti in Venus Dasa yields mixed results. Spiritual growth, but family misunderstandings or minor travel obstacles.',
      ta: 'சுக்கிர திசையில் கேது புத்தி: கலவையான பலன்கள் இருக்கும். ஆன்மீக ஈடுபாடு கூடும், ஆனால் குடும்பத்தில் சிறு கருத்து வேறுபாடுகள் வரலாம்.'
    },
    Venus: {
      en: 'Venus Bhukti in Venus Dasa brings massive luxury, marital happiness, vehicles, artistic accolades, and high popularity.',
      ta: 'சுக்கிர திசையில் சுக்கிர புத்தி: திருமண யோகம், சொகுசு வாழ்க்கை, வாகனம் வாங்குதல், கலைத் துறையில் பெரும் நற்பெயர் மற்றும் தன லாபம் அள்ளித்தரும்.'
    }
  }
};

export function getDashaBhuktiPrediction(
  mahadashaLord: string,
  bhuktiLord: string
): DashaPredictionResult {
  const normalizedMaha = mahadashaLord.charAt(0).toUpperCase() + mahadashaLord.slice(1).toLowerCase();
  const normalizedBhukti = bhuktiLord.charAt(0).toUpperCase() + bhuktiLord.slice(1).toLowerCase();

  const mahaPred = MAHADASHA_PREDICTIONS[normalizedMaha] || {
    en: `The Mahadasha of ${normalizedMaha} will bring planetary influences based on its placement in your birth chart.`,
    ta: `${normalizedMaha} மகாதிசையானது உங்கள் ஜாதகத்தில் உள்ள அதன் அமைப்பைப் பொறுத்து சுப/அசுப பலன்களைத் தரும்.`
  };

  const bhuktiMap = BHUKTI_PREDICTIONS[normalizedMaha] || {};
  const bhuktiPred = bhuktiMap[normalizedBhukti] || {
    en: `The Bhukti of ${normalizedBhukti} during ${normalizedMaha} Dasa is a period of adjustment and lessons.`,
    ta: `${normalizedMaha} திசையில் ${normalizedBhukti} புத்தியானது சீரான பலன்களையும் சில பாடங்களையும் கற்றுத் தரும் காலமாகும்.`
  };

  return {
    mahadasha_lord: normalizedMaha,
    bhukti_lord: normalizedBhukti,
    mahadasha_prediction_en: mahaPred.en,
    mahadasha_prediction_ta: mahaPred.ta,
    bhukti_prediction_en: bhuktiPred.en,
    bhukti_prediction_ta: bhuktiPred.ta
  };
}
