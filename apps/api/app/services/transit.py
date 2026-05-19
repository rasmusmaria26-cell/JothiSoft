"""
transit.py
Vedic Astrological Transit (Gocharam) Engine for JothiSoft.
Computes current planetary transits relative to the natal Moon sign.
"""
from datetime import datetime
from .ephemeris import get_julian_day, get_planet_positions, ZODIAC_SIGNS

# Transits Dictionary
TRANSIT_RULES = {
    "Saturn": {
        1: {
            "en": "Janma Shani (1st House): Can bring heavy workloads, mental pressure, and health fatigue. Keep expectations low and practice patience.",
            "ta": "ஜென்ம சனி (1-ம் இடம்): அதிக பணிச்சுமை, மன அழுத்தம் மற்றும் உடல் சோர்வைத் தரலாம். பொறுமையைக் கடைப்பிடிப்பது நல்லது."
        },
        2: {
            "en": "Kudumba Shani (2nd House): Eye checkups and cautious speech are needed. Financial delays are possible. Avoid arguments with family.",
            "ta": "குடும்ப சனி (2-ம் இடம்): பேச்சில் கவனம் தேவை. வரவு செலவுகளில் தாமதங்கள் ஏற்படலாம். குடும்பத்தினருடன் வாக்குவாதங்களைத் தவிர்க்கவும்."
        },
        3: {
            "en": "Saturn in 3rd House: Highly auspicious! Yields excellent growth, courage, victory over hurdles, and new career opportunities.",
            "ta": "சனி 3-ம் இடம்: மிகுந்த நற்பலன்கள்! அதீத தைரியம், தடைகளைத் தாண்டி வெற்றி, மற்றும் புதிய தொழில் வாய்ப்புகளைத் தரும்."
        },
        4: {
            "en": "Ardhastama Shani (4th House): Pay attention to domestic comfort, mother's health, and vehicle upkeep. Avoid property disputes.",
            "ta": "அர்த்தாஷ்டம சனி (4-ம் இடம்): தாயாரின் உடல்நிலை, வாகனப் பராமரிப்பு ஆகியவற்றில் கவனம் தேவை. சொத்து விவகாரங்களில் அவசரப்பட வேண்டாம்."
        },
        5: {
            "en": "Saturn in 5th House: Restlessness regarding children's growth or romantic ventures is common. Focus on spiritual remedies.",
            "ta": "சனி 5-ம் இடம்: குழந்தைகள் பற்றிய கவலைகள் அல்லது காதல் விவகாரங்களில் சலனங்கள் வரலாம். ஆன்மீக ஈடுபாடு நல்லது."
        },
        6: {
            "en": "Saturn in 6th House: Outstanding transit! Conquers enemies, clears old debts, improves health, and brings grand success in work.",
            "ta": "சனி 6-ம் இடம்: மிகச் சிறந்த கோச்சாரம்! எதிரிகளை வெல்லுதல், கடன்கள் தீருதல், உடல்நல முன்னேற்றம் மற்றும் வேலையில் பெரிய வெற்றி."
        },
        7: {
            "en": "Saturn in 7th House: Can create minor friction with business partners or spouse. Avoid taking joint-liability loans.",
            "ta": "சனி 7-ம் இடம்: கணவன்-மனைவி அல்லது கூட்டுத் தொழில் கூட்டாளிகளிடம் சிறிய கருத்து வேறுபாடுகள் வரலாம். கூட்டுப் பொறுப்புக் கடன்களைத் தவிர்க்கவும்."
        },
        8: {
            "en": "Ashtama Shani (8th House): High caution needed in health, travel, and financial transfers. Avoid speculation.",
            "ta": "அஷ்டம சனி (8-ம் இடம்): உடல்நலம், பயணம் மற்றும் பணப் பரிமாற்றங்களில் மிகுந்த எச்சரிக்கை தேவை. ஊக வணிகத்தைத் தவிர்க்கவும்."
        },
        9: {
            "en": "Saturn in 9th House: Minor delays in fortune or travel. You will seek higher spiritual wisdom and support elder relatives.",
            "ta": "சனி 9-ம் இடம்: அதிர்ஷ்டத்தில் அல்லது பயணங்களில் சிறிய தாமதங்கள். ஆன்மீக ஞானம் தேடுதல் மற்றும் பெரியவர்களின் ஆதரவு கிட்டும்."
        },
        10: {
            "en": "Saturn in 10th House: Demands dedication to career. Possible job transfers or increased workplace responsibilities.",
            "ta": "சனி 10-ம் இடம்: தொழில் துறையில் அர்ப்பணிப்பு தேவை. வேலை மாற்றம் அல்லது பணியிடத்தில் கூடுதல் பொறுப்புகள் வரலாம்."
        },
        11: {
            "en": "Saturn in 11th House: Highly beneficial! Fulfills desires, creates continuous streams of cash, and brings elder sibling support.",
            "ta": "சனி 11-ம் இடம்: மிக அற்புதமான காலம்! விருப்பங்கள் நிறைவேறுதல், தொடர் பண வரவு மற்றும் மூத்த சகோதரர்களின் ஆதரவு கிடைக்கும்."
        },
        12: {
            "en": "Viraya Shani (12th House): First phase of Ezharai Sani. Expenses on travel, medical needs, or charity rise. Plan financial budgets carefully.",
            "ta": "விரய சனி (12-ம் இடம்): ஏழரை சனியின் ஆரம்பக் கட்டம். பயணம், மருத்துவம் அல்லது தான தர்மங்களுக்கான செலவுகள் அதிகரிக்கும். பட்ஜெட் போட்டுச் செயல்படவும்."
        }
    },
    "Jupiter": {
        1: {
            "en": "Jupiter in 1st House: Enhances self-esteem and wisdom. Minor physical weight gain or fatigue. High clarity in decision making.",
            "ta": "குரு 1-ம் இடம்: சுயமரியாதை மற்றும் ஞானம் பெருகும். உடல் எடையில் சிறிய அதிகரிப்பு அல்லது சோர்வு. முடிவெடுப்பதில் தெளிவு பிறக்கும்."
        },
        2: {
            "en": "Jupiter in 2nd House: Excellent cash inflow, sweet speech, family celebrations, and success in gold/property investments.",
            "ta": "குரு 2-ம் இடம்: சிறப்பான பண வரவு, இனிமையான பேச்சு, குடும்பத்தில் சுப காரியங்கள், மற்றும் தங்கம்/சொத்து முதலீடுகளில் வெற்றி."
        },
        3: {
            "en": "Jupiter in 3rd House: Prompts active travels, writing, and minor shifts in work. Requires hard work to yield gains.",
            "ta": "குரு 3-ம் இடம்: அடிக்கடி பயணங்கள், எழுத்துப் பணிகள் மற்றும் வேலை மாற்றங்களைத் தூண்டும். பலன்களைப் பெற கடின உழைப்பு தேவை."
        },
        4: {
            "en": "Jupiter in 4th House: Brings domestic happiness, home renovations, purchase of vehicle, and peace of mind.",
            "ta": "குரு 4-ம் இடம்: குடும்பத்தில் மகிழ்ச்சி, வீடு புதுப்பித்தல், வாகனச் சேர்க்கை மற்றும் மன அமைதியைத் தரும்."
        },
        5: {
            "en": "Jupiter in 5th House: Highly auspicious! Favorable for child birth, success in creative education, romance, and good fortune.",
            "ta": "குரு 5-ம் இடம்: மிக உன்னதமான காலம்! புத்திர பாக்கியம், கல்வி மற்றும் கலைத்துறைகளில் வெற்றி, காதல் மற்றும் அதிர்ஷ்டம் கூடும்."
        },
        6: {
            "en": "Jupiter in 6th House: Prompts checking on digestive health. You will conquer opponents and solve litigation problems.",
            "ta": "குரு 6-ம் இடம்: செரிமான ஆரோக்கியத்தில் கவனம் தேவை. எதிரிகளை வெல்லுதல் மற்றும் வழக்கு விவகாரங்களில் தீர்வு கிடைக்கும்."
        },
        7: {
            "en": "Jupiter in 7th House: Exceptional transit! Harmonious marriage, marriage fixes, new business partnerships, and strong public appreciation.",
            "ta": "குரு 7-ம் இடம்: மிக அற்புதமான கோச்சாரம்! திருமண யோகம், கூட்டுத் தொழில் தொடங்குதல் மற்றும் பொதுமக்களின் பெரும் பாராட்டு கிட்டும்."
        },
        8: {
            "en": "Jupiter in 8th House: Excellent for occult research or getting ancestral inheritance. Practice moderation in cash handling.",
            "ta": "குரு 8-ம் இடம்: ஆன்மீகம், ஆராய்ச்சி அல்லது பூர்வீக சொத்துக்கள் பெறுவதற்கு ஏற்றது. பணக் கொடுக்கல் வாங்கலில் கவனம் தேவை."
        },
        9: {
            "en": "Jupiter in 9th House: Divine blessing! Strong spiritual travels, support from mentors/father, and overall supreme luck.",
            "ta": "குரு 9-ம் இடம்: தெய்வீக அருள்! புண்ணிய ஸ்தல யாத்திரைகள், தந்தை/குருவின் முழு ஆதரவு மற்றும் ஒட்டுமொத்த நல்வாழ்வு."
        },
        10: {
            "en": "Jupiter in 10th House: Brings career changes, job promotions, and enhanced professional status. Do not overlook details at work.",
            "ta": "குரு 10-ம் இடம்: தொழில் மாற்றம், பதவியுயர்வு மற்றும் சமூக அந்தஸ்தை உயர்த்தும். பணியில் சிறு விவரங்களையும் கவனிக்கத் தவறாதீர்கள்."
        },
        11: {
            "en": "Jupiter in 11th House: Highly beneficial! Multi-source cash gains, wish fulfillments, and long-term friendships flourish.",
            "ta": "குரு 11-ம் இடம்: பெரும் லாபம் தரும் காலம்! பல வழிகளில் பண வரவு, ஆசைகள் நிறைவேறுதல் மற்றும் நட்பு வட்டாரம் விரிவடையும்."
        },
        12: {
            "en": "Jupiter in 12th House: Prompts expenses on spiritual activities, pilgrimage travels, and family weddings.",
            "ta": "குரு 12-ம் இடம்: ஆன்மீகச் செயல்பாடுகள், புண்ணிய யாத்திரை மற்றும் குடும்பத் திருமணச் சுப காரியங்களுக்கான சுப செலவுகள் அதிகரிக்கும்."
        }
    },
    "Rahu": {
        1: { "en": "Rahu in 1st House: Focus on mental peace and original thinking. Avoid impulsive actions.", "ta": "ராகு 1-ம் இடம்: மன அமைதி மற்றும் சுய சிந்தனையில் கவனம் செலுத்தவும். அவசர முடிவுகளைத் தவிர்க்கவும்." },
        2: { "en": "Rahu in 2nd House: Avoid harsh words and check cash outlays. Invest wisely.", "ta": "ராகு 2-ம் இடம்: கடுமையான வார்த்தைகளைத் தவிர்க்கவும், பணச் செலவுகளைக் கட்டுப்படுத்தவும். கவனமாக முதலீடு செய்யவும்." },
        3: { "en": "Rahu in 3rd House: Extremely good! Boosts courage, professional power, and brings success in media/sales.", "ta": "ராகு 3-ம் இடம்: மிகச் சிறப்பு! தைரியம், தொழில் வளம் மற்றும் ஊடகம்/விற்பனைத் துறையில் வெற்றி தரும்." },
        4: { "en": "Rahu in 4th House: Focus on domestic peace and maternal health. Do vehicle checks.", "ta": "ராகு 4-ம் இடம்: குடும்ப அமைதி மற்றும் தாயின் உடல்நலனில் கவனம் தேவை. வாகனங்களைச் சோதிக்கவும்." },
        5: { "en": "Rahu in 5th House: Prompts creative interests. Children's growth needs care.", "ta": "ராகு 5-ம் இடம்: படைப்பாற்றல் கூடும். பிள்ளைகளின் வளர்ச்சியில் கூடுதல் கவனம் தேவை." },
        6: { "en": "Rahu in 6th House: Magnificent! Overcomes competitors, heals long-standing illness, and clears debt.", "ta": "ராகு 6-ம் இடம்: மிக அற்புதம்! எதிரிகளை வெல்லுதல், நீண்ட காலப் பிணி தீருதல் மற்றும் கடன்களை அடைக்க உதவும்." },
        7: { "en": "Rahu in 7th House: Spouse relations need clear dialogue. Guard against partner misalignments.", "ta": "ராகு 7-ம் இடம்: வாழ்க்கைத் துணையுடன் தெளிவான உரையாடல் தேவை. கருத்து வேறுபாடுகள் வராமல் காக்கவும்." },
        8: { "en": "Rahu in 8th House: Keep business dealings clean. Avoid mysterious money schemes.", "ta": "ராகு 8-ம் இடம்: வணிக விவகாரங்களை நேர்மையாக வைத்திருக்கவும். மர்மமான பணத் திட்டங்களைத் தவிர்க்கவும்." },
        9: { "en": "Rahu in 9th House: Minor difference of opinion with elders. High interest in esoteric philosophy.", "ta": "ராகு 9-ம் இடம்: பெரியவர்களுடன் சிறிய கருத்து வேறுபாடுகள். ஆன்மீக மற்றும் தத்துவ தேடல் அதிகரிக்கும்." },
        10: { "en": "Rahu in 10th House: Excellent career status, name, fame, and dominance in business.", "ta": "ராகு 10-ம் இடம்: மிகச் சிறந்த தொழில் மேன்மை, புகழ் மற்றும் வணிகத்தில் தனி ஆதிக்கம் செலுத்தும் காலம்." },
        11: { "en": "Rahu in 11th House: Multiplies gains, cash flows, and introduces foreign partners.", "ta": "ராகு 11-ம் இடம்: லாபங்கள் மற்றும் பண வரவை இரட்டிப்பாக்கும். வெளிநாட்டுத் தொடர்புகள் மூலம் பலன் கிட்டும்." },
        12: { "en": "Rahu in 12th House: Foreign travel, spiritual interest, but control excessive night insomnia.", "ta": "ராகு 12-ம் இடம்: வெளிநாட்டுப் பயணம், ஆன்மீக ஈடுபாடு கூடும். இரவு தூக்கமின்மையைக் கட்டுப்படுத்தவும்." }
    }
}

# Ketu transits are opposite of Rahu (offset by 6 houses)
KETU_TRANSIT_RULES = {
    1: { "en": "Ketu in 1st House: Deep introspection and spiritual maturity. Avoid isolation.", "ta": "கேது 1-ம் இடம்: ஆழ்ந்த தியானம் மற்றும் ஆன்மீக முதிர்ச்சி. தனிமையைத் தவிர்க்கவும்." },
    2: { "en": "Ketu in 2nd House: Maintain moderate food habits. Guard family valuables.", "ta": "கேது 2-ம் இடம்: சீரான உணவுப் பழக்கம் தேவை. குடும்பத்தின் விலையுயர்ந்த பொருட்களைப் பாதுகாக்கவும்." },
    3: { "en": "Ketu in 3rd House: Good! Yields inner mental resolve and victory in intellectual arguments.", "ta": "கேது 3-ம் இடம்: நற்பலன்! மன உறுதி மற்றும் அறிவுசார் விவாதங்களில் வெற்றி கிட்டும்." },
    4: { "en": "Ketu in 4th House: Home peace demands patience. Do yoga or meditation.", "ta": "கேது 4-ம் இடம்: இல்லத்தில் அமைதி நிலவ பொறுமை தேவை. யோகா அல்லது தியானம் செய்யவும்." },
    5: { "en": "Ketu in 5th House: Prompts intuition and interest in religious hymns.", "ta": "கேது 5-ம் இடம்: உள்ளுணர்வு மற்றும் ஆன்மீகப் பாடல்களில் ஈடுபாடு அதிகரிக்கும்." },
    6: { "en": "Ketu in 6th House: Auspicious! Free from health fears and old competitors.", "ta": "கேது 6-ம் இடம்: சுப பலன்! உடல்நலக் கவலைகள் மற்றும் பழைய எதிரிகளிடம் இருந்து விடுதலை." },
    7: { "en": "Ketu in 7th House: Spiritual focus in relationships. Keep transparent dialog with spouse.", "ta": "கேது 7-ம் இடம்: உறவுகளில் ஆன்மீகப் போக்கு. துணையுடன் வெளிப்படையான பேச்சுவார்த்தை நல்லது." },
    8: { "en": "Ketu in 8th House: Heightened intuitive power. Keep general safety in travel.", "ta": "கேது 8-ம் இடம்: உள்ளுணர்வுத் திறன் அதிகரிக்கும். பயணங்களின் போது பொதுவான பாதுகாப்பு தேவை." },
    9: { "en": "Ketu in 9th House: High devotion and philosophical mind. Support from paternal relatives.", "ta": "கேது 9-ம் இடம்: மிகுந்த பக்தி மற்றும் தத்துவ சிந்தனை. தந்தைவழி உறவுகளின் ஆதரவு." },
    10: { "en": "Ketu in 10th House: Detachment from career vanity, but continuous execution of duty.", "ta": "கேது 10-ம் இடம்: ஆடம்பரமான தொழில் எண்ணங்களில் இருந்து விடுபடுதல், ஆனால் கடமைகளைச் செவ்வனே செய்தல்." },
    11: { "en": "Ketu in 11th House: Good spiritual gains and wishes met in unexpected spiritual ways.", "ta": "கேது 11-ம் இடம்: நல்ல ஆன்மீக லாபங்கள் மற்றும் எதிர்பாராத வழிகளில் ஆசைகள் நிறைவேறுதல்." },
    12: { "en": "Ketu in 12th House: Supreme transit for Moksha. Exceptional dreams and peaceful sleep.", "ta": "கேது 12-ம் இடம்: மோட்ச சாதனைகளுக்கு உகந்த காலம். சிறந்த ஆன்மீகக் கனவுகள் மற்றும் அமைதியான உறக்கம்." }
}

def calculate_transit(natal_moon_sign: str) -> dict:
    """
    Computes transits relative to the natal Moon sign.
    The current date is used for transit calculations.
    """
    if natal_moon_sign not in ZODIAC_SIGNS:
        # Default fallback
        natal_moon_sign = "Mesha"
        
    natal_idx = ZODIAC_SIGNS.index(natal_moon_sign)
    
    # Calculate current planet positions
    now = datetime.now()
    jd_now = get_julian_day(now.year, now.month, now.day, now.hour, now.minute, 5.5)
    transit_positions = get_planet_positions(jd_now)
    
    planets_to_calc = ["Saturn", "Jupiter", "Rahu", "Ketu"]
    results = {}
    
    for planet in planets_to_calc:
        pos = transit_positions.get(planet)
        if not pos:
            continue
            
        sign = pos["sign"]
        sign_degree = pos["sign_degree"]
        transit_idx = ZODIAC_SIGNS.index(sign)
        
        # Calculate house relative to natal Moon
        house = ((transit_idx - natal_idx) % 12) + 1
        
        # Get interpretations
        if planet == "Ketu":
            rule = KETU_TRANSIT_RULES.get(house, {"en": "", "ta": ""})
        else:
            rule = TRANSIT_RULES.get(planet, {}).get(house, {"en": "", "ta": ""})
            
        results[planet] = {
            "sign": sign,
            "sign_degree": round(sign_degree, 2),
            "house": house,
            "interpretation_en": rule["en"],
            "interpretation_ta": rule["ta"]
        }
        
    # Specialty calculations:
    saturn_house = results["Saturn"]["house"]
    
    # Ezharai Sani (7.5 Saturn) is active if Saturn is in 12th, 1st, or 2nd house from Moon
    ezharai_active = saturn_house in [12, 1, 2]
    ezharai_phase = "Inactive"
    ezharai_phase_ta = "நடைபெறவில்லை"
    ezharai_desc = "Saturn is currently in a highly supportive house. You are free from the 7.5 Saturn period."
    ezharai_desc_ta = "தற்போது சனி உங்களுக்கு சாதகமான வீடுகளில் சஞ்சரிக்கிறார். ஏழரை சனி தாக்கம் இல்லை."
    
    if saturn_house == 12:
        ezharai_phase = "Phase 1: Viraya Shani (Starting)"
        ezharai_phase_ta = "முதல் கட்டம்: விரய சனி"
        ezharai_desc = "Expenses on travel, luxury, or medical needs will rise. Practice budget discipline."
        ezharai_desc_ta = "சுப விரயங்கள், பயணச் செலவுகள் அதிகரிக்கக்கூடும். திட்டமிட்டுச் செயல்படுவது நலம் தரும்."
    elif saturn_house == 1:
        ezharai_phase = "Phase 2: Janma Shani (Peak)"
        ezharai_phase_ta = "இரண்டாம் கட்டம்: ஜென்ம சனி"
        ezharai_desc = "Mental pressure and high career load might feel exhausting. Focus on physical health."
        ezharai_desc_ta = "மன அழுத்தம், கூடுதல் பொறுப்புகள் மற்றும் உடல் சோர்வு வரலாம். ஆரோக்கியத்தில் கவனம் வையுங்கள்."
    elif saturn_house == 2:
        ezharai_phase = "Phase 3: Kudumba/Paadha Shani (Ending)"
        ezharai_phase_ta = "மூன்றாம் கட்டம்: குடும்ப/பாத சனி"
        ezharai_desc = "Speech precautions and patience in family discussions are required. Financial flow stabilizes."
        ezharai_desc_ta = "பேச்சில் நிதானம் தேவை. குடும்பத்தினருடன் அனுசரித்துச் செல்லவும். வரவுகள் படிப்படியாக சீராகும்."

    ashtama_active = saturn_house == 8
    ardhastama_active = saturn_house == 4
    
    # Guru Transit (Jupiter)
    guru_house = results["Jupiter"]["house"]
    guru_auspicious = guru_house in [2, 5, 7, 9, 11]
    
    return {
        "natal_moon_sign": natal_moon_sign,
        "transit_date": now.strftime("%Y-%m-%d"),
        "transits": results,
        "special_transits": {
            "ezharai_sani": {
                "active": ezharai_active,
                "phase": ezharai_phase,
                "phase_ta": ezharai_phase_ta,
                "desc": ezharai_desc,
                "desc_ta": ezharai_desc_ta
            },
            "ashtama_sani": {
                "active": ashtama_active,
                "desc": "Saturn is in your 8th house. Avoid high speculation and be cautious with travels.",
                "desc_ta": "அஷ்டம சனி நடைபெறுகிறது. முதலீடுகள், பயணங்களில் கூடுதல் எச்சரிக்கையும் விழிப்புணர்வும் தேவை."
            },
            "ardhastama_sani": {
                "active": ardhastama_active,
                "desc": "Saturn is in your 4th house. Focus on home peace and vehicles safety.",
                "desc_ta": "அர்த்தாஷ்டம சனி நடைபெறுகிறது. தாயாரின் உடல்நலம் மற்றும் இல்லப் பராமரிப்பில் அக்கறை காட்டவும்."
            },
            "guru_transit": {
                "house": guru_house,
                "auspicious": guru_auspicious,
                "desc": "Jupiter is in your 5th / 9th / 11th axis of supreme benefits!" if guru_auspicious else "Jupiter demands structured hard work to manifest best success.",
                "desc_ta": "குரு உங்களுக்கு உன்னதமான சுப பலன்களை அள்ளித் தரும் வீடுகளில் சஞ்சரிக்கிறார்!" if guru_auspicious else "குரு பகவான் நற்பலன்களை வழங்க உங்கள் தொடர் உழைப்பையும் முயற்சியையும் எதிர்பார்க்கிறார்."
            }
        }
    }
