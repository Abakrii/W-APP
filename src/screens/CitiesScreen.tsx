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
import { capitalizeFirst } from '../utils/formatters';
import CityCard from '../components/weather/CityCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface CitiesScreenProps {
  navigation: any;
}

/**
 * CitiesScreen displays the list of saved cities exactly like the design
 * Features search functionality and city management
 */
const CitiesScreen: React.FC<CitiesScreenProps> = ({ navigation }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadCities();
    }, [])
  );

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

  const handleAddCity = async () => {
    if (!searchQuery.trim()) {
      // When search is empty, just clear and show default list like design
      setSearchQuery('');
      return;
    }

    const validation = validateCityName(searchQuery);
    if (!validation.isValid) {
      Alert.alert('Invalid City Name', validation.error);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const formattedCityName = capitalizeFirst(searchQuery.trim());
      const result = await weatherApi.getCurrentWeather(formattedCityName);
      
      if (result.success && result.data) {
        const cityData: City = {
          name: result.data.name,
          country: result.data.sys.country,
        };
        
        const updatedCities = await storageService.saveCity(cityData);
        setCities(updatedCities);
        setSearchQuery('');
        
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

  const removeCity = async (cityName: string) => {
    try {
      const updatedCities = await storageService.removeCity(cityName);
      setCities(updatedCities);
    } catch (err) {
      setError('Failed to remove city');
      console.error('Error removing city:', err);
    }
  };

  const handleCityPress = (city: City) => {
    navigation.navigate('CityDetail', { city });
  };

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
      {/* Title - Exact match to design */}
      <Text style={styles.title}>Cities</Text>
      
      {/* Cities List - Exact match to design with dashes */}
      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => `${item.name}-${item.country}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No cities added yet</Text>
        }
        style={styles.list}
      />

      {/* Divider - Exact match to design */}
      <View style={styles.divider} />

      {/* Search/Add Section - Exact match to design */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for cities"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleAddCity}
          returnKeyType="done"
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
    paddingHorizontal: 24,
    paddingTop: 60, // Exact spacing from top like design
  },
  title: {
    fontSize: 34, // Exact size like design
    fontWeight: '700', // Bold like design
    color: '#000000',
    marginBottom: 30, // Exact spacing like design
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5', // Light grey like design
    marginBottom: 20, // Exact spacing like design
  },
  searchSection: {
    flexDirection: 'row',
    marginBottom: 30, // Exact spacing like design
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0, // No border like design
    fontSize: 17, // Exact font size like design
    color: '#000000',
    paddingVertical: 12,
    // No background, no border like design
  },
  addButton: {
    backgroundColor: 'transparent', // Transparent like design
    paddingHorizontal: 0,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#007AFF', // Blue color like design
    fontSize: 17, // Exact font size like design
    fontWeight: '400', // Regular weight like design
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 17,
    marginTop: 40,
    fontStyle: 'italic',
  },
});

export default CitiesScreen;