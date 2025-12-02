import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/login_style';

type Props = {
  email: string;
  password: string;
  username?: string;
  isRegisterMode: boolean;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeUsername?: (v: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
};

export const AuthForm: React.FC<Props> = ({
  email,
  password,
  username,
  isRegisterMode,
  onChangeEmail,
  onChangePassword,
  onChangeUsername,
  onSubmit,
  isProcessing,
}) => {
  return (
    <View>
      {isRegisterMode && (
        <TextInput style={styles.input} placeholder="Benutzername" value={username} onChangeText={onChangeUsername} autoCapitalize="none" />
      )}
      <TextInput style={styles.input} placeholder="E-Mail" value={email} onChangeText={onChangeEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Passwort" value={password} onChangeText={onChangePassword} secureTextEntry />
      <TouchableOpacity style={styles.authButton} onPress={onSubmit} disabled={isProcessing}>
        {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>{isRegisterMode ? 'Registrieren & Anmelden' : 'Anmelden'}</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default AuthForm;
