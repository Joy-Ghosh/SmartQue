import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const isIOS = Platform.OS === 'ios';

  const handleTabPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Custom labeling entirely handled inside the icon component
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isIOS ? 88 : 68,
          backgroundColor: Colors.surfacePrimary,
          borderTopWidth: 1,
          borderTopColor: Colors.gray200,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          paddingTop: isIOS ? 12 : 0, 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={22} 
                color={focused ? Colors.primary500 : Colors.gray500} 
              />
              {focused && <Text style={styles.tabTextActive}>Home</Text>}
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons 
                name={focused ? "search" : "search-outline"} 
                size={22} 
                color={focused ? Colors.primary500 : Colors.gray500} 
              />
              {focused && <Text style={styles.tabTextActive}>Clinics</Text>}
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="token"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons 
                name={focused ? "ticket" : "ticket-outline"} 
                size={22} 
                color={focused ? Colors.primary500 : Colors.gray500} 
              />
              {focused && <Text style={styles.tabTextActive}>My Queue</Text>}
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
           // Hide appointments from the bottom nav specifically based on user request "Home, Clinics, My Queue, Profile"
           href: null as any,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={22} 
                color={focused ? Colors.primary500 : Colors.gray500} 
              />
              {focused && <Text style={styles.tabTextActive}>Profile</Text>}
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Equal square-ish dimension when inactive to ensure centering
    height: 44,
    minWidth: 44,
    borderRadius: 100,
    gap: 6,
    paddingHorizontal: 0,
  },
  tabItemActive: {
    backgroundColor: Colors.primary100, // Soft blue pill
    paddingHorizontal: 16, // Expands pill beautifully
    minWidth: 'auto',
  },
  tabTextActive: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.primary500,
    marginBottom: Platform.OS === 'ios' ? 0 : 2, // Slight vertical balancing
  }
});

