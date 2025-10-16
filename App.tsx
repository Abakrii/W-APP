import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import CitiesScreen from './src/screens/CitiesScreen';
import CityDetailScreen from './src/screens/CityDetailScreen';
import HistoricalDataScreen from './src/screens/HistoricalDataScreen';
import { City } from './src/services/types';

export type RootStackParamList = {
  Cities: undefined;
  CityDetail: { city: City };
  HistoricalData: { city: City };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Cities"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8f8f8',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Cities" 
          component={CitiesScreen}
          options={{ title: 'Cities' }}
        />
        <Stack.Screen 
          name="CityDetail" 
          component={CityDetailScreen}
          options={{ title: 'City Details' }}
        />
        <Stack.Screen 
          name="HistoricalData" 
          component={HistoricalDataScreen}
          options={{ title: 'Historical Data' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}