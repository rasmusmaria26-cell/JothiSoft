"""
panchapakshi.py
Panchapatchi (Five Bird Oracle) engine for Tamil Prasnam Astrology.
Based on the Siddha system: birth nakshatra → ruling bird → daily activity.
"""
from datetime import datetime, date
import ephem

# ── Five Birds ────────────────────────────────────────────────────────────────
BIRDS = ["Vulture", "Owl", "Crow", "Cock", "Peacock"]

# Five activities the bird may be doing
ACTIVITIES = ["Ruling", "Eating", "Walking", "Dying", "Sleeping"]

# ── Birth Nakshatra → Birth Bird Mapping ──────────────────────────────────────
# Nakshatras 0–26 → bird index 0–4
NAKSHATRA_TO_BIRD: list[int] = [
    0, 1, 2, 3, 4,   # Ashwini, Bharani, Krittika, Rohini, Mrigashira
    0, 1, 2, 3, 4,   # Ardra, Punarvasu, Pushya, Ashlesha, Magha
    0, 1, 2, 3, 4,   # Purva Phalguni, Uttara Phalguni, Hasta, Chitra, Swati
    0, 1, 2, 3, 4,   # Vishakha, Anuradha, Jyeshtha, Mula, Purva Ashadha
    0, 1, 2, 3, 4,   # Uttara Ashadha, Shravana, Dhanishtha, Shatabhisha, Purva Bhadrapada
    0, 1,            # Uttara Bhadrapada, Revati
]

# ── Day Paksha Correction ─────────────────────────────────────────────────────
# Shukla Paksha (waxing) vs Krishna Paksha (waning) affects activity rotation
# Activity table: rows = weekday (0=Sun … 6=Sat), cols = activity slot
# The Panchapatchi day is divided into 5 equal slots (day + night each)
_DAY_ACTIVITY_TABLE: list[list[int]] = [
    # Sun  Mon  Tue  Wed  Thu  Fri  Sat  → weekday index
    [0,   1,   2,   3,   4,   0,   1],  # slot 1
    [1,   2,   3,   4,   0,   1,   2],  # slot 2
    [2,   3,   4,   0,   1,   2,   3],  # slot 3
    [3,   4,   0,   1,   2,   3,   4],  # slot 4
    [4,   0,   1,   2,   3,   4,   0],  # slot 5
]


# ── Sunrise / Sunset ──────────────────────────────────────────────────────────
def _get_sun_times(dt: date, lat: float, lng: float):
    observer = ephem.Observer()
    observer.lat = str(lat)
    observer.lon = str(lng)
    observer.date = dt.strftime("%Y/%m/%d 00:00:00")
    observer.horizon = "-0:34"
    sun = ephem.Sun()
    sunrise = ephem.localtime(observer.next_rising(sun))
    sunset = ephem.localtime(observer.next_setting(sun))
    return sunrise, sunset


# ── Core Calculation ──────────────────────────────────────────────────────────
def calculate_panchapakshi(
    birth_nakshatra: str,
    query_dt: datetime,
    lat: float,
    lng: float,
) -> dict:
    """
    Returns the ruling bird and current activity for a given person at a given moment.

    Args:
        birth_nakshatra: e.g. "Rohini"
        query_dt: the datetime to query (defaults to now if None)
        lat, lng: observer location for sunrise/sunset calculation
    """
    from .ephemeris import NAKSHATRAS

    try:
        nak_index = NAKSHATRAS.index(birth_nakshatra)
    except ValueError:
        raise ValueError(f"Unknown nakshatra: {birth_nakshatra}")

    birth_bird_index = NAKSHATRA_TO_BIRD[nak_index]
    birth_bird = BIRDS[birth_bird_index]

    dt = query_dt.date()
    sunrise, sunset = _get_sun_times(dt, lat, lng)

    # Determine if current time is day or night
    now = query_dt.replace(tzinfo=None)
    is_daytime = sunrise.replace(tzinfo=None) <= now < sunset.replace(tzinfo=None)

    if is_daytime:
        day_duration = (sunset - sunrise).total_seconds()
        elapsed = (now - sunrise.replace(tzinfo=None)).total_seconds()
    else:
        # Night: from sunset to next day sunrise
        next_sunrise, _ = _get_sun_times(dt + __import__("datetime").timedelta(days=1), lat, lng)
        night_duration = (next_sunrise - sunset).total_seconds()
        if now >= sunset.replace(tzinfo=None):
            elapsed = (now - sunset.replace(tzinfo=None)).total_seconds()
        else:
            elapsed = 0
        day_duration = night_duration

    # Which of 5 time slots are we in?
    slot_duration = day_duration / 5
    slot_index = min(int(elapsed / slot_duration), 4)  # 0–4

    weekday = dt.weekday()  # Mon=0 … Sun=6 (map to Sun=0 … Sat=6)
    weekday_sun_first = (weekday + 1) % 7  # Mon=1 → Sun=0

    base_activity_index = _DAY_ACTIVITY_TABLE[slot_index][weekday_sun_first]

    # Rotate activity by birth bird offset
    activity_index = (base_activity_index + birth_bird_index) % 5
    current_activity = ACTIVITIES[activity_index]

    return {
        "birth_nakshatra": birth_nakshatra,
        "birth_bird": birth_bird,
        "query_time": query_dt.isoformat(),
        "is_daytime": is_daytime,
        "time_slot": slot_index + 1,
        "current_activity": current_activity,
        "interpretation": _interpret(birth_bird, current_activity),
    }


def _interpret(bird: str, activity: str) -> str:
    """Human-readable interpretation of the bird activity for Prasnam."""
    interpretations = {
        "Ruling":   "This is your most powerful period. Excellent time to start new ventures, make decisions, or take important actions.",
        "Eating":   "A moderately favorable period. Activities related to nourishment, business transactions, and growth are supported.",
        "Walking":  "Neutral period — things are in transition. Avoid major decisions; use this time for planning and preparation.",
        "Dying":    "An inauspicious period. Avoid starting new work, signing contracts, or making important decisions right now.",
        "Sleeping": "A rest period. Your energy is low. Suitable for reflection, rest, and introspective activities only.",
    }
    return interpretations.get(activity, "")
