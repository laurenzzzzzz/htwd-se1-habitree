import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  Alert,
  Platform,
  FlatList,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';

import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { useEffect } from 'react';
// import { Platform } from 'react-native';

{/*Pushbenachrichtigung-Feature hat die App nicht mehr aktualieren lassen!!*/}

{/*}
useEffect(() => {
  registerForPushNotificationsAsync();
}, []);
{*/}

{/*}
async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Benachrichtigungen deaktiviert', 'Bitte aktiviere sie in den Einstellungen.');a
      return;
    }
  } else {
    Alert.alert('Push-Nachrichten', 'Nur auf physischem Gerät möglich');
  }
}
{*/}

export default function HomeScreen() {
  const [expanded, setExpanded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [motivationEnabled, setMotivationEnabled] = useState(false);
  const [quoteEnabled, setQuoteEnabled] = useState(false);  
  const [markedDates, setMarkedDates] = useState({
    '2025-05-16': { selected: true, marked: true, selectedColor: 'rgb(15, 74, 70)' },
  });

  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [choice, setChoice] = useState('A');

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleExpand = () => setExpanded(!expanded);

  const habits = [
    { id: '1', name: 'Meditieren' },
    { id: '2', name: 'Sport machen' },
    { id: '3', name: 'Lesen' },
    { id: '4', name: 'Hallo' },
    { id: '5', name: 'Nach der Uni abreagieren' },
    { id: '6', name: 'Nicht die Kontrolle verlieren' },
    { id: '7', name: 'Nicht die Kontrolle verlieren' },
  ];

  const tableData = [
    { key: 'Montag', value: 'Joggen' },
    { key: 'Dienstag', value: 'Yoga' },
    { key: 'Mittwoch', value: 'Lesen' },
  ]; 

  const handlePress = () => {
    Alert.alert('Button gedrückt', 'Du hast den Button gedrückt!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="rgb(25, 145, 137)" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>habitree🌳</Text>
        <Text style={styles.subtitle}>Die letzte App die du brauchst</Text>

        {/* Infokarte */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Infokarte</Text>
          <Text style={styles.cardContent}>
            Hier steht wichtige Information für den Benutzer. Du kannst hier deine Features erklären oder Highlights präsentieren.
          </Text>
          <View style={styles.buttonWrapper}>
            <Button color="rgb(253, 253, 253)" title="Mehr erfahren" onPress={handlePress} />
          </View>
        </View>

      {/*Push-Benachrichtigung*/}
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Test-Benachrichtigung</Text>
        <Button
          title="Push senden"
          color="#fff"
          onPress={async () => {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '🎯 Ziel erreicht!',
                body: 'Du hast gerade erfolgreich eine Testnachricht erhalten!',
              },
              trigger: null, // Sofort senden
            });
          }}
        />
      </View>

        {/* Liste */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deine Gewohnheiten</Text>
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* Tabelle */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wochenplan</Text>
          {tableData.map((row) => (
            <View style={styles.tableRow} key={row.key}>
              <Text style={[styles.tableCell, styles.tableKey]}>{row.key}</Text>
              <Text style={[styles.tableCell, styles.tableValue]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Akkordeon */}
        <View style={styles.card}>
          <TouchableOpacity onPress={toggleExpand} style={styles.accordionHeader}>
            <Text style={styles.cardTitle}>Tipps & Tricks {expanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {expanded && (
            <View style={styles.accordionContent}>
              <Text style={styles.accordionText}>- Jeden Tag kleine Schritte machen</Text>
              <Text style={styles.accordionText}>- Bleib konsequent</Text>
              <Text style={styles.accordionText}>- Belohne dich selbst</Text>
            </View>
          )}
        </View>

        {/* Switches */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Benachrichtigungen</Text>

          {/* Meldungen */}
            <View style={styles.switchRow}>
              <Text style={styles.textWhite}>Meldungen</Text>
              <Switch
                trackColor={{ false: '#767577', true: 'rgb(15, 74, 70)' }}
                thumbColor={isEnabled ? 'rgb(25, 145, 137)' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            {/*<Text style={styles.textWhite}>{isEnabled ? 'An' : 'Aus'}</Text>*/}

            {/* Motivationsnachrichten */}
            <View style={styles.switchRow}>
              <Text style={styles.textWhite}>Motivationsnachrichten</Text>
              <Switch
                trackColor={{ false: '#767577', true: 'rgb(15, 74, 70)' }}
                thumbColor={motivationEnabled ? 'rgb(25, 145, 137)' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setMotivationEnabled(!motivationEnabled)}
                value={motivationEnabled}
              />
            </View>

            {/* Tageszitat */}
            <View style={styles.switchRow}>
              <Text style={styles.textWhite}>Tageszitat</Text>
              <Switch
                trackColor={{ false: '#767577', true: 'rgb(15, 74, 70)' }}
                thumbColor={quoteEnabled ? 'rgb(25, 145, 137)' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setQuoteEnabled(!quoteEnabled)}
                value={quoteEnabled}
              />
            </View>

        </View>


        {/* TextInput */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dein Tagesziel</Text>
          <TextInput
            style={styles.input}
            placeholder="Schreibe dein Ziel hier..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Text style={[styles.textWhite, { marginTop: 10 }]}>
            Aktuelles Ziel: {inputValue || 'Kein Ziel gesetzt'}
          </Text>
        </View>

        {/* Kalender */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kalender</Text>
          <Calendar
            onDayPress={(day) => {
              Alert.alert('Datum ausgewählt', day.dateString);
              setMarkedDates({
                [day.dateString]: { selected: true, marked: true, selectedColor: 'rgb(15, 74, 70)' },
              });
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'rgb(25, 145, 137)',
              calendarBackground: 'rgb(25, 145, 137)',
              textSectionTitleColor: '#fff',
              selectedDayBackgroundColor: 'rgb(15, 74, 70)',
              selectedDayTextColor: '#fff',
              todayTextColor: '#fff',
              dayTextColor: '#fff',
              textDisabledColor: 'rgba(255, 255, 255, 0.3)',
              arrowColor: '#fff',
              monthTextColor: '#fff',
              indicatorColor: '#fff',
              textDayFontWeight: 'bold',
            }}
            style={{ borderRadius: 8 }}
          />
        </View>

        {/* Klickbare Auswahl */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kategorie wählen</Text>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
            dropdownIconColor="#fff"
            style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Picker.Item label="Option 1" value="Option 1" />
            <Picker.Item label="Option 2" value="Option 2" />
            <Picker.Item label="Option 3" value="Option 3" />
          </Picker>
          <Text style={styles.textWhite}>Ausgewählt: {selectedOption}</Text>
        </View>

        {/* Entweder-Oder Auswahl */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Was bevorzugst du?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                choice === 'A' && styles.choiceButtonSelected,
              ]}
              onPress={() => setChoice('A')}
            >
              <Text style={styles.textWhite}>Option A</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                choice === 'B' && styles.choiceButtonSelected,
              ]}
              onPress={() => setChoice('B')}
            >
              <Text style={styles.textWhite}>Option B</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.textWhite, { marginTop: 10 }]}>
            Deine Wahl: {choice}
          </Text>
        </View>

        <Text style={styles.footer}>© 2025 Habitly Inc.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 8,
    color: 'rgb(25, 145, 137)',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: 'rgb(25, 145, 137)',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgb(37, 143, 136)',
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  cardContent: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
  },
  buttonWrapper: {
    width: '50%',
    alignSelf: 'center',
  },
  listItem: {
    paddingVertical: 8,
    borderBottomColor: '#49938f',
    borderBottomWidth: 1,
  },
  listItemText: {
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomColor: '#49938f',
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  tableKey: {
    fontWeight: 'bold',
  },
  accordionHeader: {
    paddingVertical: 10,
  },
  accordionContent: {
    paddingLeft: 10,
  },
  accordionText: {
    color: '#fff',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
  },
  textWhite: {
    color: '#fff',
  },
  footer: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 40,
  },
  choiceButton: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    minWidth: '40%',
    alignItems: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: 'rgb(15, 74, 70)',
  },
  switchRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  },
});