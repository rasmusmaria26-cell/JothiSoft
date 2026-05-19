"""
dasha.py
Vimshottari Dasha engine for Tamil Astrology.
Calculates Mahadasha, Antardasha (Bhukti) timelines from birth Nakshatra.
"""
from datetime import date, timedelta
from .ephemeris import get_julian_day, get_planet_positions, NAKSHATRAS

# ── Dasha Lord Sequence & Years ────────────────────────────────────────────────
# Starting lord based on birth nakshatra index (0–26)
# Sequence: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]

# Total dasha years for each lord (Vimshottari = 120 years total)
DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
    "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}

# Which dasha lord starts for each nakshatra (index 0–26)
NAKSHATRA_DASHA_LORD = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury",  # 0–8
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury",  # 9–17
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury",  # 18–26
]


# ── Balance of Dasha at Birth ──────────────────────────────────────────────────
def _dasha_balance(moon_longitude: float) -> tuple[str, float]:
    """
    Returns (dasha_lord, remaining_years) at the moment of birth.
    The remaining fraction is determined by position within the nakshatra.
    """
    nakshatra_index = int(moon_longitude / (360 / 27))
    nakshatra_span = 360 / 27         # 13.333...°
    degrees_in_nak = moon_longitude % nakshatra_span

    lord = NAKSHATRA_DASHA_LORD[nakshatra_index]
    total_years = DASHA_YEARS[lord]

    # Fraction elapsed within the nakshatra
    elapsed_fraction = degrees_in_nak / nakshatra_span
    remaining_years = total_years * (1 - elapsed_fraction)
    return lord, remaining_years


# ── Generate Full Dasha Timeline ───────────────────────────────────────────────
def _dasha_sequence_from(lord: str) -> list[str]:
    """Returns the ordered dasha sequence starting from the given lord."""
    start_index = DASHA_LORDS.index(lord)
    return DASHA_LORDS[start_index:] + DASHA_LORDS[:start_index]


def calculate_dasha_timeline(birth_date: date, moon_longitude: float, years: int = 120) -> list[dict]:
    """
    Returns a list of Mahadasha periods with nested Antardasha (Bhukti) entries.
    Covers `years` years from birth_date (default 120 = full Vimshottari cycle).
    """
    first_lord, remaining_years = _dasha_balance(moon_longitude)
    sequence = _dasha_sequence_from(first_lord)

    timeline = []
    current_date = birth_date
    cutoff = date(birth_date.year + years, birth_date.month, birth_date.day)

    for i, maha_lord in enumerate(sequence):
        maha_years = remaining_years if i == 0 else DASHA_YEARS[maha_lord]
        maha_days = int(maha_years * 365.25)
        maha_end = current_date + timedelta(days=maha_days)

        if current_date > cutoff:
            break

        # ── Antardasha (Bhukti) within this Mahadasha ──────────────────────
        antara_sequence = _dasha_sequence_from(maha_lord)
        antara_list = []
        antara_start = current_date

        for antara_lord in antara_sequence:
            # Antardasha fraction: (maha_years × antara_years) / 120
            antara_years = (maha_years * DASHA_YEARS[antara_lord]) / 120.0
            antara_days = int(antara_years * 365.25)
            antara_end = antara_start + timedelta(days=antara_days)

            antara_list.append({
                "lord": antara_lord,
                "start": antara_start.isoformat(),
                "end": antara_end.isoformat(),
                "years": round(antara_years, 2),
            })
            antara_start = antara_end
            if antara_start >= maha_end:
                break

        timeline.append({
            "lord": maha_lord,
            "start": current_date.isoformat(),
            "end": maha_end.isoformat(),
            "years": round(maha_years, 2),
            "antaradasha": antara_list,
        })

        current_date = maha_end

    return timeline


def calculate_current_dasha(
    birth_date: date, moon_longitude: float, reference_date: date | None = None
) -> dict:
    """Returns the active Mahadasha and Antardasha for today (or reference_date)."""
    ref = reference_date or date.today()
    timeline = calculate_dasha_timeline(birth_date, moon_longitude, years=120)

    for maha in timeline:
        maha_start = date.fromisoformat(maha["start"])
        maha_end = date.fromisoformat(maha["end"])
        if maha_start <= ref < maha_end:
            current_maha = maha
            # Find current antardasha
            for antara in maha["antaradasha"]:
                a_start = date.fromisoformat(antara["start"])
                a_end = date.fromisoformat(antara["end"])
                if a_start <= ref < a_end:
                    return {
                        "mahadasha": maha_start.isoformat(),
                        "mahadasha_lord": maha["lord"],
                        "mahadasha_end": maha_end.isoformat(),
                        "antardasha_lord": antara["lord"],
                        "antardasha_end": a_end.isoformat(),
                    }
    return {}
