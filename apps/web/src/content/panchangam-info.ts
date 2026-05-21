/**
 * content/panchangam-info.ts
 * Detailed static astrological datasets for JothiSoft Panchangam limbs.
 */

export interface VaraInfo {
  nameEn: string;
  nameTa: string;
  ruler: string;
  rulerTa: string;
  element: string;
  elementTa: string;
  adviceEn: string;
  adviceTa: string;
}

export interface TithiInfo {
  index: number;
  nameEn: string;
  nameTa: string;
  ruler: string;
  rulerTa: string;
  element: string;
  elementTa: string;
  meaningEn: string;
  meaningTa: string;
}

export interface NakshatraSummary {
  index: number;
  nameEn: string;
  nameTa: string;
  ruler: string;
  rulerTa: string;
  element: string;
  elementTa: string;
  summaryEn: string;
  summaryTa: string;
}

export interface YogamInfo {
  index: number;
  nameEn: string;
  nameTa: string;
  ruler: string;
  rulerTa: string;
  element: string;
  elementTa: string;
  meaningEn: string;
  meaningTa: string;
}

export interface KaranamInfo {
  index: number;
  nameEn: string;
  nameTa: string;
  type: 'movable' | 'fixed';
  ruler: string;
  rulerTa: string;
  element: string;
  elementTa: string;
  meaningEn: string;
  meaningTa: string;
}

// All 7 days of the week (Vara)
export const VARA_DATA: Record<string, VaraInfo> = {
  sunday: {
    nameEn: 'Sunday',
    nameTa: 'ஞாயிறு',
    ruler: 'Sun',
    rulerTa: 'சூரியன்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    adviceEn: 'Ideal for administrative work, leadership duties, and spiritual practices.',
    adviceTa: 'நிர்வாகப் பணிகள், தலைமைப் பொறுப்புகள் மற்றும் ஆன்மீக வழிபாடுகளுக்கு உகந்தது.'
  },
  monday: {
    nameEn: 'Monday',
    nameTa: 'திங்கள்',
    ruler: 'Moon',
    rulerTa: 'சந்திரன்',
    element: 'Water',
    elementTa: 'நீர்',
    adviceEn: 'Perfect for artistic endeavours, public relations, and maternal care.',
    adviceTa: 'கலை சார்ந்த பணிகள், மக்கள் தொடர்பு மற்றும் தாய்வழி பராமரிப்புகளுக்கு ஏற்றது.'
  },
  tuesday: {
    nameEn: 'Tuesday',
    nameTa: 'செவ்வாய்',
    ruler: 'Mars',
    rulerTa: 'செவ்வாய்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    adviceEn: 'Good for legal matters, physical exercises, and technical operations.',
    adviceTa: 'சட்ட விவகாரங்கள், உடற்பயிற்சிகள் மற்றும் தொழில்நுட்பப் பணிகளுக்கு உகந்தது.'
  },
  wednesday: {
    nameEn: 'Wednesday',
    nameTa: 'புதன்',
    ruler: 'Mercury',
    rulerTa: 'புதன்',
    element: 'Earth',
    elementTa: 'மண்',
    adviceEn: 'Highly auspicious for business deals, studies, writing, and calculations.',
    adviceTa: 'வணிக ஒப்பந்தங்கள், கல்விப் பயில்வு, எழுத்து மற்றும் கணக்கீடுகளுக்கு மிகவும் ஏற்றது.'
  },
  thursday: {
    nameEn: 'Thursday',
    nameTa: 'வியாழன்',
    ruler: 'Jupiter',
    rulerTa: 'குரு',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    adviceEn: 'Excellent for religious ceremonies, investments, and higher learning.',
    adviceTa: 'ஆன்மீக சடங்குகள், முதலீடுகள் மற்றும் உயர்கல்வி கற்பதற்கு சிறந்தது.'
  },
  friday: {
    nameEn: 'Friday',
    nameTa: 'வெள்ளி',
    ruler: 'Venus',
    rulerTa: 'சுக்கிரன்',
    element: 'Water',
    elementTa: 'நீர்',
    adviceEn: 'Favourable for purchasing assets, beauty treatments, arts, and relationship planning.',
    adviceTa: 'சொத்துக்கள் வாங்குதல், அழகு சார்ந்த விஷயங்கள், கலை மற்றும் உறவு திட்டமிடலுக்கு உகந்தது.'
  },
  saturday: {
    nameEn: 'Saturday',
    nameTa: 'சனி',
    ruler: 'Saturn',
    rulerTa: 'சனி',
    element: 'Air',
    elementTa: 'காற்று',
    adviceEn: 'Suitable for agricultural works, cleaning, and long-term planning.',
    adviceTa: 'விவசாயப் பணிகள், தூய்மைப்படுத்துதல் மற்றும் நீண்ட காலத் திட்டமிடலுக்கு ஏற்றது.'
  }
};

// All 30 Tithis
export const TITHI_DATA: Record<string, TithiInfo> = {
  tithi_1: {
    index: 1,
    nameEn: 'Prathama',
    nameTa: 'பிரதமை',
    ruler: 'Agni',
    rulerTa: 'அக்னி',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Represents the first step or new beginnings of lunar cycles.',
    meaningTa: 'சந்திர சுழற்சியின் முதல் படி அல்லது புதிய தொடக்கங்களைக் குறிக்கிறது.'
  },
  tithi_2: {
    index: 2,
    nameEn: 'Dwitiya',
    nameTa: 'துவிதியை',
    ruler: 'Brahma',
    rulerTa: 'பிரம்மா',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Favourable for layings foundations, marriages, and music studies.',
    meaningTa: 'அடித்தளம் அமைப்பதற்கும், திருமணங்களுக்கும், இசை பயில்வதற்கும் உகந்தது.'
  },
  tithi_3: {
    index: 3,
    nameEn: 'Tritiya',
    nameTa: 'திருதியை',
    ruler: 'Gauri',
    rulerTa: 'கௌரி',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Highly auspicious for shaving, haircuts, and beginning constructions.',
    meaningTa: 'சவரம் செய்தல், முடி வெட்டுதல் மற்றும் கட்டுமானங்களைத் தொடங்குவதற்கு உகந்தது.'
  },
  tithi_4: {
    index: 4,
    nameEn: 'Chaturthi',
    nameTa: 'சதுர்த்தி',
    ruler: 'Ganesha',
    rulerTa: 'விநாயகர்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Ruled by Lord Ganesha; excellent for overcoming obstacles and studying.',
    meaningTa: 'விநாயகப் பெருமானால் ஆளப்படுகிறது; தடைகளைத் தாண்டுவதற்கும் கல்வி கற்பதற்கும் சிறந்தது.'
  },
  tithi_5: {
    index: 5,
    nameEn: 'Panchami',
    nameTa: 'பஞ்சமி',
    ruler: 'Nagas',
    rulerTa: 'நாகர்கள்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Auspicious day for taking medicines, administration, and social gatherings.',
    meaningTa: 'மருந்து உட்கொள்வதற்கும், நிர்வாகப் பணிகளுக்கும், சமூகக் கூட்டங்களுக்கும் உகந்த நாள்.'
  },
  tithi_6: {
    index: 6,
    nameEn: 'Shashthi',
    nameTa: 'சஷ்டி',
    ruler: 'Kartikeya',
    rulerTa: 'முருகன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Favourable for meeting friends, purchasing land, and dynamic action.',
    meaningTa: 'நண்பர்களைச் சந்திப்பதற்கும், நிலம் வாங்குவதற்கும், சுறுசுறுப்பான பணிகளுக்கும் உகந்தது.'
  },
  tithi_7: {
    index: 7,
    nameEn: 'Saptami',
    nameTa: 'சப்தமி',
    ruler: 'Surya',
    rulerTa: 'சூரியன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Auspicious day for starting journeys, vehicles, and dealing with health issues.',
    meaningTa: 'பயணங்களைத் தொடங்குவதற்கும், வாகனங்கள் வாங்குவதற்கும், ஆரோக்கியத்தைக் கவனிப்பதற்கும் உகந்தது.'
  },
  tithi_8: {
    index: 8,
    nameEn: 'Ashtami',
    nameTa: 'அஷ்டமி',
    ruler: 'Shiva',
    rulerTa: 'சிவன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Ruled by Lord Shiva; suitable for dynamic operations and writing.',
    meaningTa: 'சிவபெருமானால் ஆளப்படுகிறது; சுறுசுறுப்பான செயல்பாடுகள் மற்றும் எழுதுவதற்கு ஏற்றது.'
  },
  tithi_9: {
    index: 9,
    nameEn: 'Navami',
    nameTa: 'நவமி',
    ruler: 'Durga',
    rulerTa: 'துர்க்கை',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Ideal for physical training, competitions, and tackling difficult disputes.',
    meaningTa: 'உடற்பயிற்சிகள், போட்டிகள் மற்றும் கடினமான வழக்குகளைக் கையாளுவதற்கு உகந்தது.'
  },
  tithi_10: {
    index: 10,
    nameEn: 'Dashami',
    nameTa: 'தசமி',
    ruler: 'Yama',
    rulerTa: 'எமன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Highly auspicious for marriages, starting businesses, and long travels.',
    meaningTa: 'திருமணங்கள், புதிய தொழில்கள் தொடங்குதல் மற்றும் நீண்ட பயணங்களுக்கு மிகவும் உகந்தது.'
  },
  tithi_11: {
    index: 11,
    nameEn: 'Ekadashi',
    nameTa: 'ஏகாதசி',
    ruler: 'Vishwadevas',
    rulerTa: 'விஸ்வதேவர்கள்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Sacred day for fasting, prayer, and focusing on spiritual self-discipline.',
    meaningTa: 'விரதம் இருப்பதற்கும், பிரார்த்தனை செய்வதற்கும், ஆன்மீக சுய ஒழுக்கத்திற்கும் உகந்த புனித நாள்.'
  },
  tithi_12: {
    index: 12,
    nameEn: 'Dwadashi',
    nameTa: 'துவாதசி',
    ruler: 'Vishnu',
    rulerTa: 'விஷ்ணு',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Favourable for fulfilling charity, completing vows, and religious studies.',
    meaningTa: 'தான தர்மங்கள் செய்வதற்கும், விரதங்களை முடிப்பதற்கும், ஆன்மீகக் கல்வியை நிறைவு செய்வதற்கும் ஏற்றது.'
  },
  tithi_13: {
    index: 13,
    nameEn: 'Trayodashi',
    nameTa: 'திரயோதசி',
    ruler: 'Kamadeva',
    rulerTa: 'காமதேவன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Auspicious day for romantic planning, friendships, and starting ceremonies.',
    meaningTa: 'காதல் திட்டமிடல், நட்புகளை உருவாக்குதல் மற்றும் புதிய சடங்குகளைத் தொடங்குவதற்கு ஏற்றது.'
  },
  tithi_14: {
    index: 14,
    nameEn: 'Chaturdashi',
    nameTa: 'சதுர்தசி',
    ruler: 'Kali',
    rulerTa: 'காளி',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Suitable for dealing with obstacles, spiritual purification, and dynamic operations.',
    meaningTa: 'தடைகளைக் கையாளுவதற்கும், ஆன்மீக தூய்மைப்படுத்துதலுக்கும், சுறுசுறுப்பான பணிகளுக்கும் ஏற்றது.'
  },
  tithi_15: {
    index: 15,
    nameEn: 'Purnima',
    nameTa: 'பௌர்ணமி',
    ruler: 'Chandra',
    rulerTa: 'சந்திரன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'The full moon day; auspicious for festivals, acts of worship, and celebrations.',
    meaningTa: 'முழு நிலவு நாள்; திருவிழாக்கள், வழிபாடுகள் மற்றும் கொண்டாட்டங்களுக்கு மிகவும் உகந்தது.'
  },
  tithi_16: {
    index: 16,
    nameEn: 'Prathama (Krishna)',
    nameTa: 'பிரதமை (தேய்பிறை)',
    ruler: 'Agni',
    rulerTa: 'அக்னி',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Favourable for starting long-term quiet activities and internal reflections.',
    meaningTa: 'நீண்ட கால அமைதியான செயல்பாடுகள் மற்றும் உள்நோக்கிய சிந்தனைகளைத் தொடங்குவதற்கு உகந்தது.'
  },
  tithi_17: {
    index: 17,
    nameEn: 'Dwitiya (Krishna)',
    nameTa: 'துவிதியை (தேய்பிறை)',
    ruler: 'Brahma',
    rulerTa: 'பிரம்மா',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Favourable for agricultural pursuits, planning, and organizing properties.',
    meaningTa: 'விவசாயப் பணிகள், திட்டமிடல் மற்றும் சொத்துக்களை ஒழுங்குபடுத்துவதற்கு ஏற்றது.'
  },
  tithi_18: {
    index: 18,
    nameEn: 'Tritiya (Krishna)',
    nameTa: 'திருதியை (தேய்பிறை)',
    ruler: 'Gauri',
    rulerTa: 'கௌரி',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Good for music lessons, creative hobbies, and cultural pursuits.',
    meaningTa: 'இசை வகுப்புகள், படைப்பு பொழுதுபோக்குகள் மற்றும் கலாச்சாரப் பணிகளுக்கு ஏற்றது.'
  },
  tithi_19: {
    index: 19,
    nameEn: 'Chaturthi (Krishna)',
    nameTa: 'சதுர்த்தி (தேய்பிறை)',
    ruler: 'Ganesha',
    rulerTa: 'விநாயகர்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Sankashti Chaturthi; highly auspicious for resolving spiritual obstacles.',
    meaningTa: 'சங்கடஹர சதுர்த்தி; ஆன்மீக மற்றும் உலகியல் தடைகளை நீக்குவதற்கு மிகவும் உகந்தது.'
  },
  tithi_20: {
    index: 20,
    nameEn: 'Panchami (Krishna)',
    nameTa: 'பஞ்சமி (தேய்பிறை)',
    ruler: 'Nagas',
    rulerTa: 'நாகர்கள்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Auspicious for building designs, plans, and long-term security setups.',
    meaningTa: 'கட்டிட வடிவமைப்பு திட்டங்கள் மற்றும் நீண்ட கால பாதுகாப்பு ஏற்பாடுகளுக்கு உகந்தது.'
  },
  tithi_21: {
    index: 21,
    nameEn: 'Shashthi (Krishna)',
    nameTa: 'சஷ்டி (தேய்பிறை)',
    ruler: 'Kartikeya',
    rulerTa: 'முருகன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Excellent day for fastings, yoga, and mental discipline practices.',
    meaningTa: 'விரதம் இருப்பதற்கும், யோகா மற்றும் மன ஒழுங்கு பயிற்சிகளுக்கும் சிறந்த நாள்.'
  },
  tithi_22: {
    index: 22,
    nameEn: 'Saptami (Krishna)',
    nameTa: 'சப்தமி (தேய்பிறை)',
    ruler: 'Surya',
    rulerTa: 'சூரியன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Good for studying science, engineering, and starting minor journeys.',
    meaningTa: 'அறிவியல், பொறியியல் பயில்வதற்கும் மற்றும் சிறிய பயணங்களைத் தொடங்குவதற்கும் ஏற்றது.'
  },
  tithi_23: {
    index: 23,
    nameEn: 'Ashtami (Krishna)',
    nameTa: 'அஷ்டமி (தேய்பிறை)',
    ruler: 'Shiva',
    rulerTa: 'சிவன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Kala Bhairava Ashtami; suitable for introspective prayers and meditations.',
    meaningTa: 'கால பைரவ அஷ்டமி; ஆழமான பிரார்த்தனைகள் மற்றும் தியானங்களுக்கு உகந்தது.'
  },
  tithi_24: {
    index: 24,
    nameEn: 'Navami (Krishna)',
    nameTa: 'நவமி (தேய்பிறை)',
    ruler: 'Durga',
    rulerTa: 'துர்க்கை',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Excellent for legal strategy preparation and dismantling outdated structures.',
    meaningTa: 'சட்ட உத்திகளைத் தயாரிப்பதற்கும், தேவையற்ற பழக்கங்களை ஒழிப்பதற்கும் ஏற்றது.'
  },
  tithi_25: {
    index: 25,
    nameEn: 'Dashami (Krishna)',
    nameTa: 'தசமி (தேய்பிறை)',
    ruler: 'Yama',
    rulerTa: 'எமன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Favourable for making investments, charity, and ending long conflicts.',
    meaningTa: 'முதலீடுகள் செய்வதற்கும், தர்ம காரியங்கள் செய்வதற்கும், நீண்ட தகராறுகளை முடிப்பதற்கும் ஏற்றது.'
  },
  tithi_26: {
    index: 26,
    nameEn: 'Ekadashi (Krishna)',
    nameTa: 'ஏகாதசி (தேய்பிறை)',
    ruler: 'Vishwadevas',
    rulerTa: 'விஸ்வதேவர்கள்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Auspicious day for deep spiritual fasting, introspection, and meditation.',
    meaningTa: 'ஆழமான ஆன்மீக விரதங்கள், சுய ஆய்வு மற்றும் தியானத்திற்கு உகந்த நாள்.'
  },
  tithi_27: {
    index: 27,
    nameEn: 'Dwadashi (Krishna)',
    nameTa: 'துவாதசி (தேய்பிறை)',
    ruler: 'Vishnu',
    rulerTa: 'விஷ்ணு',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Ideal for reading scriptures, studying historical works, and introspection.',
    meaningTa: 'புனித நூல்களை வாசிப்பதற்கும், வரலாற்றுப் படிப்புகளுக்கும், சுயபரிசோதனைக்கும் சிறந்தது.'
  },
  tithi_28: {
    index: 28,
    nameEn: 'Trayodashi (Krishna)',
    nameTa: 'திரயோதசி (தேய்பிறை)',
    ruler: 'Kamadeva',
    rulerTa: 'காமதேவன்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Pradosham; highly auspicious day for Shivapuja and clearing past karma.',
    meaningTa: 'பிரதோஷம்; சிவபூஜை செய்வதற்கும் கடந்த கால கர்மவினைகளை நீக்குவதற்கும் உகந்தது.'
  },
  tithi_29: {
    index: 29,
    nameEn: 'Chaturdashi (Krishna)',
    nameTa: 'சதுர்தசி (தேய்பிறை)',
    ruler: 'Kali',
    rulerTa: 'காளி',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'Shivaratri; ideal for spiritual vigils, intense prayers, and meditation.',
    meaningTa: 'சிவராத்திரி; விழிப்புடன் இருப்பதற்கும், தீவிர பிரார்த்தனைகள் மற்றும் தியானத்திற்கும் உகந்தது.'
  },
  tithi_30: {
    index: 30,
    nameEn: 'Amavasya',
    nameTa: 'அமாவாசை',
    ruler: 'Pitrus',
    rulerTa: 'பித்ருக்கள்',
    element: 'Water',
    elementTa: 'நீர்',
    meaningEn: 'The new moon day; highly sacred for ancestor worship (Tharpanam) and meditation.',
    meaningTa: 'புது நிலவு நாள்; பித்ரு வழிபாடுகளுக்கும் (தர்ப்பணம்) தியானத்திற்கும் மிகவும் புனிதமானது.'
  }
};

// All 27 Nakshatras summary — exactly 2 sentences each as requested
export const NAKSHATRA_SUMMARY: Record<string, NakshatraSummary> = {
  star_1: {
    index: 1,
    nameEn: 'Aswini',
    nameTa: 'அஸ்வினி',
    ruler: 'Ketu',
    rulerTa: 'கேது',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Initiative-taking and rapid individuals ruled by Ketu. They possess healing skills and exhibit high speed in executing plans.',
    summaryTa: 'கேதுவால் ஆளப்படும் சுறுசுறுப்பானவர்கள். இவர்கள் குணப்படுத்தும் திறனும் திட்டங்களை விரைவாகச் செயல்படுத்தும் ஆற்றலும் கொண்டவர்கள்.'
  },
  star_2: {
    index: 2,
    nameEn: 'Bharani',
    nameTa: 'பரணி',
    ruler: 'Venus',
    rulerTa: 'சுக்கிரன்',
    element: 'Earth',
    elementTa: 'மண்',
    summaryEn: 'Expressive and creative souls who experience intense life cycles. They are highly artistic and exhibit deep determination.',
    summaryTa: 'தீவிரமான வாழ்க்கைச் சுழற்சிகளைக் கடக்கும் ஆக்கப்பூர்வமானவர்கள். இவர்கள் கலைத்திறனும் ஆழ்ந்த உறுதியும் கொண்டவர்கள்.'
  },
  star_3: {
    index: 3,
    nameEn: 'Krithika',
    nameTa: 'கார்த்திகை',
    ruler: 'Sun',
    rulerTa: 'சூரியன்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Fiery and analytical individuals possess strong critical faculties. They are born protectors and have powerful purification traits.',
    summaryTa: 'சூரியனால் ஆளப்படும் கூர்மையான அறிவுடையவர்கள். இவர்கள் பிறவிப் பாதுகாவலர்கள் மற்றும் தூய்மைப்படுத்தும் பண்பு கொண்டவர்கள்.'
  },
  star_4: {
    index: 4,
    nameEn: 'Rohini',
    nameTa: 'ரோகிணி',
    ruler: 'Moon',
    rulerTa: 'சந்திரன்',
    element: 'Earth',
    elementTa: 'மண்',
    summaryEn: 'Charming, expressive, and highly elegant natures ruled by Moon. They represent growth, beauty, and possess strong family bonds.',
    summaryTa: 'சந்திரனால் ஆளப்படும் அழகான மற்றும் கனிவான குணமுடையவர்கள். இவர்கள் வளர்ச்சி, அழகு மற்றும் குடும்பப் பிணைப்பைக் குறிக்கிறார்கள்.'
  },
  star_5: {
    index: 5,
    nameEn: 'Mrigasira',
    nameTa: 'மிருகசீரிடம்',
    ruler: 'Mars',
    rulerTa: 'செவ்வாய்',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Curious searchers who love exploring knowledge and travel. They are gentle, analytical, and constantly seek growth.',
    summaryTa: 'அறிவையும் தேடலையும் விரும்பும் ஆராய்ச்சியாளர்கள். இவர்கள் மென்மையானவர்கள், பகுப்பாய்வு செய்பவர்கள் மற்றும் வளர்ச்சியை நாடுவோர்.'
  },
  star_6: {
    index: 6,
    nameEn: 'Arudra',
    nameTa: 'திருவாதிரை',
    ruler: 'Rahu',
    rulerTa: 'ராகு',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Intense and transformative personalities ruled by Rahu. They experience powerful emotions and emerge extremely strong after challenges.',
    summaryTa: 'ராகுவால் ஆளப்படும் தீவிரமான மற்றும் மாற்றங்களை விரும்பும் மனிதர்கள். இவர்கள் சவால்களை வென்று வலிமையோடு வெளிவருவார்கள்.'
  },
  star_7: {
    index: 7,
    nameEn: 'Punarvasu',
    nameTa: 'புனர்பூசம்',
    ruler: 'Jupiter',
    rulerTa: 'குரு',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Generous and hopeful souls representing the return of light. They have great recovery skills and practice high integrity.',
    summaryTa: 'ஒளியின் மீள்வருகையைக் குறிக்கும் தாராள குணமுடையவர்கள். இவர்கள் மீண்டுவரும் திறனும் சிறந்த நேர்மையும் கொண்டவர்கள்.'
  },
  star_8: {
    index: 8,
    nameEn: 'Pushya',
    nameTa: 'பூசம்',
    ruler: 'Saturn',
    rulerTa: 'சனி',
    element: 'Earth',
    elementTa: 'மண்',
    summaryEn: 'The most nurturing star of the zodiac. They are spiritual, highly responsible, and provide immense comfort to others.',
    summaryTa: 'ராசி மண்டலத்தின் மிகவும் ஆதரவான நட்சத்திரம். இவர்கள் ஆன்மீக நாட்டம், பொறுப்புணர்வு மற்றும் பிறருக்கு உதவும் குணம் கொண்டவர்கள்.'
  },
  star_9: {
    index: 9,
    nameEn: 'Ashlesha',
    nameTa: 'ஆயில்யம்',
    ruler: 'Mercury',
    rulerTa: 'புதன்',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Sharp, intuitive, and highly mystical individuals ruled by Mercury. They possess deep analytical wisdom and protective instincts.',
    summaryTa: 'புதனோடு தொடர்புடைய கூர்மையான மற்றும் உள்ளுணர்வு மிக்கவர்கள். இவர்கள் ஆழமான ஞானமும் பாதுகாப்புத் திறனும் கொண்டவர்கள்.'
  },
  star_10: {
    index: 10,
    nameEn: 'Magha',
    nameTa: 'மகம்',
    ruler: 'Ketu',
    rulerTa: 'கேது',
    element: 'Earth',
    elementTa: 'மண்',
    summaryEn: 'Regal and historical individuals connected deeply to ancestors. They exhibit high leadership talents and command deep respect.',
    summaryTa: 'முன்னோர்களோடு தொடர்புடைய கம்பீரமான மனிதர்கள். இவர்கள் தலைமைப் பண்புகளும் சிறந்த மரியாதையும் கொண்டவர்கள்.'
  },
  star_11: {
    index: 11,
    nameEn: 'Poorva Phalguni',
    nameTa: 'பூரம்',
    ruler: 'Venus',
    rulerTa: 'சுக்கிரன்',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Charming, artistic, and relaxed personalities ruled by Venus. They enjoy music, luxury, and excel in creative writing.',
    summaryTa: 'சுக்கிரனால் ஆளப்படும் மகிழ்ச்சியான மற்றும் கலைநயம் மிக்கவர்கள். இவர்கள் சொகுசு, இசை மற்றும் படைப்புத் திறன்களை விரும்புபவர்கள்.'
  },
  star_12: {
    index: 12,
    nameEn: 'Uttara Phalguni',
    nameTa: 'உத்திரம்',
    ruler: 'Sun',
    rulerTa: 'சூரியன்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Generous, reliable, and relationship-oriented individuals. They possess strong moral standards and act as pillars of community.',
    summaryTa: 'தாராள மனமும் நம்பிக்கையும் கொண்ட உறவு சார்ந்த மனிதர்கள். இவர்கள் சமூகத்தின் தூண்களாகவும் சிறந்த நெறியாளர்களாகவும் திகழ்கிறார்கள்.'
  },
  star_13: {
    index: 13,
    nameEn: 'Hasta',
    nameTa: 'அஸ்தம்',
    ruler: 'Moon',
    rulerTa: 'சந்திரன்',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Clever, humorous, and highly dexterous individuals ruled by Moon. They are exceptionally skilled with hands and excel in commerce.',
    summaryTa: 'சந்திரனால் ஆளப்படும் நகைச்சுவையும் திறமையும் உடையவர்கள். இவர்கள் கைகளின் செயல்பாடுகளிலும் வாணிபத்திலும் வல்லவர்கள்.'
  },
  star_14: {
    index: 14,
    nameEn: 'Chitra',
    nameTa: 'சித்திரை',
    ruler: 'Mars',
    rulerTa: 'செவ்வாய்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Brilliant architects and creative designers ruled by Mars. They possess beautiful aesthetics and can build master structures.',
    summaryTa: 'செவ்வாயால் ஆளப்படும் சிறந்த வடிவமைப்பாளர்கள் மற்றும் கலைஞர்கள். இவர்கள் சிறந்த அழகுணர்ச்சியும் கலைத்திறனும் கொண்டவர்கள்.'
  },
  star_15: {
    index: 15,
    nameEn: 'Swati',
    nameTa: 'சுவாதி',
    ruler: 'Rahu',
    rulerTa: 'ராகு',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Independent, gentle, and highly adaptable personalities. They value freedom, show deep diplomacy, and excel in communications.',
    summaryTa: 'சுதந்திரமான, மென்மையான மற்றும் மாற்றங்களுக்கு ஏற்ப மாறும் குணம் கொண்டவர்கள். இவர்கள் தூதுவர் பண்புகளும் சிறந்த தொடர்பாடலும் உடையவர்கள்.'
  },
  star_16: {
    index: 16,
    nameEn: 'Vishakha',
    nameTa: 'விசாகம்',
    ruler: 'Jupiter',
    rulerTa: 'குரு',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Determined and highly focused achievers ruled by Jupiter. They set ambitious targets and exhibit strong willpower to succeed.',
    summaryTa: 'குருவால் ஆளப்படும் உறுதியான மற்றும் இலக்கு சார்ந்த மனிதர்கள். இவர்கள் வெற்றிக்காகத் தீவிரமாகவும் அர்ப்பணிப்போடும் உழைப்பவர்கள்.'
  },
  star_17: {
    index: 17,
    nameEn: 'Anuradha',
    nameTa: 'அனுஷம்',
    ruler: 'Saturn',
    rulerTa: 'சனி',
    element: 'Earth',
    elementTa: 'மண்',
    summaryEn: 'Loyal friends and cooperative team players ruled by Saturn. They possess strong survival skills and bridge diverse relationships.',
    summaryTa: 'சனியால் ஆளப்படும் நம்பிக்கையான மற்றும் கூட்டுப் பணிக்கு உகந்தவர்கள். இவர்கள் நட்புகளைப் பேணுவதிலும் சவால்களை வெல்வதிலும் சிறந்தவர்கள்.'
  },
  star_18: {
    index: 18,
    nameEn: 'Jyeshtha',
    nameTa: 'கேட்டை',
    ruler: 'Mercury',
    rulerTa: 'புதன்',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Analytical, proud, and protective elders ruled by Mercury. They possess immense occult wisdom and safeguard heritage.',
    summaryTa: 'புதனோடு தொடர்புடைய பகுப்பாய்வுத் திறன் மிக்க மூத்தவர்கள். இவர்கள் ஆழமான ஞானமும் பாரம்பரியத்தைப் பாதுகாக்கும் பண்பும் கொண்டவர்கள்.'
  },
  star_19: {
    index: 19,
    nameEn: 'Moola',
    nameTa: 'மூலம்',
    ruler: 'Ketu',
    rulerTa: 'கேது',
    element: 'Earth',
    elementTa: 'மண்',
    summaryEn: 'Deep investigators who seek the root cause of every phenomenon. Ruled by Ketu, they represent total destruction followed by massive rebirth.',
    summaryTa: 'ஒவ்வொரு நிகழ்வின் மூலத்தைக் கண்டறியும் ஆராய்ச்சியாளர்கள். கேதுவால் ஆளப்படும் இவர்கள் அழிவு மற்றும் மாபெரும் மறுபிறப்பைக் குறிக்கிறார்கள்.'
  },
  star_20: {
    index: 20,
    nameEn: 'Poorvashadha',
    nameTa: 'பூராடம்',
    ruler: 'Venus',
    rulerTa: 'சுக்கிரன்',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Cheerful, proud, and highly influential natures ruled by Venus. They believe in their invincibility and excel in public speaking.',
    summaryTa: 'சுக்கிரனால் ஆளப்படும் மகிழ்ச்சியான மற்றும் செல்வாக்கு மிக்கவர்கள். இவர்கள் அசைக்க முடியாத தன்னம்பிக்கையும் பேச்சுத்திறனும் கொண்டவர்கள்.'
  },
  star_21: {
    index: 21,
    nameEn: 'Uttarashadha',
    nameTa: 'உத்திராடம்',
    ruler: 'Sun',
    rulerTa: 'சூரியன்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Principled, honest, and deeply enduring souls ruled by Sun. They command long-term victory and practice great virtue.',
    summaryTa: 'சூரியனால் ஆளப்படும் நேர்மையும் ஒழுக்கமும் மிக்கவர்கள். இவர்கள் நீண்ட கால வெற்றிகளையும் சிறந்த நற்பண்புகளையும் கொண்டிருப்பார்கள்.'
  },
  star_22: {
    index: 22,
    nameEn: 'Shravana',
    nameTa: 'திருவோணம்',
    ruler: 'Moon',
    rulerTa: 'சந்திரன்',
    element: 'Air',
    elementTa: 'காற்று',
    summaryEn: 'Exceptional listeners who value learning and oral traditions. They possess high organizational skills and spread knowledge.',
    summaryTa: 'சந்திரனால் ஆளப்படும் சிறந்த கேட்போர்கள். இவர்கள் கற்றலிலும் அமைப்புகளையும் நிர்வாகங்களையும் வழிநடத்துவதிலும் வல்லவர்கள்.'
  },
  star_23: {
    index: 23,
    nameEn: 'Dhanishta',
    nameTa: 'அவிட்டம்',
    ruler: 'Mars',
    rulerTa: 'செவ்வாய்',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Auspicious, musically inclined, and wealthy natures ruled by Mars. They possess high rhythmic coordination and enjoy arts.',
    summaryTa: 'செவ்வாயால் ஆளப்படும் செல்வந்தர்கள் மற்றும் கலைப்பிரியர்கள். இவர்கள் சிறந்த தாள ஒழுங்கும் கலை உணர்வும் கொண்டவர்கள்.'
  },
  star_24: {
    index: 24,
    nameEn: 'Shatabhisha',
    nameTa: 'சதயம்',
    ruler: 'Rahu',
    rulerTa: 'ராகு',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Highly mystical and secretive healers ruled by Rahu. They possess a deep understanding of complex systems and human nature.',
    summaryTa: 'ராகுவால் ஆளப்படும் மர்மமான மற்றும் ஆழமான உள்ளுணர்வு மிக்க குணப்படுத்துவோர். இவர்கள் சிக்கலான விதிகளையும் மனிதர்களையும் அறிவர்.'
  },
  star_25: {
    index: 25,
    nameEn: 'Poorvabhadra',
    nameTa: 'பூரட்டாதி',
    ruler: 'Jupiter',
    rulerTa: 'குரு',
    element: 'Fire',
    elementTa: 'நெருப்பு',
    summaryEn: 'Passionate, highly individualistic, and spiritual reformers. They exhibit massive willpower and drive social transformations.',
    summaryTa: 'குருவோடு தொடர்புடைய ஆன்மீக சீர்திருத்தவாதிகள். இவர்கள் மாபெரும் மன உறுதியும் சமூக மாற்றங்களை வழிநடத்தும் பண்பும் கொண்டவர்கள்.'
  },
  star_26: {
    index: 26,
    nameEn: 'Uttarabhadra',
    nameTa: 'உத்திரட்டாதி',
    ruler: 'Saturn',
    rulerTa: 'சனி',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Calm, highly self-controlled, and deeply spiritual individuals. Ruled by Saturn, they show massive patience and protect others.',
    summaryTa: 'சனியால் ஆளப்படும் அமைதியான மற்றும் சுயக் கட்டுப்பாட்டுடன் கூடியவர்கள். இவர்கள் பொறுமையும் பிறரைக் காக்கும் பண்பும் கொண்டவர்கள்.'
  },
  star_27: {
    index: 27,
    nameEn: 'Revati',
    nameTa: 'ரேவதி',
    ruler: 'Mercury',
    rulerTa: 'புதன்',
    element: 'Water',
    elementTa: 'நீர்',
    summaryEn: 'Gentle, nurturing travelers who offer shelter and guidance to all. Ruled by Mercury, they embody final releases and absolute peace.',
    summaryTa: 'புதனோடு தொடர்புடைய மென்மையான மற்றும் அன்பான வழிகாட்டிகள். இவர்கள் இறுதி அமைதி மற்றும் முக்தி நிலைகளைக் குறிப்பவர்கள்.'
  }
};

// All 27 Yogas
export const YOGAM_DATA: Record<string, YogamInfo> = {
  yoga_1: {
    index: 1,
    nameEn: 'Vishkambha',
    nameTa: 'விஷ்கம்பம்',
    ruler: 'Yama',
    rulerTa: 'எமன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Gives victory over obstacles, strong organization, and highly logical mind.',
    meaningTa: 'தடைகளை வெல்லும் திறன், சிறந்த மேலாண்மை மற்றும் தர்க்கரீதியான அறிவைத் தரும்.'
  },
  yoga_2: {
    index: 2,
    nameEn: 'Preeti',
    nameTa: 'பிரீதி',
    ruler: 'Vishnu',
    rulerTa: 'விஷ்ணு',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Brings immense love, popularity, charm, and friendly relationships.',
    meaningTa: 'அளவற்ற அன்பு, புகழ், கவர்ச்சி மற்றும் நட்பு ரீதியான உறவுகளைத் தரும்.'
  },
  yoga_3: {
    index: 3,
    nameEn: 'Ayushman',
    nameTa: 'ஆயுஷ்மான்',
    ruler: 'Chandra',
    rulerTa: 'சந்திரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Grants long life, great physical health, wealth, and general prosperity.',
    meaningTa: 'நீண்ட ஆயுள், நல்வாழ்வு, செல்வம் மற்றும் பொதுவான செழிப்பைத் தரும்.'
  },
  yoga_4: {
    index: 4,
    nameEn: 'Saubhagya',
    nameTa: 'சௌபாக்கியம்',
    ruler: 'Indra',
    rulerTa: 'இந்திரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Auspicious day; represents good fortune, happy marriages, and beauty.',
    meaningTa: 'அதிர்ஷ்டம், மகிழ்ச்சியான திருமண வாழ்க்கை மற்றும் அழகைக் குறிக்கிறது.'
  },
  yoga_5: {
    index: 5,
    nameEn: 'Shobhana',
    nameTa: 'சோபனம்',
    ruler: 'Brihaspati',
    rulerTa: 'குரு',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Favourable for investments, decorations, designs, and pleasant actions.',
    meaningTa: 'முதலீடுகள், அலங்காரங்கள், கலைப் பணிகள் மற்றும் இனிமையான காரியங்களுக்கு உகந்தது.'
  },
  yoga_6: {
    index: 6,
    nameEn: 'Atiganda',
    nameTa: 'அதிகண்டம்',
    ruler: 'Chandra',
    rulerTa: 'சந்திரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Ideal for internal work and facing difficult challenges directly.',
    meaningTa: 'உள்முகப் பணிகள் மற்றும் கடினமான சவால்களை நேரடியாக எதிர்கொள்வதற்கு ஏற்றது.'
  },
  yoga_7: {
    index: 7,
    nameEn: 'Sukarma',
    nameTa: 'சுகர்மா',
    ruler: 'Vishwakarma',
    rulerTa: 'விஸ்வகர்மா',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Auspicious; grants skills in trade, dynamic actions, and happy events.',
    meaningTa: 'வர்த்தகத் திறன்கள், சுறுசுறுப்பான செயல்பாடுகள் மற்றும் மகிழ்ச்சியான நிகழ்வுகளைத் தரும்.'
  },
  yoga_8: {
    index: 8,
    nameEn: 'Dhriti',
    nameTa: 'திருதி',
    ruler: 'Varuna',
    rulerTa: 'வருணன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Grants immense patience, absolute steady mind, and wealth stability.',
    meaningTa: 'அளவற்ற பொறுமை, நிலையான மனம் மற்றும் செல்வ நிலைத்தன்மையைத் தரும்.'
  },
  yoga_9: {
    index: 9,
    nameEn: 'Shoola',
    nameTa: 'சூலம்',
    ruler: 'Shiva',
    rulerTa: 'சிவன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Ruled by Lord Shiva; suitable for dynamic operations and dispute resolution.',
    meaningTa: 'சிவபெருமானால் ஆளப்படுகிறது; சுறுசுறுப்பான பணிகள் மற்றும் வழக்குகளைத் தீர்ப்பதற்கு ஏற்றது.'
  },
  yoga_10: {
    index: 10,
    nameEn: 'Ganda',
    nameTa: 'கண்டம்',
    ruler: 'Agni',
    rulerTa: 'அக்னி',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Favourable for planning, analysis, and strategic self-correction.',
    meaningTa: 'முறையான திட்டமிடல், பகுப்பாய்வு மற்றும் சுய திருத்தப் பணிகளுக்கு உகந்தது.'
  },
  yoga_11: {
    index: 11,
    nameEn: 'Vriddhi',
    nameTa: 'விருத்தி',
    ruler: 'Surya',
    rulerTa: 'சூரியன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Gives exponential growth, business expansions, and absolute success.',
    meaningTa: 'மாபெரும் வளர்ச்சி, தொழில் விரிவாக்கம் மற்றும் முழுமையான வெற்றியைத் தரும்.'
  },
  yoga_12: {
    index: 12,
    nameEn: 'Dhruva',
    nameTa: 'துருவம்',
    ruler: 'Brahma',
    rulerTa: 'பிரம்மா',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Ensures absolute stability, lays foundations, and long-term security.',
    meaningTa: 'முழுமையான நிலைத்தன்மையை உறுதி செய்கிறது, அஸ்திவாரம் மற்றும் நீண்ட காலப் பாதுகாப்புக்கு ஏற்றது.'
  },
  yoga_13: {
    index: 13,
    nameEn: 'Vyaghata',
    nameTa: 'வியாகாதம்',
    ruler: 'Vayu',
    rulerTa: 'வாயு',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Highly suitable for physical defense, competition, and decisive action.',
    meaningTa: 'உடற்பயிற்சிகள், பாதுகாப்புப் பணிகள், போட்டிகள் மற்றும் தீர்க்கமான காரியங்களுக்கு உகந்தது.'
  },
  yoga_14: {
    index: 14,
    nameEn: 'Harshana',
    nameTa: 'ஹர்ஷணம்',
    ruler: 'Bhaga',
    rulerTa: 'பாகன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Brings happiness, celebration, humor, and pleasant social times.',
    meaningTa: 'மகிழ்ச்சி, கொண்டாட்டங்கள், நகைச்சுவை மற்றும் இனிமையான சமூக உறவுகளைத் தரும்.'
  },
  yoga_15: {
    index: 15,
    nameEn: 'Vajra',
    nameTa: 'வஜிரம்',
    ruler: 'Varuna',
    rulerTa: 'வருணன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Gives immense physical strength, mental resolve, and technical expertise.',
    meaningTa: 'அளவற்ற உடல் வலிமை, மன உறுதி மற்றும் தொழில்நுட்பத் திறன்களைத் தரும்.'
  },
  yoga_16: {
    index: 16,
    nameEn: 'Siddhi',
    nameTa: 'சித்தி',
    ruler: 'Ganesha',
    rulerTa: 'விநாயகர்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Ensures successful completions of tasks, business and study achievements.',
    meaningTa: 'காரியங்கள் வெற்றிகரமாக நிறைவேறுவதையும், வணிகம் மற்றும் கல்விச் சாதனைகளையும் உறுதி செய்யும்.'
  },
  yoga_17: {
    index: 17,
    nameEn: 'Vyatipata',
    nameTa: 'வியதீபாதம்',
    ruler: 'Rudra',
    rulerTa: 'ருத்ரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Favourable for deep internal prayers, ancestor worship, and charity work.',
    meaningTa: 'ஆழமான ஆத்மார்த்த பிரார்த்தனைகள், பித்ரு வழிபாடு மற்றும் தொண்டு நிறுவனப் பணிகளுக்கு ஏற்றது.'
  },
  yoga_18: {
    index: 18,
    nameEn: 'Variyana',
    nameTa: 'வரியான்',
    ruler: 'Kubera',
    rulerTa: 'குபேரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Brings massive luxury, wealth accumulation, and success in trade.',
    meaningTa: 'மாபெரும் சொகுசு வாழ்க்கை, செல்வச் சேர்க்கை மற்றும் வர்த்தகத்தில் வெற்றியைத் தரும்.'
  },
  yoga_19: {
    index: 19,
    nameEn: 'Parigha',
    nameTa: 'பரிகம்',
    ruler: 'Vishwakarma',
    rulerTa: 'விஸ்வகர்மா',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Good for structural constructions, defensive policies, and studies.',
    meaningTa: 'கட்டுமானப் பணிகள், பாதுகாப்பு ஏற்பாடுகள் மற்றும் கல்விப் பயில்வுக்கு உகந்தது.'
  },
  yoga_20: {
    index: 20,
    nameEn: 'Shiva',
    nameTa: 'சிவம்',
    ruler: 'Shiva',
    rulerTa: 'சிவன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Sacred; represents peace, spiritual elevation, and absolute clarity.',
    meaningTa: 'புனிதமானது; அமைதி, ஆன்மீக மேன்மை மற்றும் தெளிவைக் குறிக்கிறது.'
  },
  yoga_21: {
    index: 21,
    nameEn: 'Siddha',
    nameTa: 'சித்தம்',
    ruler: 'Kartikeya',
    rulerTa: 'முருகன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Highly auspicious; perfect for starting marriages, education, and jobs.',
    meaningTa: 'மிகவும் உகந்தது; திருமணங்கள், கல்வி மற்றும் புதிய வேலைகளைத் தொடங்குவதற்கு ஏற்றது.'
  },
  yoga_22: {
    index: 22,
    nameEn: 'Sadhya',
    nameTa: 'சாத்தியம்',
    ruler: 'Savitr',
    rulerTa: 'சவிதா',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Makes difficult tasks completely possible, grants deep endurance.',
    meaningTa: 'கடினமான பணிகளையும் சாத்தியமாக்குகிறது, ஆழமான சகிப்புத்தன்மையைத் தரும்.'
  },
  yoga_23: {
    index: 23,
    nameEn: 'Shubha',
    nameTa: 'சுபம்',
    ruler: 'Lakshmi',
    rulerTa: 'லட்சுமி',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Auspicious; brings happy relationships, marriages, and wealth deals.',
    meaningTa: 'சுப நிகழ்வுகள்; மகிழ்ச்சியான உறவுகள், திருமணங்கள் மற்றும் நிதி ஒப்பந்தங்களைத் தரும்.'
  },
  yoga_24: {
    index: 24,
    nameEn: 'Shukla',
    nameTa: 'சுக்கிலம்',
    ruler: 'Chandra',
    rulerTa: 'சந்திரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Brings mental bright clarity, positive state, and public popularity.',
    meaningTa: 'மனத் தெளிவு, நேர்மறையான எண்ணங்கள் மற்றும் மக்கள் செல்வாக்கைத் தரும்.'
  },
  yoga_25: {
    index: 25,
    nameEn: 'Brahma',
    nameTa: 'பிரம்மா',
    ruler: 'Brahma',
    rulerTa: 'பிரம்மா',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Highly auspicious; represents creative studies, arts, and long planning.',
    meaningTa: 'கல்வி கற்பது, கலைப் பயிற்சிகள் மற்றும் ஆக்கப்பூர்வமான திட்டமிடல்களுக்கு உகந்தது.'
  },
  yoga_26: {
    index: 26,
    nameEn: 'Indra',
    nameTa: 'இந்திரம்',
    ruler: 'Indra',
    rulerTa: 'இந்திரன்',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Grants leadership authority, success in administrative affairs, and trade.',
    meaningTa: 'தலைமைப் பொறுப்புகள், அரசு வழி காரியங்கள் மற்றும் வர்த்தகத்தில் வெற்றியைத் தரும்.'
  },
  yoga_27: {
    index: 27,
    nameEn: 'Vaidhriti',
    nameTa: 'வைதிருதி',
    ruler: 'Diti',
    rulerTa: 'திதி',
    element: 'Ether',
    elementTa: 'ஆகாயம்',
    meaningEn: 'Ideal day for charitable acts, spiritual retreats, and meditation.',
    meaningTa: 'தர்ம காரியங்கள், ஆன்மீக தியானங்கள் மற்றும் பிரார்த்தனைகளுக்கு உகந்த நாள்.'
  }
};

// All 11 Karanas (7 recurring + 4 fixed)
export const KARANAM_DATA: Record<string, KaranamInfo> = {
  karanam_1: {
    index: 1,
    nameEn: 'Bava',
    nameTa: 'பவம்',
    type: 'movable',
    ruler: 'Indra',
    rulerTa: 'இந்திரன்',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Favourable for laying foundations, health recovery, and agricultural works.',
    meaningTa: 'அடித்தளம் அமைத்தல், உடல் நலம் தேறுதல் மற்றும் விவசாயப் பணிகளுக்கு உகந்தது.'
  },
  karanam_2: {
    index: 2,
    nameEn: 'Balava',
    nameTa: 'பாலவம்',
    type: 'movable',
    ruler: 'Brahma',
    rulerTa: 'பிரம்மா',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Highly auspicious for education, writing books, and spiritual rituals.',
    meaningTa: 'கல்வி கற்றிடல், புத்தகங்கள் எழுதுதல் மற்றும் ஆன்மீகச் சடங்குகளுக்கு ஏற்றது.'
  },
  karanam_3: {
    index: 3,
    nameEn: 'Kaulava',
    nameTa: 'கௌலவம்',
    type: 'movable',
    ruler: 'Mitra',
    rulerTa: 'மித்ரன்',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Excellent for friendly negotiations, partnership agreements, and romance.',
    meaningTa: 'நட்பு ரீதியான பேச்சுவார்த்தைகள், கூட்டாண்மை ஒப்பந்தங்கள் மற்றும் காதலுக்கு ஏற்றது.'
  },
  karanam_4: {
    index: 4,
    nameEn: 'Taitila',
    nameTa: 'தைதிலம்',
    type: 'movable',
    ruler: 'Vishwakarma',
    rulerTa: 'விஸ்வகர்மா',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Favourable for houses construction, public relations, and arts creation.',
    meaningTa: 'வீடு கட்டுதல், மக்கள் தொடர்பு மற்றும் கலைப் படைப்புகளுக்கு உகந்தது.'
  },
  karanam_5: {
    index: 5,
    nameEn: 'Garaja',
    nameTa: 'கரசை',
    type: 'movable',
    ruler: 'Bhumidevi',
    rulerTa: 'பூமிதேவி',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Auspicious day for agricultural works, planting, and purchasing land assets.',
    meaningTa: 'விவசாயப் பணிகள், நாற்று நடுதல் மற்றும் புதிய நிலங்கள் வாங்குவதற்கு ஏற்றது.'
  },
  karanam_6: {
    index: 6,
    nameEn: 'Vanija',
    nameTa: 'வணிசை',
    type: 'movable',
    ruler: 'Lakshmi',
    rulerTa: 'லட்சுமி',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Highly beneficial for business deals, investments, and trade agreements.',
    meaningTa: 'வணிக ஒப்பந்தங்கள், முதலீடுகள் மற்றும் வர்த்தகங்களுக்கு மிகவும் நன்மை தரும்.'
  },
  karanam_7: {
    index: 7,
    nameEn: 'Vishti (Bhadra)',
    nameTa: 'பத்திரை/விஷ்டி',
    type: 'movable',
    ruler: 'Yama',
    rulerTa: 'எமன்',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Suitable for dynamic activities, clearing obstacles, and self-defense training.',
    meaningTa: 'தடைகளை நீக்குவதற்கும், பாதுகாப்புப் பயிற்சிகளுக்கும் உகந்தது.'
  },
  karanam_8: {
    index: 8,
    nameEn: 'Shakuni',
    nameTa: 'சகுனி',
    type: 'fixed',
    ruler: 'Koli',
    rulerTa: 'கோலி',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Favourable for preparing medicines, legal defense, and introspection.',
    meaningTa: 'மருந்துகள் தயாரிப்பதற்கும், சட்டப் பாதுகாப்புகளுக்கும், தியானத்திற்கும் ஏற்றது.'
  },
  karanam_9: {
    index: 9,
    nameEn: 'Chatushpada',
    nameTa: 'சதுஷ்பாதம்',
    type: 'fixed',
    ruler: 'Vrishabha',
    rulerTa: 'விருஷபம்',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Beneficial for cattle management, administrative works, and planning properties.',
    meaningTa: 'கால்நடைகள் பராமரிப்பு, நிர்வாகப் பணிகள் மற்றும் சொத்துக்கள் மேலாண்மைக்கு ஏற்றது.'
  },
  karanam_10: {
    index: 10,
    nameEn: 'Naga',
    nameTa: 'நாகவம்',
    type: 'fixed',
    ruler: 'Nagas',
    rulerTa: 'நாகர்கள்',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Auspicious day for research, occult studies, and starting complex tasks.',
    meaningTa: 'ஆராய்ச்சிப் பணிகள், இரகசியக் கலைகள் கற்பது மற்றும் சிக்கலான காரியங்களைத் தொடங்க ஏற்றது.'
  },
  karanam_11: {
    index: 11,
    nameEn: 'Kimstughna',
    nameTa: 'கிம்ஸ்துக்கினம்',
    type: 'fixed',
    ruler: 'Kubera',
    rulerTa: 'குபேரன்',
    element: 'Earth',
    elementTa: 'மண்',
    meaningEn: 'Highly auspicious for performing marriages, starting houses, and investments.',
    meaningTa: 'திருமணங்களை நடத்தவும், வீடு கட்டத் தொடங்கவும், புதிய முதலீடுகள் செய்யவும் சிறந்தது.'
  }
};
