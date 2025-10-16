import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherDetailRowProps {
  label: string;
  value: string;
  testID?: string;
}

/**
 * WeatherDetailRow component displays a label-value pair exactly like table design
 */
const WeatherDetailRow: React.FC<WeatherDetailRowProps> = ({ 
  label, 
  value, 
  testID 
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16, // Exact spacing like design
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5', // Light grey border like design
    marginHorizontal: 0, // No horizontal margin like design
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 17, // Exact font size like design
    fontWeight: '600', // Semibold like design
    color: '#000000',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 17, // Exact font size like design
    color: '#000000', // Black color like design
    fontWeight: '400', // Regular weight like design
  },
});

export default WeatherDetailRow;