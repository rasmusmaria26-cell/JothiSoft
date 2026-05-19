"""
panchangam.py
Daily Panchangam calculation engine for Tamil Astrology.
Tithi · Nakshatra · Yogam · Karanam · Rahu Kalam · Varjyam
"""
import math
import ephem
from datetime import date, datetime, timedelta
from .ephemeris import get_julian_day, get_planet_positions, NAKSHATRAS

# ── Lookup Tables ──────────────────────────────────────────────────────────────
TITHIS = [
    "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Purnima",  # 15 — Shukla Paksha
    "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Amavasya",  # 30
]

YOGAMS = [
    "Vishkambha", "Preeti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Indra", "Vaidhriti",
]

KARANAMS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garaja",
    "Vanija", "Vishti", "Bava", "Balava", "Kaulava",
    "Taitila", "Garaja", "Vanija", "Vishti",  # repeating cycle
    "Shakuni", "Chatushpada", "Naga", "Kimstughna",  # fixed
]

# Rahu Kalam start index (from sunrise) by weekday: Mon=0 … Sun=6
# Duration: 1.5 hours each
_RAHU_KALAM_SLOT = {0: 7, 1: 1, 2: 6, 3: 4, 4: 5, 5: 3, 6: 8}


# ── Sunrise / Sunset via ephem ─────────────────────────────────────────────────
def _get_sun_times(dt: date, lat: float, lng: float) -> tuple[datetime, datetime]:
    """Return (sunrise, sunset) as UTC datetime for the given date and location."""
    observer = ephem.Observer()
    observer.lat = str(lat)
    observer.lon = str(lng)
    observer.date = dt.strftime("%Y/%m/%d 00:00:00")
    observer.horizon = "-0:34"  # standard atmospheric refraction

    sun = ephem.Sun()
    sunrise_utc = ephem.localtime(observer.next_rising(sun))
    sunset_utc = ephem.localtime(observer.next_setting(sun))
    return sunrise_utc, sunset_utc


# ── Rahu Kalam ─────────────────────────────────────────────────────────────────
def _calculate_rahu_kalam(dt: date, lat: float, lng: float) -> dict:
    sunrise, sunset = _get_sun_times(dt, lat, lng)
    day_duration = (sunset - sunrise).total_seconds()
    slot_duration = day_duration / 8  # day split into 8 equal slots
    weekday = dt.weekday()  # Mon=0, Sun=6
    slot_index = _RAHU_KALAM_SLOT[weekday]

    start = sunrise + timedelta(seconds=slot_duration * (slot_index - 1))
    end = start + timedelta(seconds=slot_duration)
    return {
        "start": start.strftime("%H:%M"),
        "end": end.strftime("%H:%M"),
    }


# ── Core Panchangam ────────────────────────────────────────────────────────────
def calculate_panchangam(dt: date, lat: float, lng: float) -> dict:
    """
    Returns a full daily Panchangam dict for the given date and location.
    Uses the 5:30 IST offset for Julian Day conversion.
    """
    jd = get_julian_day(dt.year, dt.month, dt.day, 6, 0, tz_offset=5.5)
    positions = get_planet_positions(jd)

    sun_long = positions["Sun"]["longitude"]
    moon_long = positions["Moon"]["longitude"]

    # ── Tithi ─────────────────────────────────────────────────────────────────
    tithi_index = int((moon_long - sun_long) % 360 / 12)
    tithi = TITHIS[tithi_index]
    paksha = "Shukla" if tithi_index < 15 else "Krishna"

    # ── Nakshatra ─────────────────────────────────────────────────────────────
    nakshatra_index = int(moon_long / (360 / 27))
    nakshatra = NAKSHATRAS[nakshatra_index]
    nakshatra_pada = int((moon_long % (360 / 27)) / (360 / 108)) + 1

    # ── Yogam ─────────────────────────────────────────────────────────────────
    yogam_index = int((sun_long + moon_long) % 360 / (360 / 27))
    yogam = YOGAMS[yogam_index]

    # ── Karanam ───────────────────────────────────────────────────────────────
    karanam_index = int(((moon_long - sun_long) % 360) / 6) % 60
    karanam = KARANAMS[karanam_index % len(KARANAMS)]

    # ── Rahu Kalam ────────────────────────────────────────────────────────────
    rahu_kalam = _calculate_rahu_kalam(dt, lat, lng)

    return {
        "date": dt.isoformat(),
        "paksha": paksha,
        "tithi": {"name": tithi, "index": tithi_index + 1},
        "nakshatra": {"name": nakshatra, "index": nakshatra_index + 1, "pada": nakshatra_pada},
        "yogam": {"name": yogam, "index": yogam_index + 1},
        "karanam": {"name": karanam},
        "rahu_kalam": rahu_kalam,
        "sun_longitude": round(sun_long, 4),
        "moon_longitude": round(moon_long, 4),
    }
