import { Router, Request, Response } from 'express';
import { getVastuDays, getVastuDayById, checkManaiyadiDimension } from '../services/vastu.service';
import { apiLimiter } from '../middleware/rateLimit';

import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';

const router = Router();

// We use the basic apiLimiter since these are simple local lookups/calculations
router.use(apiLimiter);
router.use(authenticate);
router.use(requireSubscription);

router.get('/days', (req: Request, res: Response): void => {
  try {
    const year = parseInt(req.query.year as any, 10);
    
    if (isNaN(year)) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing or invalid required query parameter: year',
      });
      return;
    }

    const data = getVastuDays(year);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    if (error.message.includes('VASTU_DATA_NOT_FOUND')) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while fetching Vastu days',
    });
  }
});

router.get('/days/:id', (req: Request, res: Response): void => {
  try {
    const year = parseInt(req.query.year as any, 10);
    const id = parseInt(req.params.id as any, 10);
    
    if (isNaN(year) || isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing or invalid required parameters: year query and id param',
      });
      return;
    }

    const data = getVastuDayById(year, id);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    if (error.message.includes('NOT_FOUND')) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while fetching Vastu day details',
    });
  }
});

router.post('/manaiyadi', (req: Request, res: Response): void => {
  try {
    const { feet, inches } = req.body;

    if (feet === undefined || inches === undefined || typeof feet !== 'number' || typeof inches !== 'number') {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing or invalid required parameters: feet and inches must be numbers',
      });
      return;
    }

    const data = checkManaiyadiDimension(feet, inches);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while checking Manaiyadi dimensions',
    });
  }
});

export default router;
