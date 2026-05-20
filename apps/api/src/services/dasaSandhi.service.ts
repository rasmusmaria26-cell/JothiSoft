import { calculateVimshottariDasha } from './horoscope.service';

export interface DasaSandhiClash {
  boy_age: number;
  girl_age: number;
  boy_planet: string;
  girl_planet: string;
  clash_date: string;
  severity: 'severe' | 'moderate' | 'mild';
  gap_months: number;
  advice_en: string;
  advice_ta: string;
}

export interface DasaSandhiResult {
  clashes: DasaSandhiClash[];
  summary_severity: 'none' | 'mild' | 'moderate' | 'severe';
}

export const getDasaSandhiClashes = (
  boyDobStr: string,
  boyMoonLongitude: number,
  girlDobStr: string,
  girlMoonLongitude: number
): DasaSandhiResult => {
  const boyDasa = calculateVimshottariDasha(boyDobStr, boyMoonLongitude);
  const girlDasa = calculateVimshottariDasha(girlDobStr, girlMoonLongitude);

  const boyTimeline = boyDasa.timeline;
  const girlTimeline = girlDasa.timeline;

  const clashes: DasaSandhiClash[] = [];
  const boyBirthDate = new Date(boyDobStr);
  const girlBirthDate = new Date(girlDobStr);

  // Compare every Maha Dasa transition of boy with girl
  for (const bDasa of boyTimeline) {
    const bTransitionDate = new Date(bDasa.start_date);
    
    // Calculate boy's age at this transition
    const boyAge = (bTransitionDate.getTime() - boyBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    // We only care about clashes during their potential married life (e.g. boy age 20 to 80)
    if (boyAge < 20 || boyAge > 90) continue;

    for (const gDasa of girlTimeline) {
      const gTransitionDate = new Date(gDasa.start_date);
      
      const girlAge = (gTransitionDate.getTime() - girlBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (girlAge < 18 || girlAge > 90) continue;

      // Calculate gap in months between their transitions
      const gapMs = Math.abs(bTransitionDate.getTime() - gTransitionDate.getTime());
      const gapMonths = gapMs / (1000 * 60 * 60 * 24 * 30.44);

      if (gapMonths <= 24) {
        // We have a clash!
        let severity: 'severe' | 'moderate' | 'mild' = 'mild';
        if (gapMonths <= 6) severity = 'severe';
        else if (gapMonths <= 12) severity = 'moderate';

        // Determine if they are malefic transitions (Rahu, Ketu, Saturn, Mars, Sun)
        const malefics = ['Rahu', 'Ketu', 'Saturn', 'Mars', 'Sun'];
        const bIsMalefic = malefics.includes(bDasa.dasha_lord);
        const gIsMalefic = malefics.includes(gDasa.dasha_lord);

        // If both transition into malefics, it's more severe
        if (bIsMalefic && gIsMalefic && severity !== 'severe') {
            severity = 'moderate';
        }

        const clashDate = bTransitionDate < gTransitionDate ? bTransitionDate : gTransitionDate;

        clashes.push({
          boy_age: Math.round(boyAge),
          girl_age: Math.round(girlAge),
          boy_planet: bDasa.dasha_lord,
          girl_planet: gDasa.dasha_lord,
          clash_date: clashDate.toISOString().split('T')[0],
          severity,
          gap_months: Math.round(gapMonths * 10) / 10,
          advice_en: severity === 'severe' 
            ? 'Strong remedies like Mrityunjaya Homa recommended as both enter new major periods simultaneously.'
            : 'Mild overlapping periods. General prayers and understanding recommended.',
          advice_ta: severity === 'severe'
            ? 'இருவருக்கும் ஒரே சமயத்தில் தசா மாறுவதால் மிருத்யுஞ்சய ஹோமம் செய்வது நன்று.'
            : 'சாதாரண தசா சந்தி. கவனமாக இருப்பது நன்று.'
        });
      }
    }
  }

  // Sort clashes by date
  clashes.sort((a, b) => new Date(a.clash_date).getTime() - new Date(b.clash_date).getTime());

  // Determine overall severity
  let summary_severity: 'none' | 'mild' | 'moderate' | 'severe' = 'none';
  if (clashes.length > 0) {
    if (clashes.some(c => c.severity === 'severe')) summary_severity = 'severe';
    else if (clashes.some(c => c.severity === 'moderate')) summary_severity = 'moderate';
    else summary_severity = 'mild';
  }

  return {
    clashes,
    summary_severity
  };
};
