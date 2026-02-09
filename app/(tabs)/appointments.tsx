import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useQueue } from '@/lib/queue-context';

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const { activeBooking, pastBookings } = useQueue();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Appointments</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        {activeBooking && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Pressable
              style={styles.activeCard}
              onPress={() => router.push('/active-token')}
            >
              <View style={styles.activeCardHeader}>
                <View style={styles.activeIconWrap}>
                  <Ionicons name="ticket" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeTitle}>Active Queue</Text>
                  <Text style={styles.activeSub}>{activeBooking.clinicName}</Text>
                </View>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenBadgeText}>#{activeBooking.tokenNumber}</Text>
                </View>
              </View>
              <View style={styles.activeDetails}>
                <View style={styles.activeDetailItem}>
                  <Text style={styles.activeDetailLabel}>Doctor</Text>
                  <Text style={styles.activeDetailValue}>{activeBooking.doctorName}</Text>
                </View>
                <View style={styles.activeDetailItem}>
                  <Text style={styles.activeDetailLabel}>Serving</Text>
                  <Text style={styles.activeDetailValue}>#{activeBooking.servingToken}</Text>
                </View>
                <View style={styles.activeDetailItem}>
                  <Text style={styles.activeDetailLabel}>Mode</Text>
                  <Text style={styles.activeDetailValue}>
                    {activeBooking.transportMode === 'car' ? 'Car' : activeBooking.transportMode === 'bike' ? 'Bike' : 'Walk'}
                  </Text>
                </View>
              </View>
              <View style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View Live Status</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </Pressable>
          </Animated.View>
        )}

        <Text style={styles.sectionTitle}>Past Bookings</Text>

        {pastBookings.length === 0 && !activeBooking && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Appointments Yet</Text>
            <Text style={styles.emptySub}>Book a clinic visit to see your appointments here</Text>
            <Pressable style={styles.emptyBtn} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.emptyBtnText}>Find Clinics</Text>
            </Pressable>
          </View>
        )}

        {pastBookings.map((booking, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 60).duration(300)}>
            <View style={styles.pastCard}>
              <View style={styles.pastCardLeft}>
                <View style={styles.pastIconWrap}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                </View>
                <View>
                  <Text style={styles.pastClinic}>{booking.clinicName}</Text>
                  <Text style={styles.pastDoctor}>{booking.doctorName}</Text>
                  <Text style={styles.pastMeta}>Token #{booking.tokenNumber}</Text>
                </View>
              </View>
              <Text style={styles.pastStatus}>Completed</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  pageTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  activeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  activeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  activeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  activeSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tokenBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tokenBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#fff',
  },
  activeDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  activeDetailItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
  },
  activeDetailLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  activeDetailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#fff',
    marginTop: 2,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  viewBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  emptyBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pastCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pastIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastClinic: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  pastDoctor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  pastMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  pastStatus: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.success,
  },
});
