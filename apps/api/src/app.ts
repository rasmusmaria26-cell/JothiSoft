import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Load from root

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  'https://jothisoft.com',
  'https://www.jothisoft.com',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') || 
      origin.endsWith('.onrender.com') ||
      /^http:\/\/localhost:\d+$/.test(origin);
      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Custom secure HTTP headers middleware (bypasses helmet dependency overhead)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.jothisoft.com; frame-src https://api.razorpay.com");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'JothiSoft API Proxy (Prokerala) is running' });
});

import panchangamRoutes from './routes/panchangam';
import horoscopeRouter from './routes/horoscope';
import matchingRouter from './routes/matching';
import numerologyRouter from './routes/numerology';
import kpRouter from './routes/kp';
import vastuRouter from './routes/vastu';
import specialDaysRouter, { specialDaysCache } from './routes/specialdays';
import authRouter from './routes/auth';
import subscriptionRouter from './routes/subscription';
import profileRouter from './routes/profile';
import prasnamRouter from './routes/prasnam';
import citiesRouter from './routes/cities';
import { computeSpecialDaysForYear } from './services/specialdays.service';

// Register Routes
app.use('/api/auth', authRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/profile', profileRouter);
app.use('/api/panchangam', panchangamRoutes);
app.use('/api/horoscope', horoscopeRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/numerology', numerologyRouter);
app.use('/api/kp', kpRouter);
app.use('/api/vastu', vastuRouter);
app.use('/api/special-days', specialDaysRouter);
app.use('/api/prasnam', prasnamRouter);
app.use('/api/cities', citiesRouter);

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`[server]: JothiSoft API running at http://localhost:${port}`);
    
    // Async pre-compute special days for 2026 in background to avoid blocking server start
    console.log(`[server]: Starting background pre-computation for 2026 special days...`);
    computeSpecialDaysForYear(2026, 13.0827, 80.2707, 5.5)
      .then((days) => {
        specialDaysCache.set('special-days-v4:2026', days);
        console.log(`[server]: Background pre-computation for 2026 special days completed successfully! Total events: ${days.length}`);
      })
      .catch((err) => {
        console.error(`[server]: Failed to pre-compute 2026 special days:`, err.message);
      });
  });
}

export default app;
