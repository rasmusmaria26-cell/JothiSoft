export interface BabyNameItem {
  nameEn: string
  nameTa: string
  meaningEn: string
  meaningTa: string
  gender: 'boy' | 'girl' | 'unisex'
  startingLetter: string // English syllable starting letter, e.g. "Che", "La", "Ka"
}

export const SYLLABLE_MAPPING: Record<string, string[]> = {
  "Ashwini": ["Chu / சு", "Che / சே", "Cho / சோ", "La / லா"],
  "Bharani": ["Li / லி", "Lu / லு", "Le / லே", "Lo / லோ"],
  "Krittika": ["A / அ", "I / இ", "U / உ", "Ea / ஏ"],
  "Rohini": ["O / ஓ", "Va / வ", "Vi / வி", "Vu / வு"],
  "Mrigashira": ["Ve / வே", "Vo / வோ", "Ka / க", "Ki / கி"],
  "Ardra": ["Ku / கு", "Gha / க", "Ng / ச", "Chha / ச"],
  "Punarvasu": ["Ke / கே", "Ko / கோ", "Ha / ஹ", "Hi / ஹி"],
  "Pushya": ["Hu / ஹு", "He / ஹே", "Ho / ஹோ", "Da / ட"],
  "Ashlesha": ["Di / டி", "Du / டு", "De / டே", "Do / டோ"],
  "Magha": ["Ma / ம", "Mi / மி", "Mu / மு", "Me / மே"],
  "Purva Phalguni": ["Mo / மோ", "Ta / த", "Ti / தி", "Tu / து"],
  "Uttara Phalguni": ["Te / தே", "To / தோ", "Pa / ப", "Pi / பி"],
  "Hasta": ["Pu / பு", "Sha / ஷ", "Na / ண", "Tha / த"],
  "Chitra": ["Pe / பே", "Po / போ", "Ra / ர", "Ri / ரி"],
  "Swati": ["Ru / ரு", "Re / ரே", "Ro / ரோ", "Ta / த"],
  "Vishakha": ["Ti / தி", "Tu / து", "Te / தே", "To / தோ"],
  "Anuradha": ["Na / ந", "Ni / நி", "Nu / னு", "Ne / நே"],
  "Jyeshtha": ["No / நோ", "Ya / ய", "Yi / யி", "Yu / யு"],
  "Mula": ["Ye / யே", "Yo / யோ", "Bha / ப", "Bhi / பி"],
  "Purva Ashadha": ["Bhu / பு", "Dha / த", "Pha / ப", "Dha / த"],
  "Uttara Ashadha": ["Bhe / பே", "Bho / போ", "Ja / ஜ", "Ji / ஜி"],
  "Shravana": ["Ju / ஜு", "Je / ஜே", "Jo / ஜோ", "Gha / க"],
  "Dhanishta": ["Ga / க", "Gi / கி", "Gu / கு", "Ge / கே"],
  "Shatabhisha": ["Go / கோ", "Sa / ச", "Si / சி", "Su / சு"],
  "Purva Bhadrapada": ["Se / சே", "So / சோ", "Da / த", "Di / தி"],
  "Uttara Bhadrapada": ["Du / து", "Tha / த", "Jha / ஜ", "Na / ஞ"],
  "Revati": ["De / தே", "Do / டோ", "Cha / ச", "Chi / சி"]
}

export const CuratedBabyNames: BabyNameItem[] = [
  // 1. Ashwini: Chu, Che, Cho, La
  { nameEn: "Chudar", nameTa: "சுடர்", meaningEn: "Flame, Brilliance", meaningTa: "ஒளி வீசும் சுடர்", gender: "unisex", startingLetter: "Chu" },
  { nameEn: "Choodamani", nameTa: "சூடாமணி", meaningEn: "Crest jewel", meaningTa: "தலைமுடியில் அணியும் ரத்தினம்", gender: "girl", startingLetter: "Chu" },
  { nameEn: "Chezhian", nameTa: "செழியன்", meaningEn: "Prosperous, flourishing", meaningTa: "வளமான, செழிப்பான", gender: "boy", startingLetter: "Che" },
  { nameEn: "Chelvi", nameTa: "செல்வி", meaningEn: "Wealthy daughter, princess", meaningTa: "அன்பான மகள், செல்வம்", gender: "girl", startingLetter: "Che" },
  { nameEn: "Chozhan", nameTa: "சோழன்", meaningEn: "The Chola king", meaningTa: "சோழ மன்னன்", gender: "boy", startingLetter: "Cho" },
  { nameEn: "Chokkan", nameTa: "சொக்கன்", meaningEn: "Lord Shiva, beautiful", meaningTa: "சிவபெருமான், அழகானவன்", gender: "boy", startingLetter: "Cho" },
  { nameEn: "Lalitha", nameTa: "லலிதா", meaningEn: "Goddess Durga, playful beauty", meaningTa: "அழகிய, லலிதாம்பிகை", gender: "girl", startingLetter: "La" },
  { nameEn: "Lakshanya", nameTa: "லக்ஷன்யா", meaningEn: "One who achieves goals", meaningTa: "இலக்கை அடைபவள்", gender: "girl", startingLetter: "La" },

  // 2. Bharani: Li, Lu, Le, Lo
  { nameEn: "Lingesh", nameTa: "லிங்கேஷ்", meaningEn: "Lord Shiva", meaningTa: "சிவபெருமான்", gender: "boy", startingLetter: "Li" },
  { nameEn: "Lishika", nameTa: "லிஷிகா", meaningEn: "Sacred, beautiful", meaningTa: "புனிதமான, அழகான", gender: "girl", startingLetter: "Li" },
  { nameEn: "Lubdha", nameTa: "லுப்தா", meaningEn: "Hunter, star", meaningTa: "நட்சத்திரம், வேடன்", gender: "girl", startingLetter: "Lu" },
  { nameEn: "Lumbika", nameTa: "லும்பிகா", meaningEn: "A musical instrument", meaningTa: "ஒரு இசைக்கருவி", gender: "girl", startingLetter: "Lu" },
  { nameEn: "Lekha", nameTa: "லேகா", meaningEn: "Writing, picture", meaningTa: "எழுத்து, ஓவியம்", gender: "girl", startingLetter: "Le" },
  { nameEn: "Lethika", nameTa: "லேத்திகா", meaningEn: "A small creeper", meaningTa: "சிறிய கொடி", gender: "girl", startingLetter: "Le" },
  { nameEn: "Lokesh", nameTa: "லோகேஷ்", meaningEn: "King of the world", meaningTa: "உலகின் அரசன், பிரம்மா", gender: "boy", startingLetter: "Lo" },
  { nameEn: "Loganayagi", nameTa: "லோகநாயகி", meaningEn: "Leader of the world", meaningTa: "உலகிற்கு தலைவி", gender: "girl", startingLetter: "Lo" },

  // 3. Krittika: A, I, U, Ea
  { nameEn: "Aarav", nameTa: "ஆரவ்", meaningEn: "Peaceful, calm", meaningTa: "அமைதியானவன்", gender: "boy", startingLetter: "A" },
  { nameEn: "Aadhira", nameTa: "ஆதிரா", meaningEn: "Lightning, strong", meaningTa: "மின்னல், வலிமையானவள்", gender: "girl", startingLetter: "A" },
  { nameEn: "Iniya", nameTa: "இனியா", meaningEn: "Sweet, pleasant", meaningTa: "இனிமையானவள்", gender: "girl", startingLetter: "I" },
  { nameEn: "Ilango", nameTa: "இளங்கோ", meaningEn: "Prince, author of Silappatikaram", meaningTa: "இளவரசன், சிலப்பதிகாரம் இயற்றியவர்", gender: "boy", startingLetter: "I" },
  { nameEn: "Udhay", nameTa: "உதய்", meaningEn: "To rise, sunrise", meaningTa: "உதயம், எழுச்சி", gender: "boy", startingLetter: "U" },
  { nameEn: "Uma", nameTa: "உமா", meaningEn: "Goddess Parvati", meaningTa: "பார்வதி தேவி", gender: "girl", startingLetter: "U" },
  { nameEn: "Ezhil", nameTa: "எழில்", meaningEn: "Beauty", meaningTa: "அழகு", gender: "unisex", startingLetter: "Ea" },
  { nameEn: "Ekam", nameTa: "ஏகம்", meaningEn: "One, supreme", meaningTa: "ஒன்று, முழுமை", gender: "boy", startingLetter: "Ea" },

  // 4. Rohini: O, Va, Vi, Vu
  { nameEn: "Oviya", nameTa: "ஓவியா", meaningEn: "Beautiful painting", meaningTa: "அழகிய சித்திரம்", gender: "girl", startingLetter: "O" },
  { nameEn: "Omkar", nameTa: "ஓம்கார்", meaningEn: "Sound of Om, sacred syllable", meaningTa: "பிரணவ மந்திரம்", gender: "boy", startingLetter: "O" },
  { nameEn: "Varun", nameTa: "வருண்", meaningEn: "Lord of the water", meaningTa: "நீரின் கடவுள்", gender: "boy", startingLetter: "Va" },
  { nameEn: "Vaidehi", nameTa: "வைதேகி", meaningEn: "Sita, princess of Videha", meaningTa: "சீதை", gender: "girl", startingLetter: "Va" },
  { nameEn: "Vimal", nameTa: "விமல்", meaningEn: "Pure, clean", meaningTa: "தூய்மையானவன்", gender: "boy", startingLetter: "Vi" },
  { nameEn: "Vidhya", nameTa: "வித்யா", meaningEn: "Knowledge, wisdom", meaningTa: "கல்வி, ஞானம்", gender: "girl", startingLetter: "Vi" },
  { nameEn: "Vrundha", nameTa: "விருந்தா", meaningEn: "Tulsi, holy basil", meaningTa: "துளசி", gender: "girl", startingLetter: "Vu" },
  { nameEn: "Vumika", nameTa: "வுமிகா", meaningEn: "Goddess Sita, earth", meaningTa: "பூமி, சீதை", gender: "girl", startingLetter: "Vu" },

  // 5. Mrigashira: Ve, Vo, Ka, Ki
  { nameEn: "Velan", nameTa: "வேலன்", meaningEn: "Lord Murugan", meaningTa: "முருகப்பெருமான்", gender: "boy", startingLetter: "Ve" },
  { nameEn: "Vennila", nameTa: "வெண்ணிலா", meaningEn: "White moon", meaningTa: "வெண்மையான நிலவு", gender: "girl", startingLetter: "Ve" },
  { nameEn: "Vohith", nameTa: "வோஹித்", meaningEn: "Traveller, ship", meaningTa: "பயணி, கப்பல்", gender: "boy", startingLetter: "Vo" },
  { nameEn: "Vopika", nameTa: "வோபிகா", meaningEn: "Worshipper", meaningTa: "வழிபடுபவள்", gender: "girl", startingLetter: "Vo" },
  { nameEn: "Kavin", nameTa: "கவின்", meaningEn: "Handsome, beautiful", meaningTa: "அழகானவன்", gender: "boy", startingLetter: "Ka" },
  { nameEn: "Kavya", nameTa: "காவ்யா", meaningEn: "Poetry in motion", meaningTa: "கவிதை", gender: "girl", startingLetter: "Ka" },
  { nameEn: "Kishore", nameTa: "கிஷோர்", meaningEn: "Young boy, Lord Krishna", meaningTa: "இளமையானவன்", gender: "boy", startingLetter: "Ki" },
  { nameEn: "Kirthika", nameTa: "கீர்த்திகா", meaningEn: "Fame, glorious", meaningTa: "புகழ் பெற்றவள்", gender: "girl", startingLetter: "Ki" },

  // 6. Ardra: Ku, Gha, Ng, Chha
  { nameEn: "Kumaran", nameTa: "குமரன்", meaningEn: "Youthful, Lord Murugan", meaningTa: "இளமையானவன், முருகப்பெருமான்", gender: "boy", startingLetter: "Ku" },
  { nameEn: "Kuzhali", nameTa: "குழலி", meaningEn: "Girl with sweet voice/beautiful hair", meaningTa: "அழகிய கூந்தல்/குரல் உடையவள்", gender: "girl", startingLetter: "Ku" },
  { nameEn: "Ghanashyam", nameTa: "கனஷ்யாம்", meaningEn: "Lord Krishna, dark cloud", meaningTa: "கருமேகம் போன்றவன், கிருஷ்ணன்", gender: "boy", startingLetter: "Gha" },
  { nameEn: "Ghanavi", nameTa: "கனவி", meaningEn: "Singer, melody", meaningTa: "இனிமையாக பாடுபவள்", gender: "girl", startingLetter: "Gha" },
  { nameEn: "Gnanavel", nameTa: "ஞானவேல்", meaningEn: "Spear of wisdom", meaningTa: "அறிவைக் குறிக்கும் வேல்", gender: "boy", startingLetter: "Ng" },
  { nameEn: "Gnaneshwari", nameTa: "ஞானேஸ்வரி", meaningEn: "Goddess of knowledge", meaningTa: "ஞானத்தின் தெய்வம்", gender: "girl", startingLetter: "Ng" },
  { nameEn: "Chhaya", nameTa: "ச்சாயா", meaningEn: "Shadow, reflection", meaningTa: "நிழல்", gender: "girl", startingLetter: "Chha" },
  { nameEn: "Chhatrapati", nameTa: "ச்சத்ரபதி", meaningEn: "King of Kings", meaningTa: "மன்னர்களின் மன்னன்", gender: "boy", startingLetter: "Chha" },

  // 7. Punarvasu: Ke, Ko, Ha, Hi
  { nameEn: "Keshika", nameTa: "கேஷிகா", meaningEn: "Woman with beautiful hair", meaningTa: "அழகிய கூந்தலை உடையவள்", gender: "girl", startingLetter: "Ke" },
  { nameEn: "Keval", nameTa: "கேவல்", meaningEn: "Only, absolute", meaningTa: "தனித்துவமானவன்", gender: "boy", startingLetter: "Ke" },
  { nameEn: "Kovendhan", nameTa: "கோவேந்தன்", meaningEn: "King of kings", meaningTa: "அரசர்களுக்கெல்லாம் அரசன்", gender: "boy", startingLetter: "Ko" },
  { nameEn: "Kousalya", nameTa: "கௌசல்யா", meaningEn: "Mother of Lord Rama", meaningTa: "ராமரின் தாய்", gender: "girl", startingLetter: "Ko" },
  { nameEn: "Hari", nameTa: "ஹரி", meaningEn: "Lord Vishnu", meaningTa: "திருமால்", gender: "boy", startingLetter: "Ha" },
  { nameEn: "Harini", nameTa: "ஹரிணி", meaningEn: "Deer, Goddess Lakshmi", meaningTa: "மான் போன்றவள், லட்சுமி", gender: "girl", startingLetter: "Ha" },
  { nameEn: "Hitesh", nameTa: "ஹிதேஷ்", meaningEn: "Lord of goodness", meaningTa: "நன்மைகளின் இறைவன்", gender: "boy", startingLetter: "Hi" },
  { nameEn: "Hima", nameTa: "ஹிமா", meaningEn: "Snow, Goddess Parvati", meaningTa: "பனி, பார்வதி தேவி", gender: "girl", startingLetter: "Hi" },

  // 8. Pushya: Hu, He, Ho, Da
  { nameEn: "Humesh", nameTa: "ஹுமேஷ்", meaningEn: "Lord of intellect", meaningTa: "அறிவின் இறைவன்", gender: "boy", startingLetter: "Hu" },
  { nameEn: "Huvishka", nameTa: "ஹுவிஷ்கா", meaningEn: "Name of a king, golden", meaningTa: "தங்கமானவள், ஒரு அரசனின் பெயர்", gender: "girl", startingLetter: "Hu" },
  { nameEn: "Hema", nameTa: "ஹேமா", meaningEn: "Golden", meaningTa: "தங்கமானவள்", gender: "girl", startingLetter: "He" },
  { nameEn: "Hemant", nameTa: "ஹேமந்த்", meaningEn: "Early winter", meaningTa: "முன்பனிக்காலம்", gender: "boy", startingLetter: "He" },
  { nameEn: "Hoshika", nameTa: "ஹோஷிகா", meaningEn: "Star, brilliant", meaningTa: "நicletas போன்றவள்", gender: "girl", startingLetter: "Ho" },
  { nameEn: "Hoysala", nameTa: "ஹொய்சாலா", meaningEn: "A legendary dynasty", meaningTa: "வரலாற்று சிறப்புமிக்க வம்சம்", gender: "boy", startingLetter: "Ho" },
  { nameEn: "Dayanidhi", nameTa: "தயாநிதி", meaningEn: "Treasure of mercy", meaningTa: "கருணையின் நிதி", gender: "boy", startingLetter: "Da" },
  { nameEn: "Darshini", nameTa: "தர்ஷினி", meaningEn: "Blessed one, seeing the divine", meaningTa: "தெய்வீக தரிசனம் தருபவள்", gender: "girl", startingLetter: "Da" },

  // 9. Ashlesha: Di, Du, De, Do
  { nameEn: "Dinesh", nameTa: "தினேஷ்", meaningEn: "Lord of the day, Sun", meaningTa: "சூரியன்", gender: "boy", startingLetter: "Di" },
  { nameEn: "Divya", nameTa: "திவ்யா", meaningEn: "Divine, heavenly", meaningTa: "தெய்வீகமானவள்", gender: "girl", startingLetter: "Di" },
  { nameEn: "Durga", nameTa: "துர்கா", meaningEn: "Goddess Parvati, invincible", meaningTa: "துர்க்கை, வெல்ல முடியாதவள்", gender: "girl", startingLetter: "Du" },
  { nameEn: "Durai", nameTa: "துரை", meaningEn: "Leader, chief", meaningTa: "தலைவன்", gender: "boy", startingLetter: "Du" },
  { nameEn: "Devan", nameTa: "தேவன்", meaningEn: "God, divine", meaningTa: "இறைவன்", gender: "boy", startingLetter: "De" },
  { nameEn: "Devi", nameTa: "தேவி", meaningEn: "Goddess", meaningTa: "தெய்வம்", gender: "girl", startingLetter: "De" },
  { nameEn: "Doshika", nameTa: "தோஷிகா", meaningEn: "Flawless, clearing obstacles", meaningTa: "குற்றமற்றவள்", gender: "girl", startingLetter: "Do" },
  { nameEn: "Drona", nameTa: "துரோணா", meaningEn: "Teacher, preceptor", meaningTa: "குரு, ஆசிரியர்", gender: "boy", startingLetter: "Do" },

  // 10. Magha: Ma, Mi, Mu, Me
  { nameEn: "Maran", nameTa: "மாறன்", meaningEn: "Brave, Lord Murugan", meaningTa: "வீரமானவன், பாண்டிய மன்னன்", gender: "boy", startingLetter: "Ma" },
  { nameEn: "Madhu", nameTa: "மது", meaningEn: "Sweet, honey", meaningTa: "தேன் போன்றவள்", gender: "unisex", startingLetter: "Ma" },
  { nameEn: "Mithran", nameTa: "மித்ரன்", meaningEn: "Friend, Sun", meaningTa: "நண்பன், சூரியன்", gender: "boy", startingLetter: "Mi" },
  { nameEn: "Mirnalini", nameTa: "மிருணாளினி", meaningEn: "Lotus stalk", meaningTa: "தாமரை தண்டு", gender: "girl", startingLetter: "Mi" },
  { nameEn: "Mugilan", nameTa: "முகிலன்", meaningEn: "Like a cloud", meaningTa: "மேகம் போன்றவன்", gender: "boy", startingLetter: "Mu" },
  { nameEn: "Mullai", nameTa: "முல்லை", meaningEn: "Jasmine flower", meaningTa: "முல்லை மலர்", gender: "girl", startingLetter: "Mu" },
  { nameEn: "Meenakshi", nameTa: "மீனாட்சி", meaningEn: "Fish-eyed Goddess", meaningTa: "மீன் போன்ற கண்களை உடையவள்", gender: "girl", startingLetter: "Me" },
  { nameEn: "Meyyappan", nameTa: "மெய்யப்பன்", meaningEn: "Embodiment of truth", meaningTa: "உண்மையின் வடிவம்", gender: "boy", startingLetter: "Me" },

  // 11. Purva Phalguni: Mo, Ta, Ti, Tu
  { nameEn: "Mohan", nameTa: "மோகன்", meaningEn: "Attractive, Lord Krishna", meaningTa: "ஈர்க்கக்கூடியவன், கிருஷ்ணன்", gender: "boy", startingLetter: "Mo" },
  { nameEn: "Mohini", nameTa: "மோகினி", meaningEn: "Most beautiful, enchanting", meaningTa: "மயக்கும் அழகுடையவள்", gender: "girl", startingLetter: "Mo" },
  { nameEn: "Tamil", nameTa: "தமிழ்", meaningEn: "The Tamil language, sweet", meaningTa: "இனிமையான மொழி", gender: "unisex", startingLetter: "Ta" },
  { nameEn: "Taara", nameTa: "தாரா", meaningEn: "Star", meaningTa: "நகஷ்த்திரம்", gender: "girl", startingLetter: "Ta" },
  { nameEn: "Thilagam", nameTa: "திலகம்", meaningEn: "Sacred mark, foremost", meaningTa: "சிறந்தவள், திலகம்", gender: "girl", startingLetter: "Ti" },
  { nameEn: "Thirumaal", nameTa: "திருமால்", meaningEn: "Lord Vishnu", meaningTa: "விஷ்ணு பகவான்", gender: "boy", startingLetter: "Ti" },
  { nameEn: "Thulasi", nameTa: "துளசி", meaningEn: "Sacred basil", meaningTa: "புனிதமான துளசி", gender: "girl", startingLetter: "Tu" },
  { nameEn: "Thushar", nameTa: "துஷார்", meaningEn: "Snow, winter", meaningTa: "பனி", gender: "boy", startingLetter: "Tu" },

  // 12. Uttara Phalguni: Te, To, Pa, Pi
  { nameEn: "Thenral", nameTa: "தென்றல்", meaningEn: "Breeze", meaningTa: "மென்மையான காற்று", gender: "girl", startingLetter: "Te" },
  { nameEn: "Thenmozhi", nameTa: "தேன்மொழி", meaningEn: "Sweet-spoken", meaningTa: "தேன் போன்ற இனிமையான பேச்சு", gender: "girl", startingLetter: "Te" },
  { nameEn: "Tholkappiyan", nameTa: "தொல்காப்பியன்", meaningEn: "Ancient scholar", meaningTa: "பழமையான அறிஞர்", gender: "boy", startingLetter: "To" },
  { nameEn: "Thoshini", nameTa: "தோஷினி", meaningEn: "Pleasing, bringing joy", meaningTa: "மகிழ்ச்சி தருபவள்", gender: "girl", startingLetter: "To" },
  { nameEn: "Paari", nameTa: "பாரி", meaningEn: "Philanthropist king", meaningTa: "வள்ளல்", gender: "boy", startingLetter: "Pa" },
  { nameEn: "Pavithra", nameTa: "பவித்ரா", meaningEn: "Pure, sacred", meaningTa: "தூய்மையானவள்", gender: "girl", startingLetter: "Pa" },
  { nameEn: "Piraichoodan", nameTa: "பிறைசூடன்", meaningEn: "Lord Shiva", meaningTa: "பிறை நிலவை சூடியவன், சிவன்", gender: "boy", startingLetter: "Pi" },
  { nameEn: "Piyush", nameTa: "பியூஷ்", meaningEn: "Nectar, amrit", meaningTa: "அமிர்தம்", gender: "boy", startingLetter: "Pi" },

  // 13. Hasta: Pu, Sha, Na, Tha
  { nameEn: "Pugazh", nameTa: "புகழ்", meaningEn: "Fame, glory", meaningTa: "கீர்த்தி, புகழ்", gender: "boy", startingLetter: "Pu" },
  { nameEn: "Punitha", nameTa: "புனிதா", meaningEn: "Holy, pure", meaningTa: "புனிதமானவள்", gender: "girl", startingLetter: "Pu" },
  { nameEn: "Shankar", nameTa: "சங்கர்", meaningEn: "Lord Shiva, benefactor", meaningTa: "நன்மை செய்பவன், சிவன்", gender: "boy", startingLetter: "Sha" },
  { nameEn: "Shalini", nameTa: "ஷாலினி", meaningEn: "Modest, intelligent", meaningTa: "அடக்கமானவள்", gender: "girl", startingLetter: "Sha" },
  { nameEn: "Nalan", nameTa: "நளன்", meaningEn: "Honest king", meaningTa: "நேர்மையான அரசன்", gender: "boy", startingLetter: "Na" },
  { nameEn: "Nandhini", nameTa: "நந்தினி", meaningEn: "Delightful, Goddess Durga", meaningTa: "மகிழ்ச்சி தருபவள்", gender: "girl", startingLetter: "Na" },
  { nameEn: "Thamarai", nameTa: "தாமரை", meaningEn: "Lotus flower", meaningTa: "தாமரை மலர்", gender: "girl", startingLetter: "Tha" },
  { nameEn: "Thangam", nameTa: "தங்கம்", meaningEn: "Gold, precious", meaningTa: "தங்கம், மதிப்பிற்குரியவள்", gender: "girl", startingLetter: "Tha" },

  // 14. Chitra: Pe, Po, Ra, Ri
  { nameEn: "Perarasi", nameTa: "பேரரசி", meaningEn: "Empress", meaningTa: "பெரிய அரசி", gender: "girl", startingLetter: "Pe" },
  { nameEn: "Perumal", nameTa: "பெருமாள்", meaningEn: "Lord Vishnu", meaningTa: "திருமால்", gender: "boy", startingLetter: "Pe" },
  { nameEn: "Ponni", nameTa: "பொன்னி", meaningEn: "River Kaveri", meaningTa: "காவிரி நதி, தங்கம் போன்றவள்", gender: "girl", startingLetter: "Po" },
  { nameEn: "Ponnambalam", nameTa: "பொன்னம்பலம்", meaningEn: "Golden temple", meaningTa: "தங்க ஆலயம்", gender: "boy", startingLetter: "Po" },
  { nameEn: "Raja", nameTa: "ராஜா", meaningEn: "King", meaningTa: "அரசன்", gender: "boy", startingLetter: "Ra" },
  { nameEn: "Ramya", nameTa: "ரம்யா", meaningEn: "Beautiful, delightful", meaningTa: "அழகானவள்", gender: "girl", startingLetter: "Ra" },
  { nameEn: "Rithvik", nameTa: "ரித்விக்", meaningEn: "Priest", meaningTa: "யாகம் செய்பவன்", gender: "boy", startingLetter: "Ri" },
  { nameEn: "Riya", nameTa: "ரியா", meaningEn: "Singer, graceful", meaningTa: "இனிமையாக பாடுபவள்", gender: "girl", startingLetter: "Ri" },

  // 15. Swati: Ru, Re, Ro, Ta
  { nameEn: "Rudra", nameTa: "ருத்ரா", meaningEn: "Lord Shiva, fierce", meaningTa: "சிவன், உக்கிரமானவன்", gender: "boy", startingLetter: "Ru" },
  { nameEn: "Rukmini", nameTa: "ருக்மணி", meaningEn: "Consort of Lord Krishna", meaningTa: "கிருஷ்ணரின் மனைவி", gender: "girl", startingLetter: "Ru" },
  { nameEn: "Revathi", nameTa: "ரேவதி", meaningEn: "Prosperity, a star", meaningTa: "செல்வம், ஒரு நட்சத்திரம்", gender: "girl", startingLetter: "Re" },
  { nameEn: "Rethika", nameTa: "ரேத்திகா", meaningEn: "Joy, truth", meaningTa: "உண்மை, மகிழ்ச்சி", gender: "girl", startingLetter: "Re" },
  { nameEn: "Roshini", nameTa: "ரோஷினி", meaningEn: "Light, brightness", meaningTa: "ஒளி, பிரகாசம்", gender: "girl", startingLetter: "Ro" },
  { nameEn: "Rohit", nameTa: "ரோஹித்", meaningEn: "Red, Sun", meaningTa: "சூரியன், சிவப்பு", gender: "boy", startingLetter: "Ro" },
  { nameEn: "Tarak", nameTa: "தாரக்", meaningEn: "Protector, star", meaningTa: "பாதுகாவலன், நட்சத்திரம்", gender: "boy", startingLetter: "Ta" },
  { nameEn: "Tanvi", nameTa: "தன்வி", meaningEn: "Delicate, beautiful girl", meaningTa: "மென்மையானவள், அழகானவள்", gender: "girl", startingLetter: "Ta" },

  // 16. Vishakha: Ti, Tu, Te, To
  { nameEn: "Thirumurugan", nameTa: "திருமுருகன்", meaningEn: "Lord Murugan", meaningTa: "முருகப்பெருமான்", gender: "boy", startingLetter: "Ti" },
  { nameEn: "Thirumagal", nameTa: "திருமகள்", meaningEn: "Goddess Lakshmi", meaningTa: "லட்சுமி தேவி", gender: "girl", startingLetter: "Ti" },
  { nameEn: "Thuyavan", nameTa: "தூயவன்", meaningEn: "Pure, holy", meaningTa: "தூய்மையானவன்", gender: "boy", startingLetter: "Tu" },
  { nameEn: "Tushara", nameTa: "துஷாரா", meaningEn: "Snow, morning dew", meaningTa: "பனித்துளி", gender: "girl", startingLetter: "Tu" },
  { nameEn: "Thej", nameTa: "தேஜ்", meaningEn: "Light, brilliance", meaningTa: "ஒளி, பிரகாசம்", gender: "boy", startingLetter: "Te" },
  { nameEn: "Thejaswini", nameTa: "தேஜஸ்வினி", meaningEn: "Radiant, intelligent", meaningTa: "பிரகாசமானவள்", gender: "girl", startingLetter: "Te" },
  { nameEn: "Thogai", nameTa: "தோகை", meaningEn: "Peacock feather", meaningTa: "மயில் தோகை", gender: "girl", startingLetter: "To" },
  { nameEn: "Tholan", nameTa: "தோழன்", meaningEn: "Friend, companion", meaningTa: "நண்பன்", gender: "boy", startingLetter: "To" },

  // 17. Anuradha: Na, Ni, Nu, Ne
  { nameEn: "Naveen", nameTa: "நவீன்", meaningEn: "New, modern", meaningTa: "புதியவன்", gender: "boy", startingLetter: "Na" },
  { nameEn: "Narmadha", nameTa: "நர்மதா", meaningEn: "One who gives pleasure, a river", meaningTa: "மகிழ்ச்சி தருபவள், நர்மதை நதி", gender: "girl", startingLetter: "Na" },
  { nameEn: "Nithya", nameTa: "நித்யா", meaningEn: "Eternal, forever", meaningTa: "நிரந்தரமானவள்", gender: "girl", startingLetter: "Ni" },
  { nameEn: "Nithilan", nameTa: "நித்திலன்", meaningEn: "Like a pure pearl", meaningTa: "முத்து போன்றவன்", gender: "boy", startingLetter: "Ni" },
  { nameEn: "Nupur", nameTa: "நூபுர்", meaningEn: "Anklet", meaningTa: "சிலம்பு, கொலுசு", gender: "girl", startingLetter: "Nu" },
  { nameEn: "Nutan", nameTa: "நூதன்", meaningEn: "New, fresh", meaningTa: "புதியவன்", gender: "boy", startingLetter: "Nu" },
  { nameEn: "Nethra", nameTa: "நேத்ரா", meaningEn: "Eye, vision", meaningTa: "கண், பார்வை", gender: "girl", startingLetter: "Ne" },
  { nameEn: "Nedunchezhiyan", nameTa: "நெடுஞ்செழியன்", meaningEn: "Tall and prosperous, Pandiya King", meaningTa: "பாண்டிய மன்னன்", gender: "boy", startingLetter: "Ne" },

  // 18. Jyeshtha: No, Ya, Yi, Yu
  { nameEn: "Noviya", nameTa: "நோவியா", meaningEn: "New, artistic", meaningTa: "புதியவள், கலைநயம் மிக்கவள்", gender: "girl", startingLetter: "No" },
  { nameEn: "Novan", nameTa: "நோவன்", meaningEn: "A bright soul", meaningTa: "பிரகாசமான ஆன்மா", gender: "boy", startingLetter: "No" },
  { nameEn: "Yazhini", nameTa: "யாழினி", meaningEn: "Melodious like the Yazh instrument", meaningTa: "யாழ் போன்ற இனிமையானவள்", gender: "girl", startingLetter: "Ya" },
  { nameEn: "Yashwanth", nameTa: "யஸ்வந்த்", meaningEn: "One who has achieved glory", meaningTa: "புகழ் பெற்றவன்", gender: "boy", startingLetter: "Ya" },
  { nameEn: "Yishaan", nameTa: "யிஷான்", meaningEn: "Lord Shiva, Sun", meaningTa: "சிவபெருமான், சூரியன்", gender: "boy", startingLetter: "Yi" },
  { nameEn: "Yita", nameTa: "யிடா", meaningEn: "Intelligent", meaningTa: "அறிவுள்ளவள்", gender: "girl", startingLetter: "Yi" },
  { nameEn: "Yuvan", nameTa: "யுவன்", meaningEn: "Youthful, healthy", meaningTa: "இளமையானவன்", gender: "boy", startingLetter: "Yu" },
  { nameEn: "Yuvashree", nameTa: "யுவஸ்ரீ", meaningEn: "Young and beautiful", meaningTa: "இளமையானவள், அழகானவள்", gender: "girl", startingLetter: "Yu" },

  // 19. Mula: Ye, Yo, Bha, Bhi
  { nameEn: "Yeshwanth", nameTa: "யேஷ்வந்த்", meaningEn: "Glorious, successful", meaningTa: "வெற்றி பெற்றவன்", gender: "boy", startingLetter: "Ye" },
  { nameEn: "Yegnesh", nameTa: "யக்னேஷ்", meaningEn: "Lord of fire", meaningTa: "யாகத்தின் இறைவன்", gender: "boy", startingLetter: "Ye" },
  { nameEn: "Yogesh", nameTa: "யோகேஷ்", meaningEn: "Lord of Yoga", meaningTa: "யோகத்தின் இறைவன், சிவன்", gender: "boy", startingLetter: "Yo" },
  { nameEn: "Yogini", nameTa: "யோகினி", meaningEn: "Female ascetic, mystic", meaningTa: "யோகக் கலைகளில் சிறந்தவள்", gender: "girl", startingLetter: "Yo" },
  { nameEn: "Bharathi", nameTa: "பாரதி", meaningEn: "Goddess Saraswati, learned", meaningTa: "கல்வியின் தெய்வம்", gender: "unisex", startingLetter: "Bha" },
  { nameEn: "Bhavan", nameTa: "பவன்", meaningEn: "Creator, Lord Krishna", meaningTa: "உருவாக்குபவன்", gender: "boy", startingLetter: "Bha" },
  { nameEn: "Bhima", nameTa: "பீமா", meaningEn: "Powerful, strong", meaningTa: "வலிமையானவன்", gender: "boy", startingLetter: "Bhi" },
  { nameEn: "Bhindhu", nameTa: "பிந்து", meaningEn: "Drop of water, point", meaningTa: "நீர் துளி", gender: "girl", startingLetter: "Bhi" },

  // 20. Purva Ashadha: Bhu, Dha, Pha
  { nameEn: "Bhuvanesh", nameTa: "புவனேஷ்", meaningEn: "Lord of the world", meaningTa: "உலகின் இறைவன்", gender: "boy", startingLetter: "Bhu" },
  { nameEn: "Bhumika", nameTa: "பூமிகா", meaningEn: "Earth, base", meaningTa: "பூமி", gender: "girl", startingLetter: "Bhu" },
  { nameEn: "Dhanush", nameTa: "தனுஷ்", meaningEn: "Bow", meaningTa: "வில்", gender: "boy", startingLetter: "Dha" },
  { nameEn: "Dharani", nameTa: "தரணி", meaningEn: "Earth, world", meaningTa: "பூமி, உலகம்", gender: "girl", startingLetter: "Dha" },
  { nameEn: "Phalan", nameTa: "பலன்", meaningEn: "Fruit, result", meaningTa: "பலன், விளைவு", gender: "boy", startingLetter: "Pha" },
  { nameEn: "Phalguni", nameTa: "பல்குனி", meaningEn: "Born in Phalgun month, beautiful", meaningTa: "பங்குனி மாதத்தில் பிறந்தவள்", gender: "girl", startingLetter: "Pha" },
  { nameEn: "Bhuvan", nameTa: "புவன்", meaningEn: "World, universe", meaningTa: "உலகம்", gender: "boy", startingLetter: "Bhu" },
  { nameEn: "Dharshini", nameTa: "தர்ஷினி", meaningEn: "Seeing the divine", meaningTa: "இறைவனை தரிசிப்பவள்", gender: "girl", startingLetter: "Dha" },

  // 21. Uttara Ashadha: Bhe, Bho, Ja, Ji
  { nameEn: "Bhairavi", nameTa: "பைரவி", meaningEn: "Goddess Durga, a melody", meaningTa: "துர்க்கை, ஒரு ராகம்", gender: "girl", startingLetter: "Bhe" },
  { nameEn: "Bheeshma", nameTa: "பீஷ்மா", meaningEn: "Terrible, strong character", meaningTa: "வலிமையானவன், பீஷ்மர்", gender: "boy", startingLetter: "Bhe" },
  { nameEn: "Bhoomi", nameTa: "பூமி", meaningEn: "Earth", meaningTa: "பூமித்தாய்", gender: "girl", startingLetter: "Bho" },
  { nameEn: "Bhoopesh", nameTa: "பூபேஷ்", meaningEn: "King, Lord of Earth", meaningTa: "மன்னன்", gender: "boy", startingLetter: "Bho" },
  { nameEn: "Janani", nameTa: "ஜனனி", meaningEn: "Mother, creator", meaningTa: "தாய், உருவாக்குபவள்", gender: "girl", startingLetter: "Ja" },
  { nameEn: "Jagan", nameTa: "ஜெகன்", meaningEn: "Universe, world", meaningTa: "உலகம்", gender: "boy", startingLetter: "Ja" },
  { nameEn: "Jiva", nameTa: "ஜீவா", meaningEn: "Life, soul", meaningTa: "உயிர், ஆன்மா", gender: "boy", startingLetter: "Ji" },
  { nameEn: "Jithya", nameTa: "ジットயா", meaningEn: "Victorious", meaningTa: "வெற்றி பெறுபவள்", gender: "girl", startingLetter: "Ji" },

  // 22. Shravana: Ju, Je, Jo, Gha
  { nameEn: "Jugal", nameTa: "ஜுகல்", meaningEn: "Couple, pair", meaningTa: "இணை", gender: "boy", startingLetter: "Ju" },
  { nameEn: "Juhi", nameTa: "ஜூஹி", meaningEn: "Jasmine flower", meaningTa: "மல்லிகை மலர்", gender: "girl", startingLetter: "Ju" },
  { nameEn: "Jeevitha", nameTa: "ஜீவிதா", meaningEn: "Life", meaningTa: "வாழ்க்கை", gender: "girl", startingLetter: "Je" },
  { nameEn: "Jeyan", nameTa: "ஜெயன்", meaningEn: "Victorious", meaningTa: "வெற்றி பெறுபவன்", gender: "boy", startingLetter: "Je" },
  { nameEn: "Jyothi", nameTa: "ஜோதி", meaningEn: "Light, flame", meaningTa: "ஒளி", gender: "girl", startingLetter: "Jo" },
  { nameEn: "Joshan", nameTa: "ஜோஷன்", meaningEn: "Pleased, enthusiastic", meaningTa: "மகிழ்ச்சியானவன்", gender: "boy", startingLetter: "Jo" },
  { nameEn: "Ghayanth", nameTa: "கயந்த்", meaningEn: "Strong like an elephant", meaningTa: "யானை போன்ற வலிமையானவன்", gender: "boy", startingLetter: "Gha" },
  { nameEn: "Ghani", nameTa: "கனி", meaningEn: "Fruit, sweet", meaningTa: "இனிமையான பழம்", gender: "unisex", startingLetter: "Gha" },

  // 23. Dhanishta: Ga, Gi, Gu, Ge
  { nameEn: "Ganesh", nameTa: "கணேஷ்", meaningEn: "Lord Ganesha", meaningTa: "விநாயகர்", gender: "boy", startingLetter: "Ga" },
  { nameEn: "Gayathri", nameTa: "காயத்ரி", meaningEn: "Mother of Vedas, Goddess", meaningTa: "வேதங்களின் தாய்", gender: "girl", startingLetter: "Ga" },
  { nameEn: "Giri", nameTa: "கிரி", meaningEn: "Mountain", meaningTa: "மலை", gender: "boy", startingLetter: "Gi" },
  { nameEn: "Girija", nameTa: "கிரிஜா", meaningEn: "Daughter of mountain, Parvati", meaningTa: "மலையின் மகள், பார்வதி", gender: "girl", startingLetter: "Gi" },
  { nameEn: "Guhan", nameTa: "குகன்", meaningEn: "Lord Murugan", meaningTa: "முருகப்பெருமான்", gender: "boy", startingLetter: "Gu" },
  { nameEn: "Gunavathi", nameTa: "குணவதி", meaningEn: "Virtuous, good character", meaningTa: "நற்பண்பு கொண்டவள்", gender: "girl", startingLetter: "Gu" },
  { nameEn: "Geetha", nameTa: "கீதா", meaningEn: "Holy book, song", meaningTa: "புனித நூல், பாடல்", gender: "girl", startingLetter: "Ge" },
  { nameEn: "Gethin", nameTa: "கெதின்", meaningEn: "Dark, mysterious", meaningTa: "ஆழமானவன்", gender: "boy", startingLetter: "Ge" },

  // 24. Shatabhisha: Go, Sa, Si, Su
  { nameEn: "Gokul", nameTa: "கோகுல்", meaningEn: "Village of Lord Krishna", meaningTa: "கிருஷ்ணர் வாழ்ந்த இடம்", gender: "boy", startingLetter: "Go" },
  { nameEn: "Gomathi", nameTa: "கோமதி", meaningEn: "A river, name of a Goddess", meaningTa: "கோமதி நதி, அம்மன்", gender: "girl", startingLetter: "Go" },
  { nameEn: "Sanjay", nameTa: "சஞ்சய்", meaningEn: "Victorious, triumphant", meaningTa: "வெற்றி பெற்றவன்", gender: "boy", startingLetter: "Sa" },
  { nameEn: "Sandhya", nameTa: "சந்தியா", meaningEn: "Evening, twilight", meaningTa: "மாலை நேரம்", gender: "girl", startingLetter: "Sa" },
  { nameEn: "Sibi", nameTa: "சிபி", meaningEn: "A righteous king", meaningTa: "நீதிமான் அரசன்", gender: "boy", startingLetter: "Si" },
  { nameEn: "Sita", nameTa: "சீதா", meaningEn: "Wife of Lord Rama", meaningTa: "ராமரின் மனைவி", gender: "girl", startingLetter: "Si" },
  { nameEn: "Surya", nameTa: "சூர்யா", meaningEn: "The Sun", meaningTa: "சூரியன்", gender: "boy", startingLetter: "Su" },
  { nameEn: "Subashini", nameTa: "சுபாஷினி", meaningEn: "Soft-spoken", meaningTa: "இனிமையாக பேசுபவள்", gender: "girl", startingLetter: "Su" },

  // 25. Purva Bhadrapada: Se, So, Da, Di
  { nameEn: "Selvan", nameTa: "செல்வன்", meaningEn: "Wealthy boy, prosperous", meaningTa: "செல்வம் மிக்கவன்", gender: "boy", startingLetter: "Se" },
  { nameEn: "Senthamizh", nameTa: "செந்தமிழ்", meaningEn: "Pure Tamil", meaningTa: "தூய தமிழ்", gender: "unisex", startingLetter: "Se" },
  { nameEn: "Somasundaram", nameTa: "சோமசுந்தரம்", meaningEn: "Lord Shiva", meaningTa: "சிவபெருமான்", gender: "boy", startingLetter: "So" },
  { nameEn: "Sowmya", nameTa: "சௌம்யா", meaningEn: "Mild, gentle", meaningTa: "மென்மையானவள்", gender: "girl", startingLetter: "So" },
  { nameEn: "Daksha", nameTa: "தக்ஷா", meaningEn: "The earth, Sati", meaningTa: "பூமி, தக்ஷனின் மகள்", gender: "girl", startingLetter: "Da" },
  { nameEn: "Dayalan", nameTa: "தயாளன்", meaningEn: "Compassionate", meaningTa: "கருணையானவன்", gender: "boy", startingLetter: "Da" },
  { nameEn: "Dhilip", nameTa: "திலீப்", meaningEn: "Protector, King", meaningTa: "பாதுகாவலன்", gender: "boy", startingLetter: "Di" },
  { nameEn: "Divyabharathi", nameTa: "திவ்யபாரதி", meaningEn: "Divine Goddess Saraswati", meaningTa: "தெய்வீகமான சரஸ்வதி", gender: "girl", startingLetter: "Di" },

  // 26. Highlight: Du, Tha, Jha, Na
  { nameEn: "Durgesh", nameTa: "துர்கேஷ்", meaningEn: "Lord of forts, protector", meaningTa: "கோட்டைகளின் இறைவன்", gender: "boy", startingLetter: "Du" },
  { nameEn: "Dushyanth", nameTa: "துஷ்யந்த்", meaningEn: "Destroyer of evil", meaningTa: "தீமையை அழிப்பவன்", gender: "boy", startingLetter: "Du" },
  { nameEn: "Tharani", nameTa: "தரணி", meaningEn: "Earth", meaningTa: "பூமி", gender: "girl", startingLetter: "Tha" },
  { nameEn: "Thangavel", nameTa: "தங்கவேல்", meaningEn: "Golden spear, Lord Murugan", meaningTa: "தங்க வேல், முருகன்", gender: "boy", startingLetter: "Tha" },
  { nameEn: "Jhansi", nameTa: "ஜான்சி", meaningEn: "Life-like, rising sun", meaningTa: "உயிர் போன்றவள், துணிச்சலானவள்", gender: "girl", startingLetter: "Jha" },
  { nameEn: "Jhalak", nameTa: "ஜலக்", meaningEn: "Glimpse, spark", meaningTa: "வெளிச்சம், பார்வை", gender: "girl", startingLetter: "Jha" },
  { nameEn: "Navaneeth", nameTa: "நவநீத்", meaningEn: "Fresh butter, Lord Krishna", meaningTa: "புதிய வெண்ணெய், கிருஷ்ணன்", gender: "boy", startingLetter: "Na" },
  { nameEn: "Nanditha", nameTa: "நந்திதா", meaningEn: "Happy, joyous", meaningTa: "மகிழ்ச்சியானவள்", gender: "girl", startingLetter: "Na" },

  // 27. Revati: De, Do, Cha, Chi
  { nameEn: "Deva", nameTa: "தேவா", meaningEn: "Divine, Lord", meaningTa: "தெய்வீகமானவன்", gender: "boy", startingLetter: "De" },
  { nameEn: "Devasena", nameTa: "தேவசேனா", meaningEn: "Consort of Lord Murugan", meaningTa: "முருகனின் மனைவி", gender: "girl", startingLetter: "De" },
  { nameEn: "Dolan", nameTa: "டோலன்", meaningEn: "Swing", meaningTa: "ஊஞ்சல்", gender: "boy", startingLetter: "Do" },
  { nameEn: "Doraisamy", nameTa: "துரைசாமி", meaningEn: "Lord, Chief", meaningTa: "தலைவன், சாமி", gender: "boy", startingLetter: "Do" },
  { nameEn: "Chandran", nameTa: "சந்திரன்", meaningEn: "Moon", meaningTa: "நிலவு", gender: "boy", startingLetter: "Cha" },
  { nameEn: "Charu", nameTa: "சாரு", meaningEn: "Beautiful, attractive", meaningTa: "அழகானவள்", gender: "girl", startingLetter: "Cha" },
  { nameEn: "Chidambaram", nameTa: "சிதம்பரம்", meaningEn: "Sky of consciousness, Shiva's abode", meaningTa: "ஞான ஆகாயம்", gender: "boy", startingLetter: "Chi" },
  { nameEn: "Chitra", nameTa: "சித்ரா", meaningEn: "Picture, a star", meaningTa: "சித்திரம், நட்சத்திரம்", gender: "girl", startingLetter: "Chi" }
];
