"""
calc.py
FastAPI router for all /api/calc/* endpoints.
Covers: Panchangam, Horoscope, Dasha, Matching, Numerology, Panchapakshi.
"""
import json
import redis as redis_lib
from datetime import date, datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from ..services.ephemeris import ensure_ephemeris_files, get_julian_day, get_planet_positions, NAKSHATRAS
from ..services.panchangam import calculate_panchangam, _get_sun_times
from ..services.horoscope import calculate_horoscope
from ..services.dasha import calculate_dasha_timeline, calculate_current_dasha
from ..services.matching import calculate_star_match, calculate_horoscope_match, calculate_compatibility_index, calculate_dasa_sandhi
from ..services.numerology import calculate_numerology_report
from ..services.panchapakshi import calculate_panchapakshi
from ..services.muhurtham import calculate_muhurtham

import os

router = APIRouter(prefix="/api/calc", tags=["calculations"])

# ── Redis Cache ────────────────────────────────────────────────────────────────
_redis_client: redis_lib.Redis | None = None

def get_redis() -> redis_lib.Redis | None:
    global _redis_client
    if _redis_client is None:
        try:
            _redis_client = redis_lib.from_url(
                os.getenv("REDIS_URL", "redis://localhost:6379"),
                decode_responses=True,
            )
            _redis_client.ping()
        except Exception:
            _redis_client = None  # Redis optional — degrade gracefully
    return _redis_client


# ── Request / Response Models ──────────────────────────────────────────────────
class HoroscopeRequest(BaseModel):
    year: int
    month: int
    day: int
    hour: int = Field(default=12, ge=0, le=23)
    minute: int = Field(default=0, ge=0, le=59)
    lat: float
    lng: float
    tz_offset: float = 5.5


class StarMatchRequest(BaseModel):
    boy_star: str
    girl_star: str


class HoroscopeMatchRequest(BaseModel):
    boy_horoscope: dict
    girl_horoscope: dict


class NumerologyRequest(BaseModel):
    name: str
    dob: str  # YYYY-MM-DD


class PanchapakshiRequest(BaseModel):
    birth_nakshatra: str
    lat: float
    lng: float
    query_datetime: Optional[str] = None  # ISO format; defaults to now


class MuhurthamRequest(BaseModel):
    year: int
    month: int
    category: Optional[str] = "general"
    lat: Optional[float] = 13.0827
    lng: Optional[float] = 80.2707


class MonthlyPanchangamRequest(BaseModel):
    year: int
    month: int = Field(..., ge=1, le=12)
    lat: float
    lng: float
    utc_offset: float = 5.5
    place_name: Optional[str] = "Chennai"


class DashaRequest(BaseModel):
    # Optional old params for backward compatibility
    birth_date: Optional[str] = None
    moon_longitude: Optional[float] = None

    # New precision params for single API call
    year: Optional[int] = None
    month: Optional[int] = None
    day: Optional[int] = None
    hour: Optional[int] = 12
    minute: Optional[int] = 0
    lat: Optional[float] = None
    lng: Optional[float] = None
    tz_offset: Optional[float] = 5.5


class DetailedMatchRequest(BaseModel):
    boy_name: Optional[str] = "Groom"
    boy_year: int
    boy_month: int
    boy_day: int
    boy_hour: int = 12
    boy_minute: int = 0
    boy_lat: float
    boy_lng: float
    boy_utc_offset: float = 5.5
    boy_place_name: Optional[str] = "Chennai"

    girl_name: Optional[str] = "Bride"
    girl_year: int
    girl_month: int
    girl_day: int
    girl_hour: int = 12
    girl_minute: int = 0
    girl_lat: float
    girl_lng: float
    girl_utc_offset: float = 5.5
    girl_place_name: Optional[str] = "Chennai"


# ── Panchangam ─────────────────────────────────────────────────────────────────
@router.get("/panchangam")
async def panchangam(
    date_str: str = Query(default=None, alias="date", description="YYYY-MM-DD (defaults to today)"),
    lat: float = Query(default=13.0827, description="Latitude (default: Chennai)"),
    lng: float = Query(default=80.2707, description="Longitude (default: Chennai)"),
    tz_offset: float = Query(default=5.5, description="Timezone Offset (default: 5.5)"),
):
    """Return the daily Panchangam for the given date and location."""
    try:
        dt = date.fromisoformat(date_str) if date_str else date.today()
    except ValueError:
        raise HTTPException(400, detail="Invalid date format. Use YYYY-MM-DD.")

    cache_key = f"panchangam:{dt.isoformat()}:{lat:.2f}:{lng:.2f}:{tz_offset:.2f}"
    r = get_redis()
    if r:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)

    ensure_ephemeris_files()
    result = calculate_panchangam(dt, lat, lng, tz_offset)

    if r:
        r.setex(cache_key, 86400, json.dumps(result))  # cache 24h

    return result


from functools import lru_cache
from calendar import monthrange

# LRU cache on backend to save computation for fixed lat/lng/month combinations
@lru_cache(maxsize=256)
def get_cached_monthly_panchangam(year: int, month: int, lat: float, lng: float, utc_offset: float) -> list:
    ensure_ephemeris_files()
    num_days = monthrange(year, month)[1]
    
    TITHIS_TA = [
        "பிரதமை (Pratipada)", "துவிதியை (Dvitiya)", "திருதியை (Tritiya)", "சதுர்த்தி (Chaturthi)", "பஞ்சமி (Panchami)",
        "சஷ்டி (Shashthi)", "சப்தமி (Saptami)", "அஷ்டமி (Ashtami)", "நவமி (Navami)", "தசமி (Dashami)",
        "ஏகாதசி (Ekadashi)", "துவாதசி (Dwadashi)", "திரயோதசி (Trayodashi)", "சதுர்தசி (Chaturdashi)", "பௌர்ணமி (Purnima)",
        "பிரதமை (Pratipada)", "துவிதியை (Dvitiya)", "திருதியை (Tritiya)", "சதுர்த்தி (Chaturthi)", "பஞ்சமி (Panchami)",
        "சஷ்டி (Shashthi)", "சப்தமி (Saptami)", "அஷ்டமி (Ashtami)", "நவமி (Navami)", "தசமி (Dashami)",
        "ஏகாதசி (Ekadashi)", "துவாதசி (Dwadashi)", "திரயோதசி (Trayodashi)", "சதுர்தசி (Chaturdashi)", "அமாவாசை (Amavasya)"
    ]

    NAKSHATRAS_TA = [
        "அஸ்வினி (Aswini)", "பரணி (Bharani)", "கார்த்திகை (Krithika)", "ரோகிணி (Rohini)", "மிருகசீரிடம் (Mrigasira)",
        "திருவாதிரை (Arudra)", "புனர்பூசம் (Punarvasu)", "பூசம் (Pushya)", "ஆயில்யம் (Ashlesha)", "மகம் (Magha)",
        "பூரம் (Poorva Phalguni)", "உத்திரம் (Uttara Phalguni)", "அஸ்தம் (Hasta)", "சித்திரை (Chitra)", "சுவாதி (Swati)",
        "விசாகம் (Vishakha)", "அனுஷம் (Anuradha)", "கேட்டை (Jyeshtha)", "மூலம் (Moola)", "பூராடம் (Poorvashadha)",
        "உத்திராடம் (Uttarashadha)", "திருவோணம் (Shravana)", "அவிட்டம் (Dhanishta)", "சதயம் (Shatabhisha)", "பூரட்டாதி (Poorvabhadra)",
        "உத்திரட்டாதி (Uttarabhadra)", "ரேவதி (Revati)"
    ]

    YOGAS_TA = [
        "விஷ்கம்பம் (Vishkambha)", "பிரீதி (Preeti)", "ஆயுஷ்மான் (Ayushman)", "சௌபாக்கியம் (Saubhagya)", "சோபனம் (Shobhana)",
        "அதிகண்டம் (Atiganda)", "சுகர்மா (Sukarma)", "திருதி (Dhriti)", "சூலம் (Shoola)", "கண்டம் (Ganda)",
        "விருத்தி (Vriddhi)", "துருவம் (Dhruva)", "வியாகாதம் (Vyaghata)", "ஹர்ஷணம் (Harshana)", "வஜிரம் (Vajra)",
        "சித்தி (Siddhi)", "வியதீபாதம் (Vyatipata)", "வரியான் (Variyana)", "பரிகம் (Parigha)", "சிவம் (Shiva)",
        "சித்தம் (Siddha)", "சாத்தியம் (Sadhya)", "சுபம் (Shubha)", "சுக்கிலம் (Shukla)", "பிரம்மா (Brahma)",
        "இந்திரம் (Indra)", "வைதிருதி (Vaidhriti)"
    ]

    KARANAS_TA = {
        "Bava": "பவம் (Bava)", "Balava": "பாலவம் (Balava)", "Kaulava": "கௌலவம் (Kaulava)", "Taitila": "தைதிலம் (Taitila)",
        "Garaja": "கரசை (Garaja)", "Vanija": "வணிசை (Vanija)", "Vishti": "பத்திரை/விஷ்டி (Vishti)",
        "Shakuni": "சகுனி (Shakuni)", "Chatushpada": "சதுஷ்பாதம் (Chatushpada)", "Naga": "நாகவம் (Naga)", "Kimstughna": "கிம்ஸ்துக்கினம் (Kimstughna)"
    }

    PAKSHA_TA = {
        "Shukla": "வளர்பிறை (Shukla)",
        "Krishna": "தேய்பிறை (Krishna)"
    }

    WEEKDAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    WEEKDAYS_TA = ["திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி", "ஞாயிறு"]

    results = []
    for day in range(1, num_days + 1):
        dt = date(year, month, day)
        pan = calculate_panchangam(dt, lat, lng, utc_offset)
        
        tithi_idx = pan["tithi"]["index"]
        tithi_name = pan["tithi"]["name"]
        tithi_ta = TITHIS_TA[tithi_idx - 1] if 1 <= tithi_idx <= len(TITHIS_TA) else tithi_name

        nak_idx = pan["nakshatra"]["index"]
        nak_name = pan["nakshatra"]["name"]
        nak_ta = NAKSHATRAS_TA[nak_idx - 1] if 1 <= nak_idx <= len(NAKSHATRAS_TA) else nak_name

        yogam_idx = pan["yogam"]["index"]
        yogam_name = pan["yogam"]["name"]
        yogam_ta = YOGAS_TA[yogam_idx - 1] if 1 <= yogam_idx <= len(YOGAS_TA) else yogam_name

        karanam_name = pan["karanam"]["name"]
        karanam_ta = KARANAS_TA.get(karanam_name, karanam_name)

        paksha = pan["paksha"]
        paksha_ta = PAKSHA_TA.get(paksha, paksha)

        sunrise_dt, sunset_dt = _get_sun_times(dt, lat, lng)

        results.append({
            "date": dt.isoformat(),
            "day_of_week": WEEKDAYS_EN[dt.weekday()],
            "day_of_week_ta": WEEKDAYS_TA[dt.weekday()],
            "tithi": tithi_name,
            "tithi_ta": tithi_ta,
            "tithi_index": tithi_idx,
            "paksha": paksha.lower(),
            "paksha_ta": paksha_ta,
            "nakshatra": nak_name,
            "nakshatra_ta": nak_ta,
            "nakshatra_index": nak_idx,
            "yogam": yogam_name,
            "yogam_ta": yogam_ta,
            "karanam": karanam_name,
            "karanam_ta": karanam_ta,
            "rahu_kalam": pan["rahu_kalam"],
            "sunrise": sunrise_dt.strftime("%H:%M"),
            "sunset": sunset_dt.strftime("%H:%M"),
        })
    return results

@router.post("/panchangam/monthly")
async def panchangam_monthly(req: MonthlyPanchangamRequest):
    """Return a lightweight monthly Panchangam for calendar rendering without planetary longitudes."""
    try:
        results = get_cached_monthly_panchangam(
            req.year, req.month, round(req.lat, 4), round(req.lng, 4), round(req.utc_offset, 2)
        )
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    return results


# ── Horoscope ──────────────────────────────────────────────────────────────────
@router.post("/horoscope")
async def horoscope(req: HoroscopeRequest):
    """Return the full Jathagam: Lagna, Rasi chart, Navamsam chart, planet table."""
    ensure_ephemeris_files()
    try:
        result = calculate_horoscope(
            req.year, req.month, req.day,
            req.hour, req.minute,
            req.lat, req.lng,
            req.tz_offset,
        )
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    return result


# ── Dasha ──────────────────────────────────────────────────────────────────────
@router.post("/dasha")
async def dasha(req: DashaRequest):
    """Return the full Vimshottari Dasha timeline for the given birth details."""
    try:
        # Check if high-precision details are passed
        if req.year is not None and req.month is not None and req.day is not None and req.lat is not None and req.lng is not None:
            # 1. Reconstruct Julian Day
            jd = get_julian_day(req.year, req.month, req.day, req.hour, req.minute, req.tz_offset)
            # 2. Reconstruct exact moon longitude
            positions = get_planet_positions(jd)
            moon_long = positions["Moon"]["longitude"]
            # 3. Create birth_date object
            birth_date = date(req.year, req.month, req.day)
            
            # Retrieve Moon Nakshatra and translations
            moon_nakshatra = positions["Moon"]["nakshatra"]
        else:
            # Fallback to old format
            if not req.birth_date or req.moon_longitude is None:
                raise HTTPException(400, detail="Missing birth details or moon_longitude.")
            try:
                birth_date = date.fromisoformat(req.birth_date)
            except ValueError:
                raise HTTPException(400, detail="Invalid birth_date format YYYY-MM-DD.")
            moon_long = req.moon_longitude
            # In old format, compute moon_nakshatra from longitude
            nakshatra_index = int(moon_long / (360 / 27))
            moon_nakshatra = NAKSHATRAS[nakshatra_index % 27]

        # Calculate full three-level deep timeline
        timeline = calculate_dasha_timeline(birth_date, moon_long)
        current = calculate_current_dasha(birth_date, moon_long)
        
        # Localized nakshatra translation map
        nak_map_ta = {
            'Ashwini': 'அஸ்வினி', 'Bharani': 'பரணி', 'Krittika': 'கார்த்திகை', 'Rohini': 'ரோகிணி',
            'Mrigashira': 'மிருகசீரிடம்', 'Ardra': 'திருவாதிரை', 'Punarvasu': 'புனர்பூசம்',
            'Pushya': 'பூசம்', 'Ashlesha': 'ஆயில்யம்', 'Magha': 'மகம்',
            'Purva Phalguni': 'பூரம்', 'Uttara Phalguni': 'உத்திரம்', 'Hasta': 'அஸ்தம்',
            'Chitra': 'சித்திரை', 'Swati': 'சுவாதி', 'Vishakha': 'விசாகம்', 'Anuradha': 'அனுஷம்',
            'Jyeshtha': 'கேட்டை', 'Mula': 'மூலம்', 'Purva Ashadha': 'பூராடம்',
            'Uttara Ashadha': 'உத்திராடம்', 'Shravana': 'திருவோணம்', 'Dhanishta': 'அவிட்டம்',
            'Shatabhisha': 'சதயம்', 'Purva Bhadrapada': 'பூரட்டாதி',
            'Uttara Bhadrapada': 'உத்திரட்டாதி', 'Revati': 'ரேவதி'
        }
        moon_nakshatra_ta = nak_map_ta.get(moon_nakshatra, moon_nakshatra)

        return {
            "current": current,
            "timeline": timeline,
            "moon_longitude": round(moon_long, 4),
            "moon_nakshatra": moon_nakshatra,
            "moon_nakshatra_ta": moon_nakshatra_ta,
        }
        
    except ValueError:
        raise HTTPException(400, detail="Invalid date format or parameters.")
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# ── Star Matching ──────────────────────────────────────────────────────────────
@router.post("/matching/star")
async def star_match(req: StarMatchRequest):
    """Return the 10-porutham Nakshatra compatibility score."""
    try:
        result = calculate_star_match(req.boy_star, req.girl_star)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))
    return result


# ── Horoscope Matching ─────────────────────────────────────────────────────────
@router.post("/matching/horoscope")
async def horoscope_match(req: HoroscopeMatchRequest):
    """Return Papasamyam and Mangal Dosha compatibility analysis."""
    result = calculate_horoscope_match(req.boy_horoscope, req.girl_horoscope)
    return result


# ── Deep Matching (PRO Feature) ────────────────────────────────────────────────
@router.post("/matching/detailed/basic")
async def detailed_match_basic(req: DetailedMatchRequest):
    """Return fast basic calculations (10 Poruthams, Papasamyam, Mangal Dosha, Overview Score, Charts)"""
    ensure_ephemeris_files()
    try:
        # 1. Cast Groom's Horoscope
        boy_horo = calculate_horoscope(
            req.boy_year, req.boy_month, req.boy_day,
            req.boy_hour, req.boy_minute,
            req.boy_lat, req.boy_lng,
            req.boy_utc_offset,
        )

        # 2. Cast Bride's Horoscope
        girl_horo = calculate_horoscope(
            req.girl_year, req.girl_month, req.girl_day,
            req.girl_hour, req.girl_minute,
            req.girl_lat, req.girl_lng,
            req.girl_utc_offset,
        )

        # 3. Derive Stars
        boy_star = boy_horo["moon"]["nakshatra"]
        girl_star = girl_horo["moon"]["nakshatra"]

        # 4. Calculate 10 Poruthams
        star_result = calculate_star_match(boy_star, girl_star)

        # 5. Calculate Papasamyam & Mangal Dosha
        horo_result = calculate_horoscope_match(boy_horo, girl_horo)

        # 6. Pre-calculate Dasa Sandhi (Mahadashas only) for overview score
        boy_dob = f"{req.boy_year:04d}-{req.boy_month:02d}-{req.boy_day:02d}"
        girl_dob = f"{req.girl_year:04d}-{req.girl_month:02d}-{req.girl_day:02d}"
        dasa_result = calculate_dasa_sandhi(
            boy_dob, boy_horo["moon"]["longitude"],
            girl_dob, girl_horo["moon"]["longitude"]
        )
        dasa_severity = dasa_result["summary_severity"]

        # 7. Compute Synthesized Overview Score
        overview_score = calculate_compatibility_index(
            star_result["score_percent"] / 10.0,
            horo_result["papasamyam"]["difference"],
            horo_result["mangal_dosha"]["compatible"],
            dasa_severity
        )

        # Localized nakshatra translation map
        nak_map_ta = {
            'Ashwini': 'அஸ்வினி', 'Bharani': 'பரணி', 'Krittika': 'கார்த்திகை', 'Rohini': 'ரோகிணி',
            'Mrigashira': 'மிருகசீரிஷம்', 'Ardra': 'திருவாதிரை', 'Punarvasu': 'புனர்பூசம்',
            'Pushya': 'பூசம்', 'Ashlesha': 'ஆயில்யம்', 'Magha': 'மகம்',
            'Purva Phalguni': 'பூரம்', 'Uttara Phalguni': 'உத்திரம்', 'Hasta': 'அஸ்தம்',
            'Chitra': 'சித்திரை', 'Swati': 'சுவாதி', 'Vishakha': 'விசாகம்', 'Anuradha': 'அனுஷம்',
            'Jyeshtha': 'கேட்டை', 'Mula': 'மூலம்', 'Purva Ashadha': 'பூராடம்',
            'Uttara Ashadha': 'உத்திராடம்', 'Shravana': 'திருவோணம்', 'Dhanishtha': 'அவிட்டம்',
            'Shatabhisha': 'சதயம்', 'Purva Bhadrapada': 'பூரட்டாதி',
            'Uttara Bhadrapada': 'உத்திரட்டாதி', 'Revati': 'ரேவதி'
        }
        boy_star_ta = nak_map_ta.get(boy_star, boy_star)
        girl_star_ta = nak_map_ta.get(girl_star, girl_star)

        return {
            "boy_star": boy_star,
            "boy_star_ta": boy_star_ta,
            "girl_star": girl_star,
            "girl_star_ta": girl_star_ta,
            "star_result": star_result,
            "horo_result": horo_result,
            "overview_score": overview_score,
            "dasa_sandhi_precheck_severity": dasa_severity,
            "boy_chart": boy_horo["rasi_chart"],
            "girl_chart": girl_horo["rasi_chart"],
            "boy_planets": boy_horo["planets"],
            "girl_planets": girl_horo["planets"],
            "boy_lagna": boy_horo["lagna"],
            "girl_lagna": girl_horo["lagna"],
        }

    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.post("/matching/detailed/dasa-sandhi")
async def detailed_match_dasa_sandhi(req: DetailedMatchRequest):
    """Return heavier detailed 120-year Dasa Sandhi scan timeline and clashes"""
    ensure_ephemeris_files()
    try:
        # Cast Moon positions
        boy_jd = get_julian_day(req.boy_year, req.boy_month, req.boy_day, req.boy_hour, req.boy_minute, req.boy_utc_offset)
        boy_positions = get_planet_positions(boy_jd)
        boy_moon_long = boy_positions["Moon"]["longitude"]

        girl_jd = get_julian_day(req.girl_year, req.girl_month, req.girl_day, req.girl_hour, req.girl_minute, req.girl_utc_offset)
        girl_positions = get_planet_positions(girl_jd)
        girl_moon_long = girl_positions["Moon"]["longitude"]

        boy_dob = f"{req.boy_year:04d}-{req.boy_month:02d}-{req.boy_day:02d}"
        girl_dob = f"{req.girl_year:04d}-{req.girl_month:02d}-{req.girl_day:02d}"

        dasa_result = calculate_dasa_sandhi(boy_dob, boy_moon_long, girl_dob, girl_moon_long)
        return dasa_result

    except Exception as e:
        raise HTTPException(500, detail=str(e))



# ── Numerology ─────────────────────────────────────────────────────────────────
@router.post("/numerology")
async def numerology(req: NumerologyRequest):
    """Return a full Chaldean Tamil numerology report."""
    result = calculate_numerology_report(req.name, req.dob)
    return result


# ── Panchapakshi ───────────────────────────────────────────────────────────────
@router.post("/prasnam/panchapakshi")
async def panchapakshi(req: PanchapakshiRequest):
    """Return the ruling bird and current activity for Prasnam."""
    if req.query_datetime:
        try:
            query_dt = datetime.fromisoformat(req.query_datetime)
        except ValueError:
            raise HTTPException(400, detail="Invalid query_datetime. Use ISO 8601 format.")
    else:
        query_dt = datetime.now()

    try:
        result = calculate_panchapakshi(req.birth_nakshatra, query_dt, req.lat, req.lng)
    except ValueError as e:
        raise HTTPException(400, detail=str(e))
    return result


# ── Transit (Gocharam) ─────────────────────────────────────────────────────────
@router.get("/transit")
async def transit(
    rasi: str = Query(..., description="Natal Moon Sign (Rasi) in English, e.g. Vrischika / Scorpio")
):
    """Return Vedic transit (Gocharam) for Saturn, Jupiter, Rahu, Ketu relative to natal Rasi."""
    from ..services.transit import calculate_transit
    ensure_ephemeris_files()
    try:
        # Map Vrischika -> Vrischika, Scorpio -> Vrischika (if needed, but our services support the ZODIAC_SIGNS keys)
        # ZODIAC_SIGNS = ["Mesha", "Rishabha", "Mithuna", "Kataka", "Simha", "Kanya", "Thula", "Vrischika", "Dhanus", "Makara", "Kumbha", "Meena"]
        # Let's map common English names if passed
        english_to_vedic = {
            "aries": "Mesha", "taurus": "Rishabha", "gemini": "Mithuna", "cancer": "Kataka",
            "leo": "Simha", "virgo": "Kanya", "libra": "Thula", "scorpio": "Vrischika",
            "sagittarius": "Dhanus", "capricorn": "Makara", "aquarius": "Kumbha", "pisces": "Meena"
        }
        mapped_rasi = rasi.strip().capitalize()
        if rasi.lower() in english_to_vedic:
            mapped_rasi = english_to_vedic[rasi.lower()]
            
        result = calculate_transit(mapped_rasi)
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    return result


# ── Muhurtham Finder ───────────────────────────────────────────────────────────
@router.post("/muhurtham")
async def muhurtham(req: MuhurthamRequest):
    """Return daily Muhurtham evaluations and Gowri timings for the given month."""
    ensure_ephemeris_files()
    try:
        result = calculate_muhurtham(
            req.year, req.month, req.category, req.lat, req.lng
        )
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    return result

