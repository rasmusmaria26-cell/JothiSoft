import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.transit import calculate_transit
try:
    res = calculate_transit("Mesha")
    print("SUCCESS:", res.keys())
    print(res["transits"]["Saturn"])
except Exception as e:
    import traceback
    print("ERROR:")
    traceback.print_exc()
