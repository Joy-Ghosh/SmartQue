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
  FadeIn,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { clinics, getClinicDoctor } from '@/lib/data';
import { useQueue } from '@/lib/queue-context';
import { Motion } from '@/constants/motion';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CountUp } from '@/components/CountUp';
import SmartBookingSheet from '@/components/booking/SmartBookingSheet';
import SuccessOverlay from '@/components/booking/SuccessOverlay';

const { width } = Dimensions.get('window');

// ── Trust Badge Row
function TrustBadge({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.trustBadge}>
      <Ionicons name={icon} size={14} color={Colors.success700} />
      <Text style={styles.trustBadgeText}>{text}</Text>
    </View>
  );
}

// ── Review Item (compact)
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
              <Ionicons key={s} name="star" size={10} color={s <= rating ? Colors.warning500 : Colors.gray200} />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{text}</Text>
    </View>
  );
}

export default function ClinicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { activeBooking, setActiveBooking } = useQueue();

  const clinic = clinics.find((c) => c.id === id);
  const doctor = clinic ? getClinicDoctor(clinic.id) : undefined;

  const [isEmergency, setIsEmergency] = useState(false);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  // Queue data
  const currentToken = 12;
  const yourToken = clinic ? clinic.currentQueueLength + 11 : 23;
  const peopleAhead = yourToken - currentToken - 1;

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

  if (!clinic || !doctor) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Clinic not found</Text>
      </View>
    );
  }

  const handleOpenBookingSheet = () => {
    if (activeBooking) {
      Alert.alert('Already in Queue', 'You already have an active booking.');
      return;
    }
    setIsEmergency(false);
    setIsBookingSheetOpen(true);
  };

  const handleEmergency = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsEmergency(true);
    setIsBookingSheetOpen(true);
  };

  const handleConfirmBooking = (data: any) => {
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
    setTimeout(() => {
      setShowSuccessOverlay(true);
    }, 600);
  };

  const isInQueueForThisClinic = activeBooking?.clinicId === clinic.id;
  const consultationFee = clinic.pricing?.consultation || doctor.fee;
  const totalFee = clinic.pricing?.total || (doctor.fee + 49);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── HERO ── */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: clinic.image?.startsWith('http') ? clinic.image : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=60' }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {/* Stronger gradient for text legibility */}
        <LinearGradient
          colors={['rgba(5,15,35,0.75)', 'rgba(5,15,35,0.15)', 'rgba(248,250,252,0)']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(248,250,252,1)']}
          locations={[0.6, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Nav */}
        <View style={[styles.navRow, { paddingTop: insets.top + 8 }]}>
          <AnimatedButton onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </AnimatedButton>
          <View style={styles.navRightActions}>
            <AnimatedButton style={styles.iconBtn} onPress={() => setIsWishlisted(!isWishlisted)}>
              <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={20} color={isWishlisted ? Colors.error500 : '#fff'} />
            </AnimatedButton>
          </View>
        </View>

        {/* Hero Identity (overlaid at bottom of hero) */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.heroIdentity}>
          <View style={styles.heroStatusPill}>
            <Animated.View style={[styles.heroPillDot, liveDotStyle]} />
            <Text style={styles.heroStatusText}>In Cabin</Text>
          </View>
          <Text style={styles.heroDoctorName}>{doctor.name}</Text>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroSpecialty}>{doctor.specialty}</Text>
            <Text style={styles.heroMetaDot}>·</Text>
            <Text style={styles.heroDistance}>{clinic.distance} km</Text>
            <Text style={styles.heroMetaDot}>·</Text>
            <Ionicons name="star" size={12} color={Colors.warning500} />
            <Text style={styles.heroRating}> {doctor.rating}</Text>
            <Text style={styles.heroRatingCount}> ({doctor.reviews})</Text>
          </View>
        </Animated.View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: 160 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── LIVE STATUS STRIP ── */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger)} style={styles.liveStrip}>
          <View style={styles.liveStripLeft}>
            <Animated.View style={[styles.liveDot, liveDotStyle]} />
            <Text style={styles.liveStripTitle}>LIVE</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.liveStripSub}>Serving </Text>
                <Animated.View key={currentToken} entering={FadeInDown.duration(300)}>
                    <Text style={[styles.liveStripSub, styles.liveStripBold]}>#{currentToken}</Text>
                </Animated.View>
            </View>
          </View>
          <View style={styles.liveStripRight}>
            <Text style={styles.liveStripMeta}>Active 2h  ·  Closes 9:00 PM</Text>
          </View>
        </Animated.View>

        {/* ── DECISION BLOCK (HERO) ── */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * 2)} style={styles.decisionHero}>
          <Text style={styles.decisionLabel}>If you join now</Text>

          {/* Big Position Number */}
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.decisionPosition}>#</Text>
              <CountUp value={yourToken} duration={800} style={styles.decisionPosition} />
          </View>

          {/* Time pair */}
          <View style={styles.decisionTimePair}>
            <View style={styles.decisionTimeItem}>
              <Text style={styles.decisionTimeValue}>6:40 PM</Text>
              <Text style={styles.decisionTimeLabel}>Visit</Text>
            </View>
            <View style={styles.decisionTimeSep} />
            <View style={styles.decisionTimeItem}>
              <Text style={[styles.decisionTimeValue, { color: Colors.primary500 }]}>1h 20m</Text>
              <Text style={[styles.decisionTimeLabel, { color: Colors.primary500, fontFamily: 'Inter_600SemiBold' }]}>Leave in</Text>
            </View>
          </View>

          {/* Subtle price line */}
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.decisionPriceLine}>Consultation ₹</Text>
              <CountUp value={consultationFee} duration={400} style={styles.decisionPriceLine} />
          </View>
        </Animated.View>

        {/* CTA now in sticky footer below */}

        {/* ── DIVIDER ── */}
        <View style={styles.sectionDivider} />

        {/* ── QUEUE SNAPSHOT (compact, secondary) ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Queue Details</Text>
          <View style={styles.compactCard}>
            <View style={styles.compactRow}>
              <Text style={styles.compactLabel}>Serving</Text>
              <Text style={styles.compactValue}>#{currentToken}</Text>
            </View>
            <View style={styles.compactSep} />
            <View style={styles.compactRow}>
              <Text style={styles.compactLabel}>Ahead of you</Text>
              <Text style={styles.compactValue}>{peopleAhead}</Text>
            </View>
            <View style={styles.compactSep} />
            <View style={styles.compactRow}>
              <Text style={styles.compactLabel}>Avg consult</Text>
              <Text style={styles.compactValue}>5 min</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── PRICING (COLLAPSIBLE) ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(225)}>
          <Pressable style={styles.pricingToggleRow} onPress={() => setShowPricing(!showPricing)}>
            <Text style={styles.sectionTitle} numberOfLines={1}>₹{consultationFee} consultation</Text>
            <Ionicons name={showPricing ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.gray500} />
          </Pressable>
          {showPricing && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.compactCard}>
              <View style={styles.compactRow}>
                <Text style={styles.compactLabel}>Consultation</Text>
                <Text style={styles.compactValue}>₹{consultationFee}</Text>
              </View>
              <View style={styles.compactSep} />
              <View style={styles.compactRow}>
                <Text style={styles.compactLabel}>Platform fee</Text>
                <Text style={styles.compactValue}>₹{clinic.pricing?.platformFee || 49}</Text>
              </View>
              <View style={styles.compactSep} />
              <View style={styles.compactRow}>
                <Text style={[styles.compactLabel, { fontFamily: 'Inter_700Bold', color: Colors.textPrimary }]}>Total</Text>
                <Text style={[styles.compactValue, { color: Colors.primary700, fontFamily: 'Inter_700Bold' }]}>₹{totalFee}</Text>
              </View>
              <View style={styles.payNote}>
                <Ionicons name="shield-checkmark" size={13} color={Colors.success500} />
                <Text style={styles.payNoteText}>Pay at clinic · No advance required</Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* ── TIMELINE ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)}>
          <Text style={styles.sectionTitle}>Today's Timeline</Text>
          <View style={styles.timelineStrip}>
            {[
              { label: 'Booking', value: '9:00 AM', accent: false },
              { label: 'Opens', value: '5:00 PM', accent: false },
              { label: 'Peak', value: '6:30 PM', accent: true },
              { label: 'Closes', value: '9:00 PM', accent: false },
            ].map((item, i) => (
              <View key={i} style={styles.timelineItem}>
                <Text style={[styles.timelineValue, item.accent && { color: Colors.warning500 }]}>{item.value}</Text>
                <Text style={styles.timelineLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── REVIEWS ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(275)}>
          <Text style={styles.sectionTitle}>Why patients prefer here</Text>
          <View style={styles.trustBadgeRow}>
            <TrustBadge icon="people-outline" text="Friendly staff" />
            <TrustBadge icon="timer-outline" text="Accurate timing" />
            <TrustBadge icon="sparkles-outline" text="Clean clinic" />
          </View>
          <View style={{ marginTop: 12, gap: 10 }}>
            <ReviewCard name="Amit S." text="Excellent service and accurate wait times!" rating={5} />
            <ReviewCard name="Priya K." text="Very clean facility, doctor was professional." rating={4} />
          </View>
        </Animated.View>

        {/* ── LOCATION ── */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.addressText}>{clinic.address}</Text>
          <Pressable style={styles.mapRow}>
            <Ionicons name="map-outline" size={18} color={Colors.primary500} />
            <Text style={styles.mapText}>View on map</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* ── STICKY BOTTOM BAR (always visible) ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        {isInQueueForThisClinic ? (
          <AnimatedButton
            style={[styles.bottomBarBtn, { backgroundColor: Colors.primary700 }]}
            onPress={() => router.push('/active-token')}
          >
            <Ionicons name="ticket-outline" size={18} color="#fff" />
            <Text style={styles.bottomBarBtnText}>View Active Ticket</Text>
          </AnimatedButton>
        ) : (
          <AnimatedButton
            style={styles.bottomBarBtn}
            onPress={handleOpenBookingSheet}
          >
            <Ionicons name="enter-outline" size={18} color="#fff" />
            <Text style={styles.bottomBarBtnText}>Join Queue</Text>
          </AnimatedButton>
        )}
        <Text style={styles.bottomBarMicro}>No waiting at clinic  ·  We'll notify you</Text>
        <AnimatedButton style={styles.emergencyLine} onPress={handleEmergency}>
          <Ionicons name="warning-outline" size={14} color={Colors.error500} />
          <Text style={styles.emergencyLineText}>Need urgent care? Get priority access</Text>
        </AnimatedButton>
      </View>

      <SmartBookingSheet
        isOpen={isBookingSheetOpen}
        onClose={() => { setIsBookingSheetOpen(false); setIsEmergency(false); }}
        onConfirm={handleConfirmBooking}
        consultationFee={doctor.fee}
        pricing={clinic.pricing}
        isEmergency={isEmergency}
        clinicName={clinic.name}
      />

      <SuccessOverlay
        visible={showSuccessOverlay}
        tokenNumber={yourToken}
        doctorName={doctor.name}
        clinicName={clinic.name}
        estimatedTime="6:40 PM"
        consultationFee={doctor.fee}
        isEmergency={isEmergency}
        onClose={() => {
          setShowSuccessOverlay(false);
          router.replace('/active-token');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSecondary },

  // ── HERO ──
  heroContainer: {
    height: 280,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  navRow: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  navRightActions: { flexDirection: 'row', gap: 10 },

  heroIdentity: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroStatusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.success100,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroPillDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.success500 },
  heroStatusText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.success700, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroDoctorName: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28, letterSpacing: -0.5,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  heroSpecialty: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.gray600 },
  heroDistance: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.gray600 },
  heroMetaDot: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.gray400 },
  heroRating: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.textPrimary },
  heroRatingCount: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.gray500 },

  // ── BODY ──
  body: { paddingHorizontal: 20, paddingTop: 20, gap: 24 },

  // ── LIVE STRIP ──
  liveStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfacePrimary,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1, borderColor: Colors.success500 + '30',
    borderLeftWidth: 3, borderLeftColor: Colors.success500,
  },
  liveStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.success500 },
  liveStripTitle: {
    fontFamily: 'Inter_800ExtraBold', fontSize: 11, color: Colors.success700,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  liveStripSub: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.gray600 },
  liveStripBold: { fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  liveStripRight: {},
  liveStripMeta: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.gray500 },

  // ── DECISION HERO ──
  decisionHero: {
    backgroundColor: Colors.surfacePrimary,
    borderRadius: 24,
    paddingVertical: 28, paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1, borderColor: Colors.gray200,
    ...Colors.shadows.sm,
  },
  decisionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.gray500,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
  },
  decisionPosition: {
    fontFamily: 'Inter_800ExtraBold', fontSize: 80, color: Colors.textPrimary,
    letterSpacing: -3, lineHeight: 88,
  },
  decisionTimePair: {
    flexDirection: 'row', alignItems: 'center', gap: 36, marginTop: 12,
  },
  decisionTimeItem: { alignItems: 'center' },
  decisionTimeValue: {
    fontFamily: 'Inter_800ExtraBold', fontSize: 20, color: Colors.textPrimary,
  },
  decisionTimeLabel: {
    fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.gray500, marginTop: 3,
  },
  decisionTimeSep: { width: 1, height: 32, backgroundColor: Colors.gray200 },
  decisionPriceLine: {
    fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.gray500, marginTop: 14,
  },

  // ── EMERGENCY ──
  emergencyLine: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 2,
  },
  emergencyLineText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.error500,
  },

  // ── SECTION DIVIDER ──
  sectionDivider: { height: 1, backgroundColor: Colors.gray200, marginVertical: 4 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.textPrimary, marginBottom: 12 },

  // ── COMPACT CARD (shared) ──
  compactCard: {
    backgroundColor: Colors.surfacePrimary, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden',
  },
  compactRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  compactLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.gray600 },
  compactValue: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.textPrimary },
  compactSep: { height: 1, backgroundColor: Colors.gray100, marginHorizontal: 16 },

  // ── PRICING ──
  pricingToggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  payNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.success100,
    marginTop: 4,
  },
  payNoteText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.success700 },

  // ── TIMELINE ──
  timelineStrip: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Colors.surfacePrimary,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  timelineItem: { alignItems: 'center', gap: 4 },
  timelineValue: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.textPrimary },
  timelineLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.gray500 },

  // ── TRUST BADGES ──
  trustBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  trustBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.success100,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  trustBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.success700 },

  // ── REVIEWS ──
  reviewCard: {
    backgroundColor: Colors.surfacePrimary, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.gray200, gap: 8,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primary100, alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.primary600 },
  reviewName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.textPrimary },
  reviewText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.gray600, lineHeight: 20 },

  // ── LOCATION ──
  addressText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.gray600, marginBottom: 12, lineHeight: 20 },
  mapRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mapText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.primary500 },

  // ── STICKY BOTTOM BAR (always visible) ──
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surfacePrimary,
    paddingHorizontal: 20, paddingTop: 16,
    gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.gray200,
    ...Colors.shadows.md,
  },
  bottomBarBtn: {
    backgroundColor: Colors.primary500, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 16,
  },
  bottomBarBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' },
  bottomBarMicro: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.gray500, textAlign: 'center' },
});
