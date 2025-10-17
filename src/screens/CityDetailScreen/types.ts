import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { WeatherData, City } from "../../services/types";

export type CityDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "CityDetail"
>;

export interface CityDetailScreenProps {
  route: CityDetailScreenRouteProp;
  navigation: any;
}

export interface CityDetailScreenState {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}

export interface WeatherDisplayData {
  temperature: string;
  description: string;
  humidity: number;
  windSpeed: number;
  iconCode: string;
  feelsLike: string;
  pressure: number;
  isHistoricalData: boolean;
}
