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
import { kelvinToCelsius } from '../services/weatherApi';
import { formatHistoricalDate, capitalizeFirst } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

type HistoricalDataScreenRouteProp = RouteProp<RootStackParamList, 'HistoricalData'>;

interface HistoricalDataScreenProps {
  route: HistoricalDataScreenRouteProp;
}

/**
 * HistoricalDataScreen displays historical weather data exactly like the design
 */
const HistoricalDataScreen: React.FC<HistoricalDataScreenProps> = ({ route }) => {
  const { city } = route.params;
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistoricalData();
  }, [city]);

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

  const renderHistoryItem = ({ item }: { item: HistoricalEntry }) => {
    const temperature = kelvinToCelsius(item.data.main.temp);
    const description = item.data.weather[0]?.description 
      ? capitalizeFirst(item.data.weather[0].description)
      : 'N/A';
    
    return (
      <View style={styles.historyItem} testID={`history-item-${item.timestamp}`}>
        <Text style={styles.dateText}>{formatHistoricalDate(item.timestamp)}</Text>
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
      {/* Title exactly like design */}
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
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60, // Exact spacing like design
  },
  title: {
    fontSize: 34, // Exact size like design
    fontWeight: '700', // Bold like design
    color: '#000000',
    marginBottom: 30, // Exact spacing like design
  },
  list: {
    flex: 1,
  },
  historyItem: {
    paddingVertical: 12, // Exact spacing like design
    paddingHorizontal: 0,
    borderBottomWidth: 0, // No borders like design
  },
  dateText: {
    fontSize: 17, // Exact font size like design
    color: '#000000', // Black color like design
    fontWeight: '400', // Regular weight like design
    marginBottom: 4, // Exact spacing like design
  },
  weatherText: {
    fontSize: 17, // Exact font size like design
    fontWeight: '600', // Bold weight like design (from the bold text in design)
    color: '#000000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 17,
    marginTop: 40,
    fontStyle: 'italic',
  },
});

export default HistoricalDataScreen;