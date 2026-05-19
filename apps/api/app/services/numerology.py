"""
numerology.py
Tamil-Chaldean numerology engine for JothiSoft.
Supports Tamil Unicode character name numbers and DOB life-path calculation.
"""

# ── Chaldean Letter Values (Tamil Unicode) ────────────────────────────────────
# Each Tamil letter maps to a Chaldean value (1–8, Chaldean excludes 9)
# Grouped by Tamil character clusters
CHALDEAN_TAMIL: dict[str, int] = {
    # Vowels (உயிரெழுத்து)
    "அ": 1, "ஆ": 1, "இ": 1, "ஈ": 1, "உ": 6, "ஊ": 6,
    "எ": 5, "ஏ": 5, "ஐ": 1, "ஒ": 7, "ஓ": 7, "ஔ": 6,

    # Consonants (மெய்யெழுத்து / ஒற்றெழுத்து)
    "க": 3, "ங": 5, "ச": 3, "ஞ": 5, "ட": 4, "ண": 5,
    "த": 4, "ந": 5, "ப": 8, "ம": 4, "ய": 1, "ர": 2,
    "ல": 3, "வ": 6, "ழ": 3, "ள": 3, "ற": 2, "ன": 5,
    "ஜ": 1, "ஷ": 3, "ஸ": 3, "ஹ": 5, "க்ஷ": 3,

    # Grantha combinations (common in Tamil names)
    "ஶ": 3,

    # Common compound vowel signs are stripped; base consonant value is used.
}

# Chaldean English letter values
CHALDEAN_ENGLISH: dict[str, int] = {
    "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 8, "G": 3, "H": 5,
    "I": 1, "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 7, "P": 8,
    "Q": 1, "R": 2, "S": 3, "T": 4, "U": 6, "V": 6, "W": 6, "X": 5,
    "Y": 1, "Z": 7,
}

VOWELS_EN = set("AEIOU")

# Tamil vowel diacritics (maaththirai) — strip these before lookup
TAMIL_DIACRITICS = set("ாிீுூெேைொோௌ்ஂஃ")


def _reduce(n: int) -> int:
    """Reduce a number to a single digit (Chaldean keeps 11, 22, 33 as master)."""
    while n > 9 and n not in (11, 22, 33):
        n = sum(int(d) for d in str(n))
    return n


def _letter_value(char: str) -> int:
    """Get the Chaldean value for a single character (Tamil or English)."""
    upper = char.upper()
    if upper in CHALDEAN_ENGLISH:
        return CHALDEAN_ENGLISH[upper]
    if char in CHALDEAN_TAMIL:
        return CHALDEAN_TAMIL[char]
    if char in TAMIL_DIACRITICS:
        return 0  # diacritics contribute 0 standalone
    return 0


def _is_vowel(char: str) -> bool:
    """Check if character is a vowel (English or Tamil)."""
    if char.upper() in VOWELS_EN:
        return True
    return char in {"அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"}


# ── Core Calculations ─────────────────────────────────────────────────────────
def calculate_name_number(name: str) -> dict:
    """
    Name Number (Expression Number): sum of all letter values.
    """
    total = sum(_letter_value(c) for c in name if not c.isspace())
    reduced = _reduce(total)
    return {"raw": total, "number": reduced, "name": name}


def calculate_life_path(dob: str) -> dict:
    """
    Life Path Number: sum of all digits in DOB (YYYY-MM-DD or DD-MM-YYYY).
    """
    digits = [int(d) for d in dob if d.isdigit()]
    total = sum(digits)
    reduced = _reduce(total)
    return {"raw": total, "number": reduced, "dob": dob}


def calculate_soul_urge(name: str) -> dict:
    """
    Soul Urge Number: sum of vowel values only.
    """
    total = sum(_letter_value(c) for c in name if not c.isspace() and _is_vowel(c))
    reduced = _reduce(total)
    return {"raw": total, "number": reduced}


def calculate_destiny(name: str) -> dict:
    """
    Destiny Number: sum of consonant values only.
    """
    total = sum(
        _letter_value(c) for c in name
        if not c.isspace() and not _is_vowel(c) and _letter_value(c) > 0
    )
    reduced = _reduce(total)
    return {"raw": total, "number": reduced}


# ── Full Report ───────────────────────────────────────────────────────────────
def calculate_numerology_report(name: str, dob: str) -> dict:
    """
    Returns a complete numerology report for a given name and DOB.
    """
    return {
        "name": name,
        "dob": dob,
        "name_number": calculate_name_number(name),
        "life_path": calculate_life_path(dob),
        "soul_urge": calculate_soul_urge(name),
        "destiny": calculate_destiny(name),
    }
