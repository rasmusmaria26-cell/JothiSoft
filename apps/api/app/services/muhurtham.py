"""
muhurtham.py
Auspicious Muhurtham finding engine for Tamil Astrology.
Calculates daily auspiciousness ratings, Gowri Panchangam slots,
Yama Gandam, Kulikai, and event-specific suitability.
"""
from datetime import date, datetime, timedelta
from calendar import monthrange
from .panchangam import calculate_panchangam, _get_sun_times

# ── Gowri daytime segments rotation ────────────────────────────────────────────
# Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
GOWRI_DAYTIME_SLOTS = {
    0: ["Amirdha", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Visham", "Uthi"],      # Monday
    1: ["Uthi", "Amirdha", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Visham"],      # Tuesday
    2: ["Laabam", "Dhanam", "Sugam", "Soram", "Visham", "Uthi", "Amirdha", "Rogam"],      # Wednesday
    3: ["Sugam", "Soram", "Visham", "Uthi", "Amirdha", "Rogam", "Laabam", "Dhanam"],      # Thursday
    4: ["Dhanam", "Sugam", "Soram", "Visham", "Uthi", "Amirdha", "Rogam", "Laabam"],      # Friday
    5: ["Visham", "Uthi", "Amirdha", "Rogam", "Laabam", "Dhanam", "Sugam", "Soram"],      # Saturday
    6: ["Rogam", "Laabam", "Dhanam", "Sugam", "Soram", "Visham", "Uthi", "Amirdha"],      # Sunday
}

GOWRI_DETAILS = {
    "Amirdha": {"en": "Amirtham (Highly Auspicious)", "ta": "அமிர்தம் (மிகவும் நன்று)", "status": "excellent"},
    "Uthi": {"en": "Uthiyogam (Auspicious)", "ta": "உத்தி (நன்று)", "status": "good"},
    "Laabam": {"en": "Laabam (Auspicious)", "ta": "லாபம் (நன்று)", "status": "good"},
    "Sugam": {"en": "Sugam (Auspicious)", "ta": "சுகம் (நன்று)", "status": "good"},
    "Dhanam": {"en": "Dhanam (Auspicious)", "ta": "தனம் (நன்று)", "status": "good"},
    "Rogam": {"en": "Rogam (Inauspicious)", "ta": "ரோகம் (தவிர்க்கவும்)", "status": "bad"},
    "Soram": {"en": "Soram (Inauspicious)", "ta": "சோரம் (தவிர்க்கவும்)", "status": "bad"},
    "Visham": {"en": "Visham (Inauspicious)", "ta": "விஷம் (தவிர்க்கவும்)", "status": "bad"},
}

# Yama Gandam and Kulikai daytime slots (1-based index 1..8)
_YAMA_SLOTS = {0: 6, 1: 4, 2: 3, 3: 2, 4: 7, 5: 8, 6: 5}
_KULI_SLOTS = {0: 5, 1: 3, 2: 2, 3: 1, 4: 6, 5: 4, 6: 7}


def _calculate_slot_time(sunrise: datetime, slot_duration: float, slot_idx: int) -> dict:
    start = sunrise + timedelta(seconds=slot_duration * (slot_idx - 1))
    end = start + timedelta(seconds=slot_duration)
    return {
        "start": start.strftime("%H:%M"),
        "end": end.strftime("%H:%M"),
    }


def calculate_muhurtham(year: int, month: int, category: str = "general", lat: float = 13.0827, lng: float = 80.2707) -> list[dict]:
    """
    Computes daily Muhurtham auspiciousness for all days in a given calendar month.
    """
    results = []
    num_days = monthrange(year, month)[1]

    # Good Nakshatra indices (1-based): Rohini, Mrigashira, Uttaraphalguni, Hasta, Chitra, Swati, Anuradha, Uttaraashadha, Shravana, Dhanishta, Shatabhisha, Uttarabhadrapada, Revati, Ashwini, Pushya
    GOOD_NAKSHATRAS = {4, 5, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27, 1, 8}
    # Bad Nakshatra indices to avoid: Bharani, Ardra, Ashlesha, Jyeshtha
    BAD_NAKSHATRAS = {2, 6, 9, 18}

    # Auspicious Tithis: Dwitiya, Tritiya, Panchami, Saptami, Dashami, Dwadashi, Trayodashi, Purnima
    GOOD_TITHIS = {2, 3, 5, 7, 10, 12, 13, 15, 17, 18, 20, 22, 25, 27, 28}
    # Rikta Tithis to avoid: Chaturthi, Navami, Chaturdashi and Amavasya / Ashtami
    BAD_TITHIS = {4, 9, 14, 19, 24, 29, 30, 8, 23}

    # Auspicious Yogams
    GOOD_YOGAMS = {
        "Siddha", "Shubha", "Shiva", "Siddhi", "Brahma", "Indra", "Preeti",
        "Ayushman", "Saubhagya", "Shobhana", "Sukarma", "Dhriti", "Harshana",
        "Variyana", "Sadhya", "Shukla", "Vriddhi", "Dhruva", "Vajra"
    }
    # Inauspicious Yogams
    BAD_YOGAMS = {"Atiganda", "Vyaghata", "Vyatipata", "Vaidhriti", "Ganda", "Shoola"}

    for day in range(1, num_days + 1):
        dt = date(year, month, day)
        weekday = dt.weekday() # Mon=0, Sun=6

        # Fetch core Panchangam details
        pan = calculate_panchangam(dt, lat, lng)
        sunrise, sunset = _get_sun_times(dt, lat, lng)

        # ── Gowri Nalla Neram Slots ────────────────────────────────────────────
        day_duration = (sunset - sunrise).total_seconds()
        slot_duration = day_duration / 8
        gowri_sequence = GOWRI_DAYTIME_SLOTS[weekday]
        gowri_slots = []

        for idx, key in enumerate(gowri_sequence):
            start_t = sunrise + timedelta(seconds=slot_duration * idx)
            end_t = start_t + timedelta(seconds=slot_duration)
            details = GOWRI_DETAILS[key]
            gowri_slots.append({
                "name_en": details["en"],
                "name_ta": details["ta"],
                "status": details["status"],
                "start": start_t.strftime("%I:%M %p"),
                "end": end_t.strftime("%I:%M %p"),
            })

        # Calculate Yama Gandam and Kulikai
        yama_gandam = _calculate_slot_time(sunrise, slot_duration, _YAMA_SLOTS[weekday])
        kulikai = _calculate_slot_time(sunrise, slot_duration, _KULI_SLOTS[weekday])

        # ── General Muhurtham Scoring ──────────────────────────────────────────
        # Weekday score (max +15, min -10)
        if weekday in (0, 2, 3, 4): # Mon, Wed, Thu, Fri
            vara_score = 15
        elif weekday in (5, 6): # Sat, Sun
            vara_score = 5
        else: # Tue
            vara_score = -10

        # Tithi score (max +20, min -15)
        tithi_idx = pan["tithi"]["index"]
        if tithi_idx in GOOD_TITHIS:
            tithi_score = 20
        elif tithi_idx in BAD_TITHIS:
            tithi_score = -15
        else:
            tithi_score = 5

        # Nakshatra score (max +25, min -15)
        nak_idx = pan["nakshatra"]["index"]
        if nak_idx in GOOD_NAKSHATRAS:
            nakshatra_score = 25
        elif nak_idx in BAD_NAKSHATRAS:
            nakshatra_score = -15
        else:
            nakshatra_score = 10

        # Yogam score (max +15, min -15)
        yogam_name = pan["yogam"]["name"]
        if yogam_name in GOOD_YOGAMS:
            yogam_score = 15
        elif yogam_name in BAD_YOGAMS:
            yogam_score = -15
        else:
            yogam_score = 5

        # Base rating
        base_score = vara_score + tithi_score + nakshatra_score + yogam_score
        # Max score is 75, Min is -55. Normalize to 0-100
        general_score = int(((base_score + 55) / 130) * 100)

        # ── Event-Specific Modifiers ───────────────────────────────────────────
        event_score = general_score
        description_en = ""
        description_ta = ""

        if category == "marriage":
            # Marriage suitability
            if weekday == 1: # Tuesday
                event_score -= 25
            elif weekday in (0, 2, 3, 4): # Mon, Wed, Thu, Fri
                event_score += 10
            
            if nak_idx in {4, 5, 12, 13, 14, 17, 21, 22, 23, 26, 27}: # Vivaha Nakshatras
                event_score += 15
            elif nak_idx in BAD_NAKSHATRAS:
                event_score -= 20

            if pan["paksha"] == "Shukla":
                event_score += 5

            if event_score >= 70:
                description_en = "Excellent day for wedding ceremonies and marriage registration."
                description_ta = "திருமண சுப காரியங்கள் மற்றும் திருமண பதிவுக்கு மிகவும் உகந்த நாள்."
            elif event_score >= 50:
                description_en = "Good day for wedding planning, engagements, or discussions."
                description_ta = "நிச்சயதார்த்தம் மற்றும் திருமண பேச்சுவார்த்தைகளுக்கு உகந்த நாள்."
            else:
                description_en = "Avoid organizing marriage ceremonies on this day due to negative weekday or tithi alignment."
                description_ta = "செவ்வாய் தோஷம் அல்லது அசுப திதி காரணமாக இன்று திருமண காரியங்களை தவிர்க்கவும்."

        elif category == "grahapravesham":
            # Housewarming
            if weekday in (1, 5): # Tuesday & Saturday avoided
                event_score -= 25
            elif weekday in (0, 2, 3, 4):
                event_score += 10

            if nak_idx in {4, 5, 12, 13, 17, 21, 22, 23, 26, 27}: # Grahapravesha Nakshatras
                event_score += 15

            if event_score >= 70:
                description_en = "Highly auspicious for entering a new home or Grihapravesha ceremonies."
                description_ta = "புதுமனை புகுவிழா மற்றும் கிரகப்பிரவேச பூசைகளுக்கு மிகவும் உகந்த நாள்."
            elif event_score >= 50:
                description_en = "Suitable for house renovations, painting, or shifting household goods."
                description_ta = "வீடு புதுப்பித்தல், வண்ணம் தீட்டுதல் அல்லது வீட்டு உபயோகப் பொருட்களை மாற்ற உகந்தது."
            else:
                description_en = "Inauspicious alignment. Avoid initiating Grihapravesha or new house projects today."
                description_ta = "அசுப கிரக நிலைகள். இன்று கிரகப்பிரவேசம் அல்லது புதிய வீட்டு வேலைகளைத் தவிர்க்கவும்."

        elif category == "business":
            # Business opening
            if weekday in (0, 2, 3, 4):
                event_score += 10
            if nak_idx in {1, 4, 5, 8, 12, 13, 14, 15, 17, 22, 23, 24, 27}:
                event_score += 15

            if event_score >= 70:
                description_en = "Auspicious day to inaugurate a new shop, office, or launch a product."
                description_ta = "புதிய கடை, அலுவலகம் திறக்க அல்லது புதிய தயாரிப்புகளை அறிமுகப்படுத்த சிறந்த நாள்."
            elif event_score >= 50:
                description_en = "Good for business meetings, planning, signing contracts, or interviews."
                description_ta = "வியாபார பேச்சுவார்த்தைகள், ஒப்பந்தங்கள் கையெழுத்திட அல்லது நேர்காணலுக்கு உகந்தது."
            else:
                description_en = "Avoid commercial openings. Postpone major financial investments or launches."
                description_ta = "வர்த்தக தொடக்கங்களை தவிர்க்கவும். பெரிய நிதி முதலீடுகள் அல்லது வெளியீடுகளை தள்ளிவைக்கவும்."

        elif category == "vehicle":
            # Vehicle purchase
            if weekday in (2, 3, 4): # Wed, Thu, Fri preferred
                event_score += 10
            if nak_idx in {1, 4, 7, 8, 13, 15, 22, 24, 27}:
                event_score += 15

            if event_score >= 70:
                description_en = "Highly recommended day for buying and registering a new vehicle."
                description_ta = "புதிய வாகனம் வாங்க மற்றும் பதிவு செய்ய மிகவும் பரிந்துரைக்கப்படும் நாள்."
            elif event_score >= 50:
                description_en = "Suitable for vehicle servicing, test drives, or purchasing parts."
                description_ta = "வாகன பழுதுபார்ப்பு, டெஸ்ட் டிரைவ் அல்லது பாகங்கள் வாங்க உகந்த நாள்."
            else:
                description_en = "Avoid signing vehicle purchase papers or taking delivery today."
                description_ta = "இன்று வாகன விநியோகம் பெறுவதையோ அல்லது வாங்குவதையோ தவிர்க்கவும்."

        elif category == "property":
            # Property registration (Tuesdays are ruled by Mars/Sevvai, good for land!)
            if weekday == 1: # Tuesday is actually good here!
                event_score += 20
            if nak_idx in {5, 14, 23}: # Mars Nakshatras
                event_score += 20

            if event_score >= 70:
                description_en = "Excellent alignment for land registration, property deals, or signing deeds."
                description_ta = "பூமி காரியங்கள், நிலப் பதிவு மற்றும் சொத்து ஒப்பந்தங்கள் செய்ய மிகவும் உகந்த நாள்."
            elif event_score >= 50:
                description_en = "Good for surveying land, visiting sites, or consulting architects."
                description_ta = "நிலத்தை பார்வையிட, தளம் செல்ல அல்லது வாஸ்து நிபுணர்களை கலந்தாலோசிக்க உகந்தது."
            else:
                description_en = "Avoid property deals or paying advance amounts today."
                description_ta = "இன்று சொத்து ஒப்பந்தங்கள் செய்வதையோ அல்லது முன்பணம் செலுத்துவதையோ தவிர்க்கவும்."

        else:
            # General category
            if event_score >= 75:
                description_en = "Highly auspicious day. Suitable for all major spiritual and worldly initiations."
                description_ta = "மிகவும் சுபமான நாள். அனைத்து ஆன்மீக மற்றும் லௌகீக சுப காரியங்களுக்கும் உகந்தது."
            elif event_score >= 55:
                description_en = "Good day. Suitable for regular activities and travel."
                description_ta = "நல்ல நாள். அன்றாட சுப காரியங்கள் மற்றும் பயணங்களுக்கு உகந்தது."
            elif event_score >= 35:
                description_en = "Average day. Continue with routine tasks, avoid starting new ventures."
                description_ta = "சாதாரண நாள். வழக்கமான பணிகளைத் தொடரலாம், புதிய முயற்சிகளைத் தவிர்க்கவும்."
            else:
                description_en = "Avoid starting any new venture. Strictly avoid major undertakings."
                description_ta = "புதிய முயற்சிகளைத் தவிர்க்கவும். பெரிய சுப காரியங்களைத் தள்ளிப்போடவும்."

        # Keep event score capped at 0-100
        event_score = max(0, min(100, event_score))

        # Classify status
        if event_score >= 75:
            status = "highly_auspicious"
        elif event_score >= 55:
            status = "auspicious"
        elif event_score >= 35:
            status = "average"
        else:
            status = "avoid"

        results.append({
            "date": dt.isoformat(),
            "weekday": weekday,
            "general_score": general_score,
            "event_score": event_score,
            "tithi": pan["tithi"]["name"],
            "tithi_index": tithi_idx,
            "nakshatra": pan["nakshatra"]["name"],
            "nakshatra_index": nak_idx,
            "nakshatra_pada": pan["nakshatra"]["pada"],
            "yogam": yogam_name,
            "paksha": pan["paksha"],
            "rahu_kalam": pan["rahu_kalam"],
            "yama_gandam": yama_gandam,
            "kulikai": kulikai,
            "gowri_slots": gowri_slots,
            "description_en": description_en,
            "description_ta": description_ta,
            "status": status,
        })

    return results
