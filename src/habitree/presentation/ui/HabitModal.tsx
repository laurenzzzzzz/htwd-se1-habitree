import React, { useState } from 'react';
import { Modal, View, Button, Pressable, TextInput, Text, ScrollView, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { styles as loginStyles } from '../../styles/login_style';
import { habitModalStyles } from '../../styles/habitmodal_style';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import FrequencyDropdown from './FrequencyDropdown';

type Predefined = { id?: number; label: string; description: string; frequency: string };

type Props = {
    visible: boolean;
    mode: 'menu' | 'custom' | 'predefined' | null;
    onClose: () => void;
    onOpenMode: (mode: 'menu' | 'custom' | 'predefined') => void;
    submitLabel?: string;
    predefinedHabits: Predefined[];
    newHabitName: string;
    newHabitDescription: string;
    newHabitStartDate: string;
    newHabitTime: string;
    newHabitFrequency: string;
    newHabitWeekDays: number[];
    newHabitIntervalDays: string;
    newHabitDurationDays?: string;
    setNewHabitName: (s: string) => void;
    setNewHabitDescription: (s: string) => void;
    setNewHabitStartDate: (s: string) => void;
    setNewHabitTime: (s: string) => void;
    setNewHabitFrequency: (s: string) => void;
    setNewHabitWeekDays: (days: number[]) => void;
    setNewHabitIntervalDays: (s: string) => void;
    setNewHabitDurationDays?: (s: string) => void;
    onAddPredefined: (label: string, description: string, frequency: string) => void;
    onSelectPredefined?: (p: Predefined) => void;
    onAddCustom: () => void;
};

export default function HabitModal({
    visible,
    mode,
    onClose,
    onOpenMode,
    submitLabel,
    predefinedHabits,
    newHabitName,
    newHabitDescription,
    newHabitStartDate,
    newHabitTime,
    newHabitFrequency,
    newHabitWeekDays,
    newHabitIntervalDays,
    newHabitDurationDays,
    setNewHabitName,
    setNewHabitDescription,
    setNewHabitStartDate,
    setNewHabitTime,
    setNewHabitFrequency,
    setNewHabitWeekDays,
    setNewHabitIntervalDays,
    setNewHabitDurationDays,
    onAddPredefined,
    onSelectPredefined,
    onAddCustom,
}: Props) {
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = Dimensions.get('window');

    const HEADER_HEIGHT = Math.max(insets.top, 60);
    const TAB_BAR_HEIGHT = Math.max(48, windowHeight * 0.050);
    const bottomOffset = TAB_BAR_HEIGHT + insets.bottom;

    const isBetweenBars = mode === 'custom' || mode === 'predefined';

    const handleClose = () => {
        setNewHabitName('');
        setNewHabitDescription('');
        setNewHabitStartDate('');
        setNewHabitTime('');
        setNewHabitFrequency('');
        setNewHabitWeekDays([]);
        setNewHabitIntervalDays('');
        setNewHabitDurationDays && setNewHabitDurationDays('');
        setDatePickerVisible(false);
        setTimePickerVisible(false);
        onClose();
    };

    const renderContent = () => {
        // Logik für den Menu-Modus
        if (mode === 'menu') {
            return (
                <View style={habitModalStyles.modalContent}>
                    <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Was möchtest du tun?</ThemedText>
                    
                    <Pressable 
                        style={habitModalStyles.menuButton} 
                        onPress={() => onOpenMode('predefined')}
                    >
                        <Text style={habitModalStyles.menuButtonText}>Vordefiniertes Ziel wählen</Text>
                    </Pressable>
                    
                    <View style={habitModalStyles.spacer} />
                    
                    <Pressable 
                        style={habitModalStyles.menuButton} 
                        onPress={() => onOpenMode('custom')}
                    >
                        <Text style={habitModalStyles.menuButtonText}>Eigenes Ziel erstellen</Text>
                    </Pressable>
                     <View style={habitModalStyles.buttonRow}>
                        <Pressable style={habitModalStyles.fullButton} onPress={handleClose}>
                            <ThemedText style={habitModalStyles.buttonText}>Zurück</ThemedText>
                        </Pressable>
                    </View>
                </View>
            );
        }

        // Logik für Predefined/Custom Modi (zwischen den Leisten)
        if (isBetweenBars) {
            return (
                <View style={[habitModalStyles.betweenContainer, { top: HEADER_HEIGHT, bottom: bottomOffset }]}>
                    <View style={habitModalStyles.betweenContent}>
                        {mode === 'predefined' && (
                            <>
                                <ScrollView style={habitModalStyles.scrollView}>
                                    <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Vordefiniertes Ziel auswählen:</ThemedText>
                                    {predefinedHabits.map(({ id, label, description, frequency }) => (
                                        <Pressable
                                            key={id ?? label}
                                            onPress={() => {
                                                if (onSelectPredefined) {
                                                    onSelectPredefined({ id, label, description, frequency });
                                                } else {
                                                    onAddPredefined(label, description, frequency);
                                                }
                                            }}
                                            style={habitModalStyles.predefinedItem}
                                        >
                                            <ThemedText style={habitModalStyles.predefinedLabel}>{label}</ThemedText>
                                            <ThemedText style={habitModalStyles.predefinedDescription}>{description}</ThemedText>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </>
                        )}

                        {mode === 'custom' && (
                            <>
                                <ScrollView style={habitModalStyles.scrollViewCustom}>
                                    <ThemedText type="subtitle" style={habitModalStyles.subtitle}>Eigenes Ziel erstellen</ThemedText>
                                    <TextInput
                                        placeholder="Kurzname (z. B. Kniebeugen)"
                                        value={newHabitName}
                                        onChangeText={setNewHabitName}
                                        style={[loginStyles.input, habitModalStyles.inputFontFix]}
                                    />
                                    <TextInput
                                        placeholder="Beschreibung"
                                        value={newHabitDescription}
                                        onChangeText={setNewHabitDescription}
                                        style={[loginStyles.input, habitModalStyles.inputFontFix]}
                                    />

                                    {/* Start Date Input */}
                                    <View style={habitModalStyles.marginTop}>
                                        <ThemedText style={habitModalStyles.label}>Startdatum</ThemedText>
                                        <View style={habitModalStyles.inputRowContainer}>
                                            <View style={[habitModalStyles.inputWithIcon, loginStyles.input, habitModalStyles.inputWithIconFix]}>
                                                <TextInput
                                                    placeholder="dd.mm.yyyy"
                                                    value={newHabitStartDate}
                                                    onChangeText={setNewHabitStartDate}
                                                    style={habitModalStyles.inputInner}
                                                    editable={false}
                                                />
                                                <Pressable
                                                    style={habitModalStyles.iconInside}
                                                    onPress={() => setDatePickerVisible(true)}
                                                >
                                                    <Image source={require('../../assets/images/calendar.png')} style={{ width: 20, height: 20 }} />
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Time Input */}
                                    <View style={habitModalStyles.marginTop}>
                                        <ThemedText style={habitModalStyles.label}>Erinnerungszeit</ThemedText>
                                        <View style={habitModalStyles.inputRowContainer}>
                                            <View style={[habitModalStyles.inputWithIcon, loginStyles.input, habitModalStyles.inputWithIconFix]}>
                                                <TextInput
                                                    placeholder="hh:mm"
                                                    value={newHabitTime}
                                                    onChangeText={setNewHabitTime}
                                                    style={habitModalStyles.inputInner}
                                                    editable={false}
                                                />
                                                <Pressable
                                                    style={habitModalStyles.iconInside}
                                                    onPress={() => setTimePickerVisible(true)}
                                                >
                                                    <Image source={require('../../assets/images/clock.png')} style={{ width: 20, height: 20 }} />
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Duration Input (Laufzeit) */}
                                    <View style={habitModalStyles.marginTop}>
                                        <ThemedText style={habitModalStyles.label}>Laufzeit (Tage)</ThemedText>
                                        <TextInput
                                            placeholder="z.B. 66 Tage"
                                            value={newHabitDurationDays || ''}
                                            onChangeText={setNewHabitDurationDays ? setNewHabitDurationDays : () => {}}
                                            keyboardType="number-pad"
                                            style={[loginStyles.input, habitModalStyles.inputFontFix, habitModalStyles.noMarginBottom]}
                                        />
                                        <Pressable style={habitModalStyles.infoLinkContainer} onPress={() => alert('Psychologisch werden 66 Tage oft als sinnvoll angesehen, um neue Gewohnheiten zu festigen. Kürzere Laufzeiten eignen sich zum Einstieg, längere für nachhaltige Etablierung.') }>
                                            <Text style={habitModalStyles.infoLinkText}>Warum 66 Tage?</Text>
                                        </Pressable>
                                    </View>

                                    {/* Frequency Dropdown */}
                                    <View style={habitModalStyles.marginTop}>
                                        <ThemedText style={habitModalStyles.label}>Häufigkeit</ThemedText>
                                        <FrequencyDropdown
                                            selectedFrequency={newHabitFrequency}
                                            onSelectFrequency={setNewHabitFrequency}
                                        />
                                    </View>

                                    {/* Interval Input - Only show if frequency is Benutzerdefiniert */}
                                    {newHabitFrequency === 'Benutzerdefiniert' && (
                                        <View style={habitModalStyles.marginTop}>
                                            <ThemedText style={habitModalStyles.label}>Alle wie viele Tage?</ThemedText>
                                            <TextInput
                                                placeholder="z.B. 2, 4, 7"
                                                value={newHabitIntervalDays}
                                                onChangeText={setNewHabitIntervalDays}
                                                keyboardType="number-pad"
                                                style={[loginStyles.input, habitModalStyles.inputFontFix]}
                                            />
                                        </View>
                                    )}

                                    {/* Weekday Picker - Only show if frequency is Wöchentlich */}
                                    {newHabitFrequency === 'Wöchentlich' && (
                                        <View style={habitModalStyles.marginTop}>
                                            <ThemedText style={habitModalStyles.label}>Wochentage auswählen:</ThemedText>
                                            <View style={habitModalStyles.weekdayGrid}>
                                                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((label, index) => {
                                                    const isSelected = newHabitWeekDays.includes(index);
                                                    return (
                                                        <Pressable
                                                            key={index}
                                                            onPress={() => {
                                                                if (isSelected) {
                                                                    setNewHabitWeekDays(newHabitWeekDays.filter(d => d !== index));
                                                                } else {
                                                                    setNewHabitWeekDays([...newHabitWeekDays, index]);
                                                                }
                                                            }}
                                                            style={[
                                                                habitModalStyles.weekdayButton,
                                                                isSelected
                                                                    ? habitModalStyles.weekdayButtonSelected
                                                                    : habitModalStyles.weekdayButtonUnselected,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    habitModalStyles.weekdayText,
                                                                    isSelected
                                                                        ? habitModalStyles.weekdayTextSelected
                                                                        : habitModalStyles.weekdayTextUnselected,
                                                                ]}
                                                            >
                                                                {label}
                                                            </Text>
                                                        </Pressable>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    )}
                                </ScrollView>
                            </>
                        )}
                        
                        <View style={habitModalStyles.buttonRow}>
                            <Pressable style={habitModalStyles.halfButton} onPress={handleClose}>
                                <ThemedText style={habitModalStyles.buttonText}>Zurück</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[
                                    habitModalStyles.halfButton,
                                    (newHabitName.trim() === '' ||
                                    newHabitStartDate.trim() === '' ||
                                    newHabitTime.trim() === '' ||
                                    !newHabitDurationDays ||
                                    newHabitDurationDays.trim() === '' ||
                                    ((newHabitFrequency || 'Täglich') === 'Wöchentlich' && newHabitWeekDays.length === 0) ||
                                    ((newHabitFrequency || 'Täglich') === 'Benutzerdefiniert' && newHabitIntervalDays.trim() === ''))
                                        ? habitModalStyles.disabledButton
                                        : null,
                                ]}
                                onPress={onAddCustom}
                                disabled={
                                    newHabitName.trim() === '' ||
                                    newHabitStartDate.trim() === '' ||
                                    newHabitTime.trim() === '' ||
                                    !newHabitDurationDays ||
                                    newHabitDurationDays.trim() === '' ||
                                    ((newHabitFrequency || 'Täglich') === 'Wöchentlich' && newHabitWeekDays.length === 0) ||
                                    ((newHabitFrequency || 'Täglich') === 'Benutzerdefiniert' && newHabitIntervalDays.trim() === '')
                                }
                            >
                                <ThemedText style={habitModalStyles.buttonText}>{submitLabel || 'Hinzufügen'}</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            );
        }
        return null; 
    };


    return (
        <Modal 
            visible={visible} 
            transparent 
            // KORREKTUR: Entferne 'slide' und verwende 'fade' oder null für alle Modi
            animationType={visible ? 'fade' : undefined} 
            onRequestClose={handleClose}
        >
            <View
                style={habitModalStyles.modalContainer}
            >
                {renderContent()}
            </View>

            {/* Date Picker Modal */}
            <DatePicker
                visible={datePickerVisible}
                selectedDate={newHabitStartDate}
                onSelectDate={setNewHabitStartDate}
                onClose={() => setDatePickerVisible(false)}
            />

            {/* Time Picker Modal */}
            <TimePicker
                visible={timePickerVisible}
                selectedTime={newHabitTime}
                onSelectTime={setNewHabitTime}
                onClose={() => setTimePickerVisible(false)}
            />
        </Modal>
    );
}