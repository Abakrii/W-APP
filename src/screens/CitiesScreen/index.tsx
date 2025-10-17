import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Snackbar,
  Modal,
  Portal,
  TextInput,
  FAB,
} from "react-native-paper";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { City } from "../../services/types";
import { storageService } from "../../services/storage";
import { weatherApi } from "../../services/weatherApi";
import { validateCityName } from "../../utils/helpers";
import { capitalizeFirst } from "../../utils/formatters";
import { CitiesScreenProps } from "./types";

const CitiesScreen: React.FC<CitiesScreenProps> = ({ navigation }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const swipeableRefs = useRef<{ [key: string]: Swipeable }>({});

  useFocusEffect(
    useCallback(() => {
      loadCities();
    }, [])
  );

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const savedCities = await storageService.getCities();
      setCities(savedCities);
    } catch (err) {
      showSnackbar("Failed to load cities");
      console.error("Error loading cities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      showSnackbar("Please enter a city name");
      return;
    }

    const validation = validateCityName(newCityName);
    if (!validation.isValid) {
      showSnackbar(validation.error || "Invalid city name");
      return;
    }

    setIsAdding(true);

    try {
      const formattedCityName = capitalizeFirst(newCityName.trim());
      const result = await weatherApi.getCurrentWeather(formattedCityName);

      if (result.success && result.data) {
        const cityData: City = {
          name: result.data.name,
          country: result.data.sys.country,
        };

        const updatedCities = await storageService.saveCity(cityData);
        setCities(updatedCities);
        setNewCityName("");
        setAddModalVisible(false);

        await storageService.saveWeatherData(cityData.name, result.data);
        showSnackbar(`${cityData.name} added successfully`);
      } else {
        showSnackbar(result.error || "City not found");
      }
    } catch (err) {
      showSnackbar("Failed to add city");
      console.error("Error adding city:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCity = async (cityName: string) => {
    try {
      // Close the swipeable
      if (swipeableRefs.current[cityName]) {
        swipeableRefs.current[cityName].close();
        delete swipeableRefs.current[cityName];
      }

      const updatedCities = await storageService.removeCity(cityName);
      setCities(updatedCities);
      showSnackbar(`${cityName} removed`);
    } catch (err) {
      showSnackbar("Failed to remove city");
      console.error("Error removing city:", err);
    }
  };

  const handleCityPress = (city: City) => {
    navigation.navigate("CityDetail", { city });
  };

  const handleHistoryPress = (city: City) => {
    navigation.navigate("HistoricalData", { city });
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    city: City
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.swipeActions}>
        <RectButton
          style={[styles.deleteButton, styles.rightAction]}
          onPress={() => handleRemoveCity(city.name)}
        >
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            Delete
          </Animated.Text>
        </RectButton>
      </View>
    );
  };

  const setSwipeableRef = (cityName: string, ref: Swipeable) => {
    if (ref) {
      swipeableRefs.current[cityName] = ref;
    }
  };

  const renderCityItem = ({ item }: { item: City }) => (
    <Swipeable
      ref={(ref) => setSwipeableRef(item.name, ref!)}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      rightThreshold={40}
      friction={2}
      testID={`swipeable-${item.name}`}
    >
      <View style={styles.cityItem} testID={`city-item-${item.name}`}>
        <View style={styles.cityContent}>
          <Text style={styles.dash}>-</Text>
          <View style={styles.cityTextContainer}>
            <Text
              style={styles.cityText}
              onPress={() => handleCityPress(item)}
              testID={`city-press-${item.name}`}
            >
              {item.name}, {item.country}
            </Text>
          </View>
        </View>

        <View style={styles.actions} testID={`actions-${item.name}`}>
          <Button
            mode="contained"
            buttonColor="#34C759"
            textColor="#FFFFFF"
            style={styles.historyButton}
            onPress={() => handleHistoryPress(item)}
            compact
            testID={`history-button-${item.name}`}
          >
            History
          </Button>
        </View>
      </View>
    </Swipeable>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} testID="loading-container">
        <ActivityIndicator size="large" testID="loading-indicator" />
        <Text style={styles.loadingText}>Loading cities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="cities-screen">
      {/* Content */}
      <View style={styles.content}>
        {/* Cities List */}
        <FlatList
          data={cities}
          renderItem={renderCityItem}
          keyExtractor={(item) => `${item.name}-${item.country}`}
          ListEmptyComponent={
            <View style={styles.emptyContainer} testID="empty-container">
              <Text style={styles.emptyText}>No cities added yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first city
              </Text>
            </View>
          }
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          testID="cities-list"
        />

        {/* Divider Line - Only show if there are cities */}
        {cities.length > 0 && (
          <Divider style={styles.divider} testID="divider" />
        )}
      </View>

      {/* Floating Action Button - Round blue button on the right */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#FFFFFF"
        onPress={() => setAddModalVisible(true)}
        customSize={56}
        testID="add-city-fab"
      />

      {/* Add City Modal */}
      <Portal>
        <Modal
          visible={addModalVisible}
          onDismiss={() => setAddModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
          testID="add-city-modal"
        >
          <Text style={styles.modalTitle}>Add New City</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter city name"
            value={newCityName}
            onChangeText={setNewCityName}
            onSubmitEditing={handleAddCity}
            returnKeyType="done"
            style={styles.modalInput}
            autoFocus
            testID="city-name-input"
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setAddModalVisible(false)}
              style={styles.cancelButton}
              testID="cancel-button"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddCity}
              loading={isAdding}
              disabled={isAdding}
              style={styles.addButton}
              testID="add-city-button"
            >
              Add City
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Snackbar for messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
        testID="snackbar"
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: "#FFFFFF",
  },
  cityContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cityTextContainer: {
    flex: 1,
  },
  dash: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "400",
    marginRight: 8,
    width: 10,
  },
  cityText: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "400",
    paddingVertical: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyButton: {
    borderRadius: 6,
  },
  swipeActions: {
    flexDirection: "row",
    width: 100,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 17,
    color: "#666666",
    fontStyle: "italic",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2388C7",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    borderColor: "#C6C6C8",
  },
  addButton: {
    backgroundColor: "#2388C7",
  },
});

export default CitiesScreen;
