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
import { useQueue } from '@/lib/queue-context';

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
const LOCATIONS = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];

const CATEGORIES = [
    { id: 'all',         name: 'All',       icon: 'apps',         color: Colors.primaryBg,   iconColor: Colors.primary },
    { id: 'general',     name: 'General',   icon: 'medkit',       color: Colors.primaryBg,   iconColor: Colors.primary },
    { id: 'dental',      name: 'Dental',    icon: 'medical',      color: Colors.secondaryBg, iconColor: Colors.secondary },
    { id: 'dermatology', name: 'Skin',      icon: 'happy',        color: '#FEF3C7',          iconColor: Colors.smartAmber },
    { id: 'cardiology',  name: 'Cardio',    icon: 'heart',        color: Colors.dangerBg,    iconColor: Colors.danger },
    { id: 'pediatrics',  name: 'Kids',      icon: 'people',       color: Colors.successBg,   iconColor: Colors.success },
    { id: 'lab',         name: 'Lab',       icon: 'flask',        color: '#F3E8FF',          iconColor: '#A855F7' },
    { id: 'ortho',       name: 'Ortho',     icon: 'fitness',      color: '#F0FDF4',          iconColor: '#166534' },
];

interface Clinic {
    id: string;
    name: string;
    doctor: string;
    specialty: string;
    rating: number;
    distance: string;
    waitTimeMin: number;
    services: string[];
    image: string;
    currentToken: number;
    nextToken: number;
}

const CLINICS: Clinic[] = [
    {
        id: '1',
        name: 'City Dental Clinic',
        doctor: 'Dr. Aditi Kulkarni',
        specialty: 'Dentist',
        rating: 4.8,
        distance: '1.2 km',
        waitTimeMin: 10,
        services: ['dental', 'general'],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&auto=format&fit=crop&q=60',
        currentToken: 12,
        nextToken: 13,
    },
    {
        id: '2',
        name: 'Lotus Medical Centre',
        doctor: 'Dr. Rahul Mehta',
        specialty: 'General Physician',
        rating: 4.5,
        distance: '2.5 km',
        waitTimeMin: 45,
        services: ['general'],
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=60',
        currentToken: 8,
        nextToken: 20,
    },
    {
        id: '3',
        name: 'SkinCare Plus',
        doctor: 'Dr. Priya Sharma',
        specialty: 'Dermatologist',
        rating: 4.9,
        distance: '3.8 km',
        waitTimeMin: 75,
        services: ['dermatology', 'general'],
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&auto=format&fit=crop&q=60',
        currentToken: 5,
        nextToken: 17,
    },
];

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

/** Animated live dot */
function LiveDot({ color = Colors.success }: { color?: string }) {
    const opacity = useSharedValue(1);
    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(withTiming(0.25, { duration: 700 }), withTiming(1, { duration: 700 })),
            -1, false
        );
    }, []);
    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, style]} />;
}

/** Wait status config */
function getWaitConfig(mins: number) {
    if (mins < 15) return { color: Colors.success, bg: Colors.successBg, label: `${mins}m`, urgency: 'Fast' };
    if (mins < 60) return { color: Colors.smartAmber, bg: Colors.warningBg, label: `${mins}m`, urgency: 'Moderate' };
    return { color: Colors.danger, bg: Colors.dangerBg, label: `${Math.floor(mins / 60)}h+`, urgency: 'Long' };
}

/** Single clinic card — wait time as the dominant number */
function ClinicCard({ clinic, index }: { clinic: Clinic; index: number }) {
    const wait = getWaitConfig(clinic.waitTimeMin);
    return (
        <Animated.View entering={FadeInDown.duration(400).delay(350 + index * 80)}>
            <Link href={`/clinic/${clinic.id}` as any} asChild>
                <Pressable style={styles.clinicCard}>
                    {/* Image */}
                    <Image source={{ uri: clinic.image }} style={styles.clinicCardImage} />

                    {/* Content */}
                    <View style={styles.clinicCardBody}>
                        {/* Name + specialty row */}
                        <View>
                            <Text style={styles.clinicCardName} numberOfLines={1}>{clinic.name}</Text>
                            <Text style={styles.clinicCardDoctor} numberOfLines={1}>
                                {clinic.doctor} · {clinic.specialty}
                            </Text>
                        </View>

                        {/* Bottom row: rating + distance | wait time */}
                        <View style={styles.clinicCardFooter}>
                            <View style={styles.clinicCardMeta}>
                                <Ionicons name="star" size={11} color={Colors.smartAmber} />
                                <Text style={styles.clinicCardMetaText}>{clinic.rating}</Text>
                                <View style={styles.metaDot} />
                                <Text style={styles.clinicCardMetaText}>{clinic.distance}</Text>
                            </View>

                            {/* The wait number — THE thing the user cares about */}
                            <View style={[styles.waitBadge, { backgroundColor: wait.bg }]}>
                                <LiveDot color={wait.color} />
                                <Text style={[styles.waitBadgeText, { color: wait.color }]}>
                                    {wait.label} wait
                                </Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClinics = CLINICS.filter(c => {
        const matchesCat = selectedCategory === 'all' || c.services.includes(selectedCategory);
        const matchesSearch = !searchQuery ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    // Area stats
    const shortestWait = Math.min(...CLINICS.map(c => c.waitTimeMin));
    const avgWait = Math.round(CLINICS.reduce((s, c) => s + c.waitTimeMin, 0) / CLINICS.length);

    // Time-based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={[
                    styles.scroll,
                    { paddingTop: insets.top + 12, paddingBottom: 120 + insets.bottom },
                ]}
                showsVerticalScrollIndicator={false}
            >

                {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
                <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.topBar}>
                    {/* Location selector */}
                    <Pressable style={styles.locationBtn} onPress={() => setShowLocationModal(true)}>
                        <View style={styles.locationIconWrap}>
                            <Ionicons name="location" size={15} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.locationMeta}>Your Location</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Text style={styles.locationCity}>{selectedLocation}</Text>
                                <Ionicons name="chevron-down" size={11} color={Colors.textMuted} />
                            </View>
                        </View>
                    </Pressable>

                    {/* Actions */}
                    <View style={styles.topActions}>
                        <Pressable style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
                            <View style={styles.notifDot} />
                        </Pressable>
                        <Pressable onPress={() => router.push('/(tabs)/profile')}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60' }}
                                style={styles.avatar}
                            />
                        </Pressable>
                    </View>
                </Animated.View>

                {/* ══ GREETING + SEARCH ════════════════════════════════════════ */}
                <Animated.View entering={FadeInDown.duration(400).delay(60)} style={styles.greetRow}>
                    <Text style={styles.greetText}>{greeting} 👋</Text>
                    <Text style={styles.greetSubtext}>Find a clinic, skip the wait.</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.searchBar}>
                    <Ionicons name="search" size={18} color={Colors.textMuted} />
                    <TextInput
                        placeholder="Search doctors, clinics, specialties..."
                        placeholderTextColor={Colors.textMuted}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        onFocus={() => router.push('/(tabs)/search')}
                    />
                    {searchQuery.length > 0 ? (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                        </Pressable>
                    ) : (
                        <Pressable
                            style={styles.filterPill}
                            onPress={() => router.push('/(tabs)/search')}
                        >
                            <Ionicons name="options-outline" size={16} color={Colors.primary} />
                            <Text style={styles.filterPillText}>Filter</Text>
                        </Pressable>
                    )}
                </Animated.View>

                {/* ══ LIVE TOKEN CARD (when booked) ════════════════════════════ */}
                {activeBooking && (
                    <Animated.View entering={FadeInDown.duration(400).delay(120)}>
                        <Pressable onPress={() => router.push('/(tabs)/token')}>
                            <LinearGradient
                                colors={Colors.gradients.hero}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.activeTokenCard}
                            >
                                <View style={styles.activeTokenLeft}>
                                    <View style={styles.activeLiveRow}>
                                        <LiveDot color="rgba(255,255,255,0.9)" />
                                        <Text style={styles.activeLiveText}>Live Token</Text>
                                    </View>
                                    <Text style={styles.activeDoctorName}>{activeBooking.doctorName}</Text>
                                    <Text style={styles.activeClinicName}>{activeBooking.clinicName}</Text>
                                    <View style={styles.activeLeaveRow}>
                                        <Ionicons name="walk-outline" size={12} color="rgba(255,255,255,0.8)" />
                                        <Text style={styles.activeLeaveText}>Leave by 10:45 AM</Text>
                                    </View>
                                </View>

                                <View style={styles.activeTokenRight}>
                                    <Text style={styles.activeTokenMeta}>YOUR TOKEN</Text>
                                    <Text style={styles.activeTokenNumber}>{activeBooking.tokenNumber}</Text>
                                    <Text style={styles.activeServingText}>
                                        Serving #{activeBooking.servingToken}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}

                {/* ══ AREA LIVE STATUS (pre-booking) ═══════════════════════════ */}
                {!activeBooking && (
                    <Animated.View entering={FadeInDown.duration(400).delay(140)} style={styles.areaPanel}>
                        {/* Left: Shortest wait */}
                        <View style={styles.areaPanelLeft}>
                            <Text style={styles.areaPanelCategory}>Shortest Wait</Text>
                            <View style={styles.areaBigNumRow}>
                                <Text style={styles.areaBigNum}>{shortestWait}</Text>
                                <Text style={styles.areaBigNumUnit}>min</Text>
                            </View>
                            <Text style={styles.areaPanelSublabel}>Near You · Now</Text>
                        </View>

                        {/* 1px divider */}
                        <View style={styles.areaPanelDivider} />

                        {/* Right: Avg wait + open clinics */}
                        <View style={styles.areaPanelRight}>
                            <Text style={styles.areaPanelCategory}>Area Average</Text>
                            <Text style={styles.areaAvgNum}>{avgWait} min</Text>
                            <View style={styles.openClinicsPill}>
                                <Text style={styles.openClinicsText}>
                                    {CLINICS.length} clinics open
                                </Text>
                            </View>
                        </View>

                        {/* Full-width bottom strip */}
                        <View style={styles.areaPanelStrip}>
                            <View style={styles.areaPanelStripLeft}>
                                <LiveDot color={Colors.success} />
                                <Text style={styles.areaPanelStripText}>Live data · Updated just now</Text>
                            </View>
                            <Pressable onPress={() => router.push('/(tabs)/search')}>
                                <Text style={styles.areaPanelStripLink}>See all →</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}

                {/* ══ EMERGENCY STRIP ══════════════════════════════════════════ */}
                <Animated.View entering={FadeInDown.duration(400).delay(180)}>
                    <Pressable
                        style={styles.emergencyStrip}
                        onPress={() => router.push({ pathname: '/clinic/[id]', params: { id: '1', emergency: 'true' } })}
                    >
                        <View style={styles.emergencyLeft}>
                            <View style={styles.emergencyIconWrap}>
                                <Ionicons name="medical" size={13} color={Colors.medicalRed} />
                            </View>
                            <Text style={styles.emergencyText}>
                                Need urgent help?{'  '}
                                <Text style={{ fontFamily: 'Inter_700Bold' }}>Request Emergency Priority</Text>
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={Colors.medicalRed} />
                    </Pressable>
                </Animated.View>

                {/* ══ SPECIALTIES ══════════════════════════════════════════════ */}
                <Animated.View entering={FadeInDown.duration(400).delay(220)} style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Specialties</Text>
                </Animated.View>

                {/* Icon-only pills in a horizontal scroll */}
                <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catScroll}
                    entering={FadeInDown.duration(400).delay(250)}
                >
                    {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <Pressable
                                key={cat.id}
                                style={[
                                    styles.catPill,
                                    active
                                        ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
                                        : { backgroundColor: Colors.surface, borderColor: Colors.border },
                                ]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                {/* Icon circle */}
                                <View style={[
                                    styles.catPillIconWrap,
                                    { backgroundColor: active ? 'rgba(255,255,255,0.2)' : cat.color },
                                ]}>
                                    <Ionicons
                                        name={cat.icon as any}
                                        size={16}
                                        color={active ? '#fff' : cat.iconColor}
                                    />
                                </View>
                                <Text style={[
                                    styles.catPillLabel,
                                    { color: active ? '#fff' : Colors.textSecondary },
                                ]}>
                                    {cat.name}
                                </Text>
                            </Pressable>
                        );
                    })}
                </Animated.ScrollView>

                {/* ══ NEARBY CLINICS ═══════════════════════════════════════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nearby Clinics</Text>
                    <Pressable onPress={() => router.push('/(tabs)/search')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </Pressable>
                </View>

                {filteredClinics.length > 0 ? (
                    <View style={styles.clinicList}>
                        {filteredClinics.map((clinic, i) => (
                            <ClinicCard key={clinic.id} clinic={clinic} index={i} />
                        ))}
                    </View>
                ) : (
                    <Animated.View entering={FadeInDown.duration(300)} style={styles.emptyState}>
                        <View style={styles.emptyIconWrap}>
                            <Ionicons name="search-outline" size={28} color={Colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>No clinics found</Text>
                        <Text style={styles.emptyText}>Try a different specialty or search term.</Text>
                    </Animated.View>
                )}

            </ScrollView>

            {/* ══ LOCATION MODAL ═══════════════════════════════════════════ */}
            <Modal
                visible={showLocationModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLocationModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowLocationModal(false)}>
                    <Animated.View
                        entering={FadeInDown.springify().damping(18)}
                        style={styles.modalSheet}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Location</Text>
                            <Pressable onPress={() => setShowLocationModal(false)}>
                                <Ionicons name="close" size={22} color={Colors.textMuted} />
                            </Pressable>
                        </View>
                        {LOCATIONS.map((loc) => {
                            const active = selectedLocation === loc;
                            return (
                                <Pressable
                                    key={loc}
                                    style={[styles.modalOption, active && styles.modalOptionActive]}
                                    onPress={() => { setSelectedLocation(loc); setShowLocationModal(false); }}
                                >
                                    <Ionicons
                                        name={active ? 'location' : 'location-outline'}
                                        size={18}
                                        color={active ? Colors.primary : Colors.textMuted}
                                    />
                                    <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>
                                        {loc}
                                    </Text>
                                    {active && (
                                        <Ionicons name="checkmark" size={18} color={Colors.primary} style={{ marginLeft: 'auto' }} />
                                    )}
                                </Pressable>
                            );
                        })}
                    </Animated.View>
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
        backgroundColor: Colors.background,
    },
    scroll: {
        paddingHorizontal: 20,
    },

    // ── Top Bar ─────────────────────────────────────────────────────
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locationIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: Colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationMeta: {
        fontFamily: 'Inter_500Medium',
        fontSize: 10,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    locationCity: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: Colors.text,
    },
    topActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    notifDot: {
        position: 'absolute',
        top: 9,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: Colors.medicalRed,
        borderWidth: 1.5,
        borderColor: Colors.surface,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.primaryBg,
    },

    // ── Greeting ────────────────────────────────────────────────────
    greetRow: {
        marginBottom: 14,
    },
    greetText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: Colors.text,
        letterSpacing: -0.4,
    },
    greetSubtext: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // ── Search Bar ──────────────────────────────────────────────────
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 11,
        gap: 10,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginBottom: 16,
        ...Colors.shadows.sm,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.text,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primaryBg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    filterPillText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.primary,
    },

    // ── Active Token Card ───────────────────────────────────────────
    activeTokenCard: {
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    activeTokenLeft: {
        flex: 1,
        gap: 4,
    },
    activeLiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    activeLiveText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    activeDoctorName: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: '#fff',
        letterSpacing: -0.3,
    },
    activeClinicName: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 8,
    },
    activeLeaveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    activeLeaveText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    activeTokenRight: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: 80,
        gap: 2,
    },
    activeTokenMeta: {
        fontFamily: 'Inter_700Bold',
        fontSize: 8,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    activeTokenNumber: {
        fontFamily: 'Inter_700Bold',
        fontSize: 36,
        color: '#fff',
        letterSpacing: -1,
        lineHeight: 40,
    },
    activeServingText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
    },

    // ── Area Live Status Panel ──────────────────────────────────────
    areaPanel: {
        backgroundColor: Colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: Colors.border,
        flexWrap: 'wrap',
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 16,
        ...Colors.shadows.md,
    },
    areaPanelLeft: {
        flex: 1,
        padding: 18,
        gap: 4,
    },
    areaPanelDivider: {
        width: 1,
        backgroundColor: Colors.border,
        marginVertical: 14,
    },
    areaPanelRight: {
        flex: 1,
        padding: 18,
        gap: 6,
    },
    areaPanelCategory: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textMuted,
        letterSpacing: 0.2,
    },
    areaBigNumRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 3,
    },
    areaBigNum: {
        fontFamily: 'Inter_700Bold',
        fontSize: 48,
        color: Colors.text,
        letterSpacing: -2,
        lineHeight: 54,
    },
    areaBigNumUnit: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    areaPanelSublabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.success,
    },
    areaAvgNum: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        color: Colors.text,
        letterSpacing: -0.5,
    },
    openClinicsPill: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.primaryBg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    openClinicsText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: Colors.primary,
    },
    areaPanelStrip: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        backgroundColor: Colors.background,
    },
    areaPanelStripLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    areaPanelStripText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textMuted,
    },
    areaPanelStripLink: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.primary,
    },

    // ── Emergency Strip ─────────────────────────────────────────────
    emergencyStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.dangerBg,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: `${Colors.medicalRed}25`,
        marginBottom: 24,
    },
    emergencyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    emergencyIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 9,
        backgroundColor: `${Colors.medicalRed}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emergencyText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.medicalRed,
        flex: 1,
    },

    // ── Specialties ─────────────────────────────────────────────────
    catScroll: {
        gap: 8,
        paddingRight: 20,
        paddingBottom: 20,
    },
    catPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        gap: 7,
        borderWidth: 1.5,
    },
    catPillIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catPillLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
    },

    // ── Section Header ──────────────────────────────────────────────
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 17,
        color: Colors.text,
    },
    seeAll: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: Colors.primary,
    },

    // ── Clinic Cards ────────────────────────────────────────────────
    clinicList: {
        gap: 12,
    },
    clinicCard: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        ...Colors.shadows.sm,
    },
    clinicCardImage: {
        width: 80,
        height: 80,
        borderRadius: 13,
        backgroundColor: Colors.borderLight,
    },
    clinicCardBody: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        height: 80,
    },
    clinicCardName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        color: Colors.text,
        letterSpacing: -0.2,
        marginBottom: 3,
    },
    clinicCardDoctor: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.textSecondary,
    },
    clinicCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clinicCardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    clinicCardMetaText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textMuted,
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: Colors.border,
    },
    waitBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 20,
    },
    waitBadgeText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12,
    },

    // ── Empty State ─────────────────────────────────────────────────
    emptyState: {
        alignItems: 'center',
        paddingTop: 40,
        gap: 10,
    },
    emptyIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: Colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.text,
    },
    emptyText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.textMuted,
    },

    // ── Location Modal ──────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(26,26,46,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalSheet: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        width: '100%',
        maxWidth: 360,
        padding: 20,
        gap: 6,
        ...Colors.shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 17,
        color: Colors.text,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 13,
        borderRadius: 14,
        backgroundColor: Colors.background,
    },
    modalOptionActive: {
        backgroundColor: Colors.primaryBg,
    },
    modalOptionText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.text,
    },
    modalOptionTextActive: {
        fontFamily: 'Inter_600SemiBold',
        color: Colors.primary,
    },
});
