import { Router, Request, Response } from 'express';
import { getChaldeanNumerology, calculateAge } from '../services/numerology.service';
import { apiLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

const router = Router();
router.use(apiLimiter);

router.post('/calculate', authenticate, requireSubscription, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, date_of_birth, dob, language } = req.body;
    const targetDob = dob || date_of_birth;

    if (!name || !targetDob) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: name, dob',
      });
      return;
    }

    const data = await getChaldeanNumerology(name, targetDob, language);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating numerology',
    });
  }
});

router.post('/age', authenticate, (req: Request, res: Response): void => {
  try {
    const { date_of_birth } = req.body;

    if (!date_of_birth) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameter: date_of_birth',
      });
      return;
    }

    const data = calculateAge(date_of_birth);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating age',
    });
  }
});

export default router;
