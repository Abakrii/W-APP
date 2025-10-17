import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherDetailRowProps {
  label: string;
  value: string;
  testID?: string;
}

/**
 * WeatherDetailRow component displays a label-value pair for weather details
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
});

export default WeatherDetailRow;