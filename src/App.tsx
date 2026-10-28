import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation/RootNavigator';
import { BookProvider } from './context/BookContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <BookProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </BookProvider>
    </SafeAreaProvider>
  );
}