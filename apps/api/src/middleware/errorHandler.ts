import { Request, Response, NextFunction } from 'express';

const PROKERALA_ERRORS: Record<string, { status: number; code: string }> = {
  'CREDITS_EXHAUSTED': { status: 503, code: 'SERVICE_LIMIT_REACHED' },
  'INVALID_INPUT': { status: 400, code: 'INVALID_BIRTH_DETAILS' },
  'CALCULATION_SERVICE_UNAVAILABLE': { status: 503, code: 'SERVICE_UNAVAILABLE' },
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]:', err.message || err);

  // Handle Prokerala specific errors if the message contains one of the keys
  if (err.message && err.message.includes('Prokerala error')) {
    const detail = err.message.replace('Prokerala error: ', '').trim();
    
    // Look up in our custom mapped errors
    for (const [key, val] of Object.entries(PROKERALA_ERRORS)) {
      if (detail.includes(key)) {
        return res.status(val.status).json({
          success: false,
          error: val.code,
          message: detail
        });
      }
    }
    
    // Fallback for general Prokerala errors
    return res.status(400).json({
      success: false,
      error: 'ASTROLOGY_SERVICE_ERROR',
      message: detail
    });
  }

  // General server error
  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred'
  });
};
