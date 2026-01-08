import React from 'react';
import { View, Switch, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles } from '../../styles/profile_style';

type Props = {
  //isDarkMode: boolean;
  //onToggleDarkMode: () => void;
  habitPushReminderEnabled: boolean;
  onToggleHabitPushReminder: () => void;
  //oeffentlichesProfilEnabled: boolean;
  //onToggleOeffentlichesProfil: () => void;
  onChangeUsername: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
};

export const ProfileSettings: React.FC<Props> = ({
  //isDarkMode,
  //onToggleDarkMode,
  habitPushReminderEnabled,
  onToggleHabitPushReminder,
  //oeffentlichesProfilEnabled,
  //onToggleOeffentlichesProfil,
  onChangeUsername,
  onChangePassword,
  onLogout,
}) => {
  return (
    <View>
      <ThemedText type="subtitle">Einstellungen</ThemedText>
      <View style={styles.settingRow}>
        <ThemedText>Habit Push-Erinnerung</ThemedText>
        <Switch value={habitPushReminderEnabled} onValueChange={onToggleHabitPushReminder} />
      </View>
      {/* <View style={styles.settingRow}>
        <ThemedText>Dark Mode</ThemedText>
        <Switch value={isDarkMode} onValueChange={onToggleDarkMode} />
      </View>
      <View style={styles.settingRow}>
        <ThemedText>Öffentliches Profil</ThemedText>
        <Switch value={oeffentlichesProfilEnabled} onValueChange={onToggleOeffentlichesProfil} />
      </View> */}

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
