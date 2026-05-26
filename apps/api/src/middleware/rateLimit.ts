import rateLimit from 'express-rate-limit';

// General API rate limiter for standard routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 2000 requests per windowMs (increased for upgraded plan)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Stricter rate limiter for expensive astrological calculations
export const calcLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 800, // Limit each IP to 800 calculation requests per windowMs (increased for upgraded plan)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_CALCULATIONS',
    message: 'Calculation limit reached. Please wait before requesting more charts.',
  },
});

// Stricter rate limiter for authentication endpoints (login and register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 authentication requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_AUTH_ATTEMPTS',
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// Custom, generous rate limiter for cities autocomplete search
export const citiesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 2000 search requests per windowMs (increased for upgraded plan)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many search requests from this IP, please try again shortly',
  },
});

