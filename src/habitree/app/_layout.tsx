import { Stack, useRouter, useSegments } from 'expo-router';
import { Appearance, Text } from 'react-native';
import React, { useEffect } from 'react';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { ApplicationServicesProvider } from '../presentation/providers/ApplicationServicesProvider';
import { applicationServices } from '../infrastructure/di/ServiceContainer';
import { rootLayoutStyles } from '../styles/rootlayout_style';

// Force app-wide light appearance to stop system-driven palette changes
Appearance.setColorScheme?.('light');

function RootLayoutContent() {
  const { isLoggedIn, isLoading } = useAuth(); // Holt den globalen Status
  const segments = useSegments();
  const router = useRouter();
  
  // Prüft, ob der Benutzer sich in der nicht-authentifizierten Gruppe befindet
  const inAuthGroup = segments[0] === '(auth)';

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)'); 
    }
  }, [isLoggedIn, inAuthGroup, isLoading, router]);

  if (isLoading) {
    return (
      <Text style={rootLayoutStyles.loadingText}>
        Laden...
      </Text>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ApplicationServicesProvider services={applicationServices}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ApplicationServicesProvider>
  );
}