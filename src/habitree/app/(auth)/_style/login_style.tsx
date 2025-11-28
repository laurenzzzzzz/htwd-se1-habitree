import { StyleSheet, Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flexGrow: 1, // Statt flex: 1, damit ScrollView funktioniert
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white', // Hintergrundfarbe anpassen
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: 15,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
    },
    authButton: {
      backgroundColor: '#007AFF', // Button-Farbe anpassen
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    authButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    switchButtonText: {
        color: '#007AFF',
        marginTop: 20,
    },
    // Fügen Sie hier alle anderen benötigten Styles (z.B. für Ihr Logo/Image) ein
  });
