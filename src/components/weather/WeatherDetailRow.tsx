import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherDetailRowProps {
  label: string;
  value: string;
  testID?: string;
}

/**
 * WeatherDetailRow component displays a label-value pair for weather details
 * @param label - The label text (e.g., "Temperature")
 * @param value - The value text (e.g., "20° C")
 * @param testID - Test ID for testing purposes
 */
const WeatherDetailRow: React.FC<WeatherDetailRowProps> = ({ 
  label, 
  value, 
  testID 
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
});

export default WeatherDetailRow;