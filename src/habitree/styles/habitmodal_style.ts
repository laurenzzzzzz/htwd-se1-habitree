import { StyleSheet } from 'react-native';

// Definierte Farbe für den Rahmen und die Buttons
const PRIMARY_COLOR = 'rgb(25, 145, 137)'; 
const BORDER_COLOR = PRIMARY_COLOR;

export const habitModalStyles = StyleSheet.create({
    // --- Styles für den Full-Screen Overlay (wird jetzt immer als äußere Schicht verwendet) ---
    modalContainer: {
        flex: 1,
        justifyContent: 'center', // Standardmäßig zentriert (für den 'menu'-Modus)
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Leichte Abdunkelung
    },
    // Dies ist der tatsächliche zentrierte Dialog-Inhalt ('menu'-Modus)
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1.5, 
        borderColor: BORDER_COLOR,
    },

    // --- Styles für den 'custom'/'predefined'-Positionierungsrahmen (zwischen Header und Tabbar) ---
    betweenContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'transparent', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 0, 
    },
    /* dialog box that sits between header and tabbar */
    betweenContent: {
        alignSelf: 'center',
        width: '92%',
        backgroundColor: '#fff', // WICHTIG: Der Inhalt bleibt weiß
        borderRadius: 12,
        padding: 16,
        borderWidth: 1.5, 
        borderColor: PRIMARY_COLOR, 
        elevation: 3,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    
    // --- Styles für die Menü-Buttons (für Textfarbe) ---
    menuButton: {
        paddingVertical: 10, 
        borderRadius: 8,
        borderWidth: 1.5, 
        borderColor: PRIMARY_COLOR,
        alignItems: 'center',
    },
    menuButtonText: {
        color: PRIMARY_COLOR, 
        fontWeight: '600',
        fontSize: 16,
    },
    
    // --- Restliche Styles (unverändert) ---
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    fullscreenContent: {
        flex: 1,
        width: '100%',
        padding: 16,
    },
    scrollView: {
        /* allow content to size naturally */
    },
    scrollViewCustom: {
        marginBottom: 12,
    },
    subtitle: {
        marginBottom: 12,
        textAlign: 'center',
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
        fontSize: 14,
    },
    inputRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    iconButtonText: {
        fontSize: 20,
    },
    inputWithIcon: {
        width: '100%',
        position: 'relative',
    },
    inputInner: {
        flex: 1,
        paddingRight: 56,
        paddingVertical: 0,
        backgroundColor: 'transparent',
    },
    iconInside: {
        position: 'absolute',
        right: 8,
        top: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    predefinedItem: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    predefinedLabel: {
        fontWeight: '500',
    },
    predefinedDescription: {
        opacity: 0.7,
        marginTop: 4,
    },
    spacer: {
        height: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    fullButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    halfButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    marginTop: {
        marginTop: 12,
    },
});