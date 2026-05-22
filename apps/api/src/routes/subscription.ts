import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { timingSafeEqual, createHmac } from 'crypto';
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
 * POST /api/subscription/create-order
 * Create a Razorpay order using direct HTTP fetch to Razorpay API (dependency-free)
 */
router.post('/create-order', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId } = req.body;
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

    if (!plan || plan.id === 'FREE') {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid plan selected for purchase',
      });
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !secret || keyId === 'rzp_test_xxx') {
      // In development/test mode without keys, return a mocked order ID
      res.json({
        success: true,
        data: {
          id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
          amount: plan.price * 100,
          currency: 'INR',
          receipt: `receipt_user_${req.user.id.substring(0, 8)}`,
          mock: true
        }
      });
      return;
    }

    // Call Razorpay API
    const authString = Buffer.from(`${keyId}:${secret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.price * 100, // in paisa
        currency: 'INR',
        receipt: `receipt_user_${req.user.id.substring(0, 8)}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      res.status(502).json({
        success: false,
        error: 'RAZORPAY_GATEWAY_ERROR',
        message: errorData.error?.description || 'Failed to create order on Razorpay',
      });
      return;
    }

    const orderData = await response.json();
    res.json({
      success: true,
      data: orderData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred creating payment order',
    });
  }
});

/**
 * POST /api/subscription/verify
 * Cryptographically verify Razorpay payment and activate PRO subscription in Supabase
 */
router.post('/verify', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Order ID, Payment ID, and Signature are required',
      });
      return;
    }

    // 1. Signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret && !razorpay_order_id.startsWith('order_mock_')) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      // Use timingSafeEqual to prevent timing attacks after verifying identical lengths
      const expectedBuffer = Buffer.from(expected);
      const signatureBuffer = Buffer.from(razorpay_signature);

      if (expectedBuffer.length !== signatureBuffer.length) {
        res.status(400).json({
          success: false,
          error: 'SIGNATURE_VERIFICATION_FAILED',
          message: 'Payment verification failed: Invalid signature length',
        });
        return;
      }

      const isVerified = timingSafeEqual(expectedBuffer, signatureBuffer);

      if (!isVerified) {
        res.status(400).json({
          success: false,
          error: 'SIGNATURE_VERIFICATION_FAILED',
          message: 'Payment verification failed: Invalid signature',
        });
        return;
      }
    } else {
      // Mock mode: Allow all signatures starting with 'order_mock_' to pass verification
      console.log(`[Subscription]: Mock verification passed for order ${razorpay_order_id}`);
    }

    // 2. Activate subscription in Supabase
    // Standard PRO validity is 30 days
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: req.user.id,
        plan: 'PRO',
        expires_at: expiresAt,
        razorpay_order_id,
        razorpay_payment_id,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('[Subscription DB Activation Error]:', error);
      res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Payment verified, but failed to activate plan. Please contact support.',
      });
      return;
    }

    // Sync to user_metadata for Next.js middleware checking
    try {
      await supabaseAdmin.auth.admin.updateUserById(req.user.id, {
        user_metadata: { plan: 'PRO', plan_expires_at: expiresAt }
      });
    } catch (metaErr) {
      console.error('[Verify Metadata Update Error]:', metaErr);
    }

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        plan: 'PRO',
        expires_at: expiresAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred during signature verification',
    });
  }
});

/**
 * GET /api/subscription/status
 * Get current user's subscription plan and expiry
 */
router.get('/status', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, expires_at, created_at')
      .eq('user_id', req.user.id)
      .single();

    if (error || !subscription) {
      // Default to FREE if no subscription row exists
      res.json({
        success: true,
        data: {
          plan: 'FREE',
          expires_at: null,
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
