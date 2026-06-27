import { Router, Request, Response } from 'express';
import { calculateHoroscope, calculateVimshottariDasha, calculateTransit } from '../services/horoscope.service';
import { getCalendarEras } from '../lib/traditionalCalendar';
import { calculateAthiyandham } from '../lib/athiyandham';
import { calcLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

const router = Router();

// Apply stricter rate limit for calculation endpoints
router.use(calcLimiter);

router.post('/calculate', authenticate, requireSubscription, async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time, lat, lng, utcOffset, language } = req.body;

    if (!date || !time || lat === undefined || lng === undefined || utcOffset === undefined) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: date, time, lat, lng, utcOffset',
      });
      return;
    }

    const data = await calculateHoroscope(date, time, lat, lng, utcOffset, language);
    const calendarEras = getCalendarEras(date);

    // Compute birth datetime in UTC for Athiyandham
    let athiyandham: any = null;
    try {
      const [y, m, d] = (date as string).split('-').map(Number);
      const [hh, mm] = (time as string).split(':').map(Number);
      const offsetMins = Number(utcOffset) * 60;
      const localMs = Date.UTC(y, m - 1, d, hh, mm);
      const utcMs   = localMs - offsetMins * 60_000;
      athiyandham   = calculateAthiyandham(new Date(utcMs), Number(lat), Number(lng));
    } catch (e) {
      console.warn('[Athiyandham]', e);
    }

    res.json({
      success: true,
      data: { ...data, calendar_eras: calendarEras, athiyandham },
    });
  } catch (error: any) {
    console.error('[Horoscope Error]:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating horoscope',
    });
  }
});

router.post('/dasha', authenticate, requireSubscription, async (req: Request, res: Response): Promise<void> => {
  try {
    const { birth_date, moon_longitude } = req.body;

    if (!birth_date || moon_longitude === undefined) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: birth_date, moon_longitude',
      });
      return;
    }

    const data = calculateVimshottariDasha(birth_date, moon_longitude);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('[Dasha Error]:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating dasha',
    });
  }
});

router.get('/transit', authenticate, requireSubscription, async (req: Request, res: Response): Promise<void> => {
  try {
    const rasi = req.query.rasi as string;

    if (!rasi) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: rasi',
      });
      return;
    }

    const data = calculateTransit(rasi);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('[Transit Error]:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating transits',
    });
  }
});

export default router;
