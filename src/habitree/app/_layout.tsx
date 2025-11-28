import { Stack, Redirect, useSegments } from 'expo-router';
import { Text } from 'react-native';
import { useAuth, AuthProvider } from './_context/AuthContext'; 
import React from 'react';

function RootLayoutContent() {
  const { isLoggedIn, isLoading } = useAuth(); // Holt den globalen Status
  const segments = useSegments();
  
  // Prüft, ob der Benutzer sich in der nicht-authentifizierten Gruppe befindet
  const inAuthGroup = segments[0] === '(auth)';

  if (isLoading) {
    // Anzeigen eines Ladebildschirms, während der initiale Auth-Status geprüft wird
    return <Text style={{ flex: 1, textAlign: 'center', marginTop: 50 }}>Laden...</Text>; 
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
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}