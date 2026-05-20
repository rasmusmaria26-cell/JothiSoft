import { Router, Request, Response } from 'express';
import { getSpecialDaysByType, SpecialDayType } from '../services/specialdays.service';
import NodeCache from 'node-cache';
import { apiLimiter } from '../middleware/rateLimit';

import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

// Shared cache instance for special days
export const specialDaysCache = new NodeCache({ stdTTL: 86400 * 365 }); // Cache for 1 year

const router = Router();
router.use(apiLimiter);
router.use(authenticate);
router.use(requireSubscription);

router.get('/', (req: Request, res: Response): void => {
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

    const cacheKey = `special-days:${year}`;
    const allDays = specialDaysCache.get(cacheKey);

    if (!allDays) {
      res.status(503).json({
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: `Special days for ${year} are still being computed. Please try again later.`,
      });
      return;
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

router.get('/:type', (req: Request, res: Response): void => {
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

    const cacheKey = `special-days:${year}`;
    const allDays: any = specialDaysCache.get(cacheKey);

    if (!allDays) {
      res.status(503).json({
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: `Special days for ${year} are still being computed. Please try again later.`,
      });
      return;
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
