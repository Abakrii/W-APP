import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { IconButton } from "react-native-paper";
import { styles } from "./styles";
import { CustomHeaderProps } from "./types";

/**
 * CustomHeader - Blue header with back button support
 */
const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View style={styles.header} testID="custom-header">
      {/* Back Button - Top Left */}
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID="back-button"
          accessibilityLabel="Back button"
          accessibilityRole="button"
        >
          <IconButton
            icon="arrow-left"
            iconColor="#FFFFFF"
            size={24}
            style={styles.backIcon}
            testID="back-icon-button"
          />
        </TouchableOpacity>
      )}

      {/* Title */}
      <View
        style={[
          styles.titleContainer,
          showBackButton && styles.titleContainerWithBackButton,
        ]}
        testID="title-container"
      >
        <Text
          style={styles.title}
          testID="header-title"
          accessibilityLabel={`Header title: ${title}`}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default CustomHeader;
