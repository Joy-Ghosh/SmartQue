import React, { useState, useMemo, useEffect } from 'react';
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
import Animated, { FadeInDown, FadeInUp, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { clinics, getClinicDoctor, transportModes } from '@/lib/data';
import { useQueue } from '@/lib/queue-context';
import SmartBookingSheet from '@/components/booking/SmartBookingSheet';
import SuccessOverlay from '@/components/booking/SuccessOverlay';
import { GlassView } from '@/components/ui/GlassView';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { QueueVisualizer } from '@/components/ui/QueueVisualizer';

const { width } = Dimensions.get('window');

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
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'location'>('about');

  // Mock Data
  const currentToken = 12;
  const yourToken = clinic ? clinic.currentQueueLength + 11 : 23;
  const estimatedWaitMins = clinic ? clinic.currentQueueLength * clinic.avgWaitTimePerPatient : 0;

  // Pulse Animation
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withRepeat(withTiming(1.05, { duration: 1500 }), -1, true);
  }, []);

  if (!clinic || !doctor) return <View style={styles.container}><Text>Clinic not found</Text></View>;

  const getStatus = (mins: number) => {
    if (mins < 15) return 'success';
    if (mins < 60) return 'live';
    return 'alert';
  };

  const handleOpenBookingSheet = () => {
    if (activeBooking) {
      Alert.alert('Active Queue', 'You already have an active queue. Please cancel it first.');
      return;
    }
    setIsBookingSheetOpen(true);
  };

  const handleConfirmBooking = (data: { patient: any; travelMode: any }) => {
    const tokenNumber = yourToken;
    setActiveBooking({
      clinicId: clinic.id,
      clinicName: clinic.name,
      doctorName: doctor.name,
      tokenNumber,
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

      {/* Background Image Header */}
      <View style={styles.headerBgContainer}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60' }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(255,255,255,0)', Colors.background]}
            locations={[0, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
      </View>

      {/* Nav Header */}
      <View style={[styles.navHeader, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} onPress={() => setIsWishlisted(!isWishlisted)}>
            <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={24} color={isWishlisted ? Colors.medicalRed : "#fff"} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 200 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <GlassView style={styles.mainCard} intensity={80} gradientColors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}>
          {/* 1. TRUST HEADER */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <View style={styles.trustBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={Colors.primary} />
                  <Text style={styles.trustBadgeText}>High Trust Clinic</Text>
                </View>
                <View style={[styles.trustBadge, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="time" size={12} color={Colors.success} />
                  <Text style={[styles.trustBadgeText, { color: Colors.success }]}>98% On Time</Text>
                </View>
              </View>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.specialty}>{doctor.specialty} • {doctor.experience} yrs exp</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={Colors.smartAmber} />
                <Text style={styles.ratingText}>{doctor.rating} (500+ patients)</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 2. DECISION BLOCK: YOUR VISIT TIMING */}
          <View style={styles.decisionBlock}>
            <View style={styles.decisionHeader}>
              <Text style={styles.decisionTitle}>Your Visit Timing</Text>
              <View style={styles.liveTag}>
                <View style={[styles.liveDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.liveText}>Moving Fast</Text>
              </View>
            </View>

            {/* Enhanced Timing Card */}
            <View style={styles.timingCard}>
              <View style={styles.timingRow}>
                {/* Now Serving */}
                <View style={styles.servingColumn}>
                  <Text style={styles.timingLabel}>Now Serving</Text>
                  <Text style={styles.timingValueAction}>{currentToken}</Text>
                  <Text style={styles.timingSubLabel}>On Time</Text>
                </View>

                {/* Visual Connector */}
                <View style={styles.connectorColumn}>
                  <View style={styles.connectorLine} />
                  <View style={styles.connectorDot} />
                </View>

                {/* Users Token */}
                <LinearGradient
                  colors={['#1E2A5E', '#2D3F84']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tokenColumn}
                >
                  <View style={styles.yourTokenBadge}>
                    <Text style={styles.yourTokenLabel}>YOU</Text>
                  </View>
                  <Text style={styles.timingValueMain}>{yourToken}</Text>
                  <Text style={styles.timingSubInverse}>~{estimatedWaitMins} min wait</Text>
                </LinearGradient>
              </View>

              {/* Leave By Alert */}
              <View style={styles.leaveByContainer}>
                <LinearGradient
                  colors={['rgba(30, 42, 94, 0.03)', 'rgba(30, 42, 94, 0.08)']}
                  style={styles.leaveByGradient}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name="walk" size={18} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.leaveByTitle}>Leave by 10:45 AM</Text>
                    <Text style={styles.leaveBySub}>To reach comfortably on time.</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Visualizer simplified */}
            <View style={{ marginTop: 12, opacity: 0.9 }}>
              <QueueVisualizer
                total={yourToken + 5}
                serving={currentToken}
                userToken={yourToken}
                estimatedWait={estimatedWaitMins}
                minimal={true}
              />
            </View>
          </View>
        </GlassView>

        {/* 3. VISUAL SUMMARY CARDS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="cash-outline" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.statValue}>₹500</Text>
              <Text style={styles.statLabel}>Fees</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="location-outline" size={18} color={Colors.success} />
            </View>
            <View>
              <Text style={styles.statValue}>{clinic.distance}</Text>
              <Text style={styles.statLabel}>Kilometers</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="star-outline" size={18} color={Colors.smartAmber} />
            </View>
            <View>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* 4. BOOKING EXPLANATION */}
        <View style={styles.explanationBox}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.explanationText}>
            Book now to secure Token #{yourToken}. We'll notify you exactly when to leave so you don't wait at the clinic.
          </Text>
        </View>

        {/* 5. SECONDARY INFO TABS (Reordered) */}
        <View style={styles.infoSection}>
          <View style={styles.tabRow}>
            {['About', 'Reviews', 'Location'].map(tab => (
              <Pressable
                key={tab}
                style={[styles.tabBtn, activeTab === tab.toLowerCase() && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab.toLowerCase() as any)}
              >
                <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.activeTabText]}>{tab}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'about' && (
              <Text style={styles.bodyText}>
                {doctor.name} is a leading {doctor.specialty} with over {doctor.experience} years of experience.
                The clinic is equipped with modern facilities for comprehensive care.
              </Text>
            )}
            {activeTab === 'reviews' && (
              <View style={{ gap: 12 }}>
                <Text style={styles.bodyText}>"Excellent service and accurate wait times!" - Amit S.</Text>
                <Text style={styles.bodyText}>"Very clean facility." - Priya K.</Text>
              </View>
            )}
            {activeTab === 'location' && (
              <View style={styles.mapPreview}>
                <Ionicons name="map" size={40} color={Colors.textMuted} />
                <Text style={styles.bodyText}>Map View Placeholder</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <GlassView style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]} intensity={95} gradientColors={['rgba(255,255,255,0.95)', '#fff']}>
        <View style={styles.bottomBarContent}>
          {/* Emergency Text Link */}
          <Pressable
            style={styles.emergencyLink}
            onPress={() => {
              if (activeBooking) {
                Alert.alert('Active Queue', 'You already have an active queue. Please cancel it first.');
                return;
              }
              setIsEmergency(true);
              setIsBookingSheetOpen(true);
            }}
          >
            <Text style={styles.emergencyLinkText}>Having an emergency? <Text style={{ textDecorationLine: 'underline', fontFamily: 'Inter_600SemiBold' }}>Request Priority</Text></Text>
          </Pressable>

          {/* Main Booking Button */}
          <GradientButton
            title="Book Your Visit"
            onPress={handleOpenBookingSheet}
            style={{ width: '100%' }}
            textStyle={{ fontSize: 16, fontFamily: 'Inter_700Bold' }}
            icon="ticket-outline"
          />
        </View>
      </GlassView>

      <SmartBookingSheet
        isOpen={isBookingSheetOpen}
        onClose={() => {
          setIsBookingSheetOpen(false);
          setIsEmergency(false);
        }}
        onConfirm={handleConfirmBooking}
        consultationFee={isEmergency ? 700 : 500}
        isEmergency={isEmergency}
      />

      <SuccessOverlay
        visible={showSuccessOverlay}
        tokenNumber={yourToken}
        doctorName={doctor.name}
        clinicName={clinic.name}
        estimatedTime="5:15 PM"
        onClose={() => {
          setShowSuccessOverlay(false);
          router.replace('/active-token');
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  headerBgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    ...Colors.shadows.lg,
    marginBottom: 20,
  },

  // TRUST HEADER
  titleRow: {
    marginBottom: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trustBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary,
  },
  clinicName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  doctorName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: 2,
    marginTop: 4,
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 20,
  },

  // DECISION BLOCK V2
  decisionBlock: {
    gap: 16,
    marginBottom: 8,
  },
  decisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  decisionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.success,
  },

  // Timing Card
  timingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    overflow: 'hidden',
    ...Colors.shadows.sm,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 120,
  },
  servingColumn: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  timingLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
    marginBottom: 6,
  },
  timingSubLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.success,
    marginTop: 4,
  },
  timingValueAction: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    letterSpacing: -1,
  },

  // Connector
  connectorColumn: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  connectorDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },

  // Token Column
  tokenColumn: {
    flex: 1.2,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
  },
  yourTokenBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  yourTokenLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  timingValueMain: {
    fontSize: 42,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    letterSpacing: -1,
    lineHeight: 48,
    marginBottom: 2,
  },
  timingSubInverse: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.8)',
  },

  // Leave By
  leaveByContainer: {
    padding: 8,
  },
  leaveByGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Platform.OS === 'ios' ? '#fff' : 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadows.sm,
  },
  leaveByTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  leaveBySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },

  // STATS ROW V2
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Colors.shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
  },

  // EXPLANATION
  explanationBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    // backgroundColor: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // INFO & TABS
  infoSection: {
    marginTop: 0,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabBtn: {
    paddingVertical: 10,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabBtn: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.primary,
  },
  tabContent: {
    minHeight: 100,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  mapPreview: {
    height: 150,
    backgroundColor: Colors.borderLight,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // BOTTOM ACTION BAR
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  bottomBarContent: {
    gap: 12,
    alignItems: 'center',
  },
  emergencyLink: {
    paddingVertical: 4,
  },
  emergencyLinkText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.medicalRed,
  },
});
