import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import CitiesScreen from "./src/screens/CitiesScreen";
import CityDetailScreen from "./src/screens/CityDetailScreen";
import HistoricalDataScreen from "./src/screens/HistoricalDataScreen";
import { City } from "./src/services/types";
import CustomHeader from "./src/components/common/CustomHeader";

export type RootStackParamList = {
  Cities: undefined;
  CityDetail: { city: City };
  HistoricalData: { city: City };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName="Cities"
          screenOptions={{
            // Use custom header for all screens
            header: ({ route, options, navigation }) => (
              <CustomHeader 
                title={options.title || route.name} 
                showBackButton={route.name !== 'Cities'}
                onBackPress={navigation.goBack}
              />
            ),
          }}
        >
          <Stack.Screen 
            name="Cities" 
            component={CitiesScreen}
            options={{ 
              title: 'Cities',
              headerShown: true,
            }}
          />
          <Stack.Screen 
            name="CityDetail" 
            component={CityDetailScreen}
            options={{ 
              title: 'City Details',
              headerShown: true,
            }}
          />
          <Stack.Screen 
            name="HistoricalData" 
            component={HistoricalDataScreen}
            options={{ 
              title: 'Historical Data',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
