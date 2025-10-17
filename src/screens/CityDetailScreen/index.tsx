import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Text, Divider, ActivityIndicator } from "react-native-paper";
import { RootStackParamList } from "../../../App";
import { WeatherData } from "../../services/types";
import { weatherApi, kelvinToCelsius } from "../../services/weatherApi";
import { storageService } from "../../services/storage";
import { formatDate, capitalizeFirst } from "../../utils/formatters";
import WeatherDetailRow from "../../components/weather/WeatherDetailRow";
import WeatherIcon from "../../components/weather/WeatherIcon";
import ErrorMessage from "../../components/common/ErrorMessage";
import { CityDetailScreenProps, WeatherDisplayData } from "./types";

/**
 * CityDetailScreen - Now supports both current and historical weather data
 */
const CityDetailScreen: React.FC<CityDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { city, historicalData, historicalTimestamp } = route.params;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(
    historicalData || null
  );
  const [loading, setLoading] = useState(!historicalData); // Only load if no historical data
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    if (historicalData && historicalTimestamp) {
      // If we have historical data, use it directly
      setLastUpdated(formatDate(historicalTimestamp));
    } else {
      // Otherwise fetch current data
      loadWeatherData();
    }
  }, [city, historicalData, historicalTimestamp]);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await weatherApi.getCurrentWeather(city.name);

      if (result.success && result.data) {
        setWeatherData(result.data);

        await storageService.saveWeatherData(city.name, result.data);

        const now = new Date();
        setLastUpdated(formatDate(now));
      } else {
        setError(result.error || "Failed to load weather data");
      }
    } catch (err) {
      setError("Failed to load weather data");
      console.error("Error loading weather data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadWeatherData();
  };

  const getWeatherDisplayData = (): WeatherDisplayData | null => {
    if (!weatherData) return null;

    return {
      temperature: kelvinToCelsius(weatherData.main.temp),
      description: weatherData.weather[0]?.description
        ? capitalizeFirst(weatherData.weather[0].description)
        : "N/A",
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      iconCode: weatherData.weather[0]?.icon || "01d",
      feelsLike: kelvinToCelsius(weatherData.main.feels_like),
      pressure: weatherData.main.pressure,
      isHistoricalData: !!historicalData,
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer} testID="loading-container">
        <ActivityIndicator size="large" testID="loading-indicator" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error && !weatherData) {
    return (
      <ErrorMessage
        message={error}
        onRetry={handleRetry}
        retryButtonText="Retry"
        testID="error-message"
      />
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.centerContainer} testID="no-data-container">
        <Text>No weather data available</Text>
      </View>
    );
  }

  const displayData = getWeatherDisplayData();
  if (!displayData) {
    return (
      <View style={styles.centerContainer}>
        <Text>Unable to process weather data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="city-detail-screen">
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        testID="weather-scrollview"
      >
        {/* City Name */}
        <Text style={styles.cityTitle} testID="city-title">
          {city.name}, {city.country}
        </Text>

        {/* Weather Icon and Basic Info */}
        <View style={styles.weatherHeader} testID="weather-header">
          <WeatherIcon
            iconCode={displayData.iconCode}
            description={displayData.description}
            size="large"
            showDescription={true}
            testID="weather-icon"
          />

          <View
            style={styles.temperatureContainer}
            testID="temperature-container"
          >
            <Text style={styles.temperature} testID="temperature-text">
              {displayData.temperature}°C
            </Text>
            <Text style={styles.weatherDescription} testID="description-text">
              {displayData.description}
            </Text>
            {displayData.isHistoricalData && (
              <Text style={styles.historicalBadge} testID="historical-badge">
                Historical Data
              </Text>
            )}
          </View>
        </View>

        <Divider style={styles.sectionDivider} testID="section-divider" />

        {/* Weather Details Table */}
        <View style={styles.weatherCard} testID="weather-details-card">
          <Text style={styles.detailsTitle} testID="details-title">
            Weather Details
          </Text>
          <WeatherDetailRow
            label="Description"
            value={displayData.description}
            testID="detail-description"
          />
          <WeatherDetailRow
            label="Temperature"
            value={`${displayData.temperature}° C`}
            testID="detail-temperature"
          />
          <WeatherDetailRow
            label="Feels Like"
            value={`${displayData.feelsLike}° C`}
            testID="detail-feels-like"
          />
          <WeatherDetailRow
            label="Humidity"
            value={`${displayData.humidity}%`}
            testID="detail-humidity"
          />
          <WeatherDetailRow
            label="Windspeed"
            value={`${displayData.windSpeed} km/h`}
            testID="detail-windspeed"
          />
          <WeatherDetailRow
            label="Pressure"
            value={`${displayData.pressure} hPa`}
            testID="detail-pressure"
          />
        </View>

        {/* Last Updated / Historical Timestamp */}
        {lastUpdated && (
          <View
            style={styles.lastUpdatedContainer}
            testID="last-updated-container"
          >
            <Text style={styles.lastUpdated} testID="last-updated-text">
              {displayData.isHistoricalData
                ? `Historical weather data for ${
                    city.name
                  } recorded on\n${lastUpdated.replace(" - ", " - ")}`
                : `Weather information for ${
                    city.name
                  } received on\n${lastUpdated.replace(" - ", " - ")}`}
            </Text>
          </View>
        )}

        {/* Only show refresh for current data */}
        {error && weatherData && !displayData.isHistoricalData && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            retryButtonText="Refresh Data"
            testID="refresh-error-message"
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    width: "100%",
    height: 150,
    backgroundColor: "#2388C7",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cityTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 24,
    textAlign: "center",
  },
  weatherHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  temperatureContainer: {
    alignItems: "flex-end",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "300",
    color: "#000000",
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "right",
    marginBottom: 4,
  },
  historicalBadge: {
    fontSize: 12,
    color: "#2388C7",
    fontWeight: "600",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  sectionDivider: {
    marginVertical: 16,
    backgroundColor: "#E5E5E5",
  },
  weatherCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  lastUpdatedContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 16,
  },
  lastUpdated: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});

export default CityDetailScreen;
