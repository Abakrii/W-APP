import AsyncStorage from '@react-native-async-storage/async-storage';
import { City, HistoricalEntry, WeatherData, StorageKeys } from './types';
import { Constants } from '../utils/constants';

/**
 * Storage service for managing persistent data using AsyncStorage
 */
class StorageService {
  /**
   * Retrieves all saved cities from storage
   * @returns Array of City objects
   */
  async getCities(): Promise<City[]> {
    try {
      const citiesJson = await AsyncStorage.getItem(StorageKeys.CITIES);
      return citiesJson ? JSON.parse(citiesJson) : [];
    } catch (error) {
      console.error('Error getting cities from storage:', error);
      return [];
    }
  }

  /**
   * Saves a new city to storage
   * @param city - City object to save
   * @returns Updated array of cities
   * @throws Error if saving fails
   */
  async saveCity(city: City): Promise<City[]> {
    try {
      const cities = await this.getCities();
      const existingCity = cities.find(c => 
        c.name.toLowerCase() === city.name.toLowerCase() && 
        c.country === city.country
      );
      
      if (!existingCity) {
        const updatedCities = [...cities, city];
        await AsyncStorage.setItem(StorageKeys.CITIES, JSON.stringify(updatedCities));
        return updatedCities;
      }
      
      return cities;
    } catch (error) {
      console.error('Error saving city to storage:', error);
      throw new Error('Failed to save city');
    }
  }

  /**
   * Removes a city from storage
   * @param cityName - Name of city to remove
   * @returns Updated array of cities
   * @throws Error if removal fails
   */
  async removeCity(cityName: string): Promise<City[]> {
    try {
      const cities = await this.getCities();
      const filteredCities = cities.filter(c => c.name !== cityName);
      await AsyncStorage.setItem(StorageKeys.CITIES, JSON.stringify(filteredCities));
      return filteredCities;
    } catch (error) {
      console.error('Error removing city from storage:', error);
      throw new Error('Failed to remove city');
    }
  }

  /**
   * Retrieves historical weather data for a specific city
   * @param cityName - Name of the city to get history for
   * @returns Array of HistoricalEntry objects
   */
  async getHistoricalData(cityName: string): Promise<HistoricalEntry[]> {
    try {
      const historyJson = await AsyncStorage.getItem(StorageKeys.HISTORY);
      const allHistory = historyJson ? JSON.parse(historyJson) : {};
      return allHistory[cityName] || [];
    } catch (error) {
      console.error('Error getting historical data from storage:', error);
      return [];
    }
  }

  /**
   * Saves weather data to historical records
   * @param cityName - Name of the city
   * @param weatherData - Weather data to save
   * @returns Updated array of historical entries for the city
   * @throws Error if saving fails
   */
  async saveWeatherData(cityName: string, weatherData: WeatherData): Promise<HistoricalEntry[]> {
    try {
      const historyJson = await AsyncStorage.getItem(StorageKeys.HISTORY);
      const allHistory: Record<string, HistoricalEntry[]> = historyJson ? JSON.parse(historyJson) : {};
      
      if (!allHistory[cityName]) {
        allHistory[cityName] = [];
      }

      const historyEntry: HistoricalEntry = {
        timestamp: new Date().toISOString(),
        data: weatherData
      };

      allHistory[cityName].unshift(historyEntry);
      
      // Keep only the most recent entries
      if (allHistory[cityName].length > Constants.STORAGE.MAX_HISTORY_ENTRIES) {
        allHistory[cityName] = allHistory[cityName].slice(0, Constants.STORAGE.MAX_HISTORY_ENTRIES);
      }

      await AsyncStorage.setItem(StorageKeys.HISTORY, JSON.stringify(allHistory));
      return allHistory[cityName];
    } catch (error) {
      console.error('Error saving weather data to storage:', error);
      throw new Error('Failed to save weather data');
    }
  }
}

export const storageService = new StorageService();