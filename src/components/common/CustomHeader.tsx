import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const { width } = Dimensions.get('window');

/**
 * CustomHeader - Blue header with back button support
 */
const CustomHeader: React.FC<CustomHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  onBackPress 
}) => {
  return (
    <View style={styles.header}>
      {/* Back Button - Top Left */}
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconButton
            icon="arrow-left"
            iconColor="#FFFFFF"
            size={24}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      )}
      
      {/* Title */}
      <View style={[
        styles.titleContainer,
        showBackButton && styles.titleContainerWithBackButton
      ]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 150,
    backgroundColor: '#2388C7',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Position below status bar
    left: 16,
    zIndex: 10,
  },
  backIcon: {
    margin: 0,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    width: '100%',
  },
  titleContainerWithBackButton: {
    paddingLeft: 40, // Make space for back button
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
});

export default CustomHeader;