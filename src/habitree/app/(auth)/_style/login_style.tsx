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
      backgroundColor: 'rgb(25, 145, 137)', // Button-Farbe anpassen
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
        color: 'rgb(25, 145, 137)',
        marginTop: 20,
    },
    logo: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    // Fügen Sie hier alle anderen benötigten Styles (z.B. für Ihr Logo/Image) ein
  });
