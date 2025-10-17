import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Using plain objects to avoid StyleSheet issues in tests
export const styles = {
  header: {
    width: "100%",
    height: 150,
    backgroundColor: "#2388C7",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backIcon: {
    margin: 0,
    backgroundColor: "transparent",
  },
  titleContainer: {
    width: "100%",
  },
  titleContainerWithBackButton: {
    paddingLeft: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
  },
} as const;
