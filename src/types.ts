export interface DiseaseResult {
  diseaseName: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  symptoms: string[];
  causes: string[];
  preventiveMeasures: string[];
  treatment: {
    organic: string[];
    chemical: string[];
  };
  timestamp: number;
  imageUrl?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  alerts: string[];
}

export interface FarmingPlan {
  cropName: string;
  month: string;
  steps: string[];
  soilPrep: string;
  watering: string;
  fertilizer: string;
  harvest: string;
}

export type Language = "en" | "ta";
