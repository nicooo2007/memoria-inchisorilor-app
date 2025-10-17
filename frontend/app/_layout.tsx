import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../src/constants/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.darkRed,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="prison/[id]" 
          options={{ 
            title: 'Detalii Închisoare',
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="victim/[id]" 
          options={{ 
            title: 'Detalii Victimă',
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="document/[id]" 
          options={{ 
            title: 'Document',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="qr-scanner" 
          options={{ 
            title: 'Scanare QR',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}