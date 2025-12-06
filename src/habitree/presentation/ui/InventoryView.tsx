import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { inventoryStyles as styles } from '../../styles/inventory_style';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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

export default function InventoryView() {
  const backgroundColor = useThemeColor({}, 'background');
  const [modalVisible, setModalVisible] = useState<null | 'abzeichen5' | 'abzeichen6'>(null);

  const renderModalContent = () => {
    if (modalVisible === 'abzeichen6') {
      return (
        <>
          <Text style={styles.modalTitle}>Täglicher Sport</Text>
          <Text style={styles.modalText}>
            Gratulation, du hast 66 Tage am Stück täglich eine Stunde Sport getrieben und damit nachhaltig deinen Alltag und Wohlbefinden verbessert. Bleib dran! :)
          </Text>
        </>
      );
    }

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
        animationType="fade"
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
