import { Stack, Redirect, useSegments } from 'expo-router';
import { Text } from 'react-native';
import { useAuth, AuthProvider } from '../context/AuthContext'; 
import { HabitsProvider } from '../context/HabitsContext';
import React from 'react';
import { ApplicationServicesProvider } from '../application/providers/ApplicationServicesProvider';
import { applicationServices } from '../infrastructure/di/ServiceContainer';

function RootLayoutContent() {
  const { isLoggedIn, isLoading } = useAuth(); // Holt den globalen Status
  const segments = useSegments();
  
  // Prüft, ob der Benutzer sich in der nicht-authentifizierten Gruppe befindet
  const inAuthGroup = segments[0] === '(auth)';

  if (isLoading) {
    return (
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          textAlignVertical: "center",
          fontSize: 18,
        }}
      >
        Laden...
      </Text>
    );
  }

 
  if (!isLoggedIn && !inAuthGroup) {
    return <Redirect href="/login" />;
  }

  if (isLoggedIn && inAuthGroup) {
    return <Redirect href="/" />; 
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApplicationServicesProvider services={applicationServices}>
      <AuthProvider>
        <HabitsProvider>
          <RootLayoutContent />
        </HabitsProvider>
      </AuthProvider>
    </ApplicationServicesProvider>
  );
}