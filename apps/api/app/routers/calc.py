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
from ..services.panchangam import calculate_panchangam
from ..services.horoscope import calculate_horoscope
from ..services.dasha import calculate_dasha_timeline, calculate_current_dasha
from ..services.matching import calculate_star_match, calculate_horoscope_match
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


# ── Panchangam ─────────────────────────────────────────────────────────────────
@router.get("/panchangam")
async def panchangam(
    date_str: str = Query(default=None, alias="date", description="YYYY-MM-DD (defaults to today)"),
    lat: float = Query(default=13.0827, description="Latitude (default: Chennai)"),
    lng: float = Query(default=80.2707, description="Longitude (default: Chennai)"),
):
    """Return the daily Panchangam for the given date and location."""
    try:
        dt = date.fromisoformat(date_str) if date_str else date.today()
    except ValueError:
        raise HTTPException(400, detail="Invalid date format. Use YYYY-MM-DD.")

    cache_key = f"panchangam:{dt.isoformat()}:{lat:.2f}:{lng:.2f}"
    r = get_redis()
    if r:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)

    ensure_ephemeris_files()
    result = calculate_panchangam(dt, lat, lng)

    if r:
        r.setex(cache_key, 86400, json.dumps(result))  # cache 24h

    return result


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

