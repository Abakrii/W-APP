import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { 
  Text, 
  Modal, 
  Portal,
  Button,
  Divider
} from "react-native-paper";
import { RootStackParamList } from "../../../App";
import { WeatherData } from "../../services/types";
import { weatherApi, kelvinToCelsius } from "../../services/weatherApi";
import { storageService } from "../../services/storage";
import { formatDate, capitalizeFirst } from "../../utils/formatters";
import WeatherIcon from "../../components/weather/WeatherIcon";
import ErrorMessage from "../../components/common/ErrorMessage";
import { CityDetailScreenProps, WeatherDisplayData } from "./types";

/**
 * CityDetailScreen - Shows weather data in dialog with last updated text outside
 */
const CityDetailScreen: React.FC<CityDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { city, historicalData, historicalTimestamp } = route.params;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(
    historicalData || null
  );
  const [loading, setLoading] = useState(!historicalData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dialogVisible, setDialogVisible] = useState(true);

  useEffect(() => {
    if (historicalData && historicalTimestamp) {
      setLastUpdated(formatDate(historicalTimestamp));
    } else {
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

  const handleClose = () => {
    setDialogVisible(false);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.dialogContent}>
          <Text style={styles.loadingText}>Loading weather data...</Text>
          <Button 
            mode="outlined" 
            onPress={handleClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      );
    }

    if (error && !weatherData) {
      return (
        <View style={styles.dialogContent}>
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            retryButtonText="Retry"
          />
          <Button 
            mode="outlined" 
            onPress={handleClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      );
    }

    if (!weatherData) {
      return (
        <View style={styles.dialogContent}>
          <Text style={styles.noDataText}>No weather data available</Text>
          <Button 
            mode="outlined" 
            onPress={handleClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      );
    }

    const displayData = getWeatherDisplayData();
    if (!displayData) {
      return (
        <View style={styles.dialogContent}>
          <Text style={styles.noDataText}>Unable to process weather data</Text>
          <Button 
            mode="outlined" 
            onPress={handleClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.dialogContent}>
        {/* City Title */}
        <Text style={styles.cityTitle}>
          {city.name}, {city.country}
        </Text>

        {/* Weather Icon */}
        <WeatherIcon
          iconCode={displayData.iconCode}
          description={displayData.description}
          size="large"
          showDescription={false}
          style={styles.weatherIcon}
        />

        <Divider style={styles.titleDivider} />

        {/* Weather Details Table */}
        <View style={styles.detailsTable}>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{displayData.description}</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.value}>{displayData.temperature}° C</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.label}>Humidity</Text>
            <Text style={styles.value}>{displayData.humidity}%</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.label}>Windspeed</Text>
            <Text style={styles.value}>{displayData.windSpeed} km/h</Text>
          </View>
        </View>

        {/* Close Button */}
        <Button 
          mode="contained" 
          onPress={handleClose}
          style={styles.closeButton}
          labelStyle={styles.closeButtonLabel}
        >
          Close
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Last Updated Text - Outside the dialog */}
      {lastUpdated && weatherData && (
        <View style={styles.lastUpdatedContainer}>
          <Text style={styles.lastUpdatedText}>
            Weather information for {city.name} received on{"\n"}
            {lastUpdated}
          </Text>
        </View>
      )}

      {/* Dialog with weather data */}
      <Portal>
        <Modal
          visible={dialogVisible}
          onDismiss={handleClose}
          contentContainerStyle={styles.dialogContainer}
        >
          {renderContent()}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  // Last Updated Text Styles (Outside dialog)
  lastUpdatedContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#F8F8F8",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  lastUpdatedText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  // Dialog Styles
  dialogContainer: {
    backgroundColor: "white",
    margin: 24,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dialogContent: {
    padding: 0,
    alignItems: "center",
  },
  cityTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  weatherIcon: {
    marginVertical: 10,
  },
  titleDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    width: "100%",
    marginVertical: 10,
  },
  detailsTable: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#2388C7",
    fontWeight: "400",
    textAlign: "right",
    flex: 1,
  },
  closeButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: "#2388C7",
    borderRadius: 4,
    paddingVertical: 8,
    minWidth: 100,
  },
  closeButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default CityDetailScreen;