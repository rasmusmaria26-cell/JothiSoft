import { Router, Request, Response } from 'express';
import { getKpSystem } from '../services/kp.service';
import { calcLimiter } from '../middleware/rateLimit';

import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

const router = Router();

// Apply stricter rate limit for calculation endpoints
router.use(calcLimiter);

router.post('/calculate', authenticate, requireSubscription, async (req: Request, res: Response): Promise<void> => {
  try {
    const { input, language } = req.body;

    if (!input?.date || !input?.time || input.lat === undefined || input.lng === undefined || input.utcOffset === undefined) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: birth input details',
      });
      return;
    }

    const data = await getKpSystem(input, language);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating KP system',
    });
  }
});

export default router;
