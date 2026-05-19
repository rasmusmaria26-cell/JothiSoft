"""
horoscope.py
Rasi (D1) and Navamsam (D9) chart engine for Tamil Jathagam.
"""
from .ephemeris import get_julian_day, get_planet_positions, get_lagna, ZODIAC_SIGNS
from .predictions import generate_predictions

# ── House Placement ────────────────────────────────────────────────────────────
def _house_from_lagna(planet_sign_index: int, lagna_sign_index: int) -> int:
    """Returns the house number (1–12) of a planet relative to the Lagna."""
    return ((planet_sign_index - lagna_sign_index) % 12) + 1


def _navamsam_sign(longitude: float) -> str:
    """
    Navamsam (D9) sign calculation.
    Each zodiac sign (30°) is divided into 9 parts (3°20' each).
    The starting navamsam sign differs by element group:
      Fire signs (1,5,9)  → start at Mesha
      Earth signs (2,6,10) → start at Makara
      Air signs (3,7,11)  → start at Thula
      Water signs (4,8,12) → start at Kataka
    """
    sign_index = int(longitude // 30)     # 0-based sign (0=Mesha)
    degree_in_sign = longitude % 30

    navamsam_index = int(degree_in_sign / (30 / 9))  # 0-8

    # Starting navamsam by element
    element = sign_index % 4  # 0=Fire, 1=Earth, 2=Air, 3=Water
    start_map = {0: 0, 1: 9, 2: 6, 3: 3}  # Mesha=0, Makara=9, Thula=6, Kataka=3
    d9_sign_index = (start_map[element] + navamsam_index) % 12
    return ZODIAC_SIGNS[d9_sign_index]


# ── Rasi Chart (D1) ────────────────────────────────────────────────────────────
def build_rasi_chart(positions: dict, lagna: dict) -> dict:
    """
    Returns house-wise planet placement for the Rasi chart.
    Output: { "house_1": ["Lagna", "Sun"], "house_2": [], ... }
    """
    lagna_sign_index = ZODIAC_SIGNS.index(lagna["sign"])
    chart = {f"house_{i}": [] for i in range(1, 13)}

    # Place Lagna
    chart["house_1"].append("Lagna")

    for planet, data in positions.items():
        sign_index = ZODIAC_SIGNS.index(data["sign"])
        house = _house_from_lagna(sign_index, lagna_sign_index)
        chart[f"house_{house}"].append(planet)

    return chart


# ── Navamsam Chart (D9) ────────────────────────────────────────────────────────
def build_navamsam_chart(positions: dict, lagna: dict) -> dict:
    """
    Returns house-wise planet placement for the Navamsam (D9) chart.
    """
    lagna_d9_sign = _navamsam_sign(lagna["longitude"])
    lagna_d9_sign_index = ZODIAC_SIGNS.index(lagna_d9_sign)
    chart = {f"house_{i}": [] for i in range(1, 13)}

    chart["house_1"].append("Lagna")

    for planet, data in positions.items():
        d9_sign = _navamsam_sign(data["longitude"])
        d9_sign_index = ZODIAC_SIGNS.index(d9_sign)
        house = _house_from_lagna(d9_sign_index, lagna_d9_sign_index)
        chart[f"house_{house}"].append(planet)

    return chart


# ── Planet Details Table ───────────────────────────────────────────────────────
def build_planet_table(positions: dict, lagna: dict) -> list[dict]:
    """
    Returns a flat list of planet details for table display.
    Each entry: { planet, sign, sign_degree, house, nakshatra, pada }
    """
    lagna_sign_index = ZODIAC_SIGNS.index(lagna["sign"])
    table = [{
        "planet": "Lagna",
        "sign": lagna["sign"],
        "sign_degree": round(lagna["sign_degree"], 2),
        "house": 1,
        "nakshatra": lagna["nakshatra"],
        "pada": None,
    }]

    for planet, data in positions.items():
        sign_index = ZODIAC_SIGNS.index(data["sign"])
        table.append({
            "planet": planet,
            "sign": data["sign"],
            "sign_degree": round(data["sign_degree"], 2),
            "house": _house_from_lagna(sign_index, lagna_sign_index),
            "nakshatra": data["nakshatra"],
            "pada": data["nakshatra_pada"],
        })

    return table


# ── Full Horoscope ─────────────────────────────────────────────────────────────
def calculate_horoscope(
    year: int, month: int, day: int,
    hour: int, minute: int,
    lat: float, lng: float,
    tz_offset: float = 5.5,
) -> dict:
    """Returns a complete horoscope dict: lagna, planets, D1, D9 charts."""
    jd = get_julian_day(year, month, day, hour, minute, tz_offset)
    positions = get_planet_positions(jd)
    lagna = get_lagna(jd, lat, lng)

    moon_data = positions.get("Moon", {})
    moon_sign = moon_data.get("sign", "")
    moon_nakshatra = moon_data.get("nakshatra", "")
    lagna_sign = lagna.get("sign", "")

    return {
        "lagna": lagna,
        "planets": build_planet_table(positions, lagna),
        "rasi_chart": build_rasi_chart(positions, lagna),
        "navamsam_chart": build_navamsam_chart(positions, lagna),
        "predictions": generate_predictions(lagna_sign, moon_sign, moon_nakshatra),
    }
