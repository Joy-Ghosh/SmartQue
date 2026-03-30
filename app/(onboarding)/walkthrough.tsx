import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, StatusBar, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    withDelay,
    FadeIn,
    FadeOut,
    FadeInDown,
    SlideInRight,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

// 🎯 GLOBAL DESIGN SYSTEM 
const DESIGN = {
    colors: {
        primary: '#2F6B8A',
        primaryDark: '#1F4E68',
        success: '#4CAF50',
        error: '#E53935',
        background: '#F7F9FB',
        card: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        border: '#E2E8F0',
    },
    spacing: {
        screenPadding: 24,
        sectionGap: 32,
        elementGap: 16,
        itemGap: 12,
    },
    radius: {
        button: 16,
        card: 20,
        pill: 99,
    },
    typography: {
        heading: { fontSize: 28, fontWeight: '600' as const, letterSpacing: -0.5, color: '#0F172A' },
        subtext: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: '#64748B' },
        cta: { fontSize: 16, fontWeight: '500' as const },
        label: { fontSize: 14, fontWeight: '600' as const },
    }
} as const;

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
    return (
        <View style={styles.progressContainer}>
            {Array.from({ length: total }).map((_, i) => (
                <View key={i} style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: i <= step ? '100%' : '0%', opacity: i === step ? 1 : 0.3 }]} />
                </View>
            ))}
        </View>
    );
}

function PrimaryButton({ title, onPress, variant = 'primary', style, icon }: any) {
    return (
        <Pressable 
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress();
            }}
            style={({ pressed }) => [
                styles.btnBase,
                variant === 'primary' ? styles.btnPrimary : styles.btnSecondary,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                style
            ]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.btnText, variant === 'secondary' && { color: DESIGN.colors.primary }]}>{title}</Text>
                {icon && <Ionicons name={icon} size={20} color={variant === 'primary' ? '#FFF' : DESIGN.colors.primary} />}
            </View>
        </Pressable>
    );
}

// ── ADVANCED MERGED ILLUSTRATIONS ──────────────────────────────────────────────

function IllustrationHook() {
    // Shared values for multi-element motion
    const mapPulse = useSharedValue(1);
    const timelineProgress = useSharedValue(0);
    const queueOpacity = useSharedValue(1);

    useEffect(() => {
        mapPulse.value = withRepeat(withSpring(1.15), -1, true);
        timelineProgress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
        queueOpacity.value = withRepeat(withTiming(0.2, { duration: 1500 }), -1, true);
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: mapPulse.value }] }));
    const dotStyle = useAnimatedStyle(() => ({ left: `${timelineProgress.value * 70}%` }));
    const queueStyle = useAnimatedStyle(() => ({ opacity: queueOpacity.value }));

    return (
        <View style={styles.illuContainer}>
            {/* Merged View: Map + Timeline + Empty Queue */}
            <View style={styles.hookWrapper}>
                {/* 1. Map Component */}
                <View style={styles.miniMap}>
                    <Animated.View style={[styles.pinBadge, { backgroundColor: '#E8F5E9' }, pulseStyle]}>
                        <Text style={[styles.pinText, { color: '#2E7D32' }]}>0 min wait</Text>
                    </Animated.View>
                </View>

                {/* 2. Timeline Component */}
                <View style={[styles.timeline, { marginTop: 24 }]}>
                    <View style={styles.timelineTrack} />
                    <Animated.View style={[styles.timelineDot, dotStyle]} />
                    <Text style={styles.timelineLabel}>Leave in 12m</Text>
                </View>

                {/* 3. Empty Queue Representation */}
                <Animated.View style={[styles.emptyQueue, queueStyle]}>
                    <Ionicons name="people-outline" size={32} color={DESIGN.colors.border} />
                    <View style={styles.slashLine} />
                </Animated.View>
            </View>
            <View style={styles.illuGlow} />
        </View>
    );
}

function IllustrationConfidence() {
    return (
        <View style={styles.illuContainer}>
            <Animated.View entering={FadeInDown.delay(200)} style={styles.doctorCard}>
                <View style={styles.docAvatar} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>Dr. Sarah Kim</Text>
                    <Text style={styles.docSub}>Cardiologist • 12 yrs exp</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8 (320 reviews)</Text>
                    </View>
                </View>
                <View style={styles.bestMatchBadge}>
                    <Text style={styles.bestMatchText}>Best Match</Text>
                </View>
            </Animated.View>
            {/* Secondary card peek */}
            <View style={[styles.doctorCard, styles.docCardPeek]} />
        </View>
    );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────

export default function WalkthroughScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0); // 0: Hook, 1: Confidence, 2: Setup, 3: Entry
    const [selectedLang, setSelectedLang] = useState('English');
    const [perms, setPerms] = useState({ location: false, alerts: false });

    const nextStep = () => {
        if (step < 3) {
            setStep(s => s + 1);
        } else {
            router.replace('/(tabs)');
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setStep(s => s - 1);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 0: // HOOK (Combined Skip + Real-time + Timing)
                return (
                    <Animated.View key="hook" entering={FadeIn} exiting={FadeOut} style={styles.stepContent}>
                        <IllustrationHook />
                        <View style={styles.textStack}>
                            <Text style={styles.heading}>Skip the waiting room.</Text>
                            <Text style={styles.subtext}>See live wait times and leave at the perfect moment. No more uncertainty.</Text>
                        </View>
                        <PrimaryButton title="Get Started" onPress={nextStep} style={styles.cta} />
                    </Animated.View>
                );

            case 1: // CONFIDENCE (Doctor Trust)
                return (
                    <Animated.View key="confidence" entering={SlideInRight} style={styles.stepContent}>
                        <IllustrationConfidence />
                        <View style={styles.textStack}>
                            <Text style={styles.heading}>Choose with confidence.</Text>
                            <Text style={styles.subtext}>Compare doctors, reviews, and availability instantly. Trust your care plan.</Text>
                        </View>
                        <PrimaryButton title="Continue" onPress={nextStep} style={styles.cta} />
                    </Animated.View>
                );

            case 2: // SETUP (Combined Language + Permissions)
                return (
                    <Animated.View key="setup" entering={SlideInRight} style={styles.stepContent}>
                        <View style={[styles.textStack, { marginBottom: 32 }]}>
                            <Text style={styles.heading}>Personalize your experience.</Text>
                            <Text style={styles.subtext}>Set your preferences to get the most accurate queue updates.</Text>
                        </View>

                        <View style={styles.setupContainer}>
                            {/* Language Selector Selector */}
                            <View style={styles.setupGroup}>
                                <Text style={styles.groupLabel}>Language</Text>
                                <View style={styles.langGrid}>
                                    {['English', 'Español', 'हिंदी'].map(l => (
                                        <Pressable 
                                            key={l} 
                                            style={[styles.langChip, selectedLang === l && styles.langChipActive]}
                                            onPress={() => setSelectedLang(l)}
                                        >
                                            <Text style={[styles.langChipText, selectedLang === l && { color: '#FFF' }]}>{l}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Permissions Stack */}
                            <View style={styles.setupGroup}>
                                <Text style={styles.groupLabel}>Preferences</Text>
                                <View style={styles.permItem}>
                                    <View style={styles.permIcon}><Ionicons name="location" size={20} color={DESIGN.colors.primary} /></View>
                                    <View style={{ flex: 1 }}><Text style={styles.permTitle}>Nearness Detection</Text><Text style={styles.permSub}>To show clinics near you</Text></View>
                                    <Switch 
                                        value={perms.location} 
                                        onValueChange={v => setPerms(p => ({ ...p, location: v }))}
                                        trackColor={{ true: DESIGN.colors.primary }}
                                    />
                                </View>
                                <View style={styles.permItem}>
                                    <View style={styles.permIcon}><Ionicons name="notifications" size={20} color={DESIGN.colors.primary} /></View>
                                    <View style={{ flex: 1 }}><Text style={styles.permTitle}>Leave Reminders</Text><Text style={styles.permSub}>Get notified when to go</Text></View>
                                    <Switch 
                                        value={perms.alerts} 
                                        onValueChange={v => setPerms(p => ({ ...p, alerts: v }))}
                                        trackColor={{ true: DESIGN.colors.primary }}
                                    />
                                </View>
                            </View>
                        </View>

                        <PrimaryButton title="Let's Go" onPress={nextStep} style={styles.cta} icon="arrow-forward" />
                    </Animated.View>
                );

            case 3: // ENTRY (Decision Screen)
                return (
                    <Animated.View key="entry" entering={FadeInDown} style={styles.stepContent}>
                        <View style={[styles.textStack, { marginBottom: 40 }]}>
                            <Text style={styles.heading}>What do you need right now?</Text>
                            <Text style={styles.subtext}>Let us guide you instantly based on your urgency.</Text>
                        </View>
                        
                        <View style={styles.decisionStack}>
                            <Pressable 
                                style={({ pressed }) => [styles.decisionCard, styles.decisionPrimary, pressed && { opacity: 0.9, transform: [{scale: 0.98}] }]} 
                                onPress={() => router.replace('/(tabs)')}
                            >
                                <View style={styles.decisionIcon}><Ionicons name="calendar-outline" size={24} color="#FFF" /></View>
                                <View style={{ flex: 1 }}><Text style={styles.decisionTitle}>Schedule a Visit</Text><Text style={styles.decisionSub}>Choose a time that works for you</Text></View>
                                <Ionicons name="chevron-forward" size={24} color="#FFF" />
                            </Pressable>

                            <Pressable 
                                style={({ pressed }) => [styles.decisionCard, styles.decisionEmergency, pressed && { opacity: 0.9, transform: [{scale: 0.98}] }]} 
                                onPress={() => router.push('/emergency')}
                            >
                                <View style={[styles.decisionIcon, { backgroundColor: '#FFEDEB' }]}><Ionicons name="flash" size={24} color={DESIGN.colors.error} /></View>
                                <View style={{ flex: 1 }}><Text style={[styles.decisionTitle, { color: DESIGN.colors.error }]}>Emergency Care</Text><Text style={styles.decisionSub}>Immediate assistance needed</Text></View>
                                <Ionicons name="chevron-forward" size={24} color={DESIGN.colors.error} />
                            </Pressable>
                        </View>
                    </Animated.View>
                );

            default: return null;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient colors={['#F7F9FB', '#FFFFFF']} style={StyleSheet.absoluteFill} />
            
            <View style={[styles.header, { paddingTop: insets.top + 20, flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                {step > 0 ? (
                    <Pressable 
                        onPress={prevStep}
                        hitSlop={8}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
                        ]}
                    >
                        <Ionicons name="chevron-back" size={24} color={DESIGN.colors.textPrimary} />
                    </Pressable>
                ) : (
                    <View style={{ width: 44 }} />
                )}
                <View style={{ flex: 1 }}>
                    <ProgressBar step={step} total={4} />
                </View>
                <View style={{ width: 44 }} /> 
            </View>

            <View style={styles.main}>
                {renderContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DESIGN.colors.background },
    header: { paddingHorizontal: 24, marginBottom: 40 },
    progressContainer: { flexDirection: 'row', gap: 10 },
    progressTrack: { flex: 1, height: 4, backgroundColor: DESIGN.colors.border, borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: DESIGN.colors.primaryDark, borderRadius: 2 },
    
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DESIGN.colors.border,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
            android: { elevation: 2 }
        })
    },
    
    main: { flex: 1, paddingHorizontal: DESIGN.spacing.screenPadding },
    stepContent: { flex: 1 },
    textStack: { gap: 8 },
    heading: { ...DESIGN.typography.heading },
    subtext: { ...DESIGN.typography.subtext },
    cta: { marginTop: 'auto', marginBottom: 40 },

    btnBase: { height: 56, borderRadius: DESIGN.radius.button, alignItems: 'center', justifyContent: 'center' },
    btnPrimary: { backgroundColor: DESIGN.colors.primary },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    btnSecondary: { backgroundColor: 'transparent' },

    // Hook Illustration (Merged)
    illuContainer: { height: 260, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    hookWrapper: { width: '100%', padding: 20, alignItems: 'center' },
    miniMap: { width: '80%', height: 100, backgroundColor: DESIGN.colors.border, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    pinBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }, android: { elevation: 4 } }) },
    pinText: { fontSize: 13, fontWeight: '700' },
    timeline: { width: '90%', height: 40, justifyContent: 'center' },
    timelineTrack: { height: 4, backgroundColor: DESIGN.colors.border, borderRadius: 2, width: '100%' },
    timelineDot: { position: 'absolute', top: 15, width: 10, height: 10, borderRadius: 5, backgroundColor: DESIGN.colors.primary, borderWidth: 2, borderColor: '#FFF' },
    timelineLabel: { position: 'absolute', top: 45, right: 0, fontSize: 11, fontWeight: '600', color: DESIGN.colors.primary },
    emptyQueue: { position: 'absolute', top: 0, right: 10, padding: 12, backgroundColor: '#FFF', borderRadius: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }, android: { elevation: 2 } }) },
    slashLine: { position: 'absolute', width: '100%', height: 2, backgroundColor: DESIGN.colors.error, top: '50%', transform: [{ rotate: '-45deg' }] },
    illuGlow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: DESIGN.colors.primary, opacity: 0.04 },

    // Setup Grouping
    setupContainer: { gap: 24, marginTop: 8 },
    setupGroup: { gap: 12 },
    groupLabel: { ...DESIGN.typography.label, color: DESIGN.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
    langGrid: { flexDirection: 'row', gap: 10 },
    langChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: DESIGN.colors.border },
    langChipActive: { backgroundColor: DESIGN.colors.primary, borderColor: DESIGN.colors.primary },
    langChipText: { fontSize: 14, fontWeight: '500', color: DESIGN.colors.textPrimary },
    permItem: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: DESIGN.colors.border },
    permIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F7FB', alignItems: 'center', justifyContent: 'center' },
    permTitle: { ...DESIGN.typography.label, color: DESIGN.colors.textPrimary },
    permSub: { fontSize: 12, color: DESIGN.colors.textSecondary },

    // Decision Gap
    decisionStack: { gap: 16 },
    decisionCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 24, borderRadius: 24 },
    decisionPrimary: { backgroundColor: DESIGN.colors.primary },
    decisionEmergency: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#FED7D7' },
    decisionIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    decisionTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
    decisionSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

    // Confidence Doctor Card
    doctorCard: { width: '100%', backgroundColor: '#FFF', padding: 16, borderRadius: 20, flexDirection: 'row', gap: 16, alignItems: 'center', borderWidth: 1, borderColor: DESIGN.colors.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 15 }, android: { elevation: 6 } }) },
    docCardPeek: { position: 'absolute', top: 20, width: '90%', zIndex: -1, opacity: 0.5, transform: [{ scale: 0.95 }, { translateY: 40 }] },
    docAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EAEEF2' },
    docName: { fontSize: 18, fontWeight: '600' },
    docSub: { fontSize: 14, color: DESIGN.colors.textSecondary, marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 13, color: DESIGN.colors.textSecondary },
    bestMatchBadge: { position: 'absolute', top: -12, right: 16, backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    bestMatchText: { color: '#0055CC', fontSize: 12, fontWeight: '700' },
});
