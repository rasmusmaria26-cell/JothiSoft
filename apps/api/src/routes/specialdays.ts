import { Router, Request, Response } from 'express';
import { getSpecialDaysByType, SpecialDayType, computeSpecialDaysForYear } from '../services/specialdays.service';
import { getLocalPanchangam } from '../services/localPanchangam.service';
import NodeCache from 'node-cache';
import { apiLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

// Shared cache instance for special days
export const specialDaysCache = new NodeCache({ stdTTL: 86400 * 365 }); // Cache for 1 year

const router = Router();
router.use(apiLimiter);

// Public route - get today's tithi and special day
router.get('/today', async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string) || 13.0827;
    const lng = parseFloat(req.query.lng as string) || 80.2707;
    const utcOffset = parseFloat(req.query.utcOffset as string) || 5.5;

    // Use current local time
    const now = new Date();
    
    // Traditional tithi of the day is the tithi prevailing at sunrise (approx 06:00 AM)
    const sunriseTime = new Date(now);
    sunriseTime.setHours(6, 0, 0, 0);

    const panchang = getLocalPanchangam(sunriseTime);

    // Formatted date string for today: YYYY-MM-DD
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Search computed special days for today
    const year = now.getFullYear();
    
    const cacheKey = `special-days-v4:${year}`;
    let allSpecialDays = specialDaysCache.get<any[]>(cacheKey);

    if (!allSpecialDays) {
      allSpecialDays = await computeSpecialDaysForYear(year, lat, lng, utcOffset);
      specialDaysCache.set(cacheKey, allSpecialDays);
    }
    
    const todaySpecial = allSpecialDays.find(d => d.date === dateStr);

    res.json({
      success: true,
      data: {
        date: dateStr,
        tithi: {
          index: panchang.tithi.index,
          name_en: panchang.tithi.name,
          name_ta: panchang.tithi.name_ta,
          paksha: panchang.tithi.paksha,
          paksha_ta: panchang.tithi.paksha_ta
        },
        nakshatra: {
          index: panchang.nakshatra.index,
          name_en: panchang.nakshatra.name,
          name_ta: panchang.nakshatra.name_ta
        },
        special_day: todaySpecial || null
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while fetching today\'s panchang'
    });
  }
});

// Authenticated/Subscribed routes follow
router.use(authenticate);
router.use(requireSubscription);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string, 10);

    if (isNaN(year)) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing or invalid required query parameter: year',
      });
      return;
    }

    const cacheKey = `special-days-v4:${year}`;
    let allDays = specialDaysCache.get<any[]>(cacheKey);

    if (!allDays) {
      console.log(`[server]: Cache miss for special days in ${year}. Computing locally on demand...`);
      allDays = await computeSpecialDaysForYear(year, 13.0827, 80.2707, 5.5);
      specialDaysCache.set(cacheKey, allDays);
    }

    res.json({
      success: true,
      data: allDays,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while fetching special days',
    });
  }
});

router.get('/:type', async (req: Request, res: Response): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string, 10);
    const type = req.params.type as SpecialDayType;

    if (isNaN(year)) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing or invalid required query parameter: year',
      });
      return;
    }

    const cacheKey = `special-days-v4:${year}`;
    let allDays = specialDaysCache.get<any[]>(cacheKey);

    if (!allDays) {
      console.log(`[server]: Cache miss for special days in ${year} by type. Computing locally on demand...`);
      allDays = await computeSpecialDaysForYear(year, 13.0827, 80.2707, 5.5);
      specialDaysCache.set(cacheKey, allDays);
    }

    const filteredDays = getSpecialDaysByType(allDays, type);

    res.json({
      success: true,
      data: filteredDays,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while fetching special days by type',
    });
  }
});

export default router;
