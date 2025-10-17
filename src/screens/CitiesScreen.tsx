import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Snackbar,
  Modal,
  Portal,
  TextInput,
  FAB,
} from 'react-native-paper';
import { City } from '../services/types';
import { storageService } from '../services/storage';
import { weatherApi } from '../services/weatherApi';
import { validateCityName } from '../utils/helpers';
import { capitalizeFirst } from '../utils/formatters';

interface CitiesScreenProps {
  navigation: any;
}

/**
 * CitiesScreen - With round blue FAB button on the right
 */
const CitiesScreen: React.FC<CitiesScreenProps> = ({ navigation }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCities();
    }, [])
  );

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const savedCities = await storageService.getCities();
      setCities(savedCities);
    } catch (err) {
      showSnackbar('Failed to load cities');
      console.error('Error loading cities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      showSnackbar('Please enter a city name');
      return;
    }

    const validation = validateCityName(newCityName);
    if (!validation.isValid) {
      showSnackbar(validation.error || 'Invalid city name');
      return;
    }

    setIsAdding(true);
    
    try {
      const formattedCityName = capitalizeFirst(newCityName.trim());
      const result = await weatherApi.getCurrentWeather(formattedCityName);
      
      if (result.success && result.data) {
        const cityData: City = {
          name: result.data.name,
          country: result.data.sys.country,
        };
        
        const updatedCities = await storageService.saveCity(cityData);
        setCities(updatedCities);
        setNewCityName('');
        setAddModalVisible(false);
        
        await storageService.saveWeatherData(cityData.name, result.data);
        showSnackbar(`${cityData.name} added successfully`);
      } else {
        showSnackbar(result.error || 'City not found');
      }
    } catch (err) {
      showSnackbar('Failed to add city');
      console.error('Error adding city:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCity = async (cityName: string) => {
    try {
      const updatedCities = await storageService.removeCity(cityName);
      setCities(updatedCities);
      showSnackbar(`${cityName} removed`);
    } catch (err) {
      showSnackbar('Failed to remove city');
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
    <View style={styles.cityItem}>
      <TouchableOpacity 
        style={styles.cityContent}
        onPress={() => handleCityPress(item)}
      >
        <Text style={styles.dash}>-</Text>
        <Text style={styles.cityText}>
          {item.name}, {item.country}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <Button
          mode="contained"
          buttonColor="#34C759"
          textColor="#FFFFFF"
          style={styles.historyButton}
          onPress={() => handleHistoryPress(item)}
          compact
        >
          History
        </Button>
        <Button
          mode="contained"
          buttonColor="#FF3B30"
          textColor="#FFFFFF"
          style={styles.removeButton}
          onPress={() => handleRemoveCity(item.name)}
          compact
        >
          Remove
        </Button>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading cities...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
     
      {/* Content */}
      <View style={styles.content}>
        {/* Cities List */}
        <FlatList
          data={cities}
          renderItem={renderCityItem}
          keyExtractor={(item) => `${item.name}-${item.country}`}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No cities added yet
              </Text>
            </View>
          }
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        {/* Divider Line - Only show if there are cities */}
        {cities.length > 0 && (
          <Divider style={styles.divider} />
        )}
      </View>

      {/* Floating Action Button - Round blue button on the right */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#FFFFFF"
        onPress={() => setAddModalVisible(true)}
        customSize={56} // Standard FAB size
      />

      {/* Add City Modal */}
      <Portal>
        <Modal
          visible={addModalVisible}
          onDismiss={() => setAddModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add New City</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter city name"
            value={newCityName}
            onChangeText={setNewCityName}
            onSubmitEditing={handleAddCity}
            returnKeyType="done"
            style={styles.modalInput}
            autoFocus
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setAddModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddCity}
              loading={isAdding}
              disabled={isAdding}
              style={styles.addButton}
            >
              Add City
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Snackbar for messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dash: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '400',
    marginRight: 8,
    width: 10,
  },
  cityText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '400',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyButton: {
    borderRadius: 6,
  },
  removeButton: {
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 17,
    color: '#666666',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 20,
  },
  // FAB Styles - Round blue button on the right
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2388C7', // Exact color from specs
  },
  // Modal styles
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    borderColor: '#C6C6C8',
  },
  addButton: {
    backgroundColor: '#2388C7', // Same blue as FAB
  },
});

export default CitiesScreen;