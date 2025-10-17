import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import {
  Text,
  Divider,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { WeatherData } from '../services/types';
import { weatherApi, kelvinToCelsius } from '../services/weatherApi';
import { storageService } from '../services/storage';
import { formatDate, capitalizeFirst } from '../utils/formatters';
import WeatherDetailRow from '../components/weather/WeatherDetailRow';
import WeatherIcon from '../components/weather/WeatherIcon';
import ErrorMessage from '../components/common/ErrorMessage';

type CityDetailScreenRouteProp = RouteProp<RootStackParamList, 'CityDetail'>;

interface CityDetailScreenProps {
  route: CityDetailScreenRouteProp;
  navigation: any;
}

/**
 * CityDetailScreen - Now supports both current and historical weather data
 */
const CityDetailScreen: React.FC<CityDetailScreenProps> = ({ route, navigation }) => {
  const { city, historicalData, historicalTimestamp } = route.params;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(historicalData || null);
  const [loading, setLoading] = useState(!historicalData); // Only load if no historical data
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (historicalData && historicalTimestamp) {
      // If we have historical data, use it directly
      setLastUpdated(formatDate(historicalTimestamp));
    } else {
      // Otherwise fetch current data
      loadWeatherData();
    }
  }, [city, historicalData, historicalTimestamp]);

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
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
  const iconCode = weatherData.weather[0]?.icon || '01d';
  const feelsLike = kelvinToCelsius(weatherData.main.feels_like);
  const pressure = weatherData.main.pressure;

  // Determine if we're showing historical data
  const isHistoricalData = !!historicalData;

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isHistoricalData ? 'Historical Weather' : 'Weather Details'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* City Name */}
        <Text style={styles.cityTitle}>{city.name}, {city.country}</Text>
        
        {/* Weather Icon and Basic Info */}
        <View style={styles.weatherHeader}>
          <WeatherIcon 
            iconCode={iconCode}
            description={description}
            size="large"
            showDescription={true}
          />
          
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{temperature}°C</Text>
            <Text style={styles.weatherDescription}>{description}</Text>
            {isHistoricalData && (
              <Text style={styles.historicalBadge}>Historical Data</Text>
            )}
          </View>
        </View>

        <Divider style={styles.sectionDivider} />

        {/* Weather Details Table */}
        <View style={styles.weatherCard}>
          <Text style={styles.detailsTitle}>Weather Details</Text>
          <WeatherDetailRow 
            label="Description" 
            value={description}
          />
          <WeatherDetailRow 
            label="Temperature" 
            value={`${temperature}° C`}
          />
          <WeatherDetailRow 
            label="Feels Like" 
            value={`${feelsLike}° C`}
          />
          <WeatherDetailRow 
            label="Humidity" 
            value={`${humidity}%`}
          />
          <WeatherDetailRow 
            label="Windspeed" 
            value={`${windSpeed} km/h`}
          />
          <WeatherDetailRow 
            label="Pressure" 
            value={`${pressure} hPa`}
          />
        </View>

        {/* Last Updated / Historical Timestamp */}
        {lastUpdated && (
          <View style={styles.lastUpdatedContainer}>
            <Text style={styles.lastUpdated}>
              {isHistoricalData 
                ? `Historical weather data for ${city.name} recorded on\n${lastUpdated.replace(' - ', ' - ')}`
                : `Weather information for ${city.name} received on\n${lastUpdated.replace(' - ', ' - ')}`
              }
            </Text>
          </View>
        )}

        {/* Only show refresh for current data */}
        {error && weatherData && !isHistoricalData && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry}
            retryButtonText="Refresh Data"
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    height: 150,
    backgroundColor: '#2388C7',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cityTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  temperatureContainer: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'right',
    marginBottom: 4,
  },
  historicalBadge: {
    fontSize: 12,
    color: '#2388C7',
    fontWeight: '600',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sectionDivider: {
    marginVertical: 16,
    backgroundColor: '#E5E5E5',
  },
  weatherCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  lastUpdatedContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
  },
  lastUpdated: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});

export default CityDetailScreen;