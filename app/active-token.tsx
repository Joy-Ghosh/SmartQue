import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useQueue } from '@/lib/queue-context';
import { GlassView } from '@/components/ui/GlassView';
import { GradientButton } from '@/components/ui/GradientButton';

type QueueState = 'relax' | 'alert' | 'arrived' | 'emergency';
const { width } = Dimensions.get('window');

export default function ActiveTokenScreen() {
  const insets = useSafeAreaInsets();
  const { activeBooking, updateServingToken, snoozeBooking, cancelBooking } = useQueue();
  const [isOnMyWay, setIsOnMyWay] = useState(false);

  const progressWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const calculations = useMemo(() => {
    if (!activeBooking) return null;
    const peopleBefore = activeBooking.tokenNumber - activeBooking.servingToken;
    const totalWait = peopleBefore * activeBooking.avgWaitTime;
    const timeToLeave = totalWait - activeBooking.travelTime - 10;
    const progress = peopleBefore <= 0 ? 1 : Math.min(1, 1 - peopleBefore / (activeBooking.tokenNumber));

    let state: QueueState = 'relax';
    if (activeBooking.isEmergency) state = 'emergency';
    else if (timeToLeave <= 0) state = 'arrived';
    else if (timeToLeave <= 15) state = 'alert';

    return { peopleBefore, totalWait, timeToLeave, progress, state };
  }, [activeBooking]);

  useEffect(() => {
    if (calculations) {
      progressWidth.value = withTiming(calculations.progress, { duration: 800, easing: Easing.out(Easing.cubic) });
    }
  }, [calculations?.progress]);

  useEffect(() => {
    if (calculations?.state === 'alert' || calculations?.state === 'emergency') {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.05, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        true,
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [calculations?.state]);

  // Simulate Queue Movement
  useEffect(() => {
    if (!activeBooking) return;
    const interval = setInterval(() => {
      updateServingToken(activeBooking.servingToken + 1);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBooking?.servingToken]);

  const progressBarStyle = useAnimatedStyle(() => ({ width: `${progressWidth.value * 100}%` as any }));
  const cardPulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  const handleCancel = useCallback(() => {
    Alert.alert('Cancel Queue', 'Are you sure you want to leave the queue?', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Leave Queue', style: 'destructive', onPress: () => { cancelBooking(); router.back(); } },
    ]);
  }, [cancelBooking]);

  const handleSnooze = useCallback(() => {
    snoozeBooking();
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [snoozeBooking]);

  if (!activeBooking || !calculations) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.emptyState}>
          <Ionicons name="ticket-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Active Queue</Text>
          <Text style={styles.emptySub}>Join a clinic queue to see your token status.</Text>
          <GradientButton title="Find Clinics" onPress={() => router.back()} style={{ marginTop: 20 }} />
        </View>
      </View>
    )
  }

  const stateColors = {
    relax: { bg: ['#E0F2FE', '#F8FAFC'], accent: Colors.primary, text: Colors.primary },
    alert: { bg: ['#FFF7ED', '#FFF'], accent: Colors.smartAmber, text: '#9A3412' },
    arrived: { bg: ['#ECFDF5', '#FFF'], accent: Colors.confidenceGreen, text: '#065F46' },
    emergency: { bg: ['#FEF2F2', '#FFF'], accent: Colors.medicalRed, text: Colors.medicalRed },
  };

  const currentState = stateColors[calculations.state];
  const stateMessages = {
    relax: { title: 'Relax at home', sub: 'You have wait time available.' },
    alert: { title: 'Leave Now!', sub: `Start moving to reach on time.` },
    arrived: { title: 'Almost There!', sub: 'Your turn is coming up very soon.' },
    emergency: { title: 'Emergency Priority', sub: 'Priority queue active. Proceed immediately.' },
  };
  const msg = stateMessages[calculations.state];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={currentState.bg} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Live Queue</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="share-outline" size={24} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Status Banner */}
        <GlassView style={styles.statusBanner} intensity={60} gradientColors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)']}>
          <View style={[styles.statusIcon, { backgroundColor: currentState.accent }]}>
            <Ionicons name={calculations.state === 'alert' ? "alert-outline" : "hourglass-outline"} size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: currentState.text }]}>{msg.title}</Text>
            <Text style={styles.statusSub}>{msg.sub}</Text>
          </View>
        </GlassView>

        {/* Main Token Circle */}
        <Animated.View style={[styles.tokenSection, cardPulseStyle]}>
          <View style={[styles.pulseRing, { borderColor: currentState.accent }]} />
          <View style={[styles.pulseRing, { borderColor: currentState.accent, opacity: 0.1, transform: [{ scale: 1.2 }] }]} />

          <View style={styles.tokenCircle}>
            <LinearGradient colors={['#fff', '#F1F5F9']} style={StyleSheet.absoluteFill} />
            <Text style={styles.tokenLabel}>YOUR TOKEN</Text>
            <Text style={[styles.tokenValue, { color: currentState.accent }]}>{activeBooking.tokenNumber}</Text>
            <View style={[styles.servingBadge, { backgroundColor: currentState.accent }]}>
              <Text style={styles.servingText}>Serving #{activeBooking.servingToken}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressVal}>{Math.round(calculations.progress * 100)}%</Text>
          </View>
          <View style={styles.track}>
            <Animated.View style={[styles.bar, { backgroundColor: currentState.accent }, progressBarStyle]} />
          </View>
          <Text style={styles.aheadText}>
            <Text style={{ fontFamily: 'Inter_700Bold' }}>{calculations.peopleBefore}</Text> people ahead of you
          </Text>
        </View>

        {/* Metrics */}
        <GlassView style={styles.metricsGrid} intensity={40} border>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{Math.max(0, calculations.totalWait)}<Text style={styles.metricUnit}>m</Text></Text>
            <Text style={styles.metricLabel}>Est. Wait</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricVal, { color: calculations.timeToLeave <= 0 ? Colors.danger : Colors.text }]}>
              {calculations.timeToLeave <= 0 ? 'Now' : calculations.timeToLeave}<Text style={styles.metricUnit}>{calculations.timeToLeave <= 0 ? '' : 'm'}</Text>
            </Text>
            <Text style={styles.metricLabel}>Leave In</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{activeBooking.travelTime}<Text style={styles.metricUnit}>m</Text></Text>
            <Text style={styles.metricLabel}>Travel</Text>
          </View>
        </GlassView>

        {/* Clinic Info */}
        <GlassView style={styles.clinicCard} intensity={50} border>
          <View style={styles.clinicIcon}>
            <Ionicons name="medical" size={24} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.clinicName}>{activeBooking.clinicName}</Text>
            <Text style={styles.doctorName}>{activeBooking.doctorName}</Text>
          </View>
        </GlassView>

        {/* Actions */}
        <View style={styles.actions}>
          {!isOnMyWay ? (
            <GradientButton
              title="I'm on my way"
              icon="navigate"
              onPress={() => setIsOnMyWay(true)}
              variant="primary"
            />
          ) : (
            <GradientButton
              title="On the way"
              icon="checkmark-circle"
              onPress={() => { }}
              variant="secondary"
              disabled
            />
          )}

          <View style={styles.secondaryActions}>
            <GradientButton
              title="Snooze"
              icon="time-outline"
              onPress={handleSnooze}
              variant="outline"
              style={{ flex: 1 }}
            />
            <GradientButton
              title="Cancel"
              icon="close-circle-outline"
              onPress={handleCancel}
              variant="danger" // Will map to a red gradient if I add it, or default
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    marginBottom: 32,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  statusSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  tokenSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 250,
  },
  tokenCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    ...Colors.shadows.lg,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    opacity: 0.3,
  },
  tokenLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMuted,
    marginBottom: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tokenValue: {
    fontSize: 64,
    fontFamily: 'Inter_700Bold',
    lineHeight: 70,
  },
  servingBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  servingText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  progressVal: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  track: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  aheadText: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderLight,
  },
  clinicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    marginBottom: 32,
  },
  clinicIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  doctorName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  actions: {
    gap: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
});
