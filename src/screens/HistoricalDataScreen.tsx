import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { RootStackParamList } from "../../App";
import { HistoricalEntry } from "../services/types";
import { storageService } from "../services/storage";
import { kelvinToCelsius } from "../services/weatherApi";
import { formatHistoricalDate, capitalizeFirst } from "../utils/formatters";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

type HistoricalDataScreenRouteProp = RouteProp<
  RootStackParamList,
  "HistoricalData"
>;

interface HistoricalDataScreenProps {
  route: HistoricalDataScreenRouteProp;
  navigation: any;
}

/**
 * HistoricalDataScreen with View Details buttons for each entry
 */
const HistoricalDataScreen: React.FC<HistoricalDataScreenProps> = ({
  route,
  navigation,
}) => {
  const { city } = route.params;
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistoricalData();
  }, [city]);

  const loadHistoricalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await storageService.getHistoricalData(city.name);
      setHistoricalData(data);
    } catch (err) {
      setError("Failed to load historical data");
      console.error("Error loading historical data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (historicalEntry: HistoricalEntry) => {
    // Navigate to City Detail screen with historical data
    navigation.navigate("CityDetail", {
      city: city,
      historicalData: historicalEntry.data,
      historicalTimestamp: historicalEntry.timestamp,
    });
  };

  const renderHistoryItem = ({ item }: { item: HistoricalEntry }) => {
    const temperature = kelvinToCelsius(item.data.main.temp);
    const description = item.data.weather[0]?.description
      ? capitalizeFirst(item.data.weather[0].description)
      : "N/A";

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyContent}>
          <Text style={styles.dateText}>
            {formatHistoricalDate(item.timestamp)}
          </Text>
          <Text style={styles.weatherText}>
            {description}, {temperature}°C
          </Text>
        </View>
        <Button
          mode="contained"
          buttonColor="#2388C7"
          textColor="#FFFFFF"
          style={styles.viewDetailsButton}
          onPress={() => handleViewDetails(item)}
          compact
        >
          View Details
        </Button>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading historical data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadHistoricalData}
        retryButtonText="Retry"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historicalData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.timestamp}
        ListEmptyComponent={
          <Text style={styles.emptyText} testID="empty-history">
            No historical data available
          </Text>
        }
        testID="historical-data-list"
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
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
  list: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  historyContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  viewDetailsButton: {
    borderRadius: 6,
    marginLeft: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#666666",
    fontSize: 17,
    marginTop: 40,
    fontStyle: "italic",
  },
});

export default HistoricalDataScreen;
