import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { City } from '../services/types';
import { storageService } from '../services/storage';
import { weatherApi } from '../services/weatherApi';
import { validateCityName } from '../utils/helpers';
import { capitalizeWords } from '../utils/formatters';
import CityCard from '../components/weather/CityCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface CitiesScreenProps {
  navigation: any;
}

/**
 * CitiesScreen displays the list of saved cities and allows adding new cities
 * Features search functionality and city management (add/remove/view details/history)
 */
const CitiesScreen: React.FC<CitiesScreenProps> = ({ navigation }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cities when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCities();
    }, [])
  );

  /**
   * Loads cities from storage
   */
  const loadCities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedCities = await storageService.getCities();
      setCities(savedCities);
    } catch (err) {
      setError('Failed to load cities');
      console.error('Error loading cities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles adding a new city
   * Validates input, fetches weather data, and saves city if valid
   */
  const handleAddCity = async () => {
    const validation = validateCityName(searchQuery);
    if (!validation.isValid) {
      Alert.alert('Invalid City Name', validation.error);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const formattedCityName = capitalizeWords(searchQuery.trim());
      const result = await weatherApi.getCurrentWeather(formattedCityName);
      
      if (result.success && result.data) {
        const cityData: City = {
          name: result.data.name,
          country: result.data.sys.country,
        };
        
        const updatedCities = await storageService.saveCity(cityData);
        setCities(updatedCities);
        setSearchQuery('');
        
        // Save to historical data
        await storageService.saveWeatherData(cityData.name, result.data);
      } else {
        Alert.alert('Error', result.error || 'Failed to add city');
      }
    } catch (err) {
      setError('Failed to add city');
      console.error('Error adding city:', err);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handles city removal with confirmation dialog
   * @param cityName - Name of city to remove
   */
  const handleRemoveCity = (cityName: string) => {
    Alert.alert(
      'Remove City',
      `Are you sure you want to remove ${cityName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => removeCity(cityName),
        },
      ]
    );
  };

  /**
   * Removes city from storage
   * @param cityName - Name of city to remove
   */
  const removeCity = async (cityName: string) => {
    try {
      const updatedCities = await storageService.removeCity(cityName);
      setCities(updatedCities);
    } catch (err) {
      setError('Failed to remove city');
      console.error('Error removing city:', err);
    }
  };

  /**
   * Handles navigation to city details screen
   * @param city - City object to view details for
   */
  const handleCityPress = (city: City) => {
    navigation.navigate('CityDetail', { city });
  };

  /**
   * Handles navigation to historical data screen
   * @param city - City object to view history for
   */
  const handleHistoryPress = (city: City) => {
    navigation.navigate('HistoricalData', { city });
  };

  const renderCityItem = ({ item }: { item: City }) => (
    <CityCard
      city={item}
      onPress={handleCityPress}
      onHistoryPress={handleHistoryPress}
      onRemovePress={handleRemoveCity}
    />
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading cities..." />;
  }

  if (error && cities.length === 0) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadCities} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cities</Text>
      
      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for cities"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleAddCity}
          returnKeyType="search"
          testID="city-search-input"
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            (!searchQuery.trim() || isSearching) && styles.addButtonDisabled,
          ]}
          onPress={handleAddCity}
          disabled={!searchQuery.trim() || isSearching}
          testID="add-city-button"
        >
          <Text style={styles.addButtonText}>
            {isSearching ? 'Adding...' : '+ Add city'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Cities List */}
      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => `${item.name}-${item.country}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No cities added yet</Text>
        }
        testID="cities-list"
      />

      {error && cities.length > 0 && (
        <ErrorMessage 
          message={error} 
          onRetry={loadCities}
          retryButtonText="Reload Cities"
        />
      )}
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
  searchSection: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    minWidth: 80,
  },
  addButtonDisabled: {
    backgroundColor: '#CCC',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
});

export default CitiesScreen;