import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { citiesLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(citiesLimiter);

// Endpoint: /api/cities
// Search cities by name (case insensitive)
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawQuery = (req.query.q as string || '').trim();
    const query = rawQuery.replace(/[^\p{L}\p{N}\s.\-']/gu, '');
    
    if (query.length === 0) {
      res.json([]);
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .or(`name.ilike.%${query}%,ascii_name.ilike.%${query}%`)
      .order('population', { ascending: false, nullsFirst: false })
      .limit(10);

    if (error) {
      console.error('[Cities Route] Error fetching cities:', error);
      res.status(500).json({ success: false, error: 'DATABASE_ERROR' });
      return;
    }

    const mapped = (data || []).map(city => ({
      ...city,
      country: 'India'
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
});

export default router;
