import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
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
    useAnimatedScrollHandler,
    Layout as AnimatedLayout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/styles';
import { Motion } from '@/constants/motion';
import { useQueue } from '@/lib/queue-context';
import { useScroll } from '@/lib/scroll-context';
import { AnimatedButton } from '@/components/AnimatedButton';
import { clinics, Clinic } from '@/lib/data';

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

/** Refined Clinic Card with High-Contrast SmartQ metrics */
function ClinicCard({ clinic, index }: { clinic: Clinic; index: number }) {
    const isLive = clinic.state === 'live';
    const isBooking = clinic.state === 'booking_open';
    const stateColor = isLive ? Colors.state.live : isBooking ? Colors.state.booking : Colors.state.closed;
    const stateText = isLive ? 'Live Queue' : isBooking ? 'Booking Open' : 'Closed';
    const waitTime = clinic.avgWaitTimePerPatient * clinic.currentQueueLength;
    const predictedToken = clinic.currentQueueLength + 1;

    return (
        <Animated.View 
            entering={FadeInDown.duration(Motion.duration.reveal).delay(Motion.stagger * (index % 10)).springify()}
        >
            <Link href={`/clinic/${clinic.id}` as any} asChild>
                <AnimatedButton activeScale={0.98} style={styles.clinicCard}>
                    <View style={styles.clinicCardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.clinicCardName}>{clinic.name}</Text>
                            <Text style={styles.clinicCardSub}>{clinic.distance} km • {clinic.rating} ★</Text>
                        </View>
                        <View style={[styles.clinicStatusBadge, { backgroundColor: stateColor + '10' }]}>
                            {isLive && <LiveDot color={stateColor} />}
                            <Text style={[styles.clinicStatusText, { color: stateColor }]}>{stateText}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.clinicCardPrediction}>
                        <View style={styles.predictionItem}>
                            <Text style={styles.predictionLabel}>You will be</Text>
                            <Text style={[styles.predictionValue, { color: Colors.primary700 }]}>#{predictedToken}</Text>
                        </View>
                        <View style={styles.predictionSep} />
                        <View style={styles.predictionItem}>
                            <Text style={styles.predictionLabel}>~ Wait time</Text>
                            <Text style={[styles.predictionValue, { color: Colors.textPrimary }]}>{waitTime} mins</Text>
                        </View>
                        <View style={styles.predictionAction}>
                            <Ionicons name="chevron-forward" size={18} color={Colors.gray300} />
                        </View>
                    </View>
                </AnimatedButton>
            </Link>
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────────────
// Main HomeScreen
// ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { activeBooking } = useQueue();
    const [selectedLocation, setSelectedLocation] = useState('Mumbai');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const { scrollY } = useScroll();

    // Filter Mapping
    const filterMap: Record<string, string> = {
        'General': 'general',
        'Dentist': 'dental',
        'Fever': 'general',
        'Checkup': 'general',
        'Lab Test': 'labs',
        'Pediatric': 'pediatric',
        'Cardio': 'cardio',
    };

    const handleFilterPress = (label: string) => {
        const value = filterMap[label] || label.toLowerCase();
        setSelectedFilter(prev => prev === value ? null : value);
    };

    const filteredClinics = selectedFilter 
        ? clinics.filter(c => c.type.toLowerCase() === selectedFilter.toLowerCase())
        : clinics;

    // Intelligence for Active Card
    const peopleAhead = activeBooking ? activeBooking.tokenNumber - activeBooking.servingToken : 0;
    const waitTime = activeBooking ? peopleAhead * activeBooking.avgWaitTime : 0;
    const leaveIn = activeBooking ? (waitTime - activeBooking.travelTime - 5) : 0;
    
    // Formatting for Action Line
    const leaveInHrs = Math.floor(Math.max(0, leaveIn) / 60);
    const leaveInMins = Math.floor(Math.max(0, leaveIn) % 60);
    const leaveInFormatted = leaveInHrs > 0 ? `${leaveInHrs}h ${leaveInMins}m` : `${Math.floor(Math.max(0, leaveIn))}m`;
    
    const totalWaitHrs = Math.floor(waitTime / 60);
    const totalWaitMins = waitTime % 60;
    const totalWaitFormatted = totalWaitHrs > 0 ? `${totalWaitHrs}h ${totalWaitMins}m` : `${waitTime}m`;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const scrollHandler = useAnimatedScrollHandler((event) => {
        // Update shared scroll context for dynamic navbar compression
        scrollY.value = event.contentOffset.y;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Animated.ScrollView
                style={{ flex: 1 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{ 
                    paddingTop: insets.top + Layout.spacing.space4, 
                    paddingBottom: 180 + insets.bottom, // Increased per audit to clear nav+fade entirely
                    paddingHorizontal: 20 
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageStructure}>

                    {/* [SECTION 1] ══ HEADER ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.systemStateHeader}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={styles.greetingText}>{greeting}</Text>
                                <Pressable style={styles.locationBlock} onPress={() => setShowLocationModal(true)}>
                                    <Text style={styles.locationCity}>
                                        {selectedLocation} <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
                                    </Text>
                                </Pressable>
                            </View>
                            <AnimatedButton onPress={() => router.push('/(tabs)/profile')}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60' }}
                                    style={styles.avatar}
                                />
                            </AnimatedButton>
                        </View>
                        
                        {activeBooking && (
                             <Animated.View entering={FadeInDown.duration(400)} style={styles.headerActivityLine}>
                                <Text style={styles.headerActivityText}>
                                    You’ll leave in <Text style={styles.headerActivityBold}>{leaveInFormatted}</Text>
                                </Text>
                             </Animated.View>
                        )}
                    </Animated.View>

                    {/* [SECTION 2] ══ ACTIVE QUEUE CARD (If exists) ═════════════════════════════════════════ */}
                    {activeBooking && (
                        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.activeQueueCard}>
                            <Link href="/active-token" asChild>
                                <Pressable>
                                    <LinearGradient
                                        colors={[Colors.primary500, Colors.primary700]}
                                        style={styles.activeCardGradient}
                                    >
                                        <View style={styles.activeCardHeader}>
                                            <View style={styles.activeCardStatus}>
                                                <LiveDot color="#FFFFFF" />
                                                <Text style={styles.liveLabelSmall}>LIVE QUEUE</Text>
                                            </View>
                                            <Text style={styles.activeClinicName}>{activeBooking.clinicName}</Text>
                                        </View>

                                        <View style={styles.activeCardMainContent}>
                                            <View>
                                                <Text style={styles.activeBigToken}>#{activeBooking.tokenNumber}</Text>
                                                <Text style={styles.activeTokenSub}>Your Current Position</Text>
                                            </View>
                                            <View style={styles.activeLeaveAction}>
                                                <Text style={styles.leaveInLabel}>Leave in</Text>
                                                <Text style={styles.leaveInValue}>{leaveInFormatted}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.activeCardDivider} />

                                        <View style={styles.activeCardFooter}>
                                            <View style={styles.activeMetricsGroup}>
                                                <View style={styles.activeStat}>
                                                    <Text style={styles.activeStatVal}>{peopleAhead}</Text>
                                                    <Text style={styles.activeStatLabel}>ahead</Text>
                                                </View>
                                                <View style={styles.activeStatDividerVertical} />
                                                <View style={styles.activeStat}>
                                                    <Text style={styles.activeStatVal}>{totalWaitFormatted}</Text>
                                                    <Text style={styles.activeStatLabel}>est. wait</Text>
                                                </View>
                                            </View>
                                            <Ionicons name="chevron-forward-circle" size={32} color="rgba(255,255,255,0.4)" />
                                        </View>
                                    </LinearGradient>
                                </Pressable>
                            </Link>
                        </Animated.View>
                    )}

                    {/* [SECTION 3] ══ SEARCH BAR (Promoted) ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.searchSection}>
                        <Pressable style={styles.searchPrimary} onPress={() => router.push('/(tabs)/search')}>
                            <Ionicons name="search" size={20} color={Colors.gray400} />
                            <Text style={styles.searchPlaceholder}>Search clinics, doctors, or symptoms</Text>
                        </Pressable>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.searchChips}>
                             {['Fever', 'Dentist', 'Pediatric', 'Cardio'].map((chip) => {
                                 const value = filterMap[chip] || chip.toLowerCase();
                                 const isActive = selectedFilter === value;
                                 return (
                                     <Pressable 
                                         key={chip} 
                                         style={[styles.searchChip, isActive && styles.searchChipActive]}
                                         onPress={() => handleFilterPress(chip)}
                                     >
                                         <Text style={[styles.searchChipText, isActive && styles.searchChipTextActive]}>{chip}</Text>
                                     </Pressable>
                                 );
                             })}
                        </ScrollView>
                    </Animated.View>

                    {/* [SECTION 4] ══ EMERGENCY STRIP (CRITICAL ACTION) ═══════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.emergencyStripContainer}>
                        <Pressable style={styles.emergencyStrip} onPress={() => router.push('/emergency')}>
                            <View style={styles.emergencyStripTextCol}>
                                <View style={styles.emergencyStripHeader}>
                                    <Ionicons name="alert-circle" size={20} color={Colors.error500} />
                                    <Text style={styles.emergencyStripTitle}>Emergency? Get help now →</Text>
                                </View>
                                <Text style={styles.emergencyStripSub}>Nearest hospitals • Instant routing • Priority care</Text>
                            </View>
                        </Pressable>
                    </Animated.View>

                    {/* [SECTION 5] ══ QUICK ACTIONS (Discovery hub) ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitleSmall}>What do you need today?</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                            {[
                                { name: 'Fever', icon: 'thermometer' },
                                { name: 'Dentist', icon: 'happy' },
                                { name: 'Checkup', icon: 'medical' },
                                { name: 'Lab Test', icon: 'flask' },
                            ].map((item, idx) => {
                                const value = filterMap[item.name] || item.name.toLowerCase();
                                const isActive = selectedFilter === value;
                                return (
                                    <Pressable 
                                        key={idx} 
                                        style={styles.quickActionCard}
                                        onPress={() => handleFilterPress(item.name)}
                                    >
                                        <View style={[styles.quickActionIcon, isActive && styles.quickActionActive]}>
                                            <Ionicons 
                                                name={item.icon as any} 
                                                size={24} 
                                                color={isActive ? '#FFFFFF' : Colors.primary500} 
                                            />
                                        </View>
                                        <Text style={[styles.quickActionName, isActive && styles.quickActionNameActive]}>{item.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </Animated.View>

                    {/* [SECTION 6] ══ NEARBY CLINICS (Smart List) ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.clinicListSection}>
                        <Text style={styles.sectionTitleSmall}>
                            {selectedFilter ? `Showing ${selectedFilter}` : 'Clinics Near You'}
                        </Text>
                        <View style={{ gap: 16 }}>
                            {filteredClinics.length > 0 ? (
                                filteredClinics.map((clinic, i) => (
                                    <ClinicCard key={clinic.id} clinic={clinic} index={i} />
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateText}>No clinics found for this category.</Text>
                                    <Pressable onPress={() => setSelectedFilter(null)}>
                                        <Text style={styles.clearFilterText}>Clear Filter</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                </View>
            </Animated.ScrollView>

            {/* LOCATION SELECTOR MODAL */}
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
        backgroundColor: '#F8FAFC',
    },
    pageStructure: {
        flexDirection: 'column',
    },
    sectionContainer: {
        marginBottom: 28,
    },

    // ── Header Components ──
    systemStateHeader: {
        marginBottom: 28,
    },
    greetingText: {
        fontFamily: Typography.fontFamily.extraBold,
        fontSize: 32,
        color: Colors.textPrimary,
        letterSpacing: -1,
        marginBottom: 2,
    },
    locationBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationCity: {
        fontFamily: Typography.fontFamily.semiBold,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: Colors.gray200,
    },
    headerActivityLine: {
        marginTop: 12,
        backgroundColor: 'rgba(38, 101, 140, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    headerActivityText: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 13,
        color: Colors.primary700,
    },
    headerActivityBold: {
        fontFamily: Typography.fontFamily.bold,
    },

    // ── Active Queue Card ──
    activeQueueCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        ...Colors.shadows.lg,
    },
    activeCardGradient: {
        padding: 24,
    },
    activeCardHeader: {
        marginBottom: 20,
    },
    activeCardStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    liveLabelSmall: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 10,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 1,
    },
    activeClinicName: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 16,
        color: '#FFFFFF',
    },
    activeCardMainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    activeBigToken: {
        fontFamily: Typography.fontFamily.extraBold,
        fontSize: 64,
        color: '#FFFFFF',
        lineHeight: 64,
        letterSpacing: -2,
    },
    activeTokenSub: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    activeLeaveAction: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        minWidth: 100,
    },
    leaveInLabel: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    leaveInValue: {
        fontFamily: Typography.fontFamily.extraBold,
        fontSize: 18,
        color: '#FFFFFF',
    },
    activeCardDivider: {
        height: 1, 
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    activeCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activeMetricsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    activeStat: {
        flexDirection: 'column',
    },
    activeStatVal: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 16,
        color: '#FFFFFF',
    },
    activeStatLabel: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    activeStatDividerVertical: {
        width: 1, 
        height: 24, 
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    activeCardCTA: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activeCTATextSmall: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 12,
        color: '#FFFFFF',
    },

    // ── Search & Chips ──
    searchSection: {
        marginBottom: 16,
    },
    searchPrimary: {
        height: 52,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.gray200,
        ...Colors.shadows.sm,
    },
    searchPlaceholder: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 15,
        color: Colors.gray400,
    },
    searchChips: {
        marginTop: 14,
    },
    searchChip: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    searchChipActive: {
        backgroundColor: Colors.primary500,
        borderColor: Colors.primary500,
    },
    searchChipText: {
        fontFamily: Typography.fontFamily.semiBold,
        fontSize: 12,
        color: Colors.gray600,
    },
    searchChipTextActive: {
        color: '#FFFFFF',
    },

    // ── Emergency Strip ──
    emergencyStripContainer: {
        marginBottom: 28,
    },
    emergencyStrip: {
        backgroundColor: Colors.error100,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(220, 38, 38, 0.1)',
    },
    emergencyStripTextCol: {
        gap: 4,
    },
    emergencyStripHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emergencyStripTitle: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 16,
        color: Colors.error700,
    },
    emergencyStripSub: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 13,
        color: Colors.error700,
        opacity: 0.7,
        paddingLeft: 28,
    },

    // ── Quick Actions ──
    quickActionCard: {
        width: 84,
        alignItems: 'center',
        gap: 8,
    },
    quickActionIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    quickActionActive: {
        backgroundColor: Colors.primary500,
        borderColor: Colors.primary500,
    },
    quickActionName: {
        fontFamily: Typography.fontFamily.semiBold,
        fontSize: 12,
        color: Colors.textSecondary,
    },
    quickActionNameActive: {
        fontFamily: Typography.fontFamily.bold,
        color: Colors.primary600,
    },

    // ── Clinic Cards ──
    clinicListSection: {
        marginBottom: 32,
    },
    sectionTitleSmall: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    clinicCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
        ...Colors.shadows.md,
        marginBottom: 16,
    },
    clinicCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    clinicCardName: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    clinicCardSub: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 13,
        color: Colors.textSecondary,
    },
    clinicStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    clinicStatusText: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 10,
        textTransform: 'uppercase',
    },
    clinicCardPrediction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgMain,
        padding: 14,
        borderRadius: 16,
    },
    predictionItem: {
        flex: 1,
    },
    predictionLabel: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 10,
        color: Colors.gray500,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    predictionValue: {
        fontFamily: Typography.fontFamily.extraBold,
        fontSize: 18,
    },
    predictionSep: {
        width: 1,
        height: 24,
        backgroundColor: Colors.gray200,
        marginHorizontal: 16,
    },
    predictionAction: {
        marginLeft: 4,
    },

    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.gray50,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.gray100,
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontFamily: Typography.fontFamily.medium,
        fontSize: 14,
        color: Colors.gray500,
        textAlign: 'center',
        marginBottom: 12,
    },
    clearFilterText: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 14,
        color: Colors.primary500,
    },

    // ── Modal Styles ──
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 48,
    },
    modalTitle: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 20,
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
        fontFamily: Typography.fontFamily.medium,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    modalOptionTextActive: {
        fontFamily: Typography.fontFamily.semiBold,
        color: Colors.primary600,
    },
});
