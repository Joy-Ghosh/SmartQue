import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
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
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isIOS ? 90 : 70,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 10,
          marginTop: 4,
          marginBottom: isIOS ? 0 : 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.activeTabPopup]}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.activeTabPopup]}>
              <Ionicons name={focused ? "compass" : "compass-outline"} size={22} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="token"
        options={{
          title: 'Token',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.activeTabPopup]}>
              <Ionicons name={focused ? "ticket" : "ticket-outline"} size={22} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.activeTabPopup]}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={focused ? Colors.primary : color} />
            </View>
          )
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.activeTabPopup]}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={focused ? Colors.primary : color} />
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
    borderRadius: 16,
  },
  activeTabPopup: {
    backgroundColor: '#E0F2FE', // Very light primary blue
  }
});
