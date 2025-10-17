export interface WeatherIconProps {
  iconCode: string;
  description: string;
  size?: "small" | "medium" | "large";
  showDescription?: boolean;
}

export type WeatherIconSize = "small" | "medium" | "large";
