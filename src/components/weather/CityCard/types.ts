import { City } from "../../../services/types";

export interface CityCardProps {
  city: City;
  onPress: (city: City) => void;
  onHistoryPress: (city: City) => void;
  onRemovePress: (cityName: string) => void;
}

// Re-export City type for convenience
export type { City };
