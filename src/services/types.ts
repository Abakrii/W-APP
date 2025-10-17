/**
 * Weather data interface from OpenWeatherMap API
 */
export interface WeatherData {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string; // This contains the icon code (e.g., "01d", "02n")
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
  dt: number;
}

/**
 * City information interface
 */
export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

/**
 * Historical weather data entry
 */
export interface HistoricalEntry {
  timestamp: string;
  data: WeatherData;
}

/**
 * API response wrapper for better error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Storage keys for AsyncStorage
 */
export enum StorageKeys {
  CITIES = "saved_cities",
  HISTORY = "weather_history",
}
