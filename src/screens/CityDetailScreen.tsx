import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { WeatherData } from '../services/types';
import { weatherApi } from '../services/weatherApi';
import { kelvinToCelsius } from '../utils/helpers';
import { storageService } from '../services/storage';
import { formatDate, capitalizeWords } from '../utils/formatters';
import WeatherDetailRow from '../components/weather/WeatherDetailRow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

type CityDetailScreenRouteProp = RouteProp<RootStackParamList, 'CityDetail'>;

interface CityDetailScreenProps {
  route: CityDetailScreenRouteProp;
}

/**
 * CityDetailScreen displays detailed weather information for a selected city
 * Shows temperature, humidity, wind speed, and weather description
 * Automatically fetches fresh data when opened and saves to history
 */
const CityDetailScreen: React.FC<CityDetailScreenProps> = ({ route }) => {
  const { city } = route.params;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadWeatherData();
  }, [city]);

  /**
   * Fetches current weather data for the city and updates the state
   */
  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await weatherApi.getCurrentWeather(city.name);
      
      if (result.success && result.data) {
        setWeatherData(result.data);
        
        // Save to historical data
        await storageService.saveWeatherData(city.name, result.data);
        
        // Set last updated timestamp
        const now = new Date();
        setLastUpdated(formatDate(now));
      } else {
        setError(result.error || 'Failed to load weather data');
      }
    } catch (err) {
      setError('Failed to load weather data');
      console.error('Error loading weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles retry action when weather data loading fails
   */
  const handleRetry = () => {
    loadWeatherData();
  };

  if (loading) {
    return <LoadingSpinner message="Loading weather data..." />;
  }

  if (error && !weatherData) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={handleRetry}
        retryButtonText="Retry"
      />
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.centerContainer}>
        <Text>No weather data available</Text>
      </View>
    );
  }

  const temperature = kelvinToCelsius(weatherData.main.temp);
  const description = weatherData.weather[0]?.description 
    ? capitalizeWords(weatherData.weather[0].description)
    : 'N/A';
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{city.name}, {city.country}</Text>
      
      <View style={styles.weatherCard}>
        <WeatherDetailRow 
          label="Description" 
          value={description}
          testID="weather-description"
        />
        <WeatherDetailRow 
          label="Temperature" 
          value={`${temperature}° C`}
          testID="weather-temperature"
        />
        <WeatherDetailRow 
          label="Humidity" 
          value={`${humidity}%`}
          testID="weather-humidity"
        />
        <WeatherDetailRow 
          label="Windspeed" 
          value={`${windSpeed} km/h`}
          testID="weather-windspeed"
        />
      </View>

      {lastUpdated && (
        <Text style={styles.lastUpdated} testID="last-updated">
          Weather information for {city.name} received on {lastUpdated}
        </Text>
      )}

      {error && weatherData && (
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
          retryButtonText="Refresh Data"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  lastUpdated: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
});

export default CityDetailScreen;