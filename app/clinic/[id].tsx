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
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'map'>('about');

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
        <GlassView style={styles.mainCard} intensity={80} gradientColors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.95)']}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.specialty}>{doctor.specialty} • {doctor.experience} yrs exp</Text>
            </View>
            <StatusBadge status={getStatus(estimatedWaitMins) as any} />
          </View>

          <View style={styles.divider} />

          {/* Queue Live Status */}
          <View style={styles.queueContainer}>
            <Text style={styles.sectionTitle}>Live Queue</Text>
            <QueueVisualizer
              total={yourToken + 5}
              serving={currentToken}
              userToken={yourToken}
              estimatedWait={estimatedWaitMins}
            />
          </View>
        </GlassView>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <GlassView style={styles.statCard} intensity={40} gradientColors={['#fff', '#F8FAFC']}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{estimatedWaitMins}m</Text>
            <Text style={styles.statLabel}>Avg Wait</Text>
          </GlassView>
          <GlassView style={styles.statCard} intensity={40} gradientColors={['#fff', '#F8FAFC']}>
            <Ionicons name="star" size={24} color={Colors.smartAmber} />
            <Text style={styles.statValue}>{doctor.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </GlassView>
          <GlassView style={styles.statCard} intensity={40} gradientColors={['#fff', '#F8FAFC']}>
            <Ionicons name="location-outline" size={24} color={Colors.secondary} />
            <Text style={styles.statValue}>{clinic.distance}</Text>
            <Text style={styles.statLabel}>Nearby</Text>
          </GlassView>
        </View>

        {/* Tabs / Info */}
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

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <GlassView style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]} intensity={95} gradientColors={['rgba(255,255,255,0.9)', '#fff']}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.priceLabel}>Consultation</Text>
            <Text style={styles.priceValue}>₹500</Text>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable
              style={styles.emergencyBtn}
              onPress={() => {
                if (activeBooking) {
                  Alert.alert('Active Queue', 'You already have an active queue. Please cancel it first.');
                  return;
                }
                setIsEmergency(true);
                setIsBookingSheetOpen(true);
              }}
            >
              <Ionicons name="warning" size={18} color={Colors.danger} />
            </Pressable>
            <GradientButton
              title="Book Token"
              onPress={handleOpenBookingSheet}
              style={{ flex: 1 }}
              icon="ticket-outline"
            />
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clinicName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },
  queueContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Colors.shadows.sm,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
  },
  priceValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginLeft: 20,
  },
  emergencyBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.medicalRed + '20',
  },
});
