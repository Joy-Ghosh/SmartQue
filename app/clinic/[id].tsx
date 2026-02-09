import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { clinics, getClinicDoctor, transportModes, getQueueBadge } from '@/lib/data';
import { useQueue } from '@/lib/queue-context';

export default function ClinicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { activeBooking, setActiveBooking } = useQueue();

  const clinic = clinics.find((c) => c.id === id);
  const doctor = clinic ? getClinicDoctor(clinic.id) : undefined;

  const [selectedTransport, setSelectedTransport] = useState<'car' | 'bike' | 'walk'>('car');
  const [isEmergency, setIsEmergency] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  const selectedMode = transportModes.find((m) => m.id === selectedTransport)!;
  const badge = clinic ? getQueueBadge(clinic.currentQueueLength) : null;

  const estimatedWait = useMemo(() => {
    if (!clinic) return 0;
    return clinic.currentQueueLength * clinic.avgWaitTimePerPatient;
  }, [clinic]);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  if (!clinic || !doctor) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
        <Text style={styles.errorText}>Clinic not found</Text>
      </View>
    );
  }

  const handleJoinQueue = () => {
    if (activeBooking) {
      Alert.alert('Active Queue', 'You already have an active queue. Please cancel it first.');
      return;
    }

    const tokenNumber = clinic.currentQueueLength + Math.floor(Math.random() * 5) + 8;
    const servingToken = Math.floor(Math.random() * 5) + 1;

    setActiveBooking({
      clinicId: clinic.id,
      clinicName: clinic.name,
      doctorName: doctor.name,
      tokenNumber,
      servingToken,
      transportMode: selectedTransport,
      travelTime: selectedMode.time,
      avgWaitTime: clinic.avgWaitTimePerPatient,
      isEmergency,
      bookedAt: Date.now(),
    });

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    router.push('/active-token');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Clinic Details</Text>
        <Pressable style={styles.backBtn}>
          <Ionicons name="heart-outline" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.doctorCard}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorAvatarWrap}>
              <Ionicons name="person" size={32} color={Colors.primary} />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingVal}>{doctor.rating}</Text>
                <Text style={styles.reviewCount}>({doctor.reviews} reviews)</Text>
              </View>
            </View>
            <View style={styles.feeBadge}>
              <Text style={styles.feeLabel}>{'\u20B9'}{doctor.fee}</Text>
              <Text style={styles.feeUnit}>/visit</Text>
            </View>
          </View>

          <View style={styles.doctorStats}>
            <View style={styles.doctorStatItem}>
              <View style={[styles.doctorStatIcon, { backgroundColor: Colors.infoBg }]}>
                <Ionicons name="briefcase" size={16} color={Colors.info} />
              </View>
              <Text style={styles.doctorStatValue}>{doctor.experience} yr</Text>
              <Text style={styles.doctorStatLabel}>Experience</Text>
            </View>
            <View style={styles.doctorStatItem}>
              <View style={[styles.doctorStatIcon, { backgroundColor: Colors.successBg }]}>
                <Ionicons name="people" size={16} color={Colors.success} />
              </View>
              <Text style={styles.doctorStatValue}>{doctor.patients}+</Text>
              <Text style={styles.doctorStatLabel}>Patients</Text>
            </View>
            <View style={styles.doctorStatItem}>
              <View style={[styles.doctorStatIcon, { backgroundColor: Colors.warningBg }]}>
                <Ionicons name="chatbubbles" size={16} color={Colors.warning} />
              </View>
              <Text style={styles.doctorStatValue}>{doctor.reviews}</Text>
              <Text style={styles.doctorStatLabel}>Reviews</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Today's Status</Text>
            {badge && (
              <View style={[styles.statusBadge, { backgroundColor: badge.bgColor }]}>
                <View style={[styles.badgeDot, { backgroundColor: badge.color }]} />
                <Text style={[styles.statusBadgeText, { color: badge.color }]}>{badge.label}</Text>
              </View>
            )}
          </View>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Ionicons name="medical" size={18} color={Colors.primary} />
              <Text style={styles.statusLabel}>Doctor Status</Text>
              <Text style={[styles.statusValue, { color: doctor.status === 'In Cabin' ? Colors.success : Colors.warning }]}>
                {doctor.status}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="people" size={18} color={Colors.primary} />
              <Text style={styles.statusLabel}>In Queue</Text>
              <Text style={styles.statusValue}>{clinic.currentQueueLength} people</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="time" size={18} color={Colors.primary} />
              <Text style={styles.statusLabel}>Est. Wait</Text>
              <Text style={styles.statusValue}>~{estimatedWait} min</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="location" size={18} color={Colors.primary} />
              <Text style={styles.statusLabel}>Distance</Text>
              <Text style={styles.statusValue}>{clinic.distance} km</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.tabsSection}>
          <View style={styles.tabsRow}>
            <Pressable
              style={[styles.tab, activeTab === 'about' && styles.tabActive]}
              onPress={() => setActiveTab('about')}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={activeTab === 'about' ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>About</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
              onPress={() => setActiveTab('reviews')}
            >
              <Ionicons
                name="star-outline"
                size={16}
                color={activeTab === 'reviews' ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>Reviews</Text>
            </Pressable>
          </View>

          {activeTab === 'about' && (
            <View style={styles.aboutContent}>
              <View style={styles.aboutRow}>
                <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.aboutText}>{clinic.address}</Text>
              </View>
              <View style={styles.aboutRow}>
                <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.aboutText}>Mon - Sat: 9:00 AM - 8:00 PM</Text>
              </View>
              <View style={styles.aboutRow}>
                <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.aboutText}>+91 98765 43210</Text>
              </View>
              <Text style={styles.aboutPara}>
                {clinic.name} offers comprehensive healthcare services with modern equipment and experienced medical professionals. Our priority is patient comfort and quality care.
              </Text>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.reviewsContent}>
              {[
                { name: 'Sneha Patil', text: 'Very polite doctor. Treatment was effective and quick.', stars: 5 },
                { name: 'Ankit Sharma', text: 'Good experience overall. Reasonable consultation fees.', stars: 4 },
                { name: 'Nisha Kulkarni', text: 'Clean clinic, minimal wait time. Highly recommended.', stars: 5 },
              ].map((review, i) => (
                <View key={i} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>{review.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Ionicons
                            key={s}
                            name={s <= review.stars ? 'star' : 'star-outline'}
                            size={12}
                            color="#F59E0B"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>Select Transport Mode</Text>
          <View style={styles.transportRow}>
            {transportModes.map((mode) => {
              const isActive = selectedTransport === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  style={[styles.transportCard, isActive && styles.transportCardActive]}
                  onPress={() => {
                    setSelectedTransport(mode.id);
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={24}
                    color={isActive ? Colors.primary : Colors.textSecondary}
                  />
                  <Text style={[styles.transportLabel, isActive && styles.transportLabelActive]}>
                    {mode.label}
                  </Text>
                  <Text style={[styles.transportTime, isActive && styles.transportTimeActive]}>
                    {mode.time} min
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Pressable
            style={styles.emergencyToggle}
            onPress={() => {
              setIsEmergency(!isEmergency);
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
          >
            <View style={styles.emergencyLeft}>
              <View style={[styles.emergencyIcon, isEmergency && styles.emergencyIconActive]}>
                <Ionicons name="alert-circle" size={20} color={isEmergency ? '#fff' : Colors.danger} />
              </View>
              <View>
                <Text style={styles.emergencyLabel}>Emergency Booking</Text>
                <Text style={styles.emergencySub}>Priority queue placement</Text>
              </View>
            </View>
            <View style={[styles.toggleTrack, isEmergency && styles.toggleTrackActive]}>
              <View style={[styles.toggleThumb, isEmergency && styles.toggleThumbActive]} />
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) + (Platform.OS === 'web' ? 34 : 0) }]}
      >
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomWait}>Wait: ~{estimatedWait} min</Text>
          <Text style={styles.bottomTravel}>Travel: {selectedMode.time} min by {selectedMode.label}</Text>
        </View>
        <Pressable
          style={[styles.joinBtn, isEmergency && styles.joinBtnEmergency]}
          onPress={handleJoinQueue}
        >
          <Ionicons name={isEmergency ? 'alert-circle' : 'add-circle'} size={20} color="#fff" />
          <Text style={styles.joinBtnText}>{isEmergency ? 'Emergency Join' : 'Join Queue'}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  doctorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  doctorAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  doctorSpecialty: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingVal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
  },
  reviewCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  feeBadge: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  feeUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  doctorStats: {
    flexDirection: 'row',
    gap: 12,
  },
  doctorStatItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
  },
  doctorStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  doctorStatValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.text,
  },
  doctorStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusItem: {
    width: '47%' as any,
    backgroundColor: Colors.primaryBg,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  statusLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statusValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  tabsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: Colors.primaryBg,
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  aboutContent: {
    gap: 10,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aboutText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  aboutPara: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
  },
  reviewsContent: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  reviewName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 2,
  },
  reviewText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 10,
  },
  transportRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  transportCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  transportCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  transportLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  transportLabelActive: {
    color: Colors.primary,
  },
  transportTime: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.textMuted,
  },
  transportTimeActive: {
    color: Colors.primaryDark,
  },
  emergencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIconActive: {
    backgroundColor: Colors.danger,
  },
  emergencyLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  emergencySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackActive: {
    backgroundColor: Colors.danger,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end' as const,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomWait: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  bottomTravel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  joinBtnEmergency: {
    backgroundColor: Colors.danger,
  },
  joinBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
});
