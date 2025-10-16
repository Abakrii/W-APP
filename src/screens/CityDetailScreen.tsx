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
import { weatherApi, kelvinToCelsius } from '../services/weatherApi';
import { storageService } from '../services/storage';
import { formatDate, capitalizeFirst } from '../utils/formatters';
import WeatherDetailRow from '../components/weather/WeatherDetailRow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

type CityDetailScreenRouteProp = RouteProp<RootStackParamList, 'CityDetail'>;

interface CityDetailScreenProps {
  route: CityDetailScreenRouteProp;
}

/**
 * CityDetailScreen displays detailed weather information exactly like the design
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

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await weatherApi.getCurrentWeather(city.name);
      
      if (result.success && result.data) {
        setWeatherData(result.data);
        
        await storageService.saveWeatherData(city.name, result.data);
        
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
    ? capitalizeFirst(weatherData.weather[0].description)
    : 'N/A';
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  return (
    <ScrollView style={styles.container}>
      {/* Title exactly like design */}
      <Text style={styles.title}>{city.name}, {city.country}</Text>
      
      {/* Weather details table exactly like design */}
      <View style={styles.weatherCard}>
        <WeatherDetailRow 
          label="Description" 
          value={description}
          testID="weather-description"
        />
        <WeatherDetailRow 
          label="Temperature" 
          value={`${temperature}° C`} // Exact format like design
          testID="weather-temperature"
        />
        <WeatherDetailRow 
          label="Humidity" 
          value={`${humidity}%`} // Exact format like design
          testID="weather-humidity"
        />
        <WeatherDetailRow 
          label="Windspeed" 
          value={`${windSpeed} km/h`} // Exact format like design
          testID="weather-windspeed"
        />
      </View>

      {/* Last updated text exactly like design */}
      {lastUpdated && (
        <Text style={styles.lastUpdated} testID="last-updated">
          Weather information for {city.name} received on {"\n"}
          {lastUpdated.replace(' - ', ' - ')} // Exact format like design
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
    paddingHorizontal: 24,
    paddingTop: 60, // Exact spacing like design
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 34, // Exact size like design
    fontWeight: '700', // Bold like design
    color: '#000000',
    marginBottom: 30, // Exact spacing like design
    textAlign: 'left', // Left aligned like design
  },
  weatherCard: {
    backgroundColor: '#F8F8F8', // Light grey background like design
    borderRadius: 0, // No border radius like design
    padding: 0, // No padding like design
    marginBottom: 30, // Exact spacing like design
    borderWidth: 0, // No border like design
  },
  lastUpdated: {
    textAlign: 'left', // Left aligned like design
    color: '#000000', // Black color like design
    fontSize: 17, // Exact font size like design
    fontWeight: '400', // Regular weight like design
    lineHeight: 22, // Proper line height
  },
});

export default CityDetailScreen;