import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(apiLimiter);

/**
 * GET /api/profile/birth-profiles
 * Retrieve the saved birth profile for the authenticated user
 */
router.get('/birth-profiles', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('birth_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle(); // Use maybeSingle to avoid PGRST116 (no rows) error

    if (error) {
      console.error('[Profile Fetch Error]:', error);
      res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to retrieve birth profile',
      });
      return;
    }

    res.json({
      success: true,
      data: profile || null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred fetching birth profile',
    });
  }
});

/**
 * POST /api/profile/birth-profiles
 * Save (create or upsert) the birth profile for the authenticated user
 */
router.post('/birth-profiles', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, dob, tob, lat, lng, place_name, gender } = req.body;
    const resolvedGender = gender || 'Male';

    if (!name || !dob || !tob || lat === undefined || lng === undefined || !place_name) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required birth details (name, dob, tob, lat, lng, place_name)',
      });
      return;
    }

    if (resolvedGender !== 'Male' && resolvedGender !== 'Female') {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Gender must be Male or Female',
      });
      return;
    }

    // Save or update (upsert) because user_id is UNIQUE in database
    const { data: profile, error } = await supabaseAdmin
      .from('birth_profiles')
      .upsert({
        user_id: req.user.id,
        name,
        dob,
        tob,
        lat,
        lng,
        place_name,
        gender: resolvedGender
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('[Profile Upsert Error]:', error);
      res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: error.message || 'Failed to save birth profile',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Birth profile saved successfully',
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred saving birth profile',
    });
  }
});

/**
 * PUT /api/profile/birth-profiles/:id
 * Update an existing birth profile by ID (validates that profile belongs to the user)
 */
router.put('/birth-profiles/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, dob, tob, lat, lng, place_name, gender } = req.body;
    const resolvedGender = gender || 'Male';

    if (!name || !dob || !tob || lat === undefined || lng === undefined || !place_name) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required birth details (name, dob, tob, lat, lng, place_name)',
      });
      return;
    }

    if (resolvedGender !== 'Male' && resolvedGender !== 'Female') {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Gender must be Male or Female',
      });
      return;
    }

    // Update with strict user ownership validation
    const { data: profile, error } = await supabaseAdmin
      .from('birth_profiles')
      .update({ name, dob, tob, lat, lng, place_name, gender: resolvedGender })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('[Profile Update Error]:', error);
      res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: error.message || 'Failed to update birth profile',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Birth profile updated successfully',
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred updating birth profile',
    });
  }
});

/**
 * DELETE /api/profile/birth-profiles/:id
 * Delete the birth profile by ID
 */
router.delete('/birth-profiles/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('birth_profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('[Profile Delete Error]:', error);
      res.status(500).json({
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to delete birth profile',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Birth profile deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred deleting birth profile',
    });
  }
});

export default router;
