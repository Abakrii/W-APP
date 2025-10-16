import { WeatherData } from '../services/types';
import { Constants } from './constants';

/**
 * Converts temperature from Kelvin to Celsius
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Celsius rounded to nearest integer
 */
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - Constants.WEATHER.KELVIN_OFFSET);
};

/**
 * Validates city name input
 * @param cityName - City name to validate
 * @returns Validation result with isValid flag and optional error message
 */
export const validateCityName = (cityName: string): { isValid: boolean; error?: string } => {
  if (!cityName.trim()) {
    return { isValid: false, error: 'City name cannot be empty' };
  }
  
  if (cityName.length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters long' };
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(cityName)) {
    return { isValid: false, error: 'City name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};