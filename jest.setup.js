// Minimal setup - only extend expect
import '@testing-library/jest-native/extend-expect';

// Minimal React Native mock to avoid complex issues
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
}));

// Mock react-native-paper with a simple implementation
jest.mock('react-native-paper', () => {
  const React = require('react');
  return {
    IconButton: ({ icon, onPress, testID, ...props }) =>
      React.createElement('View', { 
        testID, 
        onPress,
        accessibilityLabel: `icon-${icon}`,
        ...props 
      }),
  };
});

// Silence common warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');