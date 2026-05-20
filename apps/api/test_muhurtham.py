import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.muhurtham import calculate_muhurtham
try:
    print("Testing Muhurtham service...")
    # Calculate for May 2026 for Marriage in Chennai
    res = calculate_muhurtham(2026, 5, "marriage", 13.0827, 80.2707)
    print("SUCCESS: Computed days:", len(res))
    if len(res) > 0:
        first_day = res[0]
        print("First Day date:", first_day["date"])
        print("First Day weekday:", first_day["weekday"])
        print("First Day status:", first_day["status"])
        print("First Day event_score:", first_day["event_score"])
        print("First Day description_en:", first_day["description_en"])
        print("First Day description_ta (safe length):", len(first_day["description_ta"]))
        print("First Day rahu_kalam:", first_day["rahu_kalam"])
        print("First Day gowri_slots count:", len(first_day["gowri_slots"]))
except Exception as e:
    import traceback
    print("ERROR:")
    traceback.print_exc()
