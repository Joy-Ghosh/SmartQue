import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { clinics, getClinicDoctor, transportModes } from '@/lib/data';
import { useQueue } from '@/lib/queue-context';
import SmartBookingSheet from '@/components/booking/SmartBookingSheet';
import SuccessOverlay from '@/components/booking/SuccessOverlay';
import { GradientButton } from '@/components/ui/GradientButton';

const { width } = Dimensions.get('window');

// ── Transport Mode Pill ────────────────────────────────────────────────────────
function TransportPill({
  mode,
  selected,
  onSelect,
}: {
  mode: typeof transportModes[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[styles.transportPill, selected && styles.transportPillSelected]}
    >
      <Ionicons
        name={mode.icon}
        size={16}
        color={selected ? '#fff' : Colors.textSecondary}
      />
      <Text style={[styles.transportLabel, selected && styles.transportLabelSelected]}>
        {mode.label}
      </Text>
      <Text style={[styles.transportTime, selected && styles.transportTimeSelected]}>
        {mode.time}m
      </Text>
    </Pressable>
  );
}

// ── Review Item ────────────────────────────────────────────────────────────────
function ReviewCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewName}>{name}</Text>
          <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name="star"
                size={10}
                color={s <= rating ? Colors.smartAmber : Colors.border}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{text}</Text>
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ClinicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { activeBooking, setActiveBooking } = useQueue();

  const clinic = clinics.find((c) => c.id === id);
  const doctor = clinic ? getClinicDoctor(clinic.id) : undefined;

  const [selectedTransport, setSelectedTransport] = useState<'car' | 'bike' | 'walk'>('car');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Queue data
  const currentToken = 12;
  const yourToken = clinic ? clinic.currentQueueLength + 11 : 23;
  const tokensAhead = Math.max(0, yourToken - currentToken);
  const estimatedWaitMins = clinic
    ? tokensAhead * clinic.avgWaitTimePerPatient
    : 0;

  const selectedMode = transportModes.find((m) => m.id === selectedTransport) ?? transportModes[0];
  const leaveInMins = Math.max(0, estimatedWaitMins - selectedMode.time);
  const now = new Date();
  const leaveTime = new Date(now.getTime() + leaveInMins * 60 * 1000);
  const leaveTimeStr = leaveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Pulse animation for the "live" dot
  const dotOpacity = useSharedValue(1);
  useEffect(() => {
    dotOpacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      false
    );
  }, []);
  const liveDotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  // Doctor status colour
  const getStatusStyle = (status: string) => {
    if (status === 'In Cabin')
      return { bg: Colors.successBg, color: Colors.success };
    if (status === 'On Break')
      return { bg: Colors.warningBg, color: Colors.warning };
    return { bg: Colors.primaryBg, color: Colors.primary };
  };

  if (!clinic || !doctor) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={40} color={Colors.textMuted} />
        <Text style={{ fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary, marginTop: 12 }}>
          Clinic not found
        </Text>
      </View>
    );
  }

  const statusStyle = getStatusStyle(doctor.status);

  const handleOpenBookingSheet = () => {
    if (activeBooking) {
      Alert.alert(
        'Already in Queue',
        'You already have an active booking. Please cancel it first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Token', onPress: () => router.push('/active-token') },
        ]
      );
      return;
    }
    setIsBookingSheetOpen(true);
  };

  const handleConfirmBooking = (data: { patient: any; travelMode: any }) => {
    setActiveBooking({
      clinicId: clinic.id,
      clinicName: clinic.name,
      doctorName: doctor.name,
      tokenNumber: yourToken,
      servingToken: currentToken,
      transportMode: data.travelMode.id,
      travelTime: data.travelMode.eta,
      avgWaitTime: clinic.avgWaitTimePerPatient,
      isEmergency,
      bookedAt: Date.now(),
    });
    setIsBookingSheetOpen(false);
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setShowSuccessOverlay(true), 500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── HERO IMAGE ─────────────────────────────────────── */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.05)', Colors.background]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>

        {/* Nav row over image */}
        <View style={[styles.navRow, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={styles.navRightActions}>
            <Pressable
              style={styles.iconBtn}
              onPress={() => setIsWishlisted(!isWishlisted)}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={20}
                color={isWishlisted ? Colors.medicalRed : '#fff'}
              />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ SECTION 1: IDENTITY ══════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.identitySection}>
          {/* Doctor status pill */}
          <View style={[styles.docStatusPill, { backgroundColor: statusStyle.bg }]}>
            <Animated.View style={[styles.liveDot, { backgroundColor: statusStyle.color }, liveDotStyle]} />
            <Text style={[styles.docStatusText, { color: statusStyle.color }]}>{doctor.status}</Text>
          </View>

          <Text style={styles.doctorName}>{doctor.name}</Text>

          <View style={styles.specialtyRow}>
            <Text style={styles.specialtyText}>{doctor.specialty}</Text>
            <View style={styles.dotDivider} />
            <Text style={styles.specialtyText}>{doctor.experience} yrs exp</Text>
            <View style={styles.dotDivider} />
            <Text style={styles.clinicNameText}>{clinic.name}</Text>
          </View>

          {/* Rating + patients */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name="star"
                size={14}
                color={s <= Math.round(doctor.rating) ? Colors.smartAmber : Colors.border}
              />
            ))}
            <Text style={styles.ratingNum}>{doctor.rating}</Text>
            <Text style={styles.ratingCount}>({doctor.reviews} reviews)</Text>
          </View>
        </Animated.View>

        {/* ══ SECTION 2: KEY NUMBERS ═══════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.keyNumbers}>
          <View style={styles.keyNumCard}>
            <View style={[styles.keyNumIcon, { backgroundColor: Colors.primaryBg }]}>
              <Ionicons name="cash-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.keyNumValue}>₹{doctor.fee}</Text>
            <Text style={styles.keyNumLabel}>Fee</Text>
          </View>

          <View style={styles.keyNumDivider} />

          <View style={styles.keyNumCard}>
            <View style={[styles.keyNumIcon, { backgroundColor: Colors.secondaryBg }]}>
              <Ionicons name="location-outline" size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.keyNumValue}>{clinic.distance} km</Text>
            <Text style={styles.keyNumLabel}>Away</Text>
          </View>

          <View style={styles.keyNumDivider} />

          <View style={styles.keyNumCard}>
            <View style={[styles.keyNumIcon, { backgroundColor: Colors.warningBg }]}>
              <Ionicons name="people-outline" size={18} color={Colors.smartAmber} />
            </View>
            <Text style={styles.keyNumValue}>{doctor.patients}+</Text>
            <Text style={styles.keyNumLabel}>Patients</Text>
          </View>
        </Animated.View>

        {/* ══ SECTION 3: THE QUEUE BLOCK (THE HERO) ════════════════════════ */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.queueBlock}>
          {/* Header */}
          <View style={styles.queueBlockHeader}>
            <Text style={styles.queueBlockTitle}>Live Queue Status</Text>
            <View style={styles.queueLiveTag}>
              <Animated.View style={[styles.liveDot, { backgroundColor: Colors.success }, liveDotStyle]} />
              <Text style={styles.queueLiveText}>Live</Text>
            </View>
          </View>

          {/* ── Live Wait Panel ────────────────────────────────── */}
          <View style={styles.liveWaitPanel}>
            {/* Left side: Now Serving */}
            <View style={styles.liveWaitLeft}>
              <Text style={styles.liveWaitCategory}>Current Status</Text>
              <View style={styles.liveWaitNumberRow}>
                <Text style={styles.liveWaitNumber}>{currentToken}</Text>
              </View>
              <Text style={styles.liveWaitSublabel}>Now Serving</Text>
            </View>

            {/* 1px vertical divider */}
            <View style={styles.liveWaitDivider} />

            {/* Right side: Next Token */}
            <View style={styles.liveWaitRight}>
              <Text style={styles.liveWaitCategory}>Next Available</Text>
              <Text style={styles.liveWaitTokenText}>Token #{yourToken}</Text>
              <View style={styles.liveWaitAheadPill}>
                <Text style={styles.liveWaitAheadText}>{tokensAhead} ahead of you</Text>
              </View>
            </View>
          </View>

          {/* Est. Wait full-width bar */}
          <View style={styles.estWaitBar}>
            <View style={styles.estWaitLeft}>
              <Ionicons name="time-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.estWaitLabel}>Est. Wait</Text>
            </View>
            <Text style={styles.estWaitValue}>~{estimatedWaitMins} mins</Text>
          </View>

          {/* Transport selector */}
          <View style={styles.transportSection}>
            <Text style={styles.transportSectionLabel}>How are you getting here?</Text>
            <View style={styles.transportRow}>
              {transportModes.map((mode) => (
                <TransportPill
                  key={mode.id}
                  mode={mode}
                  selected={selectedTransport === mode.id}
                  onSelect={() => setSelectedTransport(mode.id as any)}
                />
              ))}
            </View>
          </View>

          {/* Leave By Alert */}
          <View style={styles.leaveByBox}>
            <View style={styles.leaveByIconWrap}>
              <Ionicons name="notifications" size={16} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.leaveByTitle}>
                Leave by <Text style={{ color: Colors.primary }}>{leaveTimeStr}</Text>
              </Text>
              <Text style={styles.leaveBySubtitle}>
                We'll send you a push notification when it's time.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ══ SECTION 4: ABOUT THE DOCTOR ══════════════════════════════════ */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>About the Doctor</Text>
          <Text style={styles.bioText}>
            {doctor.name} is a qualified {doctor.specialty} with {doctor.experience} years of hands-on
            experience. Known for accurate diagnosis and patient-first approach. Clinic uses modern
            equipment and follows strict hygiene protocols.
          </Text>

          {/* Tags */}
          <View style={styles.tagRow}>
            {['Accurate Diagnosis', 'Modern Equipment', 'Friendly Staff'].map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ══ SECTION 5: REVIEWS ═══════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Patient Reviews</Text>
            <View style={styles.overallRating}>
              <Ionicons name="star" size={14} color={Colors.smartAmber} />
              <Text style={styles.overallRatingText}>{doctor.rating} overall</Text>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <ReviewCard
              name="Amit S."
              text="Excellent service and accurate wait times! The app notification was spot on."
              rating={5}
            />
            <ReviewCard
              name="Priya K."
              text="Very clean facility, doctor was professional and thorough."
              rating={4}
            />
            <ReviewCard
              name="Rohan M."
              text="Saved so much time, didn't have to wait at all."
              rating={5}
            />
          </View>
        </Animated.View>

        {/* ══ SECTION 6: LOCATION ══════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.addressText}>{clinic.address}</Text>
          <Pressable style={styles.mapPreview}>
            <LinearGradient
              colors={[Colors.primaryBg, Colors.secondaryBg]}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="map" size={32} color={Colors.primary} />
            <Text style={styles.mapPlaceholderText}>Tap to open in Maps</Text>
            <View style={styles.mapDirectBtn}>
              <Ionicons name="navigate" size={14} color={Colors.primary} />
              <Text style={styles.mapDirectBtnText}>Get Directions</Text>
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ─────────────────────────────── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
        ]}
      >
        {/* Emergency link — above the button, small tertiary text */}
        <Pressable
          style={styles.emergencyRow}
          onPress={() => {
            if (activeBooking) {
              Alert.alert('Already in Queue', 'Please cancel your active booking first.');
              return;
            }
            setIsEmergency(true);
            setIsBookingSheetOpen(true);
          }}
        >
          <Ionicons name="medical-outline" size={13} color={Colors.medicalRed} />
          <Text style={styles.emergencyText}>
            Emergency?{' '}
            <Text style={{ textDecorationLine: 'underline', fontFamily: 'Inter_700Bold' }}>
              Request Priority
            </Text>
          </Text>
        </Pressable>

        <GradientButton
          title="Book Your Visit"
          onPress={handleOpenBookingSheet}
          icon="ticket-outline"
          style={{ borderRadius: 18 }}
          textStyle={{ fontSize: 16, fontFamily: 'Inter_700Bold' }}
        />
      </View>

      {/* Booking Sheet + Success Overlay */}
      <SmartBookingSheet
        isOpen={isBookingSheetOpen}
        onClose={() => {
          setIsBookingSheetOpen(false);
          setIsEmergency(false);
        }}
        onConfirm={handleConfirmBooking}
        consultationFee={isEmergency ? 700 : doctor.fee}
        isEmergency={isEmergency}
      />

      <SuccessOverlay
        visible={showSuccessOverlay}
        tokenNumber={yourToken}
        doctorName={doctor.name}
        clinicName={clinic.name}
        estimatedTime={leaveTimeStr}
        onClose={() => {
          setShowSuccessOverlay(false);
          router.replace('/active-token');
        }}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Hero Image ──────────────────────────────────────────────────────────
  heroContainer: {
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  navRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  navRightActions: {
    flexDirection: 'row',
    gap: 10,
  },

  // ── Scrollable Body ─────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },

  // ── Section 1: Identity ─────────────────────────────────────────────────
  identitySection: {
    gap: 6,
  },
  docStatusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  docStatusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  doctorName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  clinicNameText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  dotDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
  },

  // ── Section 2: Key Numbers ──────────────────────────────────────────────
  keyNumbers: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadows.sm,
    alignItems: 'center',
  },
  keyNumCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  keyNumIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  keyNumValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.text,
  },
  keyNumLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
  },
  keyNumDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },

  // ── Section 3: Queue Block ──────────────────────────────────────────────
  queueBlock: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadows.md,
    gap: 20,
  },
  queueBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueBlockTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  queueLiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  queueLiveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.success,
  },

  // Live Wait Panel
  liveWaitPanel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: Colors.background,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  liveWaitLeft: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
    gap: 4,
  },
  liveWaitDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  liveWaitRight: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
    gap: 6,
  },
  liveWaitCategory: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  liveWaitNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  liveWaitNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 52,
    color: Colors.text,
    letterSpacing: -2,
    lineHeight: 58,
  },
  liveWaitSublabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.success,
  },
  liveWaitTokenText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  liveWaitAheadPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  liveWaitAheadText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.primary,
  },

  // Est. Wait Bar
  estWaitBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 4,
  },
  estWaitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estWaitLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  estWaitValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.text,
  },

  // Transport
  transportSection: {
    gap: 10,
  },
  transportSectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  transportRow: {
    flexDirection: 'row',
    gap: 8,
  },
  transportPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    gap: 3,
  },
  transportPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Colors.shadows.sm,
  },
  transportLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  transportLabelSelected: {
    color: '#fff',
  },
  transportTime: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textMuted,
  },
  transportTimeSelected: {
    color: 'rgba(255,255,255,0.8)',
  },

  // Leave By
  leaveByBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primaryBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  leaveByIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveByTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  leaveBySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },

  // ── Section 4 & 5 ───────────────────────────────────────────────────────
  section: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.text,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  overallRatingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.smartAmber,
  },
  bioText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
  },
  tagText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.primary,
  },

  // Reviews
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.primary,
  },
  reviewName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
  },
  reviewText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Location
  addressText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  mapPreview: {
    height: 140,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapPlaceholderText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  mapDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadows.sm,
  },
  mapDirectBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },

  // ── Bottom Bar ──────────────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(247, 245, 242, 0.96)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emergencyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.medicalRed,
    textAlign: 'center',
  },
});
