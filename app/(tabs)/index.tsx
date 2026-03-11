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
import { Layout } from '@/constants/layout';
import { useQueue } from '@/lib/queue-context';

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
const LOCATIONS = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];

const CATEGORIES = [
    { id: 'all',         name: 'All',       icon: 'apps',         color: Colors.primary100,   iconColor: Colors.primary500 },
    { id: 'general',     name: 'General',   icon: 'medkit',       color: Colors.primary100,   iconColor: Colors.primary500 },
    { id: 'dental',      name: 'Dental',    icon: 'medical',      color: '#E6F9F8',          iconColor: '#2EC4B6' },
    { id: 'dermatology', name: 'Skin',      icon: 'happy',        color: '#FEF3C7',          iconColor: Colors.warning500 },
    { id: 'cardiology',  name: 'Cardio',    icon: 'heart',        color: Colors.error100,    iconColor: Colors.error500 },
    { id: 'pediatrics',  name: 'Kids',      icon: 'people',       color: Colors.success100,   iconColor: Colors.success500 },
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
function LiveDot({ color = Colors.success500 }: { color?: string }) {
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

/** Single clinic card */
function ClinicCard({ clinic, index }: { clinic: Clinic; index: number }) {
    return (
        <Animated.View entering={FadeInDown.duration(400).delay(350 + index * 80)}>
            <Link href={`/clinic/${clinic.id}` as any} asChild>
                <Pressable style={styles.clinicCard}>
                    {/* Clinic Image */}
                    <Image source={{ uri: clinic.image }} style={styles.clinicCardImage} />

                    {/* Clinic Info */}
                    <View style={styles.clinicCardInfo}>
                        <Text style={styles.clinicCardName} numberOfLines={1}>{clinic.name}</Text>
                        <Text style={styles.clinicCardDoctor} numberOfLines={1}>
                            {clinic.doctor} • {clinic.specialty}
                        </Text>
                        
                        <View style={styles.clinicCardMetaRow}>
                            <Text style={styles.clinicCardMetaText}>⭐ {clinic.rating} • {clinic.distance}</Text>
                            <View style={styles.waitBadge}>
                                <Text style={styles.waitBadgeText}>{clinic.waitTimeMin} min wait</Text>
                            </View>
                        </View>
                        
                        <Text style={styles.predictText}>Leave home in {clinic.waitTimeMin + 2} minutes</Text>
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

    const shortestWait = Math.min(...CLINICS.map(c => c.waitTimeMin));
    const avgWait = Math.round(CLINICS.reduce((s, c) => s + c.waitTimeMin, 0) / CLINICS.length);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={[
                    { paddingTop: insets.top + Layout.spacing.space5, paddingBottom: 120 + insets.bottom, paddingHorizontal: 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageStructure}>

                    {/* ══ HEADER SECTION ══════════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.headerSection}>
                        <Pressable style={styles.locationBlock} onPress={() => setShowLocationModal(true)}>
                            <Text style={styles.locationLabel}>YOUR LOCATION</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Text style={styles.locationCity}>{selectedLocation}</Text>
                                <Ionicons name="chevron-down" size={12} color={Colors.gray500} />
                            </View>
                        </Pressable>

                        <View style={styles.headerActions}>
                            <Pressable style={styles.bellIcon}>
                                <Ionicons name="notifications-outline" size={24} color={Colors.gray700} />
                            </Pressable>
                            <Pressable onPress={() => router.push('/(tabs)/profile')}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60' }}
                                    style={styles.avatar}
                                />
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* ══ GREETING SECTION ════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(60)} style={styles.greetingSection}>
                        <Text style={styles.greetingHeading}>{greeting} 👋</Text>
                        <Text style={styles.greetingSubtitle}>Find a clinic, skip the wait</Text>
                    </Animated.View>

                    {/* ══ SEARCH COMPONENT ════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.searchComponent}>
                        <Ionicons name="search" size={20} color={Colors.gray500} />
                        <TextInput
                            placeholder="Search doctors, clinics..."
                            placeholderTextColor={Colors.gray400}
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                            onFocus={() => router.push('/(tabs)/search')}
                        />
                        <Pressable style={styles.filterButton} onPress={() => router.push('/(tabs)/search')}>
                            <Ionicons name="options-outline" size={20} color={Colors.gray500} />
                        </Pressable>
                    </Animated.View>

                    {/* ══ LIVE WAIT INSIGHT (HERO CARD) ════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(140)}>
                        <LinearGradient
                            colors={[Colors.surfaceBrand, Colors.surfaceBrand]}
                            style={styles.insightCard}
                        >
                            <View style={styles.insightCardLeft}>
                                <Text style={styles.insightCategoryLabel}>Shortest Wait</Text>
                                <Text style={styles.insightBigNum}>{shortestWait} min</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <LiveDot color={Colors.success500} />
                                    <Text style={styles.insightSublabel}>Near you now</Text>
                                </View>
                            </View>

                            <View style={styles.insightCardRight}>
                                <Text style={styles.insightCategoryLabel}>Area Average</Text>
                                <Text style={styles.insightAvgNum}>{avgWait} min</Text>
                                <Text style={styles.insightClinicsOpen}>{CLINICS.length} clinics open</Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* ══ EMERGENCY CARD ══════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(180)}>
                        <Pressable 
                            style={styles.emergencyCard}
                            onPress={() => router.push({ pathname: '/clinic/[id]', params: { id: '1', emergency: 'true' } })}
                        >
                            <View style={styles.emergencyLeft}>
                                <View style={styles.emergencyIconWrap}>
                                    <Ionicons name="medical" size={16} color={Colors.error500} />
                                </View>
                                <View style={{ gap: 2 }}>
                                    <Text style={styles.emergencyTitle}>Need urgent help?</Text>
                                    <Text style={styles.emergencySubtitle}>Request emergency priority</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.error500} />
                        </Pressable>
                    </Animated.View>

                    {/* ══ SPECIALTY FILTERS ══════════════════════════════════════════════ */}
                    <Animated.View entering={FadeInDown.duration(400).delay(220)} style={styles.specialtySection}>
                        <Text style={styles.sectionTitle}>Find by Specialty</Text>
                        
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipsScrollContainer}
                        >
                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <Pressable
                                        key={cat.id}
                                        style={[
                                            styles.chipDefault,
                                            isSelected && styles.chipSelected
                                        ]}
                                        onPress={() => setSelectedCategory(cat.id)}
                                    >
                                        <Text style={[
                                            styles.chipTextDefault,
                                            isSelected && styles.chipTextSelected
                                        ]}>
                                            {cat.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </Animated.View>

                    {/* ══ NEARBY CLINICS ═══════════════════════════════════════════ */}
                    <View style={styles.nearbySection}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Nearby Clinics</Text>
                            <Pressable onPress={() => router.push('/(tabs)/search')}>
                                <Text style={styles.seeAllText}>See All →</Text>
                            </Pressable>
                        </View>

                        {filteredClinics.length > 0 ? (
                            <View style={{ gap: 16 }}>
                                {filteredClinics.map((clinic, i) => (
                                    <ClinicCard key={clinic.id} clinic={clinic} index={i} />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="search-outline" size={32} color={Colors.gray400} />
                                <Text style={styles.emptyText}>No clinics found</Text>
                            </View>
                        )}
                    </View>

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

    // ── Header Section ─────────────────────────────────────────────────────
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.space6,
    },
    locationBlock: {
        flexDirection: 'column',
        gap: 2,
    },
    locationLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.gray500,
    },
    locationCity: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    bellIcon: {
        padding: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray200,
    },

    // ── Greeting Section ───────────────────────────────────────────────────
    greetingSection: {
        marginBottom: Layout.spacing.space4,
        gap: Layout.spacing.space2,
    },
    greetingHeading: {
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    greetingSubtitle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: Colors.gray500,
    },

    // ── Search Component ───────────────────────────────────────────────────
    searchComponent: {
        height: 52,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5F7FB',
        borderWidth: 1,
        borderColor: '#E6EAF2',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: Layout.spacing.space6,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: Colors.textPrimary,
    },
    filterButton: {
        padding: 4,
    },

    // ── Live Wait Insight (Hero Card) ──────────────────────────────────────
    insightCard: {
        height: 120,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        gap: 16,
        backgroundColor: Colors.surfaceBrand,
        marginBottom: Layout.spacing.space8,
    },
    insightCardLeft: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    insightCardRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(38, 101, 140, 0.1)',
        paddingLeft: 16,
        gap: 4,
    },
    insightCategoryLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.primary700,
        opacity: 0.8,
    },
    insightBigNum: {
        fontFamily: 'Inter_700Bold',
        fontSize: 36,
        color: Colors.primary700,
        letterSpacing: -1,
    },
    insightAvgNum: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        color: Colors.primary700,
    },
    insightSublabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: Colors.success700,
    },
    insightClinicsOpen: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.primary600,
    },

    // ── Emergency Card ─────────────────────────────────────────────────────
    emergencyCard: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: Colors.error100, // #FFF1F2
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Layout.spacing.space6,
    },
    emergencyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emergencyIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FEE2E2', // matching user specs
        alignItems: 'center',
        justifyContent: 'center',
    },
    emergencyTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        color: Colors.error700,
    },
    emergencySubtitle: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.error500,
    },

    // ── Specialty Filters ──────────────────────────────────────────────────
    specialtySection: {
        marginBottom: Layout.spacing.space6,
        gap: 12,
    },
    chipsScrollContainer: {
        flexDirection: 'row',
        gap: 10,
        paddingRight: 20,
    },
    chipDefault: {
        height: 40,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipSelected: {
        backgroundColor: Colors.primary500, // #4F6EF7 approx
    },
    chipTextDefault: {
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.gray700,
    },
    chipTextSelected: {
        color: Colors.surfacePrimary,
    },

    // ── Nearby Clinics ─────────────────────────────────────────────────────
    nearbySection: {
        gap: Layout.spacing.space3,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.space2,
    },
    sectionTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.textPrimary,
    },
    seeAllText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.primary500,
    },
    
    // Clinic Card
    clinicCard: {
        height: 96,
        borderRadius: 16,
        padding: 12,
        backgroundColor: Colors.surfacePrimary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },
    clinicCardImage: {
        width: 72,
        height: 72,
        borderRadius: 12,
        backgroundColor: Colors.gray100,
    },
    clinicCardInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
    },
    clinicCardName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        color: Colors.textPrimary,
    },
    clinicCardDoctor: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.textSecondary,
    },
    clinicCardMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clinicCardMetaText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.gray500,
    },
    waitBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#E8F9F0',
    },
    waitBadgeText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: '#16A34A',
    },
    predictText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.primary500,
        marginTop: 2,
    },
    
    // Empty state
    emptyState: {
        alignItems: 'center',
        padding: 40,
        gap: 12,
    },
    emptyText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.gray500,
    },

    // ── Modal ──────────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: Colors.surfacePrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        gap: 8,
    },
    modalTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    modalOptionActive: {
        backgroundColor: Colors.primary100,
    },
    modalOptionText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.textPrimary,
    },
    modalOptionTextActive: {
        fontFamily: 'Inter_600SemiBold',
        color: Colors.primary500,
    },
});
