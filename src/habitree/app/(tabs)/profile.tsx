import { useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

export default function TabTwoScreen() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [tagesMotivationEnabled, setTagesMotivationEnabled] = useState(false);
  const [taeglicheErinnerungEnabled, setTaeglicheErinnerungEnabled] = useState(false);
  const [oeffentlichesProfilEnabled, setOeffentlichesProfilEnabled] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleTagesMotivation = () => setTagesMotivationEnabled((prev) => !prev);
  const toggleTaeglicheErinnerung = () => setTaeglicheErinnerungEnabled((prev) => !prev);
  const toggleOeffentlichesProfil = () => setOeffentlichesProfilEnabled((prev) => !prev);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/profile.png')}
          style={styles.headerImage}
          contentFit="cover"
        />
      }
    >
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profil</ThemedText>
      </ThemedView>

      <ThemedText style={{ marginBottom: 20 }}>
        Willkommen in deinem Profil! Hier findest du Infos und Einstellungen zu habitree.
      </ThemedText>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Einstellungen</ThemedText>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Tagesmotivation</ThemedText>
          <Switch value={tagesMotivationEnabled} onValueChange={toggleTagesMotivation} />
        </ThemedView>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Tägliche Erinnerung</ThemedText>
          <Switch value={taeglicheErinnerungEnabled} onValueChange={toggleTaeglicheErinnerung} />
        </ThemedView>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </ThemedView>

        <ThemedView style={styles.settingRow}>
          <ThemedText>Öffentliches Profil</ThemedText>
          <Switch value={oeffentlichesProfilEnabled} onValueChange={toggleOeffentlichesProfil} />
        </ThemedView>
      </ThemedView>

      {/* Auth-Buttons */}
      <ThemedView style={styles.authButtonsContainer}>
        <TouchableOpacity style={styles.authButton} onPress={() => console.log('Anmelden gedrückt')}>
          <ThemedText style={styles.authButtonText}>Anmelden</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={() => console.log('Registrieren gedrückt')}>
          <ThemedText style={styles.authButtonText}>Registrieren</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    height: 300,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionContainer: {
    marginVertical: 20,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  /* Neue/angepasste Styles */
  authButtonsContainer: {
    marginTop: 40,
    alignItems: 'center',   // zentriert horizontal
    gap: 12,                // Abstand zwischen den Buttons
    paddingBottom: 40,
  },
  authButton: {
    backgroundColor: 'rgb(25, 145, 137)', // gewünschte Farbe
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '70%',            // sorgt für gleiche Breite & zentriert
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
