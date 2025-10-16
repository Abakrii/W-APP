import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { HistoricalEntry } from '../services/types';
import { storageService } from '../services/storage';
import { kelvinToCelsius } from '../utils/helpers';
import { formatDate, capitalizeWords } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

type HistoricalDataScreenRouteProp = RouteProp<RootStackParamList, 'HistoricalData'>;

interface HistoricalDataScreenProps {
  route: HistoricalDataScreenRouteProp;
}

/**
 * HistoricalDataScreen displays historical weather data for a selected city
 * Shows all previous weather requests with timestamps and weather conditions
 */
const HistoricalDataScreen: React.FC<HistoricalDataScreenProps> = ({ route }) => {
  const { city } = route.params;
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistoricalData();
  }, [city]);

  /**
   * Loads historical weather data for the city from storage
   */
  const loadHistoricalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await storageService.getHistoricalData(city.name);
      setHistoricalData(data);
    } catch (err) {
      setError('Failed to load historical data');
      console.error('Error loading historical data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders each historical weather entry in the list
   * @param item - Historical weather data entry
   */
  const renderHistoryItem = ({ item }: { item: HistoricalEntry }) => {
    const temperature = kelvinToCelsius(item.data.main.temp);
    const description = item.data.weather[0]?.description 
      ? capitalizeWords(item.data.weather[0].description)
      : 'N/A';
    
    return (
      <View style={styles.historyItem} testID={`history-item-${item.timestamp}`}>
        <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        <Text style={styles.weatherText}>
          {description}, {temperature}°C
        </Text>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading historical data..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadHistoricalData}
        retryButtonText="Retry"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{city.name} historical</Text>
      
      <FlatList
        data={historicalData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.timestamp}
        ListEmptyComponent={
          <Text style={styles.emptyText} testID="empty-history">
            No historical data available
          </Text>
        }
        testID="historical-data-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  historyItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
});

export default HistoricalDataScreen;