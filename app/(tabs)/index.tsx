import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    StatusBar,
    Modal,
    Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/styles';
import { Motion } from '@/constants/motion';
import { useQueue } from '@/lib/queue-context';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CountUp } from '@/components/CountUp';
import { clinics, getClinicDoctor, Clinic } from '@/lib/data';

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
const LOCATIONS = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────
/** Animated live dot */
function LiveDot({ color = Colors.success500 }: { color?: string }) {
    const opacity = useSharedValue(1);
    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(withTiming(0.25, { duration: 700 }), withTiming(1, { duration: 700 })),
            -1, false
        );
    }, []);
    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return <Animated.View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }, style]} />;
}

/** Single clinic card */
function ClinicCard({ clinic, index }: { clinic: Clinic; index: number }) {
    const isLive = clinic.state === 'live';
    const isBooking = clinic.state === 'booking_open';
    const stateColor = isLive ? Colors.state.live : isBooking ? Colors.state.booking : Colors.state.closed;
    const stateText = isLive ? 'Live' : isBooking ? 'Booking Open' : 'Closed';
    const servingNum = clinic.servingToken || 0;
    const yourNum = servingNum + clinic.currentQueueLength;

    return (
        <Animated.View 
            entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * (index % 10)).springify()}
        >
            <Link href={`/clinic/${clinic.id}` as any} asChild>
                <AnimatedButton activeScale={0.98} style={styles.refinedClinicCard}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <View>
                            <Text style={styles.refinedClinicName}>{clinic.name}</Text>
                            <View style={styles.refinedClinicStateRow}>
                                <View style={[styles.refinedClinicStateDot, { backgroundColor: stateColor }]} />
                                <Text style={[styles.refinedClinicStateText, { color: stateColor }]}>{stateText}</Text>
                                {isLive && <Text style={styles.refinedClinicServing}>• Serving #{servingNum}</Text>}
                            </View>
                        </View>
                        <View style={[styles.refinedClinicTag, { backgroundColor: stateColor + '15' }]}>
                            <Text style={[styles.refinedClinicTagText, { color: stateColor }]}>{stateText}</Text>
                        </View>
                    </View>

                    <View style={styles.refinedClinicPredictBox}>
                        <View>
                             <Text style={styles.refinedClinicPredictLine}>You will be <Text style={{fontFamily: 'Inter_700Bold', color: Colors.textPrimary}}>#{yourNum}</Text></Text>
                             <Text style={styles.refinedClinicPredictTime}>~{clinic.avgWaitTimePerPatient * clinic.currentQueueLength} min wait</Text>
                        </View>
                        <View style={styles.refinedClinicActionBtn}>
                            <Text style={styles.refinedClinicActionText}>View Details</Text>
                        </View>
                    </View>
                </AnimatedButton>
            </Link>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { activeBooking } = useQueue();
    const [selectedLocation, setSelectedLocation] = useState('Mumbai');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const bestClinic = clinics[0] || null;

    // Intelligence for Active Card
    const peopleAhead = activeBooking ? activeBooking.tokenNumber - activeBooking.servingToken : 0;
    const waitTime = activeBooking ? peopleAhead * activeBooking.avgWaitTime : 0;
    const leaveIn = activeBooking ? (waitTime - activeBooking.travelTime - 5) : 0;
    const isLive = activeBooking && activeBooking.servingToken > 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={[
                    { paddingTop: insets.top + Layout.spacing.space4, paddingBottom: 160 + insets.bottom, paddingHorizontal: 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageStructure}>

                    {/* [SECTION 1] ══ DYNAMIC HEADER ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.systemStateHeader}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Pressable style={styles.locationBlock} onPress={() => setShowLocationModal(true)}>
                                <Text style={styles.locationCity}>{selectedLocation} <Ionicons name="chevron-down" size={14} color={Colors.textPrimary} /></Text>
                            </Pressable>
                            
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                {activeBooking && (
                                    <View style={styles.activeMiniBadge}>
                                        <LiveDot color={Colors.state.live} />
                                        <Text style={styles.activeMiniText}>#{activeBooking.tokenNumber}</Text>
                                    </View>
                                )}
                                <AnimatedButton onPress={() => router.push('/(tabs)/profile')}>
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60' }}
                                        style={styles.avatar}
                                    />
                                </AnimatedButton>
                            </View>
                        </View>
                        
                        {!activeBooking ? (
                            <>
                                <View style={{ marginTop: 32, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <LiveDot color={Colors.state.live} />
                                    <Text style={styles.systemStateTitle}>Live Now</Text>
                                </View>
                                <Text style={styles.systemStateSub}>Clinics are actively serving patients</Text>
                            </>
                        ) : (
                           <View style={{marginTop: 24}}>
                                <Text style={styles.commandWelcome}>Your Visit Dashboard</Text>
                                <Text style={styles.commandStatus}>Real-time monitoring active</Text>
                           </View> 
                        )}
                    </Animated.View>

                    {/* [SECTION 2] ══ HERO: COMMAND CENTER vs DISCOVERY ══════════════════════════════════════════════════ */}
                    {activeBooking ? (
                        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.activeQueueCard}>
                            <LinearGradient
                                colors={[Colors.primary500, Colors.primary700]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.activeCardGradient}
                            >
                                <View style={styles.activeCardTop}>
                                    <View style={styles.activeCardStatus}>
                                        <LiveDot color={Colors.textOnColor} />
                                        <Text style={styles.activeStatusText}>LIVE QUEUE</Text>
                                    </View>
                                    <Text style={styles.activeClinicName}>{activeBooking.clinicName}</Text>
                                </View>

                                <View style={styles.activeCardMain}>
                                    <View style={styles.activePosCol}>
                                        <Text style={styles.activePosLabel}>You are</Text>
                                        <Text style={styles.activePosValue}>#{activeBooking.tokenNumber}</Text>
                                    </View>
                                    
                                    <View style={styles.activeMetaCol}>
                                        <View style={styles.activeMetaRow}>
                                            <Ionicons name="people" size={16} color={Colors.textOnColorSecondary} />
                                            <Text style={styles.activeMetaText}>{peopleAhead} ahead</Text>
                                        </View>
                                        <View style={styles.activeMetaRow}>
                                            <Ionicons name="time" size={16} color={Colors.textOnColorSecondary} />
                                            <Text style={styles.activeMetaText}>~{waitTime} mins left</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.activeActionBox}>
                                    <View style={styles.activeCountdown}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <CountUp value={Math.max(0, leaveIn)} duration={800} style={styles.countdownValue} />
                                        </View>
                                        <Text style={styles.countdownLabel}>mins to leave</Text>
                                    </View>
                                    
                                    <AnimatedButton 
                                        style={styles.activeViewBtn}
                                        onPress={() => router.push('/active-token')}
                                    >
                                        <Text style={styles.activeViewText}>Full View</Text>
                                        <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                                    </AnimatedButton>
                                </View>
                                
                                {peopleAhead < 2 && (
                                    <View style={styles.delayAlert}>
                                        <Ionicons name="notifications" size={14} color="#fff" />
                                        <Text style={styles.delayText}>It's almost your turn!</Text>
                                    </View>
                                )}
                            </LinearGradient>
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.heroActionCard}>
                            <Text style={styles.heroTitle}>Skip the wait right now</Text>
                            
                            <View style={styles.heroStatsRow}>
                                <View>
                                    <Text style={styles.heroStatLabel}>Shortest queue</Text>
                                    <Text style={styles.heroStatValue}>10 mins</Text>
                                </View>
                                <View style={styles.heroStatDivider} />
                                <View>
                                    <Text style={styles.heroStatLabel}>Available</Text>
                                    <Text style={styles.heroStatValue}>2 clinics</Text>
                                </View>
                            </View>
                            
                            <Pressable style={styles.heroButton}>
                                <Text style={styles.heroButtonText}>Find Best Option</Text>
                            </Pressable>
                        </Animated.View>
                    )}

                    {/* [SECTION 3] ══ BEST OPTION (ONLY IF NO BOOKING) ══════════════════════════════════════════════════ */}
                    {!activeBooking && bestClinic && (
                        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.sectionContainer}>
                            <Text style={styles.sectionTitleSmall}>Best Option Near You</Text>
                            
                            <View style={styles.bestOptionCard}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View>
                                        <Text style={styles.bestOptionName}>{bestClinic.name}</Text>
                                        <Text style={styles.bestOptionMeta}>⭐ {bestClinic.rating} • {bestClinic.distance} km</Text>
                                    </View>
                                    <View style={styles.bestOptionWaitPill}>
                                        <Text style={styles.bestOptionWaitText}>{bestClinic.avgWaitTimePerPatient * bestClinic.currentQueueLength} min wait</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.bestOptionContextRow}>
                                    <Ionicons name="car-outline" size={16} color={Colors.gray600} />
                                    <Text style={styles.bestOptionLeaveText}>Leave in 12 mins</Text>
                                </View>
                                
                                <Pressable style={styles.bestOptionButton} onPress={() => router.push(`/clinic/${bestClinic.id}`)}>
                                    <Text style={styles.bestOptionButtonText}>Book Now</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    )}

                    {/* [SECTION 4] ══ EMERGENCY ACCESS ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.sectionContainer}>
                        <Pressable style={styles.emergencyAccessCard} onPress={() => router.push({ pathname: '/clinic/[id]', params: { id: '1', emergency: 'true' } })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <View style={styles.emergencyIconWrap}>
                                    <Ionicons name="warning" size={18} color={Colors.state.emergency} />
                                </View>
                                <Text style={styles.emergencyAccessText}>Need urgent care?</Text>
                            </View>
                            <View style={styles.emergencyAccessBtn}>
                                <Text style={styles.emergencyAccessBtnText}>Emergency Priority</Text>
                            </View>
                        </Pressable>
                    </Animated.View>

                    {/* [SECTION 5] ══ SEARCH (SECONDARY) ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.searchSecondaryContainer}>
                        <Pressable style={styles.searchSecondary} onPress={() => router.push('/(tabs)/search')}>
                            <Ionicons name="search" size={20} color={Colors.gray400} />
                            <Text style={styles.searchSecondaryInput}>Search doctors, clinics...</Text>
                        </Pressable>
                    </Animated.View>

                    {/* [SECTION 6] ══ CLINIC LIST (REFINED) ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.clinicListSection}>
                        <View style={{ gap: 16 }}>
                            {clinics.map((clinic, i) => (
                                <ClinicCard key={clinic.id} clinic={clinic} index={i} />
                            ))}
                        </View>
                    </Animated.View>

                    {/* [SECTION 7] ══ TIME INTELLIGENCE STRIP ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.timeIntelligenceStrip}>
                        <View style={styles.timeIntelHeader}>
                            <Ionicons name="time" size={16} color={Colors.primary600} />
                            <Text style={styles.timeIntelTitle}>Time Intelligence</Text>
                        </View>
                        <View style={styles.timeIntelRow}>
                            <Text style={styles.timeIntelCondition}>If you go now</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.gray400} />
                            <Text style={styles.timeIntelResultGood}>no wait</Text>
                        </View>
                        <View style={styles.timeIntelDivider} />
                        <View style={styles.timeIntelRow}>
                            <Text style={styles.timeIntelCondition}>If you go in 30 mins</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.gray400} />
                            <Text style={styles.timeIntelResultBad}>25 min wait</Text>
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>

            {/* ══ LOCATION MODAL ═══════════════════════════════════════════ */}
            <Modal
                visible={showLocationModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLocationModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowLocationModal(false)}>
                    <View style={styles.modalSheet}>
                        <Text style={styles.modalTitle}>Select Location</Text>
                        {LOCATIONS.map((loc) => {
                            const active = selectedLocation === loc;
                            return (
                                <Pressable
                                    key={loc}
                                    style={[styles.modalOption, active && styles.modalOptionActive]}
                                    onPress={() => { setSelectedLocation(loc); setShowLocationModal(false); }}
                                >
                                    <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>
                                        {loc}
                                    </Text>
                                    {active && <Ionicons name="checkmark" size={18} color={Colors.primary500} />}
                                </Pressable>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

// ─────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surfaceSecondary,
    },
    pageStructure: {
        flexDirection: 'column',
    },
    sectionContainer: {
        marginBottom: 24,
    },

    // ── Section 1: System State Header ───────────────────────────
    systemStateHeader: {
        marginBottom: 32,
    },
    locationBlock: {
        flexDirection: 'column',
    },
    locationCity: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: Colors.textPrimary,
        padding: 8,
        paddingLeft: 0,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.gray200,
    },
    systemStateTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 34,
        color: Colors.state.live,
        letterSpacing: -1,
    },
    systemStateSub: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.gray600,
        marginTop: 6,
    },
    commandWelcome: {
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    commandStatus: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.primary600,
        marginTop: 4,
    },
    activeMiniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.state.live + '15',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activeMiniText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 13,
        color: Colors.state.live,
    },

    // ── Section 2: Hero Action Card ────────────────────────────────
    heroActionCard: {
        backgroundColor: Colors.state.live,
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
        shadowColor: Colors.state.live,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    heroTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    heroStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    heroStatLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    heroStatValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    heroStatDivider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 20,
    },
    heroButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroButtonText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15,
        color: Colors.state.live,
    },

    // ── Active Queue Card (Hero Mode) ──────────────────────────────
    activeQueueCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        ...Platform.select({
            ios: { shadowColor: Colors.primary500, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20 },
            android: { elevation: 8 }
        }),
    },
    activeCardGradient: {
        padding: 24,
    },
    activeCardTop: {
        marginBottom: 20,
    },
    activeCardStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    activeStatusText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        color: Colors.textOnColor,
        letterSpacing: 1,
    },
    activeClinicName: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: Colors.textOnColor,
    },
    activeCardMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    activePosCol: {
        flex: 1,
    },
    activePosLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    activePosValue: {
        ...Typography.numbers,
        fontSize: 48,
        lineHeight: 56,
        color: Colors.textOnColor,
    },
    activeMetaCol: {
        gap: 8,
    },
    activeMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    activeMetaText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: '#FFFFFF',
    },
    activeActionBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 16,
        borderRadius: 16,
    },
    activeCountdown: {
    },
    countdownLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    countdownValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    activeViewBtn: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    activeViewText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: Colors.primary700,
    },
    delayAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    delayText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: '#FFFFFF',
    },

    // ── Section 3: Best Option ─────────────────────────────────────
    sectionTitleSmall: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    bestOptionCard: {
        backgroundColor: Colors.surfacePrimary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    bestOptionName: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    bestOptionMeta: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.gray600,
    },
    bestOptionWaitPill: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bestOptionWaitText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.gray800,
    },
    bestOptionContextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        marginBottom: 16,
    },
    bestOptionLeaveText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.gray800,
    },
    bestOptionButton: {
        backgroundColor: Colors.surfacePrimary,
        borderWidth: 1,
        borderColor: Colors.state.live,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    bestOptionButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.state.live,
    },

    // ── Section 4: Emergency Access ────────────────────────────────
    emergencyAccessCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    emergencyIconWrap: {
        width: 32,
        height: 32,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emergencyAccessText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.state.emergency,
    },
    emergencyAccessBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    emergencyAccessBtnText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.state.emergency,
    },

    // ── Section 5: Search ──────────────────────────────────────────
    searchSecondaryContainer: {
        marginBottom: 32,
    },
    searchSecondary: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchSecondaryInput: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.gray400,
    },

    // ── Section 6: Clinic List (Refined) ───────────────────────────
    clinicListSection: {
        marginBottom: 32,
    },
    refinedClinicCard: {
        backgroundColor: Colors.surfacePrimary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    refinedClinicName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 17,
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    refinedClinicStateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    refinedClinicStateDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    refinedClinicStateText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
    },
    refinedClinicServing: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.gray500,
    },
    refinedClinicTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    refinedClinicTagText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    refinedClinicPredictBox: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.gray100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    refinedClinicPredictLine: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.gray600,
        marginBottom: 2,
    },
    refinedClinicPredictTime: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.state.live,
    },
    refinedClinicActionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
    },
    refinedClinicActionText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: Colors.textPrimary,
    },

    // ── Section 7: Time Intelligence Strip ─────────────────────────
    timeIntelligenceStrip: {
        backgroundColor: '#F0F9FF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    timeIntelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    timeIntelTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: Colors.primary700,
    },
    timeIntelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeIntelCondition: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.gray700,
    },
    timeIntelResultGood: {
        fontFamily: 'Inter_700Bold',
        fontSize: 13,
        color: '#059669', // Emerald 600
    },
    timeIntelResultBad: {
        fontFamily: 'Inter_700Bold',
        fontSize: 13,
        color: Colors.state.booking, 
    },
    timeIntelDivider: {
        height: 1,
        backgroundColor: '#E0F2FE',
        marginVertical: 12,
    },

    // ── Shared Modal Styles ────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: Colors.surfacePrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray100,
    },
    modalOptionActive: {
        backgroundColor: Colors.primary100,
        marginHorizontal: -24,
        paddingHorizontal: 24,
        borderBottomColor: 'transparent',
    },
    modalOptionText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.textPrimary,
    },
    modalOptionTextActive: {
        fontFamily: 'Inter_600SemiBold',
        color: Colors.primary600,
    },
});
