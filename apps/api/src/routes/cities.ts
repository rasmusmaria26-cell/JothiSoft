import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(apiLimiter);

// Endpoint: /api/cities
// Search cities by name (case insensitive)
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length === 0) {
      res.json([]);
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .ilike('name', `${query.trim()}%`)
      .order('population', { ascending: false, nullsFirst: false })
      .limit(10);

    if (error) {
      console.error('[Cities Route] Error fetching cities:', error);
      res.status(500).json({ success: false, error: 'DATABASE_ERROR' });
      return;
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
});

export default router;
