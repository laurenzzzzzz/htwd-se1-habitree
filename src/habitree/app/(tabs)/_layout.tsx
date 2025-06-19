import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 44 + insets.top;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,

        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 34,
          fontWeight: '800',
          height:HEADER_HEIGHT - 10,
          color: Colors[colorScheme ?? 'light'].heading,
          //flex: 1,
          
         
        },

        headerStyle: {

            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderBottomColor: Colors[colorScheme ?? 'light'].border,
            height: HEADER_HEIGHT-40, 
            borderBottomWidth: 0,
            //paddingTop: 0,
          

            
        },
        headerTitleContainerStyle: {
          //height: HEADER_HEIGHT, 
          //paddingTop: 4,  // z.B. minimal nach unten schieben
          //marginTop: 0, //um nach oben zu schieben
        },

        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
        ios: {
          position: 'absolute',
          bottom: -45, // Damit die Icons nicht zu weit über dem Bildschirmrand schweben
          left: 0,
          right: 0,
          backgroundColor: 'transparent', // optional, falls du blur im Background verwendest
          borderTopWidth: 0, // optional: kein Rand oben
        },
        default: {},
      }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,

          headerTitle: 'Habitree',  // Text oben im Header

        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Kalender',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tree"
        options={{
          title: 'Baum',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tree.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="archivebox.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
