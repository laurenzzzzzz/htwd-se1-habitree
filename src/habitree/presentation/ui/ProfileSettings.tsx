import React from 'react';
import { View, Switch, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../../styles/profile_style';

type Props = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  tagesMotivationEnabled: boolean;
  onToggleTagesMotivation: () => void;
  taeglicheErinnerungEnabled: boolean;
  onToggleTaeglicheErinnerung: () => void;
  oeffentlichesProfilEnabled: boolean;
  onToggleOeffentlichesProfil: () => void;
  onChangeUsername: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
};

export const ProfileSettings: React.FC<Props> = ({
  isDarkMode,
  onToggleDarkMode,
  tagesMotivationEnabled,
  onToggleTagesMotivation,
  taeglicheErinnerungEnabled,
  onToggleTaeglicheErinnerung,
  oeffentlichesProfilEnabled,
  onToggleOeffentlichesProfil,
  onChangeUsername,
  onChangePassword,
  onLogout,
}) => {
  return (
    <View>
      <ThemedText type="subtitle">Einstellungen</ThemedText>
      <View style={styles.settingRow}>
        <ThemedText>Tagesmotivation</ThemedText>
        <Switch value={tagesMotivationEnabled} onValueChange={onToggleTagesMotivation} />
      </View>
      <View style={styles.settingRow}>
        <ThemedText>Tägliche Erinnerung</ThemedText>
        <Switch value={taeglicheErinnerungEnabled} onValueChange={onToggleTaeglicheErinnerung} />
      </View>
      <View style={styles.settingRow}>
        <ThemedText>Dark Mode</ThemedText>
        <Switch value={isDarkMode} onValueChange={onToggleDarkMode} />
      </View>
      <View style={styles.settingRow}>
        <ThemedText>Öffentliches Profil</ThemedText>
        <Switch value={oeffentlichesProfilEnabled} onValueChange={onToggleOeffentlichesProfil} />
      </View>

      <TouchableOpacity style={styles.settingRowButton} onPress={onChangeUsername}>
        <ThemedText>Benutzernamen ändern</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRowButton} onPress={onChangePassword}>
        <ThemedText>Passwort ändern</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.authButton} onPress={onLogout}>
        <Text style={styles.authButtonText}>Abmelden</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileSettings;
