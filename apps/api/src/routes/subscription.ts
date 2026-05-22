import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(apiLimiter);

// Fixed subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'FREE',
    name: 'Free Plan',
    name_ta: 'இலவச திட்டம்',
    price: 0,
    features: ['Daily Panchangam', 'Star Matching'],
    features_ta: ['தினசரி பஞ்சாங்கம்', 'நட்சத்திர பொருத்தம்'],
  },
  {
    id: 'PRO',
    name: 'PRO Monthly',
    name_ta: 'புரோ மாதாந்திர சந்தா',
    price: 299, // INR
    features: [
      'Daily & Monthly Panchangam',
      'Detailed Horoscope birth charts',
      'Advanced Star & Chart Matching',
      'Chaldean Numerology calculations',
      'KP Astrology position mapping',
      'Vastu Auspicious Days & Manaiyadi calculator',
      'Auspicious Special Days lookup',
    ],
    features_ta: [
      'தினசரி மற்றும் மாதாந்திர பஞ்சாங்கம்',
      'விரிவான ஜாதக கட்டம்',
      'மேம்பட்ட நட்சத்திர மற்றும் ஜாதக பொருத்தம்',
      'சாங்கிய எண் கணிதம்',
      'KP ஜோதிட கிரக நிலைகள்',
      'வாஸ்து நாட்கள் மற்றும் மனையடி சாஸ்திரம்',
      'விசேஷ நாட்கள் பட்டியல்',
    ],
  },
];

/**
 * GET /api/subscription/plans
 * Return available subscription plans
 */
router.get('/plans', (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: SUBSCRIPTION_PLANS,
  });
});

/**
 * GET /api/subscription/status
 * Get current user's subscription plan and expiry
 */
router.get('/status', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, expires_at, trial_expires_at, created_at')
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error || !subscription) {
      // Default to FREE if no subscription row exists
      res.json({
        success: true,
        data: {
          plan: 'FREE',
          expires_at: null,
          trial_expires_at: null,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred fetching subscription status',
    });
  }
});

export default router;
