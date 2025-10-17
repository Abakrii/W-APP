import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { HistoricalEntry, City } from "../../services/types";

export type HistoricalDataScreenRouteProp = RouteProp<
  RootStackParamList,
  "HistoricalData"
>;

export interface HistoricalDataScreenProps {
  route: HistoricalDataScreenRouteProp;
  navigation: any;
}

export interface HistoricalDataScreenState {
  historicalData: HistoricalEntry[];
  loading: boolean;
  error: string | null;
}

export interface HistoryItemDisplayData {
  dateText: string;
  weatherText: string;
  temperature: string;
  description: string;
}
