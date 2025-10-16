import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
}

/**
 * LoadingSpinner component displays a loading indicator with optional message
 * @param size - Size of the spinner ('small' or 'large')
 * @param message - Optional message to display below the spinner
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  message = 'Loading...' 
}) => {
  return (
    <View style={styles.container} testID="loading-spinner">
      <ActivityIndicator size={size} color="#007AFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingSpinner;