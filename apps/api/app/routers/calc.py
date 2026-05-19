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

from ..services.ephemeris import ensure_ephemeris_files, get_julian_day, get_planet_positions
from ..services.panchangam import calculate_panchangam
from ..services.horoscope import calculate_horoscope
from ..services.dasha import calculate_dasha_timeline, calculate_current_dasha
from ..services.matching import calculate_star_match, calculate_horoscope_match
from ..services.numerology import calculate_numerology_report
from ..services.panchapakshi import calculate_panchapakshi

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


class DashaRequest(BaseModel):
    birth_date: str  # YYYY-MM-DD
    moon_longitude: float


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
        birth_date = date.fromisoformat(req.birth_date)
    except ValueError:
        raise HTTPException(400, detail="Invalid birth_date. Use YYYY-MM-DD.")

    timeline = calculate_dasha_timeline(birth_date, req.moon_longitude)
    current = calculate_current_dasha(birth_date, req.moon_longitude)
    return {"current": current, "timeline": timeline}


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
