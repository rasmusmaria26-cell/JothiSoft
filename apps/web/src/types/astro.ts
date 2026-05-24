export interface LagnaData {
  sign: string;
  sign_degree: number;
  nakshatra: string;
  longitude: number;
}

export interface PlanetData {
  planet: string;
  sign: string;
  sign_degree: number;
  house: number;
  nakshatra: string;
  pada: number | null;
}

export interface HoroscopeChart {
  [key: string]: string[]; // house_1 to house_12 -> list of planet names
}

export interface PredictionItem {
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
}

export interface PredictionData {
  lagna: PredictionItem;
  rasi: PredictionItem;
  nakshatra: PredictionItem;
}

export interface HoroscopeResponse {
  lagna: LagnaData;
  planets: PlanetData[];
  rasi_chart: HoroscopeChart;
  navamsam_chart: HoroscopeChart;
  predictions: PredictionData;
  dasha_balance?: {
    years: number;
    months: number;
    days: number;
    lord: string;
    lagna_degree: number;
  };
  current_dasha?: {
    mahadasha: string;
    antardasha: string;
    antardasha_end: string;
  };
  panchangam?: {
    tithi: {
      name: string;
      name_ta: string;
    };
    yoga: {
      name: string;
      name_ta: string;
    };
    karana: {
      name: string;
      name_ta: string;
    };
  };
}

export interface DashaPeriod {
  dasha_lord: string;
  start_date: string;
  end_date: string;
  years?: number;
  bhuktis?: DashaPeriod[];
  antaradasha?: DashaPeriod[];
  antharams?: DashaPeriod[];
  antharas?: DashaPeriod[];
}

export interface DashaResponse {
  current: {
    dasha: string;
    bhukti: string;
    anthara: string;
    ends_at: string;
  };
  timeline: DashaPeriod[];
}

export interface CityData {
  id: number;
  name: string;
  ascii_name: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  utc_offset: number;
}
