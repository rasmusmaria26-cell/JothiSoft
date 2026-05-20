import vastuData from '../data/vastu-days.json';

export const getVastuDays = (year: number) => {
  const yearData = vastuData.years.find((y: any) => y.year === year);
  
  if (!yearData) {
    throw new Error(`VASTU_DATA_NOT_FOUND: No data for year ${year}`);
  }
  
  return yearData.days;
};

export const getVastuDayById = (year: number, id: number) => {
  const days = getVastuDays(year);
  const day = days.find((d: any) => d.id === id);
  
  if (!day) throw new Error(`VASTU_DAY_NOT_FOUND: Could not find day with id ${id} for year ${year}`);
  return day;
};

const MANAIYADI_RESULTS = [
  { remainder: 0, quality: 'Dhana', label_en: 'Wealth', label_ta: 'தனம்', auspicious: true },
  { remainder: 1, quality: 'Dhanya', label_en: 'Grain/Food', label_ta: 'தான்யம்', auspicious: true },
  { remainder: 2, quality: 'Jaya', label_en: 'Victory', label_ta: 'ஜெயம்', auspicious: true },
  { remainder: 3, quality: 'Nasha', label_en: 'Destruction', label_ta: 'நாசம்', auspicious: false },
  { remainder: 4, quality: 'Shubha', label_en: 'Auspicious', label_ta: 'சுபம்', auspicious: true },
  { remainder: 5, quality: 'Papa', label_en: 'Inauspicious', label_ta: 'பாபம்', auspicious: false },
  { remainder: 6, quality: 'Mrutyu', label_en: 'Death', label_ta: 'மிருத்யு', auspicious: false },
  { remainder: 7, quality: 'Agni', label_en: 'Fire/Loss', label_ta: 'அக்னி', auspicious: false },
];

export const checkManaiyadiDimension = (feet: number, inches: number) => {
  // Convert to angulams: 1 foot = 12 angulams, 1 inch = 1 angulam
  const totalAngulams = (feet * 12) + inches;
  const remainder = totalAngulams % 8;
  return MANAIYADI_RESULTS[remainder];
};
