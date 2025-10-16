import axios, { AxiosResponse } from 'axios';
import { WeatherData, ApiResponse } from './types';
import { Constants } from '../utils/constants';

/**
 * Weather API service for interacting with OpenWeatherMap API
 */
class WeatherApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = Constants.API.BASE_URL;
    this.apiKey = Constants.API.KEY;
  }

  /**
   * Fetches current weather data for a specified city
   * @param cityName - Name of the city to get weather for
   * @returns Promise with API response containing weather data or error
   */
  async getCurrentWeather(cityName: string): Promise<ApiResponse<WeatherData>> {
    try {
      const response: AxiosResponse<WeatherData> = await axios.get(
        `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}`
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Weather API Error:', error);
      
      let errorMessage = 'Failed to fetch weather data';
      
      if (error.response?.status === 404) {
        errorMessage = 'City not found';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Generates URL for weather icon
   * @param iconCode - Weather icon code from API response
   * @returns Complete URL to weather icon image
   */
  getWeatherIconUrl(iconCode: string): string {
    return `${Constants.API.ICON_URL}/${iconCode}.png`;
  }
}


/**
 * Converts temperature from Kelvin to Celsius
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Celsius rounded to nearest integer
 */
export const kelvinToCelsius = (kelvin: number): number => {
    return Math.round(kelvin - Constants.WEATHER.KELVIN_OFFSET);
  };

export const weatherApi = new WeatherApiService();