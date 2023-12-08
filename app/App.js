import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './components/LoginPage';
import ViewMenu from './components/ViewMenu';
import HomePage from './components/HomePage';
import Admin from './components/Admin';
import OrderStatus from './components/OrderStatus';
import AdminHome from './components/AdminHome';
import AdminInventory from './components/AdminInventory';
import AdminAnalytics from './components/AdminAnalytics'; // Import AdminAnalytics component

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: true }} />
        <Stack.Screen name="ViewMenu" component={ViewMenu} options={{ headerShown: true }} />
        <Stack.Screen name="Admin" component={Admin} options={{ title: 'Admin Login', headerShown: true }} />
        <Stack.Screen name="OrderStatus" component={OrderStatus} options={{ headerShown: true }} />
        <Stack.Screen name="AdminHome" component={AdminHome} options={{ title: 'Admin Home', headerShown: true }} />
        <Stack.Screen name="AdminInventory" component={AdminInventory} options={{ title: 'Inventory Management', headerShown: true }} />
        <Stack.Screen name="AdminAnalytics" component={AdminAnalytics} options={{ title: 'Analytics', headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}