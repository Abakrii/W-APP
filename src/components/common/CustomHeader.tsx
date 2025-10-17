import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface CustomHeaderProps {
  title: string;
}

const { width } = Dimensions.get("window");

/**
 * CustomHeader - Blue header matching exact specifications
 * Width: 360px, Height: 150px, Color: #2388C7
 */
const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%", // Exact width from specs
    height: 150, // Exact height from specs
    backgroundColor: "#2388C7", // Exact color from specs
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 16,
    // Center the header on wider screens
    alignSelf: "center",
    marginHorizontal: width > 360 ? (width - 360) / 2 : 0,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
  },
});

export default CustomHeader;
