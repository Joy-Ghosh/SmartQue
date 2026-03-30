import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Motion } from '@/constants/motion';
import { Typography } from '@/constants/styles';
import { AnimatedButton } from '@/components/AnimatedButton';
import { clinics, Clinic } from '@/lib/data';

const { width, height } = Dimensions.get('window');

// ── CORE EMERGENCY NEEDS (Bento Grid) ───────────────────────────────────────
const CORE_NEEDS = [
    { id: 'fever', label: 'Fever', icon: 'thermometer', color: '#FFD700', type: 'general', severity: 'low' },
    { id: 'injury', label: 'Injury', icon: 'bandage', color: '#EF4444', type: 'orthopedic', severity: 'high' },
    { id: 'respiratory', label: 'Breathing', icon: 'pulse', color: '#3B82F6', type: 'general', severity: 'critical' },
    { id: 'pain', label: 'Severe Pain', icon: 'flash', color: '#8B5CF6', type: 'general', severity: 'high' },
];

const URGENCY_LEVELS = [
    { id: 'immediate', label: 'Immediate', sub: 'Need care right now', score: 100 },
    { id: 'hour', label: 'Within 1 hour', sub: 'Urgent but stable', score: 50 },
    { id: 'later', label: 'Can wait', sub: 'Next 2-4 hours', score: 10 },
];

export default function EmergencyFlow() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
    const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
    const [bestMatch, setBestMatch] = useState<Clinic | null>(null);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    };

    const startMatching = (needOverride?: string) => {
        setStep(3);
        const targetType = needOverride || (selectedNeed ? CORE_NEEDS.find(n => n.id === selectedNeed)?.type : 'general');
        
        setTimeout(() => {
            let available = clinics.filter(c => c.state !== 'closed');
            const sorted = [...available].sort((a, b) => {
                const aMatches = a.type === targetType || a.emergencySupported;
                const bMatches = b.type === targetType || b.emergencySupported;
                if (aMatches && !bMatches) return -1;
                if (!aMatches && bMatches) return 1;
                const aWait = a.avgWaitTimePerPatient * a.currentQueueLength;
                const bWait = b.avgWaitTimePerPatient * b.currentQueueLength;
                return aWait - bWait;
            });

            setBestMatch(sorted[0]);
            setStep(4);
        }, 1800);
    };

    const handleImmediateEscape = () => {
        startMatching('general'); 
    };

    const handleSelectNeed = (id: string) => {
        setSelectedNeed(id);
        setStep(2);
    };

    const handleSelectUrgency = (id: string) => {
        setSelectedUrgency(id);
        startMatching();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient colors={['#FFF5F5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            
            {/* [HEADER] ══ Simplified & Clean ══════════════════════════════════════════════════ */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={handleBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </Pressable>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerTitleText}>Emergency Help</Text>
                    <Text style={styles.headerSubText}>Get care quickly based on your need</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* [STEP 1] ══ NO-SCROLL DECISION LAYER ══════════════════════════════════════════ */}
            {step === 1 && (
                <View style={styles.content}>
                    
                    {/* PRIMARY ACTION (Dominant) */}
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.primaryActionSection}>
                        <View style={styles.primaryActionLabelRow}>
                            <Ionicons name="alert-circle" size={18} color={Colors.error500} />
                            <Text style={styles.primaryActionLabel}>PRIMARY ACTION</Text>
                        </View>
                        <AnimatedButton 
                            style={styles.hospitalButton} 
                            onPress={handleImmediateEscape}
                            activeScale={0.97}
                        >
                            <View style={styles.hospitalButtonLeading}>
                                <Text style={styles.hospitalButtonEmoji}>🚨</Text>
                                <View>
                                    <Text style={styles.hospitalButtonTitle}>Get immediate help</Text>
                                    <Text style={styles.hospitalButtonSub}>Find nearest emergency hospital</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                        </AnimatedButton>
                    </Animated.View>

                    {/* BENTO GRID OF CORE NEEDS */}
                    <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.needsSection}>
                        <Text style={styles.sectionTitle}>What’s happening?</Text>
                        <View style={styles.bentoGrid}>
                            {CORE_NEEDS.map((need, idx) => (
                                <AnimatedButton 
                                    key={need.id} 
                                    style={styles.bentoCard}
                                    onPress={() => handleSelectNeed(need.id)}
                                    activeScale={0.96}
                                >
                                    <View style={[styles.bentoIconPulse, { backgroundColor: need.color + '15' }]}>
                                        <Ionicons name={need.icon as any} size={32} color={need.color} />
                                    </View>
                                    <Text style={styles.bentoLabel}>{need.label}</Text>
                                    <View style={[styles.severityHint, { backgroundColor: need.color }]} />
                                </AnimatedButton>
                            ))}
                        </View>
                    </Animated.View>

                    {/* SAFETY LAYER / SECONDARY OPTION */}
                    <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.safetySection}>
                        <Text style={styles.safetySubText}>Not sure what to choose?</Text>
                        <Pressable style={styles.describeButton} onPress={() => {}}>
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary500} />
                            <Text style={styles.describeButtonText}>Describe your symptoms →</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            )}

            {/* [STEP 2] ══ Urgency Selection ══════════════════════════════════════════════════ */}
            {step === 2 && (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>How urgent is it?</Text>
                    <View style={styles.urgencyList}>
                        {URGENCY_LEVELS.map((level) => (
                            <AnimatedButton 
                                key={level.id} 
                                style={styles.urgencyCard}
                                onPress={() => handleSelectUrgency(level.id)}
                            >
                                <View style={styles.urgencyCardMain}>
                                    <Text style={styles.urgencyLabel}>{level.label}</Text>
                                    <Text style={styles.urgencySub}>{level.sub}</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={20} color={Colors.gray400} />
                            </AnimatedButton>
                        ))}
                    </View>
                </Animated.View>
            )}

            {/* [STEP 3] ══ Matching Progress ══════════════════════════════════════════════════ */}
            {step === 3 && (
                <View style={styles.matchingContainer}>
                    <ActivityIndicator size="large" color={Colors.error500} />
                    <Text style={styles.matchingText}>Finding the fastest care...</Text>
                </View>
            )}

            {/* [STEP 4] ══ Result Matching ═══════════════════════════════════════════════════ */}
            {step === 4 && bestMatch && (
                <Animated.View entering={FadeIn.duration(500)} style={styles.resultContainer}>
                    <View style={styles.matchBadge}>
                        <Text style={styles.matchBadgeText}>FASTEST OPTION NEARBY</Text>
                    </View>
                    <Text style={styles.resultTitle}>Go to {bestMatch.name}</Text>
                    
                    <View style={styles.resultCard}>
                        <View style={styles.resultMainRow}>
                            <View style={styles.resultStatCol}>
                                <Text style={styles.resultStatValue}>5</Text>
                                <Text style={styles.resultStatLabel}>min away</Text>
                            </View>
                            <View style={styles.resultStatDivider} />
                            <View style={styles.resultStatCol}>
                                <Text style={[styles.resultStatValue, { color: Colors.success500 }]}>~10</Text>
                                <Text style={styles.resultStatLabel}>min wait</Text>
                            </View>
                        </View>
                        <View style={styles.resultHintRow}>
                            <Ionicons name="checkmark-circle" size={18} color={Colors.success500} />
                            <Text style={styles.resultHintText}>Emergency Triage priority enabled</Text>
                        </View>
                    </View>

                    <AnimatedButton 
                        style={styles.finalCTA}
                        onPress={() => router.push(`/clinic/${bestMatch.id}?emergency=true`)}
                    >
                        <Text style={styles.finalCTAText}>Directions & Join Queue</Text>
                        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
                    </AnimatedButton>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 },
    headerTextWrap: { flex: 1, alignItems: 'center' },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    headerTitleText: { fontFamily: Typography.fontFamily.bold, fontSize: 18, color: Colors.textPrimary },
    headerSubText: { fontFamily: Typography.fontFamily.medium, fontSize: 13, color: Colors.textSecondary },
    
    content: { flex: 1, paddingHorizontal: 20 },
    
    // 🚨 Primary Action
    primaryActionSection: { marginBottom: 32 },
    primaryActionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    primaryActionLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 12, color: Colors.error500, letterSpacing: 1 },
    hospitalButton: { 
        backgroundColor: '#E53935', 
        height: 80, 
        borderRadius: 20, 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        justifyContent: 'space-between',
        ...Colors.shadows.md,
    },
    hospitalButtonLeading: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    hospitalButtonEmoji: { fontSize: 24 },
    hospitalButtonTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 18, color: '#FFFFFF' },
    hospitalButtonSub: { fontFamily: Typography.fontFamily.medium, fontSize: 13, color: 'rgba(255,255,255,0.8)' },

    // 🧩 Bento Grid
    needsSection: { marginBottom: 32 },
    sectionTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 20, color: Colors.textPrimary, marginBottom: 16 },
    bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    bentoCard: { 
        width: (width - 52) / 2, 
        backgroundColor: '#FFFFFF', 
        padding: 20, 
        borderRadius: 24, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.gray100,
        ...Colors.shadows.sm,
        height: 140,
        position: 'relative',
        overflow: 'hidden',
    },
    bentoIconPulse: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    bentoLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 15, color: Colors.textPrimary },
    severityHint: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, opacity: 0.6 },

    // 🛡️ Safety Layer
    safetySection: { alignItems: 'center', marginTop: 'auto', marginBottom: 40, gap: 12 },
    safetySubText: { fontFamily: Typography.fontFamily.medium, fontSize: 14, color: Colors.gray500 },
    describeButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    describeButtonText: { fontFamily: Typography.fontFamily.bold, fontSize: 16, color: Colors.primary500 },

    // Step 2 Styles
    stepContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
    stepTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 28, color: Colors.textPrimary, marginBottom: 24 },
    urgencyList: { gap: 16 },
    urgencyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: Colors.gray100, ...Colors.shadows.sm },
    urgencyCardMain: { flex: 1 },
    urgencyLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 18, color: Colors.textPrimary, marginBottom: 4 },
    urgencySub: { fontFamily: Typography.fontFamily.medium, fontSize: 14, color: Colors.gray500 },

    matchingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    matchingText: { fontFamily: Typography.fontFamily.bold, fontSize: 18, color: Colors.textPrimary, marginTop: 20 },

    // Result Styles
    resultContainer: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
    matchBadge: { backgroundColor: Colors.success100, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginBottom: 16 },
    matchBadgeText: { fontFamily: Typography.fontFamily.bold, fontSize: 11, color: Colors.success700, letterSpacing: 1 },
    resultTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 32, color: Colors.textPrimary, textAlign: 'center', marginBottom: 24 },
    resultCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: Colors.gray100, ...Colors.shadows.md, marginBottom: 32 },
    resultMainRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray100, marginBottom: 20 },
    resultStatCol: { alignItems: 'center' },
    resultStatValue: { fontFamily: Typography.fontFamily.extraBold, fontSize: 48, color: Colors.textPrimary },
    resultStatLabel: { fontFamily: Typography.fontFamily.medium, fontSize: 14, color: Colors.gray500 },
    resultStatDivider: { width: 1, height: 40, backgroundColor: Colors.gray200 },
    resultHintRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
    resultHintText: { fontFamily: Typography.fontFamily.bold, fontSize: 14, color: Colors.success700 },
    finalCTA: { width: '100%', height: 68, backgroundColor: Colors.error500, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, ...Colors.shadows.md },
    finalCTAText: { fontFamily: Typography.fontFamily.bold, fontSize: 18, color: '#FFFFFF' },
});
