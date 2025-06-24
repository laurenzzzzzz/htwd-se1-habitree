import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const abzeichenZeilen = [
  [
    require('@/assets/images/abzeichen1.png'),
    require('@/assets/images/abzeichen2.png'),
  ],
  [
    require('@/assets/images/abzeichen3.png'),
    require('@/assets/images/abzeichen4.png'),
    require('@/assets/images/abzeichen5.png'),
  ],
  [
    require('@/assets/images/abzeichen6.png'),
    require('@/assets/images/abzeichen7.png'),
  ],
];

export default function TabTwoScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const [modalVisible, setModalVisible] = useState<null | 'abzeichen5' | 'abzeichen6'>(null);

  const renderModalContent = () => {
    if (modalVisible === 'abzeichen5') {
      return (
        <>
          <Text style={styles.modalTitle}>Rauchen abgelegt</Text>
          <Text style={styles.modalText}>
            Starke Leistung! Du hast erfolgreich das Rauchen aufgegeben und damit einen großen Schritt in Richtung besserer Gesundheit und Lebensqualität gemacht. Weiter so!
          </Text>
        </>
      );
    }
      
    if (modalVisible === 'abzeichen6') {
      return (
        <>
          <Text style={styles.modalTitle}>Täglich Sport 1h</Text>
          <Text style={styles.modalText}>
            Gratulation, du hast 66 Tage am Stück täglich eine Stunde Sport getrieben und damit nachhaltig deinen Alltag und Wohlbefinden verbessert. Bleib dran! :)
          </Text>
        </>
      );
    }

    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ThemedText type="subtitle" style={styles.erfolgeTitle}>
        Erfolge
      </ThemedText>

      {abzeichenZeilen.map((zeile, zeilenIndex) => (
        <View key={zeilenIndex} style={styles.badgeRow}>
          {zeile.map((source, index) => {
            const isAbzeichen5 = source === require('@/assets/images/abzeichen5.png');
            const isAbzeichen6 = source === require('@/assets/images/abzeichen6.png');

            return (
              <Pressable
                key={index}
                onPress={() => {
                  if (isAbzeichen5) setModalVisible('abzeichen5');
                  if (isAbzeichen6) setModalVisible('abzeichen6');
                }}
              >
                <Image source={source} style={styles.badge} contentFit="contain" />
              </Pressable>
            );
          })}
        </View>
      ))}

      <Modal
        visible={modalVisible !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderModalContent()}
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(null)}>
              <Text style={styles.closeButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  erfolgeTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    width: 100,
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'rgb(25, 145, 137)', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
},
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});