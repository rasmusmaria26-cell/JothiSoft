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


# ── Compatibility Index Formula ────────────────────────────────────────────────
def calculate_compatibility_index(
    porutham_score: float,      # out of 10
    papa_diff: int,             # point difference in papasamyam
    mangal_compatible: bool,
    dasa_sandhi_severity: str   # 'none'|'mild'|'moderate'|'severe'
) -> int:
    """
    Synthesizes a 100-point compatibility score.
    - Porutham Score: 40% weight
    - Papasamyam (Papa difference <= 1): 30% weight
    - Mangal Dosha alignment: 15% weight
    - Dasa Sandhi alignment: 15% weight
    """
    # 1. Base Porutham (40%)
    base = (porutham_score / 10.0) * 40.0

    # 2. Papasamyam Difference (30%)
    if papa_diff <= 1:
        papa = 30.0
    elif papa_diff == 2:
        papa = 20.0
    elif papa_diff == 3:
        papa = 10.0
    else:
        papa = 0.0

    # 3. Mangal Dosha (15%)
    mangal = 15.0 if mangal_compatible else 0.0

    # 4. Dasa Sandhi (15%)
    sandhi_scores = {
        'none': 15.0,
        'mild': 10.0,
        'moderate': 5.0,
        'severe': 0.0
    }
    sandhi = sandhi_scores.get(dasa_sandhi_severity, 15.0)

    return round(base + papa + mangal + sandhi)


# ── Dasa Sandhi (Timeline Junction) Analysis ───────────────────────────────────
def calculate_dasa_sandhi(
    boy_birth_date: str, # ISO string
    boy_moon_long: float,
    girl_birth_date: str, # ISO string
    girl_moon_long: float
) -> dict:
    """
    Scans Vimshottari Mahadasha timeline transitions across 120 years.
    Returns overlapping sandhi junctions (clashes) under 24 months.
    """
    from datetime import date
    from .dasha import calculate_dasha_timeline

    b_dob = date.fromisoformat(boy_birth_date)
    g_dob = date.fromisoformat(girl_birth_date)

    boy_timeline = calculate_dasha_timeline(b_dob, boy_moon_long)
    girl_timeline = calculate_dasha_timeline(g_dob, girl_moon_long)

    # 1. Collect all Mahadasha transitions for boy
    boy_transitions = []
    for i, maha in enumerate(boy_timeline):
        if i < len(boy_timeline) - 1:
            next_lord = boy_timeline[i+1]["lord"]
        else:
            next_lord = "Cycle End"
        t_date = date.fromisoformat(maha["end"])
        age = round((t_date - b_dob).days / 365.25, 1)
        boy_transitions.append({
            "from_lord": maha["lord"],
            "to_lord": next_lord,
            "transition_date": t_date,
            "age": age
        })

    # 2. Collect all Mahadasha transitions for girl
    girl_transitions = []
    for i, maha in enumerate(girl_timeline):
        if i < len(girl_timeline) - 1:
            next_lord = girl_timeline[i+1]["lord"]
        else:
            next_lord = "Cycle End"
        t_date = date.fromisoformat(maha["end"])
        age = round((t_date - g_dob).days / 365.25, 1)
        girl_transitions.append({
            "from_lord": maha["lord"],
            "to_lord": next_lord,
            "transition_date": t_date,
            "age": age
        })

    # 3. Double-loop to find overlaps under 24 months (730 days)
    clashes = []
    summary_severity = "none"

    for bt in boy_transitions:
        for gt in girl_transitions:
            diff_days = abs((bt["transition_date"] - gt["transition_date"]).days)
            if diff_days <= 730:
                gap_months = round(diff_days / 30.4375, 1)
                
                # Assign severity (exactly <= 6 months, <= 12 months, <= 24 months)
                if diff_days <= 182:
                    severity = "severe"
                    advice_en = "Highly inauspicious overlap. Both partners undergo a major planetary shift within 6 months, leading to emotional destabilization. Special remedial prayers or Dasa Shanti homam is recommended."
                    advice_ta = "மிகவும் அசுபமான காலப் பொருத்தம். இருவருக்கும் 6 மாத இடைவெளிக்குள் தசா சந்தி ஏற்படுகிறது, இது உறவுகளில் பாதிப்பை ஏற்படுத்தலாம். தசா சாந்தி ஹோமம் செய்வது நன்று."
                elif diff_days <= 365:
                    severity = "moderate"
                    advice_en = "Moderate junction clash within 12 months. Indicates planetary transition vulnerability. Patience and caution during this transition year are advised."
                    advice_ta = "மத்திய தசா சந்தி. 1 வருடத்திற்குள் இருவருக்கும் தசா மாற்றம் ஏற்படுவதால், இந்த தசா காலத்தில் தம்பதியினர் எச்சரிக்கையுடனும் பொறுமையுடனும் இருக்க வேண்டும்."
                else:
                    severity = "mild"
                    advice_en = "Mild transition impact within 24 months. Generally manageable with standard patience."
                    advice_ta = "குறைந்த தசா சந்தி பாதிப்பு. 2 வருட கால இடைவெளி இருப்பதால் பெரிய பாதிப்புகள் இல்லை, நற்பலன்கள் கிட்டும்."

                # Update summary severity
                if severity == "severe":
                    summary_severity = "severe"
                elif severity == "moderate" and summary_severity != "severe":
                    summary_severity = "moderate"
                elif severity == "mild" and summary_severity not in ("severe", "moderate"):
                    summary_severity = "mild"

                clashes.append({
                    "boy_age": bt["age"],
                    "girl_age": gt["age"],
                    "boy_planet": f"{bt['from_lord']} → {bt['to_lord']}",
                    "girl_planet": f"{gt['from_lord']} → {gt['to_lord']}",
                    "clash_date": bt["transition_date"].isoformat(),
                    "severity": severity,
                    "gap_months": gap_months,
                    "advice_en": advice_en,
                    "advice_ta": advice_ta
                })

    return {
        "clashes": clashes,
        "summary_severity": summary_severity
    }

