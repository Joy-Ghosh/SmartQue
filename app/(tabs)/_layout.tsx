/**
 * SmartQ — Bottom Navigation System v2
 *
 * Design Philosophy: "Navigation as Live Context"
 * — Not a passive menu. An active system that shows queue state.
 * — "Now" tab is special: shows live position when in queue.
 * — Pill highlight for active state with smooth press feedback.
 * — Adaptive labels only when active (icon-only when passive).
 */
import { Tabs, usePathname } from 'expo-router';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useEffect, useCallback } from 'react';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { useQueue } from '@/lib/queue-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Live Position Dot ──────────────────────────────────────────────────────
function LiveDot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.liveDot, { opacity }]} />;
}

// ─── Individual Tab Icon ─────────────────────────────────────────────────────
type TabIconProps = {
  focused: boolean;
  icon: string;
  iconActive: string;
  label: string;
  badge?: string | null;
  isLive?: boolean;
  liveLabel?: string | null;
};

function TabIcon({ focused, icon, iconActive, label, badge, isLive, liveLabel }: TabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }),
    ]).start();
  }, [scale]);

  // Trigger press anim each time focused changes
  useEffect(() => {
    if (focused) handlePress();
  }, [focused]);

  const displayLabel = focused && isLive && liveLabel ? liveLabel : label;

  return (
    <Animated.View style={[styles.tabItem, focused && styles.tabItemActive, { transform: [{ scale }] }]}>
      {/* Live indicator dot when active + in queue */}
      {isLive && <LiveDot />}

      <Ionicons
        name={(focused ? iconActive : icon) as any}
        size={22}
        color={focused ? Colors.primary500 : Colors.gray400}
      />

      {focused && (
        <Text style={styles.tabLabel}>{displayLabel}</Text>
      )}

      {/* Activity badge */}
      {!focused && badge != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Animated.View>
  );
}

// ─── Custom Tab Bar ──────────────────────────────────────────────────────────
// We use the default Tabs TabBar but customize each icon slot.
// The bottom safe area is handled per-platform.

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { activeBooking } = useQueue();

  const hasActiveBooking = !!activeBooking;
  const livePosition = activeBooking?.tokenNumber;
  const tabBarHeight = 64 + (insets.bottom > 0 ? insets.bottom : 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: Colors.surfacePrimary,
          borderTopWidth: 1,
          borderTopColor: Colors.gray200,
          // Soft top shadow only
          elevation: 8,
          shadowColor: Colors.gray900,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 10,
          paddingHorizontal: 8,
        },
      }}
    >
      {/* ── NOW (Home / Command Center) ── */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="time-outline"
              iconActive="time"
              label="Now"
              isLive={hasActiveBooking}
              liveLabel={livePosition ? `#${livePosition}` : 'Now'}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />

      {/* ── EXPLORE (Clinic Search) ── */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="compass-outline"
              iconActive="compass"
              label="Explore"
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />

      {/* ── ACTIVITY (Bookings + History) ── */}
      <Tabs.Screen
        name="token"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="receipt-outline"
              iconActive="receipt"
              label="Activity"
              badge={hasActiveBooking ? '1' : null}
              isLive={hasActiveBooking && !focused}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />

      {/* Hidden from nav */}
      <Tabs.Screen
        name="appointments"
        options={{ href: null as any }}
      />

      {/* ── PROFILE ── */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="person-outline"
              iconActive="person"
              label="Profile"
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // ── Tab item base (inactive) ─────────────────────────────────
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    minWidth: 44,
    borderRadius: 22,
    gap: 5,
    paddingHorizontal: 8,
    position: 'relative',
  },

  // ── Active pill ──────────────────────────────────────────────
  tabItemActive: {
    backgroundColor: Colors.primary100,
    paddingHorizontal: 14,
  },

  // ── Active label ─────────────────────────────────────────────
  tabLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.primary500,
    letterSpacing: -0.2,
  },

  // ── Live pulsing dot ─────────────────────────────────────────
  liveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.success500,
    borderWidth: 1.5,
    borderColor: Colors.surfacePrimary,
  },

  // ── Activity badge ────────────────────────────────────────────
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    backgroundColor: Colors.primary500,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.surfacePrimary,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: Colors.textOnColor,
    lineHeight: 12,
  },
});
