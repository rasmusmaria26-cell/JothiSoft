import sys
import os

# Load .env variables manually to avoid KeyError
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.routers.calc import get_cached_monthly_panchangam
try:
    print("Testing Monthly Panchangam service...")
    # Calculate for May 2026 for Chennai (UTC+5.5)
    res = get_cached_monthly_panchangam(2026, 5, 13.0827, 80.2707, 5.5)
    print("SUCCESS: Computed days:", len(res))
    if len(res) > 0:
        first_day = res[0]
        print("First Day date:", first_day["date"])
        print("First Day day_of_week:", first_day["day_of_week"])
        print("First Day day_of_week_ta length:", len(first_day["day_of_week_ta"]))
        print("First Day tithi:", first_day["tithi"])
        print("First Day tithi_ta length:", len(first_day["tithi_ta"]))
        print("First Day paksha:", first_day["paksha"])
        print("First Day paksha_ta length:", len(first_day["paksha_ta"]))
        print("First Day nakshatra:", first_day["nakshatra"])
        print("First Day nakshatra_ta length:", len(first_day["nakshatra_ta"]))
        print("First Day yogam:", first_day["yogam"])
        print("First Day yogam_ta length:", len(first_day["yogam_ta"]))
        print("First Day karanam:", first_day["karanam"])
        print("First Day karanam_ta length:", len(first_day["karanam_ta"]))
        print("First Day rahu_kalam:", first_day["rahu_kalam"])
        print("First Day sunrise:", first_day["sunrise"])
        print("First Day sunset:", first_day["sunset"])
        
        # Verify planetary longitudes are NOT present to prevent heavy payloads
        has_longitudes = "sun_longitude" in first_day or "moon_longitude" in first_day
        print("Lightweight Payload Check (No planetary coordinates):", "PASSED" if not has_longitudes else "FAILED")
except Exception as e:
    import traceback
    print("ERROR:")
    traceback.print_exc()
