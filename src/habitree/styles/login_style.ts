import { StyleSheet, Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// --- DYNAMISCHE KONSTANTEN ---

// 1. Horizontale und vertikale Abstände als Prozentsatz der Bildschirmmaße
const MAX_FORM_WIDTH = 400; 
const HORIZONTAL_PADDING_PERCENTAGE = 0.06; // 6% der Fensterbreite
const VERTICAL_PADDING_PERCENTAGE = 0.03;   // 3% der Fensterhöhe

// Vertikale Abstände für Margins
const LARGE_VERTICAL_SPACING = windowHeight * 0.04;   
const MEDIUM_VERTICAL_SPACING = windowHeight * 0.025; 
const SMALL_VERTICAL_SPACING = windowHeight * 0.01;   

// 2. Dynamische UI-Element-Werte (Skalierung mit Breite)
const RESPONSIVE_BUTTON_FONTSIZE = Math.min(windowWidth * 0.055, 20); 
const RESPONSIVE_INPUT_FONTSIZE = Math.min(windowWidth * 0.05, 18); 
const RESPONSIVE_TITLE_FONTSIZE = Math.min(windowWidth * 0.08, 34); 
const RESPONSIVE_BORDER_RADIUS = Math.min(windowWidth * 0.02, 8);
const RESPONSIVE_BORDER_WIDTH = Math.min(windowWidth * 0.003, 1);


export const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      
      // Horizontaler Padding ist dynamisch (5% der Breite)
      paddingHorizontal: windowWidth * HORIZONTAL_PADDING_PERCENTAGE,
      
      backgroundColor: 'white',
    },
    title: {
      fontSize: RESPONSIVE_TITLE_FONTSIZE, 
      fontWeight: 'bold',
      marginBottom: MEDIUM_VERTICAL_SPACING, 
      textAlign: 'center',
      maxWidth: MAX_FORM_WIDTH, 
    },
    input: {
      width: '100%',
      maxWidth: MAX_FORM_WIDTH, 
      
      // NEU: Responsiver vertikaler und horizontaler Padding
      paddingVertical: windowHeight * VERTICAL_PADDING_PERCENTAGE, 
      paddingHorizontal: windowWidth * 0.04, // Etwas kleiner als der Container-Padding
      
      marginVertical: SMALL_VERTICAL_SPACING, 
      borderWidth: RESPONSIVE_BORDER_WIDTH, 
      borderColor: '#ccc',
      borderRadius: RESPONSIVE_BORDER_RADIUS, 
      fontSize: RESPONSIVE_INPUT_FONTSIZE, 
    },
    authButton: {
      backgroundColor: 'rgb(25, 145, 137)',
      
      // NEU: Responsiver vertikaler Padding
      paddingVertical: windowHeight * VERTICAL_PADDING_PERCENTAGE, 
      paddingHorizontal: windowWidth * 0.04,
      
      borderRadius: RESPONSIVE_BORDER_RADIUS, 
      width: '100%',
      maxWidth: MAX_FORM_WIDTH,
      alignItems: 'center',
      marginTop: MEDIUM_VERTICAL_SPACING,
    },
    authButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: RESPONSIVE_BUTTON_FONTSIZE, 
    },
    switchButtonText: {
        color: 'rgb(25, 145, 137)',
        marginTop: MEDIUM_VERTICAL_SPACING, 
        maxWidth: MAX_FORM_WIDTH,
        textAlign: 'center',
        fontSize: RESPONSIVE_INPUT_FONTSIZE, 
    },
    logo: {
      width: Math.min(windowWidth * 0.4, 180), 
      
      // NEU: Responsive Höhe, basierend auf 18% der Fensterhöhe, begrenzt auf 150px
      height: Math.min(windowHeight * 0.18, 150), 
      
      resizeMode: 'contain',
      marginBottom: LARGE_VERTICAL_SPACING, 
    },
  });