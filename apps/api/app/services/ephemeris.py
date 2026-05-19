"""
ephemeris.py
Core Swiss Ephemeris wrapper for JothiSoft.
Auto-downloads required SE data files on first run.
"""
import os
import math
import httpx
import swisseph as swe

# ── Ephemeris Setup ────────────────────────────────────────────────────────────
EPHE_DIR = os.path.join(os.path.dirname(__file__), "..", "ephe")

# Minimal file list for 1800–2400 CE coverage
_EPHE_FILES = [
    "sepl_18.se1",  # outer planets (Jupiter–Pluto)
    "semo_18.se1",  # Moon
    "seas_18.se1",  # asteroids
]
_EPHE_BASE_URL = "https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/"


def ensure_ephemeris_files() -> None:
    """Download ephemeris data files if they are missing."""
    os.makedirs(EPHE_DIR, exist_ok=True)
    with httpx.Client(timeout=60) as client:
        for filename in _EPHE_FILES:
            dest = os.path.join(EPHE_DIR, filename)
            if not os.path.exists(dest):
                url = f"{_EPHE_BASE_URL}{filename}"
                print(f"[ephemeris] Downloading {filename} …")
                resp = client.get(url)
                resp.raise_for_status()
                with open(dest, "wb") as f:
                    f.write(resp.content)
                print(f"[ephemeris] Saved {filename}")
    swe.set_ephe_path(EPHE_DIR)


# ── Constants ─────────────────────────────────────────────────────────────────
# swisseph planet IDs
PLANETS = {
    "Sun":     swe.SUN,
    "Moon":    swe.MOON,
    "Mars":    swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus":   swe.VENUS,
    "Saturn":  swe.SATURN,
    "Rahu":    swe.MEAN_NODE,   # North Node
}

ZODIAC_SIGNS = [
    "Mesha", "Rishabha", "Mithuna", "Kataka",
    "Simha", "Kanya", "Thula", "Vrischika",
    "Dhanus", "Makara", "Kumbha", "Meena",
]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]


# ── Julian Day ─────────────────────────────────────────────────────────────────
def get_julian_day(year: int, month: int, day: int,
                   hour: float = 0.0, minute: float = 0.0,
                   tz_offset: float = 5.5) -> float:
    """Convert a local date/time (default IST +5:30) to Julian Day (UT)."""
    ut_hour = hour + minute / 60.0 - tz_offset
    return swe.julday(year, month, day, ut_hour)


# ── Planetary Positions ────────────────────────────────────────────────────────
def get_planet_positions(jd: float) -> dict:
    """
    Returns sidereal (Lahiri ayanamsa) longitude in decimal degrees
    for all 9 Grahas (Ketu computed as Rahu + 180°).
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    positions = {}
    flags = swe.FLG_SIDEREAL | swe.FLG_SPEED

    for name, pid in PLANETS.items():
        result, _ = swe.calc_ut(jd, pid, flags)
        longitude = result[0] % 360
        positions[name] = {
            "longitude": longitude,
            "sign": ZODIAC_SIGNS[int(longitude // 30)],
            "sign_degree": longitude % 30,
            "nakshatra": NAKSHATRAS[int(longitude // (360 / 27))],
            "nakshatra_pada": int((longitude % (360 / 27)) // (360 / 108)) + 1,
        }

    # Ketu = Rahu + 180°
    rahu_long = positions["Rahu"]["longitude"]
    ketu_long = (rahu_long + 180) % 360
    positions["Ketu"] = {
        "longitude": ketu_long,
        "sign": ZODIAC_SIGNS[int(ketu_long // 30)],
        "sign_degree": ketu_long % 30,
        "nakshatra": NAKSHATRAS[int(ketu_long // (360 / 27))],
        "nakshatra_pada": int((ketu_long % (360 / 27)) // (360 / 108)) + 1,
    }

    return positions


# ── Lagna (Ascendant) ──────────────────────────────────────────────────────────
def get_lagna(jd: float, lat: float, lng: float) -> dict:
    """Calculate the sidereal Lagna (Ascendant) for the given JD and location."""
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    ayanamsa = swe.get_ayanamsa_ut(jd)

    # Tropical ascendant
    cusps, ascmc = swe.houses(jd, lat, lng, b"P")
    tropical_asc = ascmc[0]

    # Convert to sidereal
    sidereal_asc = (tropical_asc - ayanamsa) % 360
    return {
        "longitude": sidereal_asc,
        "sign": ZODIAC_SIGNS[int(sidereal_asc // 30)],
        "sign_degree": sidereal_asc % 30,
        "nakshatra": NAKSHATRAS[int(sidereal_asc // (360 / 27))],
    }
