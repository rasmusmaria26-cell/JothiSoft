import { Router, Request, Response } from 'express';
import { getNakshatraPorutham, getChartMatching, getMangalDosha, calculateHoroscopeMatching, calculateStarMatching } from '../services/matching.service';
import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';
import { calcLimiter, apiLimiter } from '../middleware/rateLimit';

const router = Router();

// Apply standard rate limit globally to the matching router
router.use(apiLimiter);

router.post('/star', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { boy, girl, boy_star, girl_star, language } = req.body;

    // Check if star names are provided for local deterministic matching
    if (boy_star && girl_star) {
      const data = calculateStarMatching(boy_star, girl_star);
      res.json(data);
      return;
    }

    if (boy?.nakshatra === undefined || boy?.pada === undefined || girl?.nakshatra === undefined || girl?.pada === undefined) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: boy_star and girl_star, or boy/girl nakshatra and pada',
      });
      return;
    }

    const data = await getNakshatraPorutham(boy, girl, language);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating star matching',
    });
  }
});

router.post('/chart', authenticate, requireSubscription, calcLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { boy, girl, language } = req.body;

    if (!boy?.date || !boy?.time || boy.lat === undefined || boy.lng === undefined || boy.utcOffset === undefined ||
        !girl?.date || !girl?.time || girl.lat === undefined || girl.lng === undefined || girl.utcOffset === undefined) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters for boy or girl birth details',
      });
      return;
    }

    const data = await getChartMatching(boy, girl, language);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while calculating chart matching',
    });
  }
});

router.post('/mangal', authenticate, requireSubscription, calcLimiter, async (req: Request, res: Response): Promise<void> => {
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

    const data = await getMangalDosha(input, language);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while checking mangal dosha',
    });
  }
});

router.post('/calculate', authenticate, requireSubscription, calcLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { boy_horoscope, girl_horoscope } = req.body;

    if (!boy_horoscope || !girl_horoscope) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required parameters: boy_horoscope and girl_horoscope',
      });
      return;
    }

    const data = calculateHoroscopeMatching(boy_horoscope, girl_horoscope);

    res.json(data);
  } catch (error: any) {
    console.error('[Matching Error]:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while matching horoscopes',
    });
  }
});

export default router;
