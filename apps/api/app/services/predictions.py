"""
predictions.py
Astrological predictions mapping based on Lagna, Moon Sign (Rasi), and Nakshatra.
"""

LAGNA_PREDICTIONS = {
    "Mesha": {
        "en": "You are energetic, courageous, and independent. As a natural leader, you like to take charge and are often pioneering in your efforts.",
        "ta": "நீங்கள் ஆற்றல் மிக்கவர், தைரியமானவர் மற்றும் சுதந்திரமானவர். ஒரு சிறந்த தலைவராக, நீங்கள் முன்னின்று செயல்பட விரும்புவீர்கள்."
    },
    "Vrishabha": {
        "en": "You are reliable, patient, and practical. You value stability, comfort, and have a strong appreciation for beauty and the arts.",
        "ta": "நீங்கள் நம்பகமானவர், பொறுமையானவர் மற்றும் நடைமுறைவாதி. கலை மற்றும் அழகியல் மீது தனி ஆர்வம் கொண்டவர்."
    },
    "Mithuna": {
        "en": "You are adaptable, communicative, and intellectually curious. You enjoy socializing and quickly grasp new concepts.",
        "ta": "நீங்கள் பல்துறை அறிஞர், சிறந்த பேச்சாளர் மற்றும் கூர்மையான புத்திசாலி. புதிய விஷயங்களை எளிதில் கற்றுக்கொள்ளும் திறன் கொண்டவர்."
    },
    "Kataka": {
        "en": "You are deeply emotional, nurturing, and highly intuitive. Family and a sense of home are of utmost importance to you.",
        "ta": "நீங்கள் உணர்ச்சிவசப்படக் கூடியவர், பாசமானவர் மற்றும் உயர்ந்த உள்ளுணர்வு கொண்டவர். குடும்பத்திற்கு அதிக முக்கியத்துவம் அளிப்பவர்."
    },
    "Simha": {
        "en": "You are charismatic, confident, and generous. You have a regal presence and naturally attract attention and leadership roles.",
        "ta": "நீங்கள் தன்னம்பிக்கை மிக்கவர், கம்பீரமானவர் மற்றும் தாராள குணம் கொண்டவர். இயற்கையாகவே பிறரை ஈர்க்கும் தலைமைப் பண்பு கொண்டவர்."
    },
    "Kanya": {
        "en": "You are analytical, detail-oriented, and practical. You have a strong desire to serve others and strive for perfection.",
        "ta": "நீங்கள் பகுப்பாய்வு திறன் கொண்டவர், துல்லியமானவர் மற்றும் நடைமுறைவாதி. மற்றவர்களுக்கு சேவை செய்வதில் விருப்பம் கொண்டவர்."
    },
    "Thula": {
        "en": "You are diplomatic, charming, and value harmony. You have a strong sense of justice and excel in building relationships.",
        "ta": "நீங்கள் இணக்கமானவர், வசீகரமானவர் மற்றும் சமாதானத்தை விரும்புபவர். நியாய உணர்வு அதிகம் கொண்டவர்."
    },
    "Vrischika": {
        "en": "You are passionate, resourceful, and deeply determined. You possess intense emotional depth and excellent investigative skills.",
        "ta": "நீங்கள் உணர்ச்சிமிக்கவர், உறுதியானவர் மற்றும் ஆழ்ந்த சிந்தனை கொண்டவர். எதையும் ஆழமாக ஆராயும் குணம் கொண்டவர்."
    },
    "Dhanus": {
        "en": "You are optimistic, adventurous, and philosophical. You have a deep love for freedom, travel, and higher learning.",
        "ta": "நீங்கள் நம்பிக்கையானவர், சாகசங்களை விரும்புபவர் மற்றும் தத்துவ சிந்தனை கொண்டவர். சுதந்திரத்தையும், பயணங்களையும் அதிகம் விரும்புபவர்."
    },
    "Makara": {
        "en": "You are disciplined, ambitious, and highly responsible. You have a structured approach to life and work steadily towards your goals.",
        "ta": "நீங்கள் ஒழுக்கமானவர், லட்சியம் கொண்டவர் மற்றும் பொறுப்பானவர். உங்கள் இலக்குகளை நோக்கி விடாமுயற்சியுடன் செயல்படுவீர்கள்."
    },
    "Kumbha": {
        "en": "You are innovative, humanitarian, and fiercely independent. You often think outside the box and are drawn to progressive ideals.",
        "ta": "நீங்கள் புதுமையானவர், மனிதாபிமானம் கொண்டவர் மற்றும் சுதந்திர சிந்தனையாளர். எப்போதும் வித்தியாசமாக சிந்திப்பவர்."
    },
    "Meena": {
        "en": "You are compassionate, artistic, and highly spiritual. You are empathetic to others' feelings and have a vivid imagination.",
        "ta": "நீங்கள் இரக்கமுள்ளவர், கலை ஆர்வம் கொண்டவர் மற்றும் ஆன்மீக நாட்டம் கொண்டவர். மற்றவர்களின் உணர்வுகளை எளிதில் புரிந்துகொள்ளும் குணம் கொண்டவர்."
    }
}

RASI_PREDICTIONS = {
    "Mesha": {
        "en": "Your emotional nature is quick, fiery, and direct. You process feelings rapidly and prefer taking action over dwelling on the past.",
        "ta": "உங்கள் மனநிலை வேகமானது மற்றும் நேரடியானது. உணர்வுகளை விரைவாக வெளிப்படுத்துவீர்கள், கடந்த காலத்தை விட நிகழ்காலத்தில் வாழ விரும்புவீர்கள்."
    },
    "Vrishabha": {
        "en": "Your emotions are steady and enduring. You seek emotional security and find peace in routine and material comforts.",
        "ta": "உங்கள் உணர்வுகள் நிலையானவை. வாழ்வில் பாதுகாப்பையும், அமைதியையும் அதிகம் விரும்புவீர்கள்."
    },
    "Mithuna": {
        "en": "You intellectualize your emotions. You need variety and mental stimulation to feel emotionally satisfied.",
        "ta": "நீங்கள் உணர்வுகளை விட அறிவுக்கு முக்கியத்துவம் அளிப்பவர். மனநிறைவிற்கு புதுமையான சிந்தனைகள் அவசியம்."
    },
    "Kataka": {
        "en": "Your emotions run very deep, and you are highly sensitive to the moods of others. You are fiercely protective of your loved ones.",
        "ta": "நீங்கள் உணர்திறன் மிக்கவர் மற்றும் மற்றவர்களின் மனநிலையை எளிதில் புரிந்துகொள்வீர்கள். அன்புக்குரியவர்களை பாதுகாப்பதில் தீவிரமாக இருப்பீர்கள்."
    },
    "Simha": {
        "en": "You express your feelings warmly and dramatically. You need appreciation and respect to feel emotionally secure.",
        "ta": "நீங்கள் அன்பை வெளிப்படையாகவும், பெருமையாகவும் வெளிப்படுத்துவீர்கள். மற்றவர்களின் மரியாதையும் அங்கீகாரமும் உங்களுக்கு முக்கியம்."
    },
    "Kanya": {
        "en": "You process emotions logically. You feel most secure when everything is organized and you can be of practical help.",
        "ta": "நீங்கள் உணர்வுகளை தர்க்கரீதியாக அணுகுவீர்கள். எல்லாம் திட்டமிட்டபடி நடக்கும் போது மன அமைதி பெறுவீர்கள்."
    },
    "Thula": {
        "en": "You seek balance and emotional peace. Conflict deeply unsettles you, and you strive to maintain harmonious relationships.",
        "ta": "நீங்கள் மன அமைதியையும், சமநிலையையும் விரும்புவீர்கள். சச்சரவுகளைத் தவிர்த்து, உறவுகளில் இணக்கத்தை பேணுவீர்கள்."
    },
    "Vrischika": {
        "en": "Your emotions are intense, powerful, and secretive. You have a profound capacity for transformation and regeneration.",
        "ta": "உங்கள் உணர்வுகள் ஆழமானவை மற்றும் ரகசியமானவை. வாழ்க்கையில் எப்பேர்ப்பட்ட சவால்களையும் எதிர்கொண்டு மீளும் சக்தி கொண்டவர்."
    },
    "Dhanus": {
        "en": "You have a buoyant, enthusiastic emotional nature. You find emotional fulfillment through exploration and personal freedom.",
        "ta": "நீங்கள் உற்சாகமான மனநிலை கொண்டவர். புதிய தேடல்களும், சுதந்திரமும் உங்களுக்கு மனநிறைவைத் தரும்."
    },
    "Makara": {
        "en": "You are emotionally reserved and cautious. You prefer to show your love through duty, loyalty, and practical support.",
        "ta": "நீங்கள் உணர்வுகளை எளிதில் வெளிப்படுத்த மாட்டீர்கள். கடமை, விசுவாசம் மற்றும் செயல் மூலமாகவே அன்பைக் காட்டுவீர்கள்."
    },
    "Kumbha": {
        "en": "Your emotions can be detached and objective. You value friendship highly and care deeply about social causes.",
        "ta": "உங்கள் உணர்வுகள் சற்று விலகியே இருக்கும். நட்புக்கு அதிக முக்கியத்துவம் அளிப்பீர்கள் மற்றும் சமூக சிந்தனை கொண்டவர்."
    },
    "Meena": {
        "en": "You are deeply empathetic and sponge-like with others' emotions. You have a highly romantic and spiritual inner world.",
        "ta": "நீங்கள் மிகவும் இரக்க குணம் கொண்டவர். மற்றவர்களின் வலியை உங்களின் வலியாக உணரும் மென்மையான மனம் கொண்டவர்."
    }
}

NAKSHATRA_PREDICTIONS = {
    # Default fallback
    "default": {
        "en": "You are gifted with unique talents. Cultivate patience and focus on continuous learning.",
        "ta": "நீங்கள் தனித்துவமான திறமைகளை கொண்டவர். பொறுமையை வளர்த்துக்கொண்டு தொடர்ச்சியான கற்றலில் கவனம் செலுத்துங்கள்."
    },
    "Ashwini": {
        "en": "You are swift, youthful, and possess great healing energy. You love speed and taking the initiative.",
        "ta": "நீங்கள் வேகமானவர், சுறுசுறுப்பானவர் மற்றும் பிறரை குணப்படுத்தும் ஆற்றல் கொண்டவர். எந்த செயலிலும் முன்னின்று செயல்படுவீர்கள்."
    },
    "Bharani": {
        "en": "You endure struggles gracefully and undergo profound transformations. You are strong-willed and creative.",
        "ta": "நீங்கள் சவால்களை தைரியமாக எதிர்கொண்டு வெற்றி பெறுவீர்கள். மன உறுதி மற்றும் படைப்பாற்றல் மிக்கவர்."
    },
    "Krittika": {
        "en": "You are sharp, analytical, and possess leadership qualities. You have a burning desire to achieve greatness.",
        "ta": "நீங்கள் கூர்மையான அறிவு மற்றும் தலைமைப் பண்பு கொண்டவர். சாதிக்க வேண்டும் என்ற லட்சிய நெருப்பு உங்களிடம் எப்போதும் இருக்கும்."
    },
    # ... placeholder mapped for the rest; the backend can fall back to 'default' if not explicitly listed yet.
}

def generate_predictions(lagna_sign: str, moon_sign: str, nakshatra: str) -> dict:
    """
    Returns prediction dictionary for the given planetary signs and star.
    """
    lagna_pred = LAGNA_PREDICTIONS.get(lagna_sign, {
        "en": "You have a balanced and unique approach to life.",
        "ta": "நீங்கள் வாழ்க்கையை சமநிலையுடனும் தனித்துவத்துடனும் அணுகுகிறீர்கள்."
    })
    
    rasi_pred = RASI_PREDICTIONS.get(moon_sign, {
        "en": "You possess a steady emotional core.",
        "ta": "நீங்கள் நிலையான மன வலிமை கொண்டவர்."
    })
    
    nakshatra_pred = NAKSHATRA_PREDICTIONS.get(nakshatra, NAKSHATRA_PREDICTIONS["default"])

    return {
        "lagna": {
            "title_en": "Ascendant (Lagna) Traits",
            "title_ta": "லக்ன பலன்கள்",
            "description_en": lagna_pred["en"],
            "description_ta": lagna_pred["ta"]
        },
        "rasi": {
            "title_en": "Moon Sign (Rasi) Traits",
            "title_ta": "ராசி பலன்கள்",
            "description_en": rasi_pred["en"],
            "description_ta": rasi_pred["ta"]
        },
        "nakshatra": {
            "title_en": "Birth Star (Nakshatra) Traits",
            "title_ta": "நட்சத்திர பலன்கள்",
            "description_en": nakshatra_pred["en"],
            "description_ta": nakshatra_pred["ta"]
        }
    }
