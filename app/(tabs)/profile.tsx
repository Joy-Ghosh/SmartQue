import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { user } from '@/lib/data';
import { useQueue } from '@/lib/queue-context';
import { GlassView } from '@/components/ui/GlassView';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  isSwitch?: boolean;
}

function MenuItem({ icon, label, subtitle, color = Colors.primary, onPress, isSwitch }: MenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && !isSwitch && { opacity: 0.7, transform: [{ scale: 0.99 }] }]}
      onPress={!isSwitch ? onPress : undefined}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text style={styles.menuLabel}>{label}</Text>
        {subtitle && <Text style={styles.menuSub}>{subtitle}</Text>}
      </View>
      {isSwitch ? (
        <Switch
          trackColor={{ false: Colors.borderLight, true: Colors.primary }}
          thumbColor={'#fff'}
          ios_backgroundColor={Colors.borderLight}
          style={{ transform: [{ scale: 0.8 }] }}
          value={true}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pastBookings } = useQueue();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.headerBg}>
        <LinearGradient colors={['#F0F9FF', '#F8FAFC']} style={StyleSheet.absoluteFill} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: 120
          }
        ]}
      >
        <GlassView style={styles.profileCard} intensity={70} gradientColors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)']} border>
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </LinearGradient>
              <Pressable style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <View style={styles.locationTag}>
                <Ionicons name="location" size={12} color={Colors.textSecondary} />
                <Text style={styles.profileLocation}>{user.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{pastBookings.length}</Text>
              <Text style={styles.statLabel}>Visits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </GlassView>

        {/* Menu Sections */}
        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>My Account</Text>
          <GlassView intensity={50} style={styles.menuList} border>
            <MenuItem
              icon="calendar-outline"
              label="My Appointments"
              subtitle="Upcoming & History"
              onPress={() => router.push('/appointments')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="heart-outline"
              label="Saved Clinics"
              color={Colors.medicalRed}
              onPress={() => { }}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="wallet-outline"
              label="Payment Methods"
              color={Colors.secondary}
              onPress={() => { }}
            />
          </GlassView>
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>Preferences</Text>
          <GlassView intensity={50} style={styles.menuList} border>
            <MenuItem
              icon="notifications-outline"
              label="Push Notifications"
              color={Colors.smartAmber}
              isSwitch
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="moon-outline"
              label="Dark Mode"
              color={Colors.primary}
              isSwitch
            />
          </GlassView>
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>Support</Text>
          <GlassView intensity={50} style={styles.menuList} border>
            <MenuItem icon="help-circle-outline" label="Help Center" onPress={() => { }} />
            <View style={styles.menuDivider} />
            <MenuItem icon="document-text-outline" label="Terms & Privacy" onPress={() => { }} />
          </GlassView>
        </View>

        <Pressable style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>SmartQ v1.2.0 • Build 4502</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    zIndex: -1,
  },
  blob1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.secondary + '20', // check opacity
  },
  blob2: {
    position: 'absolute',
    top: 50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primary + '10',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    ...Colors.shadows.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadows.md,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.text,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 4,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  profileLocation: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderLight,
  },
  menuGroup: {
    gap: 12,
  },
  groupTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuList: {
    borderRadius: 20,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  menuSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  menuDivider: {
    marginLeft: 72,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.danger,
  },
  version: {
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 20,
  }
});
