import { City } from "../../services/types";
import { NavigationProp } from "@react-navigation/native";

export interface CitiesScreenProps {
  navigation: NavigationProp<any>;
}

export interface CitiesScreenState {
  cities: City[];
  isLoading: boolean;
  snackbarVisible: boolean;
  snackbarMessage: string;
  addModalVisible: boolean;
  newCityName: string;
  isAdding: boolean;
}

// Mock navigation type for testing
export type MockNavigation = {
  navigate: (screen: string, params?: any) => void;
};
