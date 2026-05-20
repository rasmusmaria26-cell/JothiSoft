import { Router, Request, Response } from 'express';
import { getPanchapakshiCalculation } from '../services/panchapakshi.service';
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

export default router;
