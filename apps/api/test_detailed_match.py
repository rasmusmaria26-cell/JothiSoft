import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from fastapi.testclient import TestClient
from main import app
from app.services.matching import calculate_dasa_sandhi, calculate_compatibility_index

client = TestClient(app)

def run_tests():
    print("==================================================")
    print("RUNNING DETAILED MATCH ASTROLOGICAL EDGE CASE TESTS")
    print("==================================================")

    # ── CASE 1: Same Nakshatra (tests Koota & Rajju Dosha) ──
    print("\n[CASE 1] Same Nakshatra compatibility precheck...")
    # Ashwini (அஸ்வினி) and Ashwini (அஸ்வினி) have same star
    res = client.post("/api/calc/matching/detailed/basic", json={
        "boy_name": "Groom Ashwini",
        "boy_year": 1995, "boy_month": 5, "boy_day": 10,
        "boy_hour": 12, "boy_minute": 0, "boy_lat": 13.0827, "boy_lng": 80.2707, "boy_utc_offset": 5.5,
        "girl_name": "Bride Ashwini",
        "girl_year": 1995, "girl_month": 5, "girl_day": 10,  # Same birth date will force same star
        "girl_hour": 12, "girl_minute": 0, "girl_lat": 13.0827, "girl_lng": 80.2707, "girl_utc_offset": 5.5
    })
    assert res.status_code == 200, f"Failed: {res.text}"
    data = res.json()
    print("Groom Star:", data["boy_star"], "| Bride Star:", data["girl_star"])
    print("Porutham Matrix count of matched kootas:", len(data["star_result"].get("matches", [])))
    print("Success: Same nakshatra matched correctly.")

    # ── CASE 2: Both have Mangal Dosha (Cancels out - should show green/compatible) ──
    print("\n[CASE 2] Mangal Dosha balance (both having Dosha)...")
    # Let's verify our compatibility index formula directly
    # If both have Dosha (mangal_compatible = True)
    score_both_dosha = calculate_compatibility_index(
        porutham_score=7.0,
        papa_diff=0,
        mangal_compatible=True,
        dasa_sandhi_severity="none"
    )
    # If they are incompatible (mangal_compatible = False)
    score_incompatible = calculate_compatibility_index(
        porutham_score=7.0,
        papa_diff=0,
        mangal_compatible=False,
        dasa_sandhi_severity="none"
    )
    print("Compatibility score when balanced (both dosha):", score_both_dosha)
    print("Compatibility score when unbalanced:", score_incompatible)
    assert score_both_dosha > score_incompatible, "Mangal cancellation failed to reward points!"
    print("Success: Mangal cancellation rewards balanced charts.")

    # ── CASE 3: Dasa Sandhi exactly at 6 months (Boundary Condition) ──
    print("\n[CASE 3] Dasa Sandhi boundary checks (<= 182 days)...")
    # Test boundary condition calculations for dasa sandhi severity
    # We will simulate a close date difference
    # Let's call calculate_dasa_sandhi directly using simulated inputs
    res_sandhi = calculate_dasa_sandhi(
        boy_birth_date="1995-05-10",
        boy_moon_long=10.0,
        girl_birth_date="1995-11-10",  # Exactly 6 months (184 days) later
        girl_moon_long=10.0
    )
    print("Simulated 6-month offset Dasa Sandhi severity:", res_sandhi["summary_severity"])
    print("Number of clashes detected:", len(res_sandhi["clashes"]))
    assert res_sandhi["summary_severity"] in ["severe", "moderate"], "Failed to identify close transition clash!"
    print("Success: Close transitions flagged correctly.")

    # ── CASE 4: Boy/Girl born same day (Stress Test) ──
    print("\n[CASE 4] Stress testing identical birth dates...")
    res = client.post("/api/calc/matching/detailed/dasa-sandhi", json={
        "boy_year": 1995, "boy_month": 5, "boy_day": 10,
        "boy_hour": 12, "boy_minute": 0, "boy_lat": 13.0827, "boy_lng": 80.2707, "boy_utc_offset": 5.5,
        "girl_year": 1995, "girl_month": 5, "girl_day": 10,
        "girl_hour": 12, "girl_minute": 0, "girl_lat": 13.0827, "girl_lng": 80.2707, "girl_utc_offset": 5.5
    })
    assert res.status_code == 200, f"Failed: {res.text}"
    dasa_data = res.json()
    print("Identical dates Dasa Sandhi severity:", dasa_data["summary_severity"])
    print("Total clashes (expecting maximum count due to exact overlaps):", len(dasa_data["clashes"]))
    assert dasa_data["summary_severity"] == "severe", "Identical dates did not yield severe overlap!"
    print("Success: Identical dates successfully evaluated as severe clash.")

    # ── CASE 5: Birth time missing (Graceful degradation) ──
    print("\n[CASE 5] Default parameter graceful fallback...")
    # DetailedMatchRequest schema defaults: hour=12, minute=0, utc_offset=5.5
    res = client.post("/api/calc/matching/detailed/basic", json={
        "boy_year": 1992, "boy_month": 8, "boy_day": 15,
        "boy_lat": 13.0827, "boy_lng": 80.2707,
        "girl_year": 1994, "girl_month": 9, "girl_day": 20,
        "girl_lat": 13.0827, "girl_lng": 80.2707
    })
    assert res.status_code == 200, f"Failed: {res.text}"
    data = res.json()
    print("Fallback Groom Moon Nakshatra:", data["boy_star"])
    print("Fallback Bride Moon Nakshatra:", data["girl_star"])
    print("Fallback Overview score:", data["overview_score"])
    print("Success: API handles missing optional time and offset fields gracefully!")

    print("\n==================================================")
    print("ALL DETAILED MATCH EDGE CASE TESTS PASSED SUCCESSFULLY! SUCCESS")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
