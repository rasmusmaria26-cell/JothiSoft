"""
matching.py
Nakshatra Porutham (Star Compatibility) engine for Tamil Astrology.
Reads the 27x27 compatibility matrix from Supabase for all 10 porutham types.
"""
import os
from supabase import create_client, Client

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

# ── Porutham Definitions ───────────────────────────────────────────────────────
PORUTHAM_TYPES = [
    "dinam",
    "ganam",
    "mahendram",
    "stree_dirgham",
    "yoni",
    "rasi",
    "rajju",
    "vedha",
    "vasya",
    "varna",
]

# Score weights (out of 10) — Rajju and Vedha are binary (must pass)
PORUTHAM_WEIGHTS = {
    "dinam": 1, "ganam": 1, "mahendram": 1, "stree_dirgham": 1, "yoni": 1,
    "rasi": 1, "rajju": 2, "vedha": 1, "vasya": 1, "varna": 0.5,
}

MAX_SCORE = sum(PORUTHAM_WEIGHTS.values())  # 10.5 — normalised to 10


def _get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


# ── Nakshatra Porutham Matrix Lookup ──────────────────────────────────────────
def _fetch_porutham_row(boy_star_index: int, girl_star_index: int) -> dict | None:
    """Fetches a single row from the nakshatra_porutham_matrix table in Supabase."""
    db = _get_supabase()
    resp = (
        db.table("nakshatra_porutham_matrix")
        .select("*")
        .eq("boy_star_index", boy_star_index)
        .eq("girl_star_index", girl_star_index)
        .single()
        .execute()
    )
    return resp.data


# ── Poruthams Calculation ─────────────────────────────────────────────────────
def calculate_star_match(boy_star: str, girl_star: str) -> dict:
    """
    Returns the 10-porutham compatibility score for two nakshatras.
    `boy_star` and `girl_star` must match the nakshatra names in the DB.
    """
    from .ephemeris import NAKSHATRAS
    try:
        boy_index = NAKSHATRAS.index(boy_star)
        girl_index = NAKSHATRAS.index(girl_star)
    except ValueError as e:
        raise ValueError(f"Invalid nakshatra name: {e}")

    row = _fetch_porutham_row(boy_index, girl_index)
    if not row:
        raise ValueError(f"No compatibility data found for {boy_star} × {girl_star}")

    results = []
    raw_score = 0.0
    for ptype in PORUTHAM_TYPES:
        passed = bool(row.get(ptype, False))
        weight = PORUTHAM_WEIGHTS[ptype]
        earned = weight if passed else 0
        raw_score += earned
        results.append({
            "type": ptype,
            "passed": passed,
            "weight": weight,
            "score": earned,
        })

    # Rajju / Vedha are eliminatory doshas
    rajju_ok = bool(row.get("rajju", True))
    vedha_ok = bool(row.get("vedha", True))
    dosha_free = rajju_ok and vedha_ok

    score_percent = round((raw_score / MAX_SCORE) * 100)
    if not dosha_free:
        score_percent = min(score_percent, 49)  # hard cap if eliminatory dosha fails

    verdict = (
        "Excellent" if score_percent >= 75 else
        "Good" if score_percent >= 60 else
        "Average" if score_percent >= 45 else
        "Not Recommended"
    )

    return {
        "boy_star": boy_star,
        "girl_star": girl_star,
        "poruthams": results,
        "score_percent": score_percent,
        "dosha_free": dosha_free,
        "verdict": verdict,
    }


# ── Horoscope Matching (Papasamyam + Mangal Dosha) ───────────────────────────
def _detect_mangal_dosha(chart: dict) -> bool:
    """
    Sevvai (Mars) Dosham: Mars in houses 1, 2, 4, 7, 8, or 12.
    """
    rasi_chart = chart.get("rasi_chart", {})
    for house_num in [1, 2, 4, 7, 8, 12]:
        house_key = f"house_{house_num}"
        if "Mars" in rasi_chart.get(house_key, []):
            return True
    return False


def _calculate_papa_score(chart: dict) -> int:
    """
    Papasamyam: Count affliction points from malefic planets in sensitive houses.
    Malefics: Sun, Mars, Saturn, Rahu, Ketu.
    Houses checked: 1, 2, 4, 7, 8, 12.
    """
    malefics = {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}
    rasi_chart = chart.get("rasi_chart", {})
    score = 0
    for house_num in [1, 2, 4, 7, 8, 12]:
        house_key = f"house_{house_num}"
        for planet in rasi_chart.get(house_key, []):
            if planet in malefics:
                score += 1
    return score


def calculate_horoscope_match(boy_chart: dict, girl_chart: dict) -> dict:
    """
    Returns a full horoscope compatibility analysis.
    Includes Papasamyam check and Mangal Dosha detection.
    """
    boy_papa = _calculate_papa_score(boy_chart)
    girl_papa = _calculate_papa_score(girl_chart)
    papa_diff = abs(boy_papa - girl_papa)
    papasamyam_ok = papa_diff <= 1  # within 1 point is acceptable

    boy_mangal = _detect_mangal_dosha(boy_chart)
    girl_mangal = _detect_mangal_dosha(girl_chart)
    mangal_compatible = (boy_mangal == girl_mangal)  # both dosha or both clean

    return {
        "papasamyam": {
            "boy_score": boy_papa,
            "girl_score": girl_papa,
            "difference": papa_diff,
            "compatible": papasamyam_ok,
        },
        "mangal_dosha": {
            "boy_has_dosha": boy_mangal,
            "girl_has_dosha": girl_mangal,
            "compatible": mangal_compatible,
        },
        "overall_compatible": papasamyam_ok and mangal_compatible,
    }
