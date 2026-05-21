export interface GowriSlot {
  name_en: string;
  name_ta: string;
  status: 'excellent' | 'good' | 'bad';
  start: string;
  end: string;
}

export interface TimeWindow {
  start: string;
  end: string;
}

export interface MuhurthamDay {
  date: string;
  weekday: number;
  general_score: number;
  event_score: number;
  tithi: string;
  tithi_index: number;
  nakshatra: string;
  nakshatra_index: number;
  nakshatra_pada: number;
  yogam: string;
  paksha: string;
  rahu_kalam: TimeWindow;
  yama_gandam: TimeWindow;
  kulikai: TimeWindow;
  gowri_slots: GowriSlot[];
  description_en: string;
  description_ta: string;
  status: 'highly_auspicious' | 'auspicious' | 'average' | 'avoid';
}
