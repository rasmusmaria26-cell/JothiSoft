import { Router, Request, Response } from 'express';
import { getPanchapakshiCalculation } from '../services/panchapakshi.service';
import { calculatePrasnam } from '../services/prasnam.service';
import { apiLimiter, calcLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

const router = Router();
router.use(apiLimiter);

router.post('/panchapakshi', authenticate, requireSubscription, calcLimiter, (req: Request, res: Response): void => {
  try {
    const { birth_nakshatra, lat, lng, query_datetime } = req.body;

    if (!birth_nakshatra) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: birth_nakshatra',
      });
      return;
    }

    const data = getPanchapakshiCalculation(
      birth_nakshatra,
      lat !== undefined ? parseFloat(lat) : 13.0827,
      lng !== undefined ? parseFloat(lng) : 80.2707,
      query_datetime
    );

    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating Panchapakshi',
    });
  }
});

router.post('/calculate', authenticate, requireSubscription, calcLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      question_category, 
      mode = 'aroodha_108', 
      aroodha_number, 
      clock_hour, 
      clock_minute, 
      date, 
      time, 
      lat, 
      lng, 
      utcOffset, 
      language 
    } = req.body;

    if (!question_category || !date || !time || lat === undefined || lng === undefined || utcOffset === undefined) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: question_category, date, time, lat, lng, utcOffset',
      });
      return;
    }

    // Call enhanced service
    const data = await calculatePrasnam(
      question_category,
      mode as 'aroodha_108' | 'clock',
      date,
      time,
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(utcOffset),
      aroodha_number ? parseInt(aroodha_number, 10) : undefined,
      clock_hour !== undefined ? parseInt(clock_hour, 10) : undefined,
      clock_minute !== undefined ? parseInt(clock_minute, 10) : undefined,
      language || 'ta'
    );

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('[Prasnam Calculation Error]:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating Prasnam horary chart',
    });
  }
});

export default router;
