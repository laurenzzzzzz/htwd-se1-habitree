import { StyleSheet } from 'react-native';
import { createResponsiveHelpers } from './responsive';

// Definierte Farbe für den Rahmen und die Buttons
const PRIMARY_COLOR = 'rgb(25, 145, 137)'; 
const BORDER_COLOR = PRIMARY_COLOR;
export const createHabitModalStyles = (width?: number, height?: number) => {
    const { spacing, radius, font, scale } = createResponsiveHelpers(width, height);

    return StyleSheet.create({
        // --- Styles für den Full-Screen Overlay (wird jetzt immer als äußere Schicht verwendet) ---
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: spacing.md,
        },
        // Dies ist der tatsächliche zentrierte Dialog-Inhalt ('menu'-Modus)
        modalContent: {
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: radius(16),
            padding: spacing.md,
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
            paddingHorizontal: spacing.md,
        },
        /* dialog box that sits between header and tabbar */
        betweenContent: {
            alignSelf: 'center',
            width: '92%',
            maxHeight: '95%',
            backgroundColor: '#fff',
            borderRadius: radius(16),
            padding: spacing.md,
            borderWidth: 1.5,
            borderColor: PRIMARY_COLOR,
            elevation: 3,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
        },
        
        // --- Styles für die Menü-Buttons (für Textfarbe) ---
        menuButton: {
            paddingVertical: spacing.sm,
            borderRadius: radius(12),
            borderWidth: 1.5,
            borderColor: PRIMARY_COLOR,
            alignItems: 'center',
        },
        menuButtonText: {
            color: PRIMARY_COLOR,
            fontWeight: '600',
            fontSize: font(16),
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
            padding: spacing.md,
        },
        scrollView: {
            /* allow content to size naturally */
        },
        scrollViewCustom: {
            marginBottom: spacing.md,
        },
        subtitle: {
            marginBottom: spacing.md * 1.3,
            textAlign: 'center',
        },
        label: {
            marginBottom: spacing.xs * 0.4,
            fontWeight: '500',
            fontSize: font(14),
            marginLeft: spacing.xs * 0.5,
        },
        inputRowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            marginBottom: spacing.sm,
        },
        iconButton: {
            width: scale(44),
            height: scale(44),
            backgroundColor: '#f0f0f0',
            borderRadius: radius(10),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
        },
        iconButtonText: {
            fontSize: font(20),
        },
        inputWithIcon: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
        },
        inputFontFix: {
            fontSize: font(16),
            paddingVertical: spacing.sm,
            height: 'auto',
            marginTop: 0,
        },
        inputWithIconFix: {
            paddingVertical: spacing.xs,
            height: 'auto',
            marginTop: 0,
        },
        dropdownFix: {
            paddingVertical: spacing.xs,
            height: 'auto',
            marginTop: 0, 
        },
        inputInner: {
            flex: 1,
            paddingVertical: 0,
            backgroundColor: 'transparent',
        },
        iconInside: {
            justifyContent: 'center',
            alignItems: 'center',
            width: scale(30),
            height: scale(30),
            borderRadius: radius(6),
            backgroundColor: '#f0f0f0',
            borderWidth: 1,
            borderColor: '#ccc',
            marginLeft: spacing.xs,
        },
        predefinedItem: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.xs,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        predefinedLabel: {
            fontWeight: '500',
        },
        predefinedDescription: {
            opacity: 0.7,
            marginTop: spacing.xs * 0.5,
        },
        spacer: {
            height: spacing.md,
        },
        buttonRow: {
            flexDirection: 'row',
            gap: spacing.sm,
            marginTop: spacing.sm,
        },
        fullButton: {
            flex: 1,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            backgroundColor: PRIMARY_COLOR,
            borderRadius: radius(12),
            alignItems: 'center',
            justifyContent: 'center',
        },
        halfButton: {
            flex: 1,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            backgroundColor: PRIMARY_COLOR,
            borderRadius: radius(12),
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: font(16),
        },
        marginTop: {
            marginTop: spacing.xs * 0.1,
        },
        weekdayGrid: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
        },
        weekdayButton: {
            width: '12%',
            aspectRatio: 1,
            borderRadius: radius(10),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
        },
        weekdayButtonSelected: {
            backgroundColor: '#4CAF50',
            borderColor: '#388E3C',
        },
        weekdayButtonUnselected: {
            backgroundColor: '#f0f0f0',
            borderColor: '#ccc',
        },
        weekdayText: {
            fontSize: font(11),
            fontWeight: '500',
        },
        weekdayTextSelected: {
            color: '#fff',
        },
        weekdayTextUnselected: {
            color: '#333',
        },
        disabledButton: {
            opacity: 0.5,
        },
        infoLinkContainer: {
            marginTop: spacing.xs * 0.1,
            marginBottom: spacing.xs * 1.3,
            alignSelf: 'flex-start',
            marginLeft: spacing.xs * 0.5,
        },
        noMarginBottom: {
            marginBottom: 0,
        },
        infoLinkText: {
            color: '#666',
            textDecorationLine: 'underline',
            fontSize: font(12),
        },
        pickerIcon: {
            width: scale(20),
            height: scale(20),
        },
    });
};

export const habitModalStyles = createHabitModalStyles();