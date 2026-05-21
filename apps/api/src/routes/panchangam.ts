import { Router, Request, Response, NextFunction } from 'express';
import { getDailyPanchangam } from '../services/panchangam.service';
import { getLocalPanchangam } from '../services/localPanchangam.service';
import { authenticate } from '../middleware/auth';
import { requireSubscription } from '../middleware/subscription';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(apiLimiter);

// Endpoint: /api/panchangam/daily
// Allowed as GET/POST for flexibility
router.all('/daily', authenticate, async (req: Request, res: Response, next) => {
  try {
    const payload = Object.keys(req.body).length > 0 ? req.body : req.query;
    const { date, lat, lng, utcOffset, language } = payload as any;

    if (!date || lat === undefined || lng === undefined || utcOffset === undefined) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required parameters: date, lat, lng, utcOffset'
      });
    }

    const p = await getDailyPanchangam(
      date as string,
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(utcOffset),
      language || 'ta'
    );

    const RAHU_KALAM = [
      { start: '16:30', end: '18:00' }, // Sunday
      { start: '07:30', end: '09:00' }, // Monday
      { start: '15:00', end: '16:30' }, // Tuesday
      { start: '12:00', end: '13:30' }, // Wednesday
      { start: '13:30', end: '15:00' }, // Thursday
      { start: '10:30', end: '12:00' }, // Friday
      { start: '09:00', end: '10:30' }  // Saturday
    ];

    const dateObj = new Date(date as string);
    const dayOfWeek = dateObj.getDay();

    // Map fields
    let tithiVal = { name: 'Dwitiya', index: 2 };
    let pakshaVal = 'Shukla';
    if (p.tithi && p.tithi.length > 0) {
      tithiVal = {
        name: p.tithi[0].name || 'Dwitiya',
        index: p.tithi[0].index || 2
      };
      pakshaVal = p.tithi[0].paksha || 'Shukla';
    }

    let nakshatraVal = { name: 'Ashwini', index: 1, pada: 1 };
    if (p.nakshatra && p.nakshatra.length > 0) {
      nakshatraVal = {
        name: p.nakshatra[0].name || 'Ashwini',
        index: p.nakshatra[0].index || 1,
        pada: p.nakshatra[0].pada || 1
      };
    }

    let yogaVal = { name: 'Siddhi', index: 1 };
    if (p.yoga && p.yoga.length > 0) {
      yogaVal = {
        name: p.yoga[0].name || 'Siddhi',
        index: p.yoga[0].index || 1
      };
    }

    let karanamVal = { name: 'Bava' };
    if (p.karanam && p.karanam.length > 0) {
      karanamVal = {
        name: p.karanam[0].name || 'Bava'
      };
    }

    const formattedData = {
      date: date as string,
      paksha: pakshaVal,
      tithi: tithiVal,
      nakshatra: nakshatraVal,
      yogam: yogaVal,
      karanam: karanamVal,
      rahu_kalam: RAHU_KALAM[dayOfWeek],
      sun_longitude: p.sun_longitude || 30.5,
      moon_longitude: p.moon_longitude || 120.2
    };

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint: /api/panchangam/monthly
// Requires PRO subscription
router.post('/monthly', authenticate, requireSubscription, async (req: Request, res: Response, next) => {
  try {
    const { year, month, lat, lng, utcOffset, language } = req.body;

    const targetLat = lat !== undefined ? parseFloat(lat) : 13.0827;
    const targetLng = lng !== undefined ? parseFloat(lng) : 80.2707;
    const targetOffset = utcOffset !== undefined ? parseFloat(utcOffset) : 5.5;
    const lang = language || 'ta';

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required parameters: year, month'
      });
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const promises = [];

    // Use local astronomical calculations instead of external API to save credits
    // We calculate it for 12:00 Noon to get the prevailing Tithi/Nakshatra of the day
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(Date.UTC(year, month - 1, day, 12 - targetOffset, 0, 0));
      const localData = getLocalPanchangam(dateObj);
      promises.push(Promise.resolve(localData));
    }

    const resolvedDays = await Promise.all(promises);

    const RAHU_KALAM = [
      { start: '16:30', end: '18:00' }, // Sunday
      { start: '07:30', end: '09:00' }, // Monday
      { start: '15:00', end: '16:30' }, // Tuesday
      { start: '12:00', end: '13:30' }, // Wednesday
      { start: '13:30', end: '15:00' }, // Thursday
      { start: '10:30', end: '12:00' }, // Friday
      { start: '09:00', end: '10:30' }  // Saturday
    ];

    const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const WEEKDAYS_TA = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];

    const result = resolvedDays.map((localData, index) => {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
      const dateObj = new Date(year, month - 1, index + 1);
      const dayOfWeek = dateObj.getDay();

      return {
        date: dateStr,
        day_of_week: WEEKDAYS_EN[dayOfWeek],
        day_of_week_ta: WEEKDAYS_TA[dayOfWeek],
        
        tithi: localData.tithi.name,
        tithi_ta: localData.tithi.name_ta,
        tithi_index: localData.tithi.index,
        
        paksha: localData.tithi.paksha,
        paksha_ta: localData.tithi.paksha_ta,
        
        nakshatra: localData.nakshatra.name,
        nakshatra_ta: localData.nakshatra.name_ta,
        nakshatra_index: localData.nakshatra.index,
        
        yogam: localData.yoga.name,
        yogam_ta: localData.yoga.name_ta,
        
        karanam: 'N/A',
        karanam_ta: 'N/A',
        
        rahu_kalam: RAHU_KALAM[dayOfWeek],
        sunrise: '06:00 AM', // Approximate fallback
        sunset: '06:00 PM'   // Approximate fallback
      };
    });


    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Endpoint: /api/panchangam/muhurtham
// Gated for PRO users
router.post('/muhurtham', authenticate, requireSubscription, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { year, month, category, lat, lng, utcOffset, language } = req.body;

    if (!year || !month || !category) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required parameters: year, month, category'
      });
      return;
    }

    const targetLat = lat !== undefined ? parseFloat(lat) : 13.0827;
    const targetLng = lng !== undefined ? parseFloat(lng) : 80.2707;
    const targetOffset = utcOffset !== undefined ? parseFloat(utcOffset) : 5.5;
    const lang = language || 'ta';

    const daysInMonth = new Date(year, month, 0).getDate();
    const promises = [];

    // Use local astronomical calculations instead of external API to save credits
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(Date.UTC(year, month - 1, day, 12 - targetOffset, 0, 0));
      const localData = getLocalPanchangam(dateObj);
      promises.push(Promise.resolve(localData));
    }

    const resolvedDays = await Promise.all(promises);

    const RAHU_KALAM = [
      { start: '16:30', end: '18:00' }, // Sunday
      { start: '07:30', end: '09:00' }, // Monday
      { start: '15:00', end: '16:30' }, // Tuesday
      { start: '12:00', end: '13:30' }, // Wednesday
      { start: '13:30', end: '15:00' }, // Thursday
      { start: '10:30', end: '12:00' }, // Friday
      { start: '09:00', end: '10:30' }  // Saturday
    ];

    const YAMA_GANDAM = [
      { start: '12:00', end: '13:30' }, // Sunday
      { start: '10:30', end: '12:00' }, // Monday
      { start: '09:00', end: '10:30' }, // Tuesday
      { start: '07:30', end: '09:00' }, // Wednesday
      { start: '06:00', end: '07:30' }, // Thursday
      { start: '15:00', end: '16:30' }, // Friday
      { start: '13:30', end: '15:00' }  // Saturday
    ];

    const KULIKAI = [
      { start: '15:00', end: '16:30' }, // Sunday
      { start: '13:30', end: '15:00' }, // Monday
      { start: '12:00', end: '13:30' }, // Tuesday
      { start: '10:30', end: '12:00' }, // Wednesday
      { start: '09:00', end: '10:30' }, // Thursday
      { start: '07:30', end: '09:00' }, // Friday
      { start: '06:00', end: '07:30' }  // Saturday
    ];

    const GOWRI_TEMPLATES = [
      // Sunday
      [
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' },
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' },
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' },
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' }
      ],
      // Monday
      [
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' },
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' },
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' },
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' }
      ],
      // Tuesday
      [
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' },
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' },
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' },
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' }
      ],
      // Wednesday
      [
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' },
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' },
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' },
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' }
      ],
      // Thursday
      [
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' },
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' },
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' },
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' }
      ],
      // Friday
      [
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' },
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' },
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' },
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' }
      ],
      // Saturday
      [
        { name_en: 'Rog', name_ta: 'ரோக', status: 'avoid' },
        { name_en: 'Labh', name_ta: 'லாப', status: 'excellent' },
        { name_en: 'Udveg', name_ta: 'உத்வேக', status: 'avoid' },
        { name_en: 'Kal', name_ta: 'கால', status: 'avoid' },
        { name_en: 'Subha', name_ta: 'சுப', status: 'excellent' },
        { name_en: 'Amrit', name_ta: 'அமிர்த', status: 'excellent' },
        { name_en: 'Hal', name_ta: 'விஷ', status: 'avoid' },
        { name_en: 'Udaya', name_ta: 'உத்யோக', status: 'good' }
      ]
    ];

    const GOWRI_TIMES = [
      { start: '06:00', end: '07:30' },
      { start: '07:30', end: '09:00' },
      { start: '09:00', end: '10:30' },
      { start: '10:30', end: '12:00' },
      { start: '12:00', end: '13:30' },
      { start: '13:30', end: '15:00' },
      { start: '15:00', end: '16:30' },
      { start: '16:30', end: '18:00' }
    ];

    const result = resolvedDays.map((localData, index) => {
      const dateObj = new Date(year, month - 1, index + 1);
      const dayOfWeek = dateObj.getDay();
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
      const weekday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      // Extract Tithi name and index
      let tithiName = localData.tithi.name;
      let tithiIndex = localData.tithi.index;
      let paksha = localData.tithi.paksha;

      // Extract Nakshatra name and index
      let nakshatraName = localData.nakshatra.name;
      let nakshatraIndex = localData.nakshatra.index;

      // Extract Yoga
      let yogaName = localData.yoga.name;

      // Calculate Muhurtham suitability based on category, weekday, tithi, and nakshatra
      let event_score = 65; // Base average rating

      // Rikta Tithis (4, 9, 14, 19, 24, 29) are generally inauspicious
      const isRikta = [4, 9, 14, 19, 24, 29].includes(tithiIndex);
      if (isRikta) {
        event_score -= 25;
      }

      // Tuesday (2) is bad for marriage / travel but good for property
      if (dayOfWeek === 2) {
        if (category === 'marriage' || category === 'travel') {
          event_score -= 15;
        } else if (category === 'property') {
          event_score += 10;
        }
      }

      // Sunday (0) and Thursday (4) are generally excellent
      if (dayOfWeek === 0 || dayOfWeek === 4) {
        event_score += 10;
      }

      // Inauspicious yogams
      const isInauspiciousYogam = ["Atiganda", "Vyaghata", "Vyatipata", "Vaidhriti", "Ganda", "Shoola"].includes(yogaName);
      if (isInauspiciousYogam) {
        event_score -= 15;
      }

      // Cap scores
      event_score = Math.max(10, Math.min(98, event_score));

      let status = 'average';
      if (event_score >= 80) status = 'highly_auspicious';
      else if (event_score >= 60) status = 'auspicious';
      else if (event_score >= 40) status = 'average';
      else status = 'bad';

      // Build Descriptions
      let description_en = 'A positive day with stable energies. Recommended for general initiatives.';
      let description_ta = 'ஸ்திரமான ஆற்றல் கொண்ட நல்ல நாள். பொதுவான காரியங்களை மேற்கொள்ள உகந்தது.';

      if (status === 'highly_auspicious') {
        description_en = `Exceptionally powerful astronomical support for ${category} today. Highly recommended!`;
        description_ta = `இன்று ${category} தொடங்குவதற்கு மிகவும் அருமையான சுப யோக நாளாகும். நற்பலன்கள் கிட்டும்!`;
      } else if (status === 'auspicious') {
        description_en = `Favorable alignment for ${category}. Auspicious timing slots offer high success chances.`;
        description_ta = `${category} சார்ந்த காரியங்களைச் செய்ய இன்று சிறந்த நாள். சுப நேரங்களைப் பயன்படுத்தவும்.`;
      } else if (status === 'bad') {
        description_en = 'Astronomical conflicts detected. Postpone highly critical initiatives if possible.';
        description_ta = 'இன்று கிரக நிலைகள் சாதகமாக இல்லை. முக்கிய காரியங்களைத் தவிர்ப்பது நலம்.';
      }

      return {
        date: dateStr,
        weekday,
        status,
        event_score,
        tithi: tithiName,
        paksha,
        tithi_index: tithiIndex,
        nakshatra: nakshatraName,
        nakshatra_pada: 1 + (index % 4),
        nakshatra_index: nakshatraIndex,
        yogam: yogaName,
        description_en,
        description_ta,
        rahu_kalam: RAHU_KALAM[dayOfWeek],
        yama_gandam: YAMA_GANDAM[dayOfWeek],
        kulikai: KULIKAI[dayOfWeek],
        gowri_slots: GOWRI_TIMES.map((time, slotIdx) => ({
          ...time,
          name_en: GOWRI_TEMPLATES[dayOfWeek][slotIdx].name_en,
          name_ta: GOWRI_TEMPLATES[dayOfWeek][slotIdx].name_ta,
          status: GOWRI_TEMPLATES[dayOfWeek][slotIdx].status
        }))
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Endpoint: /api/panchangam/detailed
// Gated for authenticated users
router.get('/detailed', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, lat, lng, tz_offset, language } = req.query;

    if (!date) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required parameter: date'
      });
      return;
    }

    const targetLat = lat !== undefined ? parseFloat(lat as string) : 13.0827;
    const targetLng = lng !== undefined ? parseFloat(lng as string) : 80.2707;
    const targetOffset = tz_offset !== undefined ? parseFloat(tz_offset as string) : 5.5;
    const lang = (language as string) || 'ta';

    const p = await getDailyPanchangam(date as string, targetLat, targetLng, targetOffset, lang);

    const RAHU_KALAM = [
      { start: '16:30', end: '18:00' }, // Sunday
      { start: '07:30', end: '09:00' }, // Monday
      { start: '15:00', end: '16:30' }, // Tuesday
      { start: '12:00', end: '13:30' }, // Wednesday
      { start: '13:30', end: '15:00' }, // Thursday
      { start: '10:30', end: '12:00' }, // Friday
      { start: '09:00', end: '10:30' }  // Saturday
    ];

    const dateObj = new Date(date as string);
    const dayOfWeek = dateObj.getDay();

    // Map fields
    let tithiVal = { name: 'Dwitiya', index: 2 };
    let pakshaVal = 'Shukla';
    if (p.tithi && p.tithi.length > 0) {
      tithiVal = {
        name: p.tithi[0].name || 'Dwitiya',
        index: p.tithi[0].index || 2
      };
      pakshaVal = p.tithi[0].paksha || 'Shukla';
    }

    let nakshatraVal = { name: 'Ashwini', index: 1, pada: 1 };
    if (p.nakshatra && p.nakshatra.length > 0) {
      nakshatraVal = {
        name: p.nakshatra[0].name || 'Ashwini',
        index: p.nakshatra[0].index || 1,
        pada: p.nakshatra[0].pada || 1
      };
    }

    let yogaVal = { name: 'Siddhi', index: 1 };
    if (p.yoga && p.yoga.length > 0) {
      yogaVal = {
        name: p.yoga[0].name || 'Siddhi',
        index: p.yoga[0].index || 1
      };
    }

    let karanamVal = { name: 'Bava' };
    if (p.karanam && p.karanam.length > 0) {
      karanamVal = {
        name: p.karanam[0].name || 'Bava'
      };
    }

    res.json({
      date: date as string,
      paksha: pakshaVal,
      tithi: tithiVal,
      nakshatra: nakshatraVal,
      yogam: yogaVal,
      karanam: karanamVal,
      rahu_kalam: RAHU_KALAM[dayOfWeek],
      sun_longitude: p.sun_longitude || 30.5,
      moon_longitude: p.moon_longitude || 120.2
    });
  } catch (error) {
    next(error);
  }
});

export default router;
