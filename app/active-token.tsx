import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
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
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useQueue } from '@/lib/queue-context';

type QueueState = 'relax' | 'alert' | 'arrived';

export default function ActiveTokenScreen() {
  const insets = useSafeAreaInsets();
  const { activeBooking, updateServingToken, snoozeBooking, cancelBooking } = useQueue();
  const [isOnMyWay, setIsOnMyWay] = useState(false);

  const progressWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const calculations = useMemo(() => {
    if (!activeBooking) return null;
    const peopleBefore = activeBooking.tokenNumber - activeBooking.servingToken;
    const totalWait = peopleBefore * activeBooking.avgWaitTime;
    const timeToLeave = totalWait - activeBooking.travelTime - 10;
    const progress = peopleBefore <= 0 ? 1 : Math.min(1, 1 - peopleBefore / (activeBooking.tokenNumber));

    let state: QueueState = 'relax';
    if (timeToLeave <= 0) state = 'arrived';
    else if (timeToLeave <= 15) state = 'alert';

    return { peopleBefore, totalWait, timeToLeave, progress, state };
  }, [activeBooking]);

  useEffect(() => {
    if (calculations) {
      progressWidth.value = withTiming(calculations.progress, { duration: 800, easing: Easing.out(Easing.cubic) });
    }
  }, [calculations?.progress]);

  useEffect(() => {
    if (calculations?.state === 'alert') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [calculations?.state]);

  useEffect(() => {
    if (!activeBooking) return;

    const interval = setInterval(() => {
      updateServingToken(activeBooking.servingToken + 1);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBooking?.servingToken]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  const cardPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Queue',
      'Are you sure you want to leave the queue?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Leave Queue',
          style: 'destructive',
          onPress: () => {
            cancelBooking();
            router.back();
          },
        },
      ],
    );
  }, [cancelBooking]);

  const handleSnooze = useCallback(() => {
    snoozeBooking();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [snoozeBooking]);

  if (!activeBooking || !calculations) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top + webTopInset }]}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="ticket-outline" size={48} color={Colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No Active Queue</Text>
        <Text style={styles.emptySub}>Join a clinic queue to see your token status</Text>
        <Pressable style={styles.emptyBtn} onPress={() => router.back()}>
          <Text style={styles.emptyBtnText}>Find Clinics</Text>
        </Pressable>
      </View>
    );
  }

  const stateColors = {
    relax: { bg: Colors.infoBg, accent: Colors.info, text: '#1E40AF' },
    alert: { bg: Colors.alertBg, accent: Colors.alert, text: '#9A3412' },
    arrived: { bg: Colors.successBg, accent: Colors.success, text: '#065F46' },
  };

  const currentState = stateColors[calculations.state];
  const stateMessages = {
    relax: { title: 'Relax at home', sub: 'You have plenty of time before your turn' },
    alert: { title: 'Leave Now!', sub: `Start ${activeBooking.transportMode === 'car' ? 'driving' : activeBooking.transportMode === 'bike' ? 'riding' : 'walking'} to reach on time` },
    arrived: { title: 'Almost There!', sub: 'Your turn is coming up very soon' },
  };

  const msg = stateMessages[calculations.state];

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Queue Status</Text>
        <View style={styles.backBtn}>
          <Ionicons name="notifications-outline" size={22} color={Colors.text} />
        </View>
      </View>

      <View style={[styles.statusBanner, { backgroundColor: currentState.bg }]}>
        <Animated.View style={cardPulseStyle}>
          <View style={styles.statusBannerContent}>
            <Ionicons
              name={
                calculations.state === 'relax' ? 'cafe' :
                calculations.state === 'alert' ? 'warning' : 'checkmark-circle'
              }
              size={20}
              color={currentState.accent}
            />
            <View>
              <Text style={[styles.statusBannerTitle, { color: currentState.text }]}>{msg.title}</Text>
              <Text style={[styles.statusBannerSub, { color: currentState.accent }]}>{msg.sub}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tokenCard}>
          <View style={styles.tokenCardInner}>
            <Text style={styles.tokenLabel}>Your Token</Text>
            <Text style={styles.tokenNumber}>#{activeBooking.tokenNumber}</Text>
            <View style={styles.tokenDivider} />
            <Text style={styles.servingLabel}>Currently Serving</Text>
            <Text style={styles.servingNumber}>#{activeBooking.servingToken}</Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Queue Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(calculations.progress * 100)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, { backgroundColor: currentState.accent }, progressBarStyle]} />
            </View>
            <Text style={styles.progressSub}>
              {calculations.peopleBefore > 0
                ? `${calculations.peopleBefore} people ahead of you`
                : "It's your turn!"
              }
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoValue}>~{Math.max(0, calculations.totalWait)} min</Text>
            <Text style={styles.infoLabel}>Total Wait</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name={
              activeBooking.transportMode === 'car' ? 'car-sport' :
              activeBooking.transportMode === 'bike' ? 'bicycle' : 'walk'
            } size={20} color={Colors.primary} />
            <Text style={styles.infoValue}>{activeBooking.travelTime} min</Text>
            <Text style={styles.infoLabel}>Travel Time</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="hourglass-outline" size={20} color={
              calculations.timeToLeave <= 0 ? Colors.danger :
              calculations.timeToLeave <= 15 ? Colors.alert : Colors.info
            } />
            <Text style={[styles.infoValue, {
              color: calculations.timeToLeave <= 0 ? Colors.danger :
              calculations.timeToLeave <= 15 ? Colors.alert : Colors.text
            }]}>
              {calculations.timeToLeave <= 0 ? 'Now!' : `${calculations.timeToLeave} min`}
            </Text>
            <Text style={styles.infoLabel}>Leave In</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.clinicInfoRow}>
          <Ionicons name="medical" size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.clinicInfoName}>{activeBooking.clinicName}</Text>
            <Text style={styles.clinicInfoDoc}>{activeBooking.doctorName}</Text>
          </View>
          {activeBooking.isEmergency && (
            <View style={styles.emergencyBadge}>
              <Ionicons name="alert-circle" size={14} color="#fff" />
              <Text style={styles.emergencyBadgeText}>Priority</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.actionsRow}>
          {!isOnMyWay ? (
            <Pressable
              style={[styles.actionBtn, styles.primaryBtn]}
              onPress={() => {
                setIsOnMyWay(true);
                if (Platform.OS !== 'web') {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
            >
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>I'm on my way</Text>
            </Pressable>
          ) : (
            <View style={[styles.actionBtn, styles.onWayBtn]}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.onWayBtnText}>On the way</Text>
            </View>
          )}
          <Pressable
            style={[styles.actionBtn, styles.secondaryBtn]}
            onPress={handleSnooze}
          >
            <Ionicons name="time" size={18} color={Colors.primary} />
            <Text style={styles.secondaryBtnText}>Snooze (+2)</Text>
          </Pressable>
        </Animated.View>

        <Pressable style={styles.cancelBtn} onPress={handleCancel}>
          <Ionicons name="close-circle-outline" size={18} color={Colors.danger} />
          <Text style={styles.cancelBtnText}>Cancel Queue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  emptyBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  statusBanner: {
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statusBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBannerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  statusBannerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tokenCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  tokenCardInner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  tokenNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 56,
    color: Colors.primary,
    lineHeight: 64,
  },
  tokenDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginVertical: 12,
    borderRadius: 1,
  },
  servingLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  servingNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  progressSection: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressPercent: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  infoValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  clinicInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  clinicInfoName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  clinicInfoDoc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  emergencyBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
  },
  primaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  onWayBtn: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  onWayBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.success,
  },
  secondaryBtn: {
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  secondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.dangerBg,
  },
  cancelBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.danger,
  },
});
