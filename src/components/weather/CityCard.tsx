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
 * CityCard component displays a city exactly like the design with dash prefix
 */
const CityCard: React.FC<CityCardProps> = ({
  city,
  onPress,
  onHistoryPress,
  onRemovePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Dash before city name exactly like design */}
      <Text style={styles.dash}>-</Text>
      
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 0, // No borders like design
  },
  dash: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '400',
    marginRight: 8,
    width: 10, // Fixed width for alignment
  },
  cityInfo: {
    flex: 1,
  },
  cityText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '400', // Regular weight like design
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyButton: {
    backgroundColor: '#34C759', // Green like design
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
    backgroundColor: '#FF3B30', // Red like design
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