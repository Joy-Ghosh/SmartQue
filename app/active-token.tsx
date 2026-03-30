import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/styles';
import { Motion } from '@/constants/motion';
import { useQueue } from '@/lib/queue-context';
import { GradientButton } from '@/components/ui/GradientButton';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CountUp } from '@/components/CountUp';

type QueueState = 'relax' | 'alert' | 'arrived' | 'emergency';
const { width, height } = Dimensions.get('window');

// Queue bubble visualization
function QueueVisualization({ total, current, yours }: { total: number; current: number; yours: number }) {
  const dots = [];
  const maxDots = Math.min(10, yours - current + 2);
  for (let i = 0; i < maxDots; i++) {
     if (i === 0) {
       dots.push(<View key={i} style={[styles.qDot, styles.qDotServing]} />);
     } else if (i === maxDots - 1) {
       dots.push(<View key={i} style={[styles.qDot, styles.qDotYou]} />);
     } else {
       dots.push(<View key={i} style={[styles.qDot, styles.qDotAhead]} />);
     }
  }

  return (
    <View style={styles.qVizContainer}>
       <View style={styles.qVizRow}>
           {dots}
       </View>
       <View style={styles.qVizLabels}>
           <Text style={styles.qVizLabel}>Serving</Text>
           <Text style={styles.qVizLabel}>You</Text>
       </View>
    </View>
  );
}

export default function ActiveTokenScreen() {
  const insets = useSafeAreaInsets();
  const { activeBooking, updateServingToken, cancelBooking } = useQueue();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const dotOpacity = useSharedValue(1);

  const calculations = useMemo(() => {
    if (!activeBooking) return null;
    const peopleBefore = activeBooking.tokenNumber - activeBooking.servingToken;
    const totalWait = peopleBefore * activeBooking.avgWaitTime;
    const timeToLeave = totalWait - activeBooking.travelTime - 5;

    let state: QueueState = 'relax';
    if (activeBooking.isEmergency) state = 'emergency';
    else if (timeToLeave <= 0) state = 'arrived';
    else if (timeToLeave <= 15) state = 'alert';

    return { peopleBefore, totalWait, timeToLeave, state };
  }, [activeBooking]);

  useEffect(() => {
    dotOpacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    if (!activeBooking) return;
    const interval = setInterval(() => {
      updateServingToken(activeBooking.servingToken + 1);
    }, 15000); 
    return () => clearInterval(interval);
  }, [activeBooking?.servingToken, updateServingToken]);

  const liveDotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));

  const handleCancel = useCallback(() => {
    setShowCancelModal(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const confirmCancel = () => {
    cancelBooking();
    setShowCancelModal(false);
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const isEmergency = activeBooking?.isEmergency ?? false;
  const isAlert = (calculations?.state === 'alert' || calculations?.state === 'arrived' || isEmergency) ?? false;
  const isUrgent = (calculations?.peopleBefore !== undefined && calculations.peopleBefore < 2) ?? false;

  const shakeOffset = useSharedValue(0);
  useEffect(() => {
    if (isUrgent) {
      shakeOffset.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [isUrgent]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }]
  }));

  if (!activeBooking || !calculations) {
    return (
      <View style={[styles.container, {justifyContent:'center', alignItems: 'center'}]}>
          <Text style={{fontFamily: 'Inter_700Bold'}}>No Active Queue</Text>
          <GradientButton title="Go Back" onPress={() => router.replace('/')} style={{marginTop: 20}}/>
      </View>
    );
  }
  
  return (
    <Animated.View style={[styles.container, { backgroundColor: isEmergency ? Colors.error100 : (isUrgent ? Colors.warning100 : Colors.surfaceSecondary) }, shakeStyle]}>
      <StatusBar barStyle="dark-content" />

      {/* Header Actions */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <AnimatedButton onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </AnimatedButton>
        <AnimatedButton style={styles.iconBtn} onPress={handleCancel}>
           <Ionicons name="trash-outline" size={20} color={isEmergency ? Colors.error500 : Colors.textSecondary} />
        </AnimatedButton>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* LIVE STATUS */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger)} style={styles.liveStatusContainer}>
             <View style={[styles.liveBadge, { borderColor: isAlert ? Colors.error100 : Colors.success100 }]}>
                  <Animated.View style={[styles.liveDot, { backgroundColor: isAlert ? Colors.error500 : Colors.success500 }, liveDotStyle]} />
                  <Text style={[styles.liveText, { color: isAlert ? Colors.error500 : Colors.success500 }]}>Live Queue</Text>
             </View>
             <Animated.View key={activeBooking.servingToken} entering={FadeInDown.duration(400)}>
                <Text style={styles.servingText}>Serving #{activeBooking.servingToken}</Text>
             </Animated.View>
             <Text style={styles.updateText}>Updating in real time</Text>
        </Animated.View>

        {/* YOUR POSITION */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * 2)} style={styles.heroContainer}>
             <Text style={styles.heroLabel}>{isEmergency ? "Priority Status" : "Your position"}</Text>
             <Text style={[styles.heroValue, isEmergency && { color: Colors.error500, fontSize: 60 }]}>
                 {isEmergency ? "PRIORITY" : `#${activeBooking.tokenNumber}`}
             </Text>
             <View style={[styles.aheadBadge, isEmergency && { borderColor: Colors.error500 }]}>
                 {isEmergency ? (
                    <Text style={[styles.aheadText, { color: Colors.error500 }]}>Moved ahead in queue</Text>
                 ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <CountUp value={calculations.peopleBefore} duration={500} style={styles.aheadText} />
                        <Text style={styles.aheadText}> people ahead</Text>
                    </View>
                 )}
             </View>
        </Animated.View>

        {/* QUEUE VISUALIZATION */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * 3)}>
             <QueueVisualization 
                 total={activeBooking.tokenNumber} 
                 current={activeBooking.servingToken} 
                 yours={activeBooking.tokenNumber} 
             />
        </Animated.View>

        {/* TIME INTELLIGENCE */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * 4)} style={styles.timeCard}>
            <View style={styles.timeRow}>
                <Ionicons name="time" size={20} color={Colors.textPrimary} />
                <Text style={styles.timeEst}>Estimated wait: {Math.max(0, calculations.totalWait - 2)}–{Math.max(0, calculations.totalWait + 2)} mins</Text>
            </View>
            <View style={styles.accuracyRow}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.success500} />
                <Text style={styles.accuracyText}>Accuracy: High (±1 mins)</Text>
            </View>
        </Animated.View>

        {/* ACTION CUE */}
        <Animated.View entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * 5)}>
            <View style={[styles.actionCueCard, { backgroundColor: isEmergency ? Colors.error500 : (isAlert ? Colors.warning500 : Colors.primary500) }]}>
                {isEmergency || calculations.timeToLeave <= 0 ? (
                    <>
                       <Ionicons name="warning" size={24} color="#fff" />
                       <View style={{flex: 1, marginLeft: 12}}>
                           <Text style={styles.actionCueTitle}>{isEmergency ? "Proceed Directly" : "Leave Now"}</Text>
                           <Text style={styles.actionCueSub}>
                               The clinic is expecting you. Please head to the triage desk.
                           </Text>
                       </View>
                    </>
                ) : (
                    <>
                       <Ionicons name="car-sport" size={24} color="#fff" />
                       <View style={{flex: 1, marginLeft: 12, flexDirection: 'row', alignItems: 'center'}}>
                           <Text style={styles.actionCueTitle}>Leave in {calculations.timeToLeave} mins</Text>
                       </View>
                    </>
                )}
            </View>
        </Animated.View>

        {/* REAL-TIME EVENTS */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.eventsCard}>
             <Text style={styles.eventsTitle}>Queue Activity</Text>
             <View style={styles.eventsList}>
                 <View style={styles.eventRow}>
                     <View style={[styles.eventDot, {backgroundColor: Colors.success500}]} />
                     <Text style={styles.eventText}>Patient #12 just checked in</Text>
                 </View>
                 <View style={styles.eventRow}>
                     <View style={[styles.eventDot, {backgroundColor: Colors.primary500}]} />
                     <Text style={styles.eventText}>Serving speed improved</Text>
                 </View>
             </View>
        </Animated.View>

        {/* EMERGENCY ESCAPE */}
        {!activeBooking.isEmergency && (
             <Animated.View entering={FadeInDown.duration(400).delay(350)}>
                 <Pressable style={styles.emergencyBtn}>
                     <Ionicons name="medical" size={16} color={Colors.error500} />
                     <Text style={styles.emergencyBtnText}>Need urgent care? Switch to Priority</Text>
                 </Pressable>
             </Animated.View>
        )}
      </ScrollView>

      {/* Premium Cancellation Modal */}
      <Modal visible={showCancelModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <Pressable style={styles.backdrop} onPress={() => setShowCancelModal(false)} />
              <Animated.View entering={ZoomIn.duration(300)} style={styles.cancellationModal}>
                  <View style={styles.warningIconContainer}>
                      <Ionicons name="alert-circle" size={48} color={Colors.error500} />
                  </View>
                  <Text style={styles.modalTitle}>Cancel Appointment?</Text>
                  <Text style={styles.modalSubtitle}>
                      You will lose your current spot (#<Text style={{fontFamily: 'Inter_700Bold'}}>{activeBooking.tokenNumber}</Text>) and wait time will reset if you join later.
                  </Text>
                  
                  <View style={styles.modalActions}>
                      <Pressable style={styles.stayBtn} onPress={() => setShowCancelModal(false)}>
                          <Text style={styles.stayBtnText}>Don't Leave</Text>
                      </Pressable>
                      <Pressable style={styles.leaveBtn} onPress={confirmCancel}>
                          <Text style={styles.leaveBtnText}>Yes, Cancel</Text>
                      </Pressable>
                  </View>
              </Animated.View>
          </View>
      </Modal>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },

  liveStatusContainer: { alignItems: 'center', marginBottom: 24 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, backgroundColor: Colors.surfacePrimary, marginBottom: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  liveText: { fontFamily: 'Inter_700Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  servingText: { fontFamily: 'Inter_800ExtraBold', fontSize: 24, lineHeight: 30, color: Colors.textPrimary, marginBottom: 4 },
  updateText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textTertiary },

  heroContainer: { alignItems: 'center', marginBottom: 24 },
  heroLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  heroValue: { fontFamily: 'Inter_800ExtraBold', fontSize: 80, lineHeight: 92, color: Colors.textPrimary },
  aheadBadge: { backgroundColor: Colors.surfacePrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.borderLight, marginTop: 8 },
  aheadText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.textSecondary },

  qVizContainer: { marginBottom: 32, alignItems: 'center' },
  qVizRow: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 20 },
  qDot: { width: 12, height: 12, borderRadius: 6 },
  qDotServing: { backgroundColor: Colors.success500 },
  qDotYou: { backgroundColor: Colors.primary500, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: Colors.surfacePrimary },
  qDotAhead: { backgroundColor: Colors.gray200 },
  qVizLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 8 },
  qVizLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textTertiary },

  timeCard: { backgroundColor: Colors.surfacePrimary, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.gray200, marginBottom: 16 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  timeEst: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.textPrimary },
  accuracyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 30 },
  accuracyText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.success500 },

  actionCueCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 24, ...Colors.shadows.md },
  actionCueTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 18, color: Colors.textOnColor, marginBottom: 4 },
  actionCueSub: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textOnColorSecondary, lineHeight: 18 },

  eventsCard: { backgroundColor: Colors.surfacePrimary, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.gray200, marginBottom: 24 },
  eventsTitle: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  eventsList: { gap: 12 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventDot: { width: 6, height: 6, borderRadius: 3 },
  eventText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.textPrimary },

  emergencyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.error100, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.error500 },
  emergencyBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.error500 },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  cancellationModal: { width: width * 0.85, backgroundColor: Colors.surfacePrimary, borderRadius: 32, padding: 32, alignItems: 'center', ...Colors.shadows.lg },
  warningIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.error100, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 24, color: Colors.textPrimary, marginBottom: 12 },
  modalSubtitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  modalActions: { width: '100%', gap: 12 },
  stayBtn: { width: '100%', height: 56, backgroundColor: Colors.gray100, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stayBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.textPrimary },
  leaveBtn: { width: '100%', height: 56, backgroundColor: Colors.error500, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  leaveBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' },
});
