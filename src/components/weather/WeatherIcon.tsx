import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

interface WeatherIconProps {
  iconCode: string;
  description: string;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
}

/**
 * WeatherIcon component displays weather icon from OpenWeatherMap
 * @param iconCode - Icon code from API (e.g., "01d", "02n")
 * @param description - Weather description for accessibility
 * @param size - Size of the icon
 * @param showDescription - Whether to show text description below icon
 */
const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  description, 
  size = 'medium',
  showDescription = false 
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 120;
      case 'medium':
      default:
        return 80;
    }
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const iconSize = getIconSize();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        {loading && (
          <ActivityIndicator size="small" color="#2388C7" style={styles.loader} />
        )}
        <Image
          source={{ uri: iconUrl }}
          style={[
            styles.weatherIcon,
            { width: iconSize, height: iconSize },
            loading && styles.hiddenImage
          ]}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode="contain"
          accessibilityLabel={description}
        />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>🌤️</Text>
          </View>
        )}
      </View>
      
      {showDescription && (
        <Text variant="bodyMedium" style={styles.descriptionText}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  weatherIcon: {
    borderRadius: 8,
  },
  hiddenImage: {
    opacity: 0,
  },
  loader: {
    position: 'absolute',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 24,
  },
  descriptionText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
  },
});

export default WeatherIcon;