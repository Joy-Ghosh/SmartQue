import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

function GlassTabBarBackground() {
  return (
    <View style={styles.tabBarBackgroundContainer}>
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.tabBarBorder} />
    </View>
  );
}

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
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isIOS ? 88 : 68,
          borderTopWidth: 0,
          elevation: 0, // Remove Android shadow to handle it consistently
          backgroundColor: isIOS ? 'transparent' : 'rgba(255,255,255,0.9)',
        },
        tabBarBackground: () => isIOS ? <GlassTabBarBackground /> : undefined,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
          marginTop: -4,
          marginBottom: isIOS ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} size={26} color={color} />
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="token"
        options={{
          title: 'Token',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.tokenTabIcon,
              focused && styles.tokenTabIconFocused
            ]}>
              <Ionicons name={focused ? "ticket" : "ticket-outline"} size={24} color={focused ? '#fff' : color} />
            </View>
          ),
          tabBarLabelStyle: {
            display: 'none',
          },
          tabBarItemStyle: {
            marginTop: -20, // Lift the center button
          }
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          href: null, // Hide from tab bar if not needed, or keep
          title: 'Visits',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
          )
        }}
        listeners={{ tabPress: handleTabPress }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tokenTabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    ...Colors.shadows.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    top: 4,
  },
  tokenTabIconFocused: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    transform: [{ scale: 1.1 }],
    ...Colors.shadows.glow,
  }
});
