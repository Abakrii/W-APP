import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { City } from '../../services/types';

interface CityCardProps {
  city: City;
  onPress: (city: City) => void;
  onHistoryPress: (city: City) => void;
  onRemovePress: (cityName: string) => void;
}

/**
 * CityCard component displays a city with actions for viewing details, history, and removal
 * @param city - City object to display
 * @param onPress - Callback when city is pressed for details
 * @param onHistoryPress - Callback when history button is pressed
 * @param onRemovePress - Callback when remove button is pressed
 */
const CityCard: React.FC<CityCardProps> = ({
  city,
  onPress,
  onHistoryPress,
  onRemovePress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.cityInfo}
        onPress={() => onPress(city)}
        testID={`city-card-${city.name}`}
      >
        <Text style={styles.cityText}>
          {city.name}, {city.country}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => onHistoryPress(city)}
          testID={`history-button-${city.name}`}
        >
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemovePress(city.name)}
          testID={`remove-button-${city.name}`}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cityInfo: {
    flex: 1,
  },
  cityText: {
    fontSize: 17,
    color: '#000',
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CityCard;