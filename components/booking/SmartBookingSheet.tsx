import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';
import { Typography } from '@/constants/styles';
import { Motion } from '@/constants/motion';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CountUp } from '@/components/CountUp';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';

interface Patient {
    id: string;
    name: string;
    relation: string;
}

interface TravelMode {
    id: 'car' | 'bike' | 'walk';
    icon: string;
    label: string;
    eta: number; // in minutes
}

interface SmartBookingSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: {
        patient: Patient;
        travelMode: TravelMode;
    }) => void;
    consultationFee?: number;
    pricing?: {
        consultation: number;
        platformFee: number;
        emergencyPremium: number;
        total: number;
    };
    isEmergency?: boolean;
    clinicName?: string;
}

const PATIENTS: Patient[] = [
    { id: 'me', name: 'Me', relation: 'Self' },
    { id: 'mom', name: 'Mom', relation: 'Mother' },
    { id: 'dad', name: 'Dad', relation: 'Father' },
];

const TRAVEL_MODES: TravelMode[] = [
    { id: 'car', icon: 'car-sport', label: 'Car', eta: 15 },
    { id: 'bike', icon: 'bicycle', label: 'Bike', eta: 12 },
    { id: 'walk', icon: 'walk', label: 'Walk', eta: 25 },
];

const EMERGENCY_SITUATIONS = [
    { id: 'pain', label: 'Severe Pain', icon: 'thunderstorm' },
    { id: 'injury', label: 'Injury', icon: 'bandage' },
    { id: 'fever', label: 'High Fever', icon: 'thermometer' },
    { id: 'other', label: 'Other', icon: 'medical' },
];

function getLeaveTime(visitTimeStr: string, travelDeltMins: number) {
    try {
        let [time, modifier] = visitTimeStr.split(' ');
        let [hours, mins] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        let totalMins = hours * 60 + mins;
        totalMins -= travelDeltMins;
        
        let outHours = Math.floor(totalMins / 60);
        let outMins = totalMins % 60;
        
        let outModifier = outHours >= 12 ? 'PM' : 'AM';
        outHours = outHours % 12;
        if (outHours === 0) outHours = 12;
        
        return `${outHours}:${outMins.toString().padStart(2, '0')} ${outModifier}`;
    } catch {
        return '5:55 PM';
    }
}

export default function SmartBookingSheet({
    isOpen,
    onClose,
    onConfirm,
    consultationFee = 500,
    pricing,
    isEmergency = false,
    clinicName = 'City Dental Clinic',
}: SmartBookingSheetProps) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [selectedPatient, setSelectedPatient] = useState<Patient>(PATIENTS[0]);
    const [selectedSituation, setSelectedSituation] = useState(EMERGENCY_SITUATIONS[0]);
    const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>(TRAVEL_MODES[0]);
    const [showPricing, setShowPricing] = useState(false);

    // Mock Intelligence Data
    const queuePosition = 14;
    const estimatedVisit = '6:20 PM';
    const leaveTime = getLeaveTime(estimatedVisit, selectedTravelMode.eta);

    const themeColor = isEmergency ? Colors.error500 : Colors.primary500;

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleTravelModeSelect = (mode: TravelMode) => {
        setSelectedTravelMode(mode);
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleConfirm = () => {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onConfirm({ patient: selectedPatient, travelMode: selectedTravelMode });
        setTimeout(() => setStep(1), 500); // reset after transition
    };

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    return (
        <Modal visible={isOpen} animationType="slide" transparent onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.backdrop} onPress={handleClose} />

                <View style={styles.modalContent}>
                    <View style={styles.handleBar} />

                    {/* Persistent Context Bar (Steps 2-4) */}
                    {step > 1 && (
                        <Animated.View 
                            entering={FadeInDown.duration(Motion.duration.action)} 
                            style={[styles.persistentBar, isEmergency && { backgroundColor: Colors.error500 }]}
                        >
                            <View style={styles.persistentBarLeft}>
                                <View style={styles.liveDotSmall} />
                                <Text style={styles.persistentBarText}>{isEmergency ? "Priority Active" : "Your position"}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {!isEmergency && <Text style={styles.persistentBarVal}>#</Text>}
                                <CountUp value={isEmergency ? 0 : queuePosition} duration={500} style={styles.persistentBarVal} suffix={isEmergency ? "PROCEED NOW" : ""} />
                            </View>
                        </Animated.View>
                    )}

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                        
                        <Animated.View key={step} entering={FadeInRight.duration(Motion.duration.action)} exiting={FadeOutLeft.duration(Motion.duration.action)}>
                           <View style={styles.stepIndicatorRow}>
                              <Text style={styles.stepIndicatorText}>Step {step} of 4</Text>
                           </View>

                        {/* Step 1: Context Entry */}
                        {step === 1 && (
                            <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>{isEmergency ? "Emergency Priority" : "Before you join..."}</Text>
                                <Text style={styles.stepSubtitle}>{isEmergency ? "You will be moved ahead for immediate care" : "Here is what will happen"}</Text>

                                <View style={styles.contextCard}>
                                    <Text style={styles.contextLabel}>You are joining:</Text>
                                    <View style={styles.contextHeaderRow}>
                                        <Text style={styles.clinicTitle}>{clinicName}</Text>
                                    </View>
                                    
                                    <View style={styles.statusPill}>
                                        <Text style={styles.statusPillText}>🟡  Booking Open</Text>
                                        <Text style={styles.statusPillSub}>Opens at 5:00 PM</Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <Text style={styles.contextLabel}>If you join now:</Text>
                                    <View style={styles.predictionRow}>
                                        <Text style={styles.predictionBigVal}>You will be <Text style={{fontFamily: 'Inter_800ExtraBold', color: themeColor}}>#{queuePosition}</Text></Text>
                                    </View>
                                    <View style={styles.predictionDetail}>
                                        <Ionicons name="time" size={16} color={Colors.textSecondary} />
                                        <Text style={styles.predictionDetailText}>Estimated visit: <Text style={{fontFamily: 'Inter_700Bold', color: Colors.text}}>{estimatedVisit}</Text></Text>
                                    </View>
                                    <View style={[styles.predictionDetail, {marginTop: 4}]}>
                                        <Ionicons name="cash-outline" size={16} color={Colors.textSecondary} />
                                        <Text style={styles.predictionDetailText}>Consultation: <Text style={{fontFamily: 'Inter_700Bold'}}>₹{consultationFee}</Text></Text>
                                    </View>
                                </View>

                                <View style={styles.navRow}>
                                    <GradientButton 
                                        title={isEmergency ? "I Understand, Get Priority" : "I Understand, Continue"} 
                                        onPress={() => setStep(2)} 
                                        variant={isEmergency ? 'danger' : 'primary'} 
                                        style={{ flex: 1 }} 
                                    />
                                </View>
                            </Animated.View>
                        )}

                        {/* Step 2: Patient Info / Emergency Select */}
                        {step === 2 && (
                            <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContainer}>
                                <Text style={styles.stepSubtitle}>
                                    {isEmergency ? "This helps the clinic prepare for your arrival." : `This will securely reserve position #${queuePosition}.`}
                                </Text>

                                <View style={styles.grid}>
                                    {isEmergency ? (
                                        EMERGENCY_SITUATIONS.map((s) => (
                                            <AnimatedButton
                                                key={s.id}
                                                style={[
                                                    styles.optionCard,
                                                    selectedSituation.id === s.id && { borderColor: themeColor, backgroundColor: Colors.error100 }
                                                ]}
                                                onPress={() => setSelectedSituation(s)}
                                                activeScale={0.96}
                                            >
                                                <Ionicons
                                                    name={s.icon as any}
                                                    size={24}
                                                    color={selectedSituation.id === s.id ? themeColor : Colors.textSecondary}
                                                />
                                                <Text style={[styles.optionLabel, selectedSituation.id === s.id && { color: themeColor, fontFamily: 'Inter_700Bold' }]}>{s.label}</Text>
                                            </AnimatedButton>
                                        ))
                                    ) : (
                                        PATIENTS.map((p) => (
                                            <AnimatedButton
                                                key={p.id}
                                                style={[
                                                    styles.optionCard,
                                                    selectedPatient.id === p.id && { borderColor: themeColor, backgroundColor: Colors.primary100 }
                                                ]}
                                                onPress={() => handlePatientSelect(p)}
                                                activeScale={0.96}
                                            >
                                                <Ionicons
                                                    name={p.id === 'me' ? 'person' : 'people'}
                                                    size={24}
                                                    color={selectedPatient.id === p.id ? themeColor : Colors.textSecondary}
                                                />
                                                <Text style={[styles.optionLabel, selectedPatient.id === p.id && { color: themeColor, fontFamily: 'Inter_700Bold' }]}>{p.name}</Text>
                                            </AnimatedButton>
                                        ))
                                    )}
                                </View>

                                {isEmergency && (
                                    <View style={styles.triageBox}>
                                        <View style={styles.triageHeader}>
                                            <Text style={styles.triageTitle}>Priority: High</Text>
                                            <Ionicons name="shield-checkmark" size={16} color={Colors.success500} />
                                        </View>
                                        <Text style={styles.triageText}>You will be moved ahead in queue. Clinic will be notified immediately.</Text>
                                    </View>
                                )}

                                <View style={styles.navRow}>
                                    <GradientButton title="Back" onPress={() => setStep(1)} variant="outline" style={{ flex: 0.4 }} />
                                    <GradientButton title="Next" onPress={() => setStep(3)} variant={isEmergency ? 'danger' : 'primary'} style={{ flex: 1 }} />
                                </View>
                            </Animated.View>
                        )}

                        {/* Step 3: Transport */}
                        {step === 3 && (
                            <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>How will you travel?</Text>
                                <Text style={styles.stepSubtitle}>We'll calculate the exact time you should leave.</Text>

                                <View style={styles.grid}>
                                    {TRAVEL_MODES.map((m) => (
                                        <AnimatedButton
                                            key={m.id}
                                            style={[
                                                styles.optionCard,
                                                selectedTravelMode.id === m.id && { borderColor: themeColor, backgroundColor: isEmergency ? Colors.error100 : Colors.primary100 }
                                            ]}
                                            onPress={() => handleTravelModeSelect(m)}
                                            activeScale={0.96}
                                        >
                                            <Ionicons
                                                name={m.icon as any}
                                                size={28}
                                                color={selectedTravelMode.id === m.id ? themeColor : Colors.textSecondary}
                                            />
                                            <Text style={[styles.optionLabel, selectedTravelMode.id === m.id && { color: themeColor, fontFamily: 'Inter_700Bold' }]}>{m.label}</Text>
                                            <Text style={styles.optionSub}>{m.eta} min</Text>
                                        </AnimatedButton>
                                    ))}
                                </View>

                                {/* Dynamic Result Box */}
                                <Animated.View layout={Layout.springify()} style={[styles.dynamicResultBox, isEmergency && { backgroundColor: Colors.error100, borderColor: Colors.error500 }]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4}}>
                                        <Ionicons name={isEmergency ? "warning" : "information-circle"} size={16} color={isEmergency ? Colors.error500 : Colors.primary500} />
                                        <Text style={styles.resultLabel}>{isEmergency ? "Proceed Directly" : "Based on this:"}</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                         <Text style={styles.resultValue}>
                                             {isEmergency 
                                                ? "Clinic notified. Start journey now." 
                                                : `You should leave at ${leaveTime}`}
                                         </Text>
                                         <View style={styles.valueFraming}>
                                             <Text style={styles.valueFramingText}>₹{consultationFee} consultation • No waiting time</Text>
                                         </View>
                                    </View>
                                </Animated.View>

                                <View style={styles.navRow}>
                                    <GradientButton title="Back" onPress={() => setStep(2)} variant="outline" style={{ flex: 0.4 }} />
                                    <GradientButton title="Next" onPress={() => setStep(4)} variant={isEmergency ? 'danger' : 'primary'} style={{ flex: 1 }} />
                                </View>
                            </Animated.View>
                        )}

                        {/* Step 4: Confirm */}
                        {step === 4 && (
                            <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContainer}>
                                <Text style={styles.confirmationTitle}>Confirm Your Visit</Text>

                                {/* 1. Unified Summary Card */}
                                <View style={styles.unifiedSummaryCard}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryItemLabel}>Clinic</Text>
                                        <Text style={styles.summaryItemVal}>{clinicName}</Text>
                                    </View>
                                    <View style={styles.summaryGrid}>
                                        <View style={styles.summaryItem}>
                                            <Text style={styles.summaryItemLabel}>Patient</Text>
                                            <Text style={styles.summaryItemVal}>{selectedPatient.name}</Text>
                                        </View>
                                        <View style={styles.summaryItem}>
                                            <Text style={styles.summaryItemLabel}>Transport</Text>
                                            <Text style={styles.summaryItemVal}>{selectedTravelMode.label}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* 2. Decision Block (Visual Hero) */}
                                <View style={styles.decisionBlock}>
                                    <View style={styles.positionHero}>
                                        <Text style={styles.heroPositionLabel}>Your Position</Text>
                                        <Text style={[styles.heroPositionValue, isEmergency && { color: Colors.error500 }]}>
                                            {isEmergency ? "PRIORITY" : `#${queuePosition}`}
                                        </Text>
                                    </View>
                                    
                                    <View style={styles.timePair}>
                                        <View style={styles.timeItem}>
                                            <Text style={styles.timeValue}>{isEmergency ? "EXPECTED" : estimatedVisit}</Text>
                                            <Text style={styles.timeLabel}>Visit</Text>
                                        </View>
                                        <View style={styles.timeDivider} />
                                        <View style={styles.timeItem}>
                                            <Text style={[styles.timeValue, { color: themeColor }]}>{isEmergency ? "NOW" : leaveTime}</Text>
                                            <Text style={[styles.timeLabel, { color: themeColor, fontFamily: 'Inter_700Bold' }]}>Leave</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* 3. Price + Trust */}
                                <View style={styles.pricingSectionCompact}>
                                    <Pressable 
                                        style={styles.pricingHeaderCompact}
                                        onPress={() => setShowPricing(!showPricing)}
                                    >
                                        <Text style={styles.pricingTotalLabel}>Total: <Text style={styles.pricingTotalValue}>₹{isEmergency ? (pricing?.total || 0) + (pricing?.emergencyPremium || 0) : pricing?.total || consultationFee}</Text></Text>
                                        <Ionicons name={showPricing ? "chevron-up" : "chevron-down"} size={16} color={Colors.textSecondary} />
                                    </Pressable>

                                    {showPricing && (
                                        <Animated.View entering={FadeIn.duration(200)} style={styles.pricingBreakdownCompact}>
                                            <View style={styles.pricingRow}>
                                                <Text style={styles.pricingLabel}>Consultation</Text>
                                                <Text style={styles.pricingValue}>₹{pricing?.consultation || consultationFee}</Text>
                                            </View>
                                            {isEmergency && (
                                                <View style={styles.pricingRow}>
                                                    <Text style={[styles.pricingLabel, {color: Colors.error500}]}>Emergency</Text>
                                                    <Text style={[styles.pricingValue, {color: Colors.error500}]}>+₹{pricing?.emergencyPremium || 300}</Text>
                                                </View>
                                            )}
                                        </Animated.View>
                                    )}
                                    
                                    <Text style={styles.trustLine}>Pay at clinic • No hidden charges</Text>
                                </View>

                                {/* Items moved below the fold / Extra space */}
                                <View style={{height: 100}} />
                            </Animated.View>
                        )}
                        </Animated.View>
                    </ScrollView>

                    {/* Sticky CTA Bar */}
                    {step === 4 && (
                        <View style={styles.stickyFooter}>
                            <GradientButton title="Back" onPress={() => setStep(3)} variant="outline" style={{ width: 100 }} />
                            <GradientButton
                                title={isEmergency ? "Confirm & Join" : "Confirm & Join Queue"}
                                onPress={handleConfirm}
                                variant={isEmergency ? 'danger' : 'primary'}
                                style={{ flex: 1 }}
                            />
                        </View>
                    )}                   
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContent: { backgroundColor: Colors.surfacePrimary, borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: '90%', paddingBottom: 20 },
    handleBar: { width: 48, height: 5, backgroundColor: Colors.borderLight, borderRadius: 2.5, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
    contentContainer: { paddingHorizontal: 24, paddingBottom: 160 },
    
    persistentBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.gray900, paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 24, borderRadius: 14, marginBottom: 16 },
    persistentBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    liveDotSmall: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success500 },
    persistentBarText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textOnColorSecondary },
    persistentBarVal: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.textOnColor },

    confirmationTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.text, textAlign: 'center', marginBottom: 20 },
    
    unifiedSummaryCard: { backgroundColor: Colors.gray50, padding: 16, borderRadius: 20, gap: 12, borderWidth: 1, borderColor: Colors.borderLight },
    summaryGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.gray100, paddingTop: 12 },
    summaryItem: { gap: 2 },
    summaryItemLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textSecondary },
    summaryItemVal: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.textPrimary },

    decisionBlock: { paddingVertical: 12, marginBottom: 20 },
    positionHero: { alignItems: 'center', marginBottom: 24 },
    heroPositionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
    heroPositionValue: { 
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 72, 
        lineHeight: 84,
        letterSpacing: -2,
        color: Colors.textPrimary,
    },
    
    timePair: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40, marginTop: 16 },
    timeItem: { alignItems: 'center' },
    timeValue: { fontFamily: 'Inter_800ExtraBold', fontSize: 22, color: Colors.textPrimary },
    timeLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
    timeDivider: { width: 1, height: 30, backgroundColor: Colors.gray200 },

    pricingSectionCompact: { alignItems: 'center', gap: 4 },
    pricingHeaderCompact: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pricingTotalLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.textSecondary },
    pricingTotalValue: { fontFamily: 'Inter_800ExtraBold', fontSize: 18, color: Colors.textPrimary },
    pricingBreakdownCompact: { width: '100%', paddingHorizontal: 40, marginTop: 8, gap: 4 },
    trustLine: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted, marginTop: 4 },

    stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surfacePrimary, flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 20, gap: 12, borderTopWidth: 1, borderTopColor: Colors.gray100, ...Colors.shadows.md },

    stepIndicatorRow: { alignItems: 'center', marginBottom: 24 },
    stepIndicatorText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },

    stepContainer: { gap: 20 },
    stepTitle: { fontSize: 24, fontFamily: 'Inter_800ExtraBold', color: Colors.textPrimary, textAlign: 'center', marginBottom: 4, letterSpacing: -0.5 },
    stepSubtitle: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, textAlign: 'center', marginBottom: 8, lineHeight: 22 },
    
    contextCard: { backgroundColor: Colors.surfacePrimary, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: Colors.borderLight, ...Colors.shadows.sm },
    contextLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.gray500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    contextHeaderRow: { marginBottom: 16 },
    clinicTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.textPrimary },
    statusPill: { backgroundColor: Colors.warning100, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    statusPillText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.warning700 },
    statusPillSub: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.warning700 + 'B3' },
    
    divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 20 },
    
    predictionRow: { marginBottom: 8 },
    predictionBigVal: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: Colors.textPrimary },
    predictionDetail: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.gray50, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    predictionDetailText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.textSecondary },

    grid: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
    optionCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surfacePrimary },
    optionLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.text },
    optionSub: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
    
    dynamicResultBox: { backgroundColor: Colors.primary100, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: Colors.primary300 },
    resultLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.gray600, marginBottom: 4 },
    resultValue: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.textPrimary },

    pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pricingLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.gray600 },
    pricingValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.textPrimary },

    triageBox: { backgroundColor: Colors.surfaceSecondary, padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: Colors.error500, marginTop: 8 },
    triageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    triageTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.error500, textTransform: 'uppercase' },
    triageText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.gray600, lineHeight: 18 },

    valueFraming: { backgroundColor: Colors.success500 + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
    valueFramingText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.success700, textTransform: 'uppercase' },

    navRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
});

